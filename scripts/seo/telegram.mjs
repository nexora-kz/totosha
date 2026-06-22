import { readFile } from "node:fs/promises";
import { PAGES } from "./config.mjs";

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

function position(value) {
  return Number.isFinite(value) && value > 0 ? value.toFixed(1) : "—";
}

function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = String(value).split("-");
  return year && month && day ? `${day}.${month}.${year}` : String(value);
}

function periodLabel(period) {
  if (!period?.startDate || !period?.endDate) return "28 дней";
  return `${formatDate(period.startDate)} — ${formatDate(period.endDate)}`;
}

function pageLabel(value) {
  try {
    const pathname = new URL(value).pathname.replace(/\/$/, "") || "/";
    return PAGES.find((page) => page.path === pathname)?.label ?? pathname;
  } catch {
    return value;
  }
}

function isIndexed(row) {
  if (row?.verdict === "PASS") return true;
  const coverage = String(row?.coverageState ?? "").toLowerCase();
  return (
    coverage.includes("indexed") &&
    !coverage.includes("not indexed") &&
    !coverage.includes("excluded")
  );
}

function sitemapState(gsc) {
  const sitemap = (gsc?.sitemaps ?? []).find((item) =>
    String(item?.path ?? "").includes("sitemap-totosha.xml"),
  );

  if (!sitemap) return { label: "не найден в API", severity: "warning" };
  const errors = Number(sitemap.errors ?? 0);
  const warnings = Number(sitemap.warnings ?? 0);

  if (errors > 0) {
    return { label: `ошибки: ${errors}`, severity: "critical" };
  }
  if (sitemap.isPending) {
    return { label: "обрабатывается Google", severity: "info" };
  }
  if (warnings > 0) {
    return { label: `OK, предупреждений: ${warnings}`, severity: "warning" };
  }
  return { label: "OK", severity: "ok" };
}

function isMondayInAstana() {
  return (
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Almaty",
      weekday: "short",
    }).format(new Date()) === "Mon"
  );
}

function buildMessage(technical, gsc) {
  const favicon = technical?.endpoints?.find(
    (endpoint) => endpoint.path === "/favicon.ico",
  );

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
    `Favicon: ${favicon?.ok ? "OK" : favicon ? `HTTP ${favicon.statusCode}` : "не проверялся"}`,
  ];

  if (gsc?.configured) {
    const inspections = gsc.inspections ?? [];
    const inspectionErrors = inspections.filter((row) => row.error).length;
    const indexed = inspections.filter(isIndexed).length;
    const sitemap = sitemapState(gsc);

    lines.push(
      "",
      `<b>Google Search Console — ${escapeHtml(periodLabel(gsc.period))}</b>`,
      `Показы: ${gsc.totals?.impressions ?? 0} (${signed(
        gsc.comparison?.impressionsPct,
      )})`,
      `Клики: ${gsc.totals?.clicks ?? 0} (${signed(
        gsc.comparison?.clicksPct,
      )})`,
      `CTR: ${percent(gsc.totals?.ctr ?? 0)}`,
      `Средняя позиция: ${position(gsc.totals?.position)}`,
      `Индексация Google: ${indexed}/${inspections.length || PAGES.length}${
        inspectionErrors ? `, ошибок проверки: ${inspectionErrors}` : ""
      }`,
      `Sitemap: ${escapeHtml(sitemap.label)}`,
    );

    const topPages = (gsc.topPages ?? [])
      .filter((row) => Number(row.impressions) > 0)
      .slice(0, 3);

    if (topPages.length) {
      lines.push("", "<b>Страницы с показами</b>");
      for (const row of topPages) {
        lines.push(
          `• ${escapeHtml(pageLabel(row.page))} — ${row.impressions} показов, позиция ${position(
            row.position,
          )}`,
        );
      }
    }

    const topQueries = (gsc.topQueries ?? [])
      .filter((row) => Number(row.impressions) > 0 && row.query)
      .slice(0, 3);

    if (topQueries.length) {
      lines.push("", "<b>Поисковые запросы</b>");
      for (const row of topQueries) {
        lines.push(
          `• ${escapeHtml(row.query)} — ${row.impressions} показов, позиция ${position(
            row.position,
          )}, CTR ${percent(row.ctr)}`,
        );
      }
    } else if ((gsc.totals?.impressions ?? 0) > 0) {
      lines.push(
        "",
        "Поисковые запросы пока скрыты Google из-за небольшого объёма данных.",
      );
    }

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
          `• ${escapeHtml(row.query)} — позиция ${position(
            row.position,
          )}, показы ${row.impressions}, CTR ${percent(row.ctr)}`,
        );
      }
    }

    if (isMondayInAstana() && gsc.weekly?.totals) {
      lines.push(
        "",
        `<b>Недельный итог — ${escapeHtml(periodLabel(gsc.weekly.period))}</b>`,
        `Показы: ${gsc.weekly.totals.impressions ?? 0} (${signed(
          gsc.weekly.comparison?.impressionsPct,
        )})`,
        `Клики: ${gsc.weekly.totals.clicks ?? 0} (${signed(
          gsc.weekly.comparison?.clicksPct,
        )})`,
        `CTR: ${percent(gsc.weekly.totals.ctr ?? 0)}`,
        `Средняя позиция: ${position(gsc.weekly.totals.position)}`,
      );
    }

    const alerts = [];
    const impressions = Number(gsc.totals?.impressions ?? 0);
    const previousImpressions = Number(gsc.previousTotals?.impressions ?? 0);

    if ((technical?.summary?.criticalCount ?? 0) > 0) {
      alerts.push("Есть критические технические ошибки сайта.");
    }
    if (favicon && !favicon.ok) {
      alerts.push("Favicon недоступен поисковым роботам.");
    }
    if (sitemap.severity === "critical") {
      alerts.push(`Sitemap: ${sitemap.label}.`);
    }
    if (inspections.length && indexed < inspections.length) {
      alerts.push(`Индексация продолжается: ${indexed}/${inspections.length} страниц.`);
    }
    if (
      previousImpressions >= 50 &&
      Number(gsc.comparison?.impressionsPct) <= -30
    ) {
      alerts.push("Показы снизились более чем на 30% относительно прошлого периода.");
    }
    if (
      impressions >= 50 &&
      Number(gsc.comparison?.positionDelta) >= 3
    ) {
      alerts.push("Средняя позиция ухудшилась более чем на 3 пункта.");
    }
    if (impressions >= 100 && Number(gsc.totals?.ctr ?? 0) < 0.01) {
      alerts.push("CTR ниже 1% при 100 и более показах.");
    }

    lines.push("", "<b>Контроль</b>");
    if (alerts.length) {
      for (const alert of alerts.slice(0, 5)) {
        lines.push(`• ${escapeHtml(alert)}`);
      }
    } else {
      lines.push("• Критических рисков не обнаружено.");
    }
  } else {
    lines.push(
      "",
      escapeHtml(
        gsc?.reason ??
          "Google Search Console API временно недоступен. Технический мониторинг продолжает работать.",
      ),
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
