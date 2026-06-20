import type { Metadata } from 'next';
import { TOTOSHA_BUILD_DATE, TOTOSHA_CONTACTS, TOTOSHA_VERSION } from '../../lib/totoshaConfig';

export const metadata: Metadata = {
  title: 'Статус системы Тотоша',
  robots: { index: false, follow: false },
};

function mask(value?: string) {
  if (!value) return 'не настроено';
  return 'настроено';
}

export default function StatusPage() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown';
  const telegramReady = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  const supabaseReady = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );

  const items = [
    ['Сайт', 'работает', true],
    ['Telegram-заявки', mask(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID ? 'yes' : ''), telegramReady],
    ['Supabase', mask(supabaseReady ? 'yes' : ''), supabaseReady],
    ['Окружение', env, env === 'production'],
    ['Версия', TOTOSHA_VERSION, true],
    ['Дата сборки', TOTOSHA_BUILD_DATE, true],
    ['Контакт', TOTOSHA_CONTACTS.phoneDisplay, true],
    ['Git commit', commit.slice(0, 12), commit !== 'unknown'],
  ] as const;

  return (
    <main className="status-page">
      <section className="status-card">
        <div className="eyebrow">TOTOSHA Control Center</div>
        <h1>Статус сайта Тотоша</h1>
        <p>Эта страница нужна, чтобы быстро понять: обновление выкатилось, сервер живой, Telegram и Supabase подключены.</p>
        <div className="status-grid">
          {items.map(([label, value, ok]) => (
            <div className="status-item" key={label}>
              <span>{label}</span>
              <b>{value}</b>
              <em className={ok ? 'ok' : 'warn'}>{ok ? 'OK' : 'Проверить'}</em>
            </div>
          ))}
        </div>
        <div className="status-actions">
          <a className="btn btn-primary" href="/api/health">Открыть health-check</a>
          <a className="btn btn-light" href="/sitemap.xml">Sitemap</a>
          <a className="btn btn-light" href="/robots.txt">Robots</a>
          <a className="btn btn-light" href="/">На сайт</a>
        </div>
      </section>
    </main>
  );
}
