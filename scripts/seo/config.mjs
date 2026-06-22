export const SITE_URL = "https://www.totoshakids.kz";
export const SITE_HOST = "www.totoshakids.kz";
export const INDEXNOW_KEY = "2ffcad2348b839de883675d2c6d1dbf8f0e032d2";
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

export const PAGES = [
  { path: "/", label: "Главная", critical: true },
  { path: "/about", label: "О нас", critical: true },
  { path: "/programs", label: "Программы", critical: true },
  { path: "/parents", label: "Родителям", critical: true },
  { path: "/cabinet", label: "Технологии", critical: true },
  { path: "/franchise", label: "Франшиза", critical: false },
  { path: "/contacts", label: "Контакты", critical: true },
  { path: "/life", label: "Жизнь Тотоша", critical: false },
];

export const REQUIRED_ENDPOINTS = [
  "/robots.txt",
  "/sitemap-totosha.xml",
  "/icon.svg",
];

export const SEARCH_CONSOLE_SITE_URL = "https://www.totoshakids.kz/";
