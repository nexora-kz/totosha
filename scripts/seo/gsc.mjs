import { createSign } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { PAGES, SEARCH_CONSOLE_SITE_URL } from "./config.mjs";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const WEBMASTERS_API = "https://www.googleapis.com/webmasters/v3";
const INSPECTION_API = "https://searchconsole.googleapis.com/v1";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function base64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function serviceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `GOOGLE_SERVICE_ACCOUNT_JSON содержит неверный JSON: ${
        error instanceof Error ? error.message : "unknown"
      }`,
    );
  }
}

async function accessToken(account) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer
    .sign(account.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const assertion = `${unsigned}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth-type:jwt-bearer",
      assertion,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(`Google OAuth error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return isoDate(date);
}

async function googleRequest(token, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...options.headers,
    },
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`Google API ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function searchAnalytics(token, startDate, endDate, dimensions = []) {
  const site = encodeURIComponent(SEARCH_CONSOLE_SITE_URL);
  return googleRequest(
    token,
    `${WEBMASTERS_API}/sites/${site}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        rowLimit: dimensions.length ? 100 : 1,
        dataState: "all",
      }),
    },
  );
}

function totals(row) {
  return {
    clicks: row?.clicks ?? 0,
    impressions: row?.impressions ?? 0,
    ctr: row?.ctr ?? 0,
    position: row?.position ?? 0,
  };
}

function compare(current, previous) {
  const delta = (a, b) => {
    if (!b) return a ? 100 : 0;
    return ((a - b) / b) * 100;
  };
  return {
    clicksPct: delta(current.clicks, previous.clicks),
    impressionsPct: delta(current.impressions, previous.impressions),
    ctrPct: delta(current.ctr, previous.ctr),
    positionDelta: current.position - previous.position,
  };
}

async function sitemapStatus(token) {
  const site = encodeURIComponent(SEARCH_CONSOLE_SITE_URL);
  return googleRequest(token, `${WEBMASTERS_API}/sites/${site}/sitemaps`);
}

async function inspectUrl(token, url) {
  return googleRequest(token, `${INSPECTION_API}/urlInspection/index:inspect`, {
    method: "POST",
    body: JSON.stringify({
      inspectionUrl: url,
      siteUrl: SEARCH_CONSOLE_SITE_URL,
      languageCode: "ru-RU",
    }),
  });
}

async function writeUnavailableReport(output, reason, details = null) {
  const report = {
    configured: false,
    generatedAt: new Date().toISOString(),
    reason,
    details,
  };
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(reason);
}

async function main() {
  const output = process.argv[2] || "gsc-report.json";
  const federatedToken = process.env.GOOGLE_OAUTH_ACCESS_TOKEN?.trim();
  const account = serviceAccount();

  if (!federatedToken && !account) {
    await writeUnavailableReport(
      output,
      process.env.GOOGLE_AUTH_OUTCOME === "failure"
        ? "Google OIDC-аутентификация не выполнена. Проверьте Workload Identity Federation и доступ service account к Search Console."
        : "Google Search Console API не подключён. Технический мониторинг продолжает работать.",
      { authOutcome: process.env.GOOGLE_AUTH_OUTCOME ?? null },
    );
    return;
  }

  const authMode = federatedToken
    ? "workload_identity_federation"
    : "service_account_json";
  const token = federatedToken || (await accessToken(account));
  const endDate = daysAgo(3);
  const startDate = daysAgo(30);
  const previousEndDate = daysAgo(31);
  const previousStartDate = daysAgo(58);

  try {
    const [currentRaw, previousRaw, queriesRaw, pagesRaw, sitemaps] =
      await Promise.all([
        searchAnalytics(token, startDate, endDate),
        searchAnalytics(token, previousStartDate, previousEndDate),
        searchAnalytics(token, startDate, endDate, ["query"]),
        searchAnalytics(token, startDate, endDate, ["page"]),
        sitemapStatus(token),
      ]);

    const current = totals(currentRaw.rows?.[0]);
    const previous = totals(previousRaw.rows?.[0]);

    const inspections = [];
    for (const page of PAGES) {
      const url = new URL(page.path, SEARCH_CONSOLE_SITE_URL).toString();
      try {
        const result = await inspectUrl(token, url);
        const indexStatus = result.inspectionResult?.indexStatusResult ?? {};
        inspections.push({
          url,
          verdict: indexStatus.verdict ?? null,
          coverageState: indexStatus.coverageState ?? null,
          robotsTxtState: indexStatus.robotsTxtState ?? null,
          indexingState: indexStatus.indexingState ?? null,
          lastCrawlTime: indexStatus.lastCrawlTime ?? null,
          pageFetchState: indexStatus.pageFetchState ?? null,
          googleCanonical: indexStatus.googleCanonical ?? null,
          userCanonical: indexStatus.userCanonical ?? null,
        });
      } catch (error) {
        inspections.push({
          url,
          error: error instanceof Error ? error.message : "unknown",
        });
      }
    }

    const report = {
      configured: true,
      authMode,
      generatedAt: new Date().toISOString(),
      property: SEARCH_CONSOLE_SITE_URL,
      period: { startDate, endDate },
      previousPeriod: {
        startDate: previousStartDate,
        endDate: previousEndDate,
      },
      totals: current,
      previousTotals: previous,
      comparison: compare(current, previous),
      topQueries: (queriesRaw.rows ?? []).slice(0, 25).map((row) => ({
        query: row.keys?.[0] ?? "",
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })),
      topPages: (pagesRaw.rows ?? []).slice(0, 25).map((row) => ({
        page: row.keys?.[0] ?? "",
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })),
      sitemaps: sitemaps.sitemap ?? [],
      inspections,
    };

    await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(
      JSON.stringify(
        {
          authMode,
          period: report.period,
          totals: report.totals,
          inspectedPages: inspections.length,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    await writeUnavailableReport(
      output,
      "Google Search Console API ответил ошибкой. Проверьте, что service account добавлен в нужное свойство Search Console.",
      {
        authMode,
        error: error instanceof Error ? error.message : "unknown",
      },
    );
    process.exitCode = 1;
  }
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
