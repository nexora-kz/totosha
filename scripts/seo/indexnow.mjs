import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  PAGES,
  SITE_HOST,
  SITE_URL,
} from "./config.mjs";

function requestedUrls() {
  const cli = process.argv.slice(2).filter((value) => value.startsWith("http"));
  const env = (process.env.INDEXNOW_URLS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const source = [...cli, ...env];
  const urls = source.length
    ? source
    : PAGES.map((page) => new URL(page.path, SITE_URL).toString());

  return [...new Set(urls)]
    .map((value) => new URL(value, SITE_URL))
    .filter((url) => url.hostname === SITE_HOST)
    .map((url) => url.toString());
}

async function main() {
  const urlList = requestedUrls();
  if (!urlList.length) {
    console.log("IndexNow: нет URL для отправки.");
    return;
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "user-agent":
        "TOTOSHA-SEO-Autopilot/1.0 (+https://www.totoshakids.kz)",
    },
    body: JSON.stringify({
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList,
    }),
  });

  const body = await response.text();
  console.log(
    JSON.stringify(
      {
        endpoint: "https://api.indexnow.org/indexnow",
        status: response.status,
        accepted: response.status === 200 || response.status === 202,
        urlCount: urlList.length,
        body: body.slice(0, 1000),
      },
      null,
      2,
    ),
  );

  if (![200, 202].includes(response.status)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
