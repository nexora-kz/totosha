import { readFile } from "node:fs/promises";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

function percent(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100).toFixed(1)}%`;
}

function signed(value, suffix = "%") {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}${suffix}`;
}

function buildMessage(technical, gsc) {
  const lines = [
    "<b>TOTOSHA SEO Autopilot</b>",
    "",
    `<b>Технический статус:</b> ${escapeHtml(
      technical?.summary?.status ?? "неизвестно",
    )}`,
    `Страницы: ${technical?.summary?.pagesHealthy ?? 0}/${
      technical?.summary?.pagesTotal ?? 0
    }`,
    `Критические ошибки: ${technical?.summary?.criticalCount ?? 0}`,
    `Предупреждения: ${technical?.summary?.warningCount ?? 0}`,
    `Среднее время ответа: ${
      technical?.summary?.averageResponseMs ?? "—"
    } мс`,
  ];

  if (gsc?.configured) {
    lines.push(
      "",
      "<b>Google Search Console — 28 дней</b>",
      `Показы: ${gsc.totals?.impressions ?? 0} (${signed(
        gsc.comparison?.impressionsPct,
      )})`,
      `Клики: ${gsc.totals?.clicks ?? 0} (${signed(
        gsc.comparison?.clicksPct,
      )})`,
      `CTR: ${percent(gsc.totals?.ctr ?? 0)}`,
      `Средняя позиция: ${(gsc.totals?.position ?? 0).toFixed(1)}`,
    );

    const opportunities = (gsc.topQueries ?? [])
      .filter(
        (row) =>
          row.impressions >= 10 &&
          row.position >= 4 &&
          row.position <= 20 &&
          row.ctr < 0.08,
      )
      .slice(0, 3);

    if (opportunities.length) {
      lines.push("", "<b>Запросы для усиления</b>");
      for (const row of opportunities) {
        lines.push(
          `• ${escapeHtml(row.query)} — позиция ${row.position.toFixed(
            1,
          )}, показы ${row.impressions}, CTR ${percent(row.ctr)}`,
        );
      }
    }
  } else {
    lines.push(
      "",
      "Google Search Console API пока не подключён: добавьте service account secret.",
    );
  }

  lines.push("", "Отчёт сформирован автоматически, без накрутки трафика.");
  return lines.join("\n").slice(0, 4000);
}

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.log(
      "Telegram пропущен: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы.",
    );
    return;
  }

  const technical = await readJson(process.argv[2] || "seo-report.json");
  const gsc = await readJson(process.argv[3] || "gsc-report.json");
  const text = buildMessage(technical, gsc);

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(`Telegram API error: ${JSON.stringify(result)}`);
  }
  console.log("SEO-отчёт отправлен в Telegram.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
