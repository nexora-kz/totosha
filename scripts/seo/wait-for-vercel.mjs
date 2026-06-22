const repository = process.env.GITHUB_REPOSITORY?.trim();
const sha = process.env.GITHUB_SHA?.trim();
const token = process.env.GITHUB_TOKEN?.trim();
const apiUrl = process.env.GITHUB_API_URL?.trim() || "https://api.github.com";

const timeoutMs = Number(process.env.VERCEL_WAIT_TIMEOUT_MS || 10 * 60 * 1000);
const intervalMs = Number(process.env.VERCEL_WAIT_INTERVAL_MS || 10 * 1000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchStatuses() {
  const response = await fetch(
    `${apiUrl}/repos/${repository}/commits/${sha}/statuses?per_page=100`,
    {
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "x-github-api-version": "2022-11-28",
        "user-agent": "TOTOSHA-SEO-Autopilot/1.1",
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub statuses API ${response.status}: ${body.slice(0, 500)}`);
  }

  return response.json();
}

async function main() {
  if (!repository || !sha || !token) {
    throw new Error(
      "GITHUB_REPOSITORY, GITHUB_SHA или GITHUB_TOKEN не заданы — нельзя дождаться Vercel deployment.",
    );
  }

  const startedAt = Date.now();
  let attempt = 0;

  while (Date.now() - startedAt < timeoutMs) {
    attempt += 1;
    const statuses = await fetchStatuses();
    const vercelStatuses = statuses.filter((status) =>
      String(status.context || "").toLowerCase().startsWith("vercel"),
    );

    const latest = vercelStatuses[0];
    const state = latest?.state || "not-created";
    console.log(
      `Vercel deployment check #${attempt}: ${state}${
        latest?.target_url ? ` — ${latest.target_url}` : ""
      }`,
    );

    if (state === "success") {
      // Даём production alias и CDN несколько секунд на распространение.
      await sleep(8000);
      console.log("Vercel production deployment готов. Запускаем SEO-проверку.");
      return;
    }

    if (state === "failure" || state === "error") {
      throw new Error(
        `Vercel deployment завершился со статусом ${state}. SEO-проверка остановлена, чтобы не анализировать старую версию сайта.`,
      );
    }

    await sleep(intervalMs);
  }

  throw new Error(
    `Vercel deployment не завершился за ${Math.round(timeoutMs / 60000)} минут.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
