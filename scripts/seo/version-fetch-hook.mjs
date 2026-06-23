import { readFile } from "node:fs/promises";

const SITE_HEALTH_URL = "https://www.totoshakids.kz/api/health";
const originalFetch = globalThis.fetch.bind(globalThis);
let cachedRelease = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = String(value).split("-");
  return year && month && day ? `${day}.${month}.${year}` : String(value);
}

async function localReleaseFallback() {
  try {
    const source = await readFile(
      new URL("../../lib/totoshaConfig.ts", import.meta.url),
      "utf8",
    );
    return {
      version: source.match(/TOTOSHA_VERSION\s*=\s*['\"]([^'\"]+)/)?.[1] ?? "неизвестно",
      buildDate: source.match(/TOTOSHA_BUILD_DATE\s*=\s*['\"]([^'\"]+)/)?.[1] ?? null,
      commit: process.env.GITHUB_SHA ?? "unknown",
      environment: "production",
    };
  } catch {
    return {
      version: "неизвестно",
      buildDate: null,
      commit: process.env.GITHUB_SHA ?? "unknown",
      environment: "unknown",
    };
  }
}

async function releaseInfo() {
  if (cachedRelease) return cachedRelease;

  try {
    const response = await originalFetch(SITE_HEALTH_URL, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`health HTTP ${response.status}`);
    cachedRelease = await response.json();
  } catch {
    cachedRelease = await localReleaseFallback();
  }

  return cachedRelease;
}

function reportType() {
  if (process.env.GITHUB_EVENT_NAME === "push") return "Отчёт после обновления";
  if (process.env.GITHUB_EVENT_NAME === "schedule") return "Плановый мониторинг";
  return "Ручной отчёт";
}

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input?.url ?? String(input);

  if (url.includes("api.telegram.org/bot") && url.endsWith("/sendMessage") && init.body) {
    try {
      const payload = JSON.parse(String(init.body));
      const release = await releaseInfo();
      const commit = String(release.commit ?? process.env.GITHUB_SHA ?? "unknown");
      const shortCommit = commit === "unknown" ? "unknown" : commit.slice(0, 12);
      const header = [
        `<b>${reportType()}</b>`,
        `Версия сайта: <b>${escapeHtml(release.version ?? "неизвестно")}</b>`,
        `Дата сборки: ${escapeHtml(formatDate(release.buildDate))}`,
        `Commit: <code>${escapeHtml(shortCommit)}</code>`,
        `Среда: ${escapeHtml(release.environment ?? "unknown")}`,
        "",
      ].join("\n");

      payload.text = `${header}${payload.text ?? ""}`.slice(0, 4000);
      init = { ...init, body: JSON.stringify(payload) };
    } catch (error) {
      console.error("Не удалось добавить версию сайта в Telegram-отчёт:", error);
    }
  }

  return originalFetch(input, init);
};
