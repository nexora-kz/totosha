import { writeFile } from "node:fs/promises";
import { PAGES, REQUIRED_ENDPOINTS, SITE_URL } from "./config.mjs";

const USER_AGENT =
  "TOTOSHA-SEO-Autopilot/1.0 (+https://www.totoshakids.kz)";

function parseArgs(argv) {
  const args = { json: "seo-report.json", markdown: "seo-report.md" };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--json" && argv[index + 1]) args.json = argv[++index];
    if (argv[index] === "--markdown" && argv[index + 1]) {
      args.markdown = argv[++index];
    }
  }
  return args;
}

function normalizeUrl(value) {
  const url = new URL(value, SITE_URL);
  url.hash = "";
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}

function extract(html, expression) {
  return html.match(expression)?.[1]?.replace(/\s+/g, " ").trim() ?? null;
}

function allMatches(html, expression) {
  return [...html.matchAll(expression)]
    .map((match) => match[1]?.trim())
    .filter(Boolean);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...options.headers,
      },
      ...options,
      signal: controller.signal,
    });
    return {
      response,
      durationMs: Math.round(performance.now() - started),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function inspectPage(page) {
  const requestedUrl = normalizeUrl(page.path);
  const checks = [];
  try {
    const { response, durationMs } = await fetchWithTimeout(requestedUrl);
    const html = await response.text();
    const finalUrl = normalizeUrl(response.url);
    const contentType = response.headers.get("content-type") ?? "";

    const title = extract(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description =
      extract(
        html,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
      ) ??
      extract(
        html,
        /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
      );
    const canonical =
      extract(
        html,
        /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
      ) ??
      extract(
        html,
        /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i,
      );
    const robots =
      extract(
        html,
        /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i,
      ) ?? "";
    const h1Count = allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).length;
    const hasJsonLd = /type=["']application\/ld\+json["']/i.test(html);

    checks.push({
      name: "HTTP 200",
      status: response.status === 200 ? "ok" : "critical",
      details: `HTTP ${response.status}`,
    });
    checks.push({
      name: "Финальный URL",
      status: finalUrl === requestedUrl ? "ok" : "warning",
      details: finalUrl,
    });
    checks.push({
      name: "Content-Type HTML",
      status: contentType.includes("text/html") ? "ok" : "critical",
      details: contentType || "не указан",
    });
    checks.push({
      name: "Title",
      status:
        title && title.length >= 20 && title.length <= 70 ? "ok" : "warning",
      details: title ? `${title.length} символов` : "не найден",
    });
    checks.push({
      name: "Description",
      status:
        description && description.length >= 70 && description.length <= 200
          ? "ok"
          : "warning",
      details: description ? `${description.length} символов` : "не найдена",
    });
    checks.push({
      name: "Canonical",
      status:
        canonical && normalizeUrl(canonical) === requestedUrl
          ? "ok"
          : "warning",
      details: canonical ?? "не найден",
    });
    checks.push({
      name: "Indexability",
      status: /noindex/i.test(robots) ? "critical" : "ok",
      details: robots || "index разрешён",
    });
    checks.push({
      name: "H1",
      status: h1Count === 1 ? "ok" : "warning",
      details: `найдено: ${h1Count}`,
    });
    if (page.path === "/") {
      checks.push({
        name: "JSON-LD",
        status: hasJsonLd ? "ok" : "warning",
        details: hasJsonLd ? "обнаружен" : "не найден",
      });
    }

    return {
      ...page,
      requestedUrl,
      finalUrl,
      statusCode: response.status,
      durationMs,
      title,
      description,
      canonical,
      h1Count,
      hasJsonLd,
      checks,
      internalLinks: allMatches(
        html,
        /<a\b[^>]+href=["']([^"'#]+)["'][^>]*>/gi,
      )
        .map((href) => {
          try {
            return normalizeUrl(href);
          } catch {
            return null;
          }
        })
        .filter((href) => href?.startsWith(SITE_URL)),
    };
  } catch (error) {
    return {
      ...page,
      requestedUrl,
      finalUrl: null,
      statusCode: 0,
      durationMs: null,
      title: null,
      description: null,
      canonical: null,
      h1Count: 0,
      hasJsonLd: false,
      checks: [
        {
          name: "Доступность",
          status: "critical",
          details: error instanceof Error ? error.message : "неизвестная ошибка",
        },
      ],
      internalLinks: [],
    };
  }
}

async function inspectEndpoint(path) {
  const url = normalizeUrl(path);
  try {
    const { response, durationMs } = await fetchWithTimeout(url, {
      headers: { accept: "*/*" },
    });
    const body = await response.text();
    return {
      path,
      url,
      statusCode: response.status,
      durationMs,
      contentType: response.headers.get("content-type"),
      ok: response.status === 200,
      bodyPreview: body.slice(0, 5000),
    };
  } catch (error) {
    return {
      path,
      url,
      statusCode: 0,
      durationMs: null,
      contentType: null,
      ok: false,
      error: error instanceof Error ? error.message : "неизвестная ошибка",
      bodyPreview: "",
    };
  }
}

async function inspectInternalLinks(pages) {
  const urls = [...new Set(pages.flatMap((page) => page.internalLinks))]
    .filter((url) => !url.includes("/api/"))
    .slice(0, 100);

  const results = [];
  for (const url of urls) {
    try {
      const { response, durationMs } = await fetchWithTimeout(url);
      results.push({
        url,
        statusCode: response.status,
        durationMs,
        ok: response.status >= 200 && response.status < 400,
      });
    } catch (error) {
      results.push({
        url,
        statusCode: 0,
        durationMs: null,
        ok: false,
        error: error instanceof Error ? error.message : "неизвестная ошибка",
      });
    }
  }
  return results;
}

function summarize(report) {
  const pageChecks = report.pages.flatMap((page) => page.checks);
  const critical = pageChecks.filter((check) => check.status === "critical");
  const warnings = pageChecks.filter((check) => check.status === "warning");
  const brokenLinks = report.internalLinks.filter((link) => !link.ok);
  const failedEndpoints = report.endpoints.filter((endpoint) => !endpoint.ok);

  const sitemap = report.endpoints.find(
    (endpoint) => endpoint.path === "/sitemap-totosha.xml",
  );
  const robots = report.endpoints.find(
    (endpoint) => endpoint.path === "/robots.txt",
  );

  if (
    sitemap &&
    !PAGES.every((page) =>
      sitemap.bodyPreview.includes(new URL(page.path, SITE_URL).toString()),
    )
  ) {
    warnings.push({
      name: "Sitemap coverage",
      status: "warning",
      details: "Не все основные страницы найдены в sitemap",
    });
  }
  if (
    robots &&
    !robots.bodyPreview.includes(
      "https://www.totoshakids.kz/sitemap-totosha.xml",
    )
  ) {
    warnings.push({
      name: "Robots sitemap",
      status: "warning",
      details: "robots.txt не содержит актуальный sitemap",
    });
  }

  return {
    pagesTotal: report.pages.length,
    pagesHealthy: report.pages.filter((page) => page.statusCode === 200).length,
    criticalCount: critical.length + failedEndpoints.length + brokenLinks.length,
    warningCount: warnings.length,
    brokenLinksCount: brokenLinks.length,
    failedEndpointsCount: failedEndpoints.length,
    averageResponseMs: Math.round(
      report.pages.reduce((sum, page) => sum + (page.durationMs ?? 0), 0) /
        Math.max(1, report.pages.filter((page) => page.durationMs).length),
    ),
    status:
      critical.length || failedEndpoints.length || brokenLinks.length
        ? "critical"
        : warnings.length
          ? "warning"
          : "ok",
  };
}

function toMarkdown(report) {
  const lines = [
    "# TOTOSHA SEO Autopilot — технический отчёт",
    "",
    `Дата: ${report.generatedAt}`,
    "",
    `**Статус:** ${report.summary.status}`,
    `**Доступные страницы:** ${report.summary.pagesHealthy}/${report.summary.pagesTotal}`,
    `**Критические проблемы:** ${report.summary.criticalCount}`,
    `**Предупреждения:** ${report.summary.warningCount}`,
    `**Среднее время ответа:** ${report.summary.averageResponseMs} мс`,
    "",
    "## Страницы",
    "",
    "| Страница | HTTP | Время | Title | Canonical | H1 |",
    "|---|---:|---:|---|---|---:|",
  ];

  for (const page of report.pages) {
    lines.push(
      `| ${page.label} | ${page.statusCode} | ${page.durationMs ?? "—"} мс | ${
        page.title ? "✓" : "✗"
      } | ${
        page.canonical &&
        normalizeUrl(page.canonical) === normalizeUrl(page.requestedUrl)
          ? "✓"
          : "⚠"
      } | ${page.h1Count} |`,
    );
  }

  lines.push("", "## Служебные endpoints", "");
  for (const endpoint of report.endpoints) {
    lines.push(
      `- ${endpoint.ok ? "✓" : "✗"} ${endpoint.path}: HTTP ${
        endpoint.statusCode
      }, ${endpoint.durationMs ?? "—"} мс`,
    );
  }

  const problems = [];
  for (const page of report.pages) {
    for (const check of page.checks) {
      if (check.status !== "ok") {
        problems.push(
          `- ${check.status === "critical" ? "❌" : "⚠️"} ${page.label}: ${
            check.name
          } — ${check.details}`,
        );
      }
    }
  }
  for (const link of report.internalLinks.filter((item) => !item.ok)) {
    problems.push(`- ❌ Битая ссылка: ${link.url} — HTTP ${link.statusCode}`);
  }

  lines.push("", "## Замечания", "");
  lines.push(...(problems.length ? problems : ["- Критических замечаний нет."]));

  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const pages = [];
  for (const page of PAGES) {
    pages.push(await inspectPage(page));
  }

  const endpoints = [];
  for (const path of REQUIRED_ENDPOINTS) {
    endpoints.push(await inspectEndpoint(path));
  }

  const internalLinks = await inspectInternalLinks(pages);
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    pages,
    endpoints,
    internalLinks,
  };
  report.summary = summarize(report);

  await writeFile(args.json, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(args.markdown, toMarkdown(report), "utf8");

  console.log(JSON.stringify(report.summary, null, 2));
  if (report.summary.status === "critical") process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
