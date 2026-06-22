import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import './v035.css';
import './seo.css';
import './premium.css';
import './premium-generated.css';

const premiumSerif = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-premium-serif',
  display: 'swap',
});

const premiumSans = Manrope({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-premium-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.totoshakids.kz'),
  title: {
    default: 'Тотоша — детский сад нового поколения в Астане',
    template: '%s | Тотоша',
  },
  description: 'Тотоша — современный частный детский сад в Астане: видеонаблюдение, логопед, английский язык, дополнительные занятия и поэтапно развиваемая цифровая экосистема.',
  keywords: ['детский сад Астана','Тотоша','частный детский сад','детский сад с видеонаблюдением','логопед Астана','подготовка к школе','детский сад левый берег','садик Астана'],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Тотоша — место, где забота стала системой',
    description: 'Частный детский сад в Астане: безопасность, развитие, понятный режим и открытая связь с семьёй.',
    url: 'https://www.totoshakids.kz',
    siteName: 'Тотоша',
    type: 'website',
    locale: 'ru_KZ',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${premiumSerif.variable} ${premiumSans.variable}`}>
      <body>
        {children}
        <nav
          aria-label="Индексируемые страницы Тотоша"
          style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
        >
          <a href="/">Главная</a>
          <a href="/about">О нас</a>
          <a href="/programs">Программы</a>
          <a href="/parents">Родителям</a>
          <a href="/cabinet">Технологии</a>
          <a href="/franchise">Франшиза</a>
          <a href="/contacts">Контакты</a>
          <a href="/life">Жизнь Тотоша</a>
        </nav>
        <script
          id="totosha-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Preschool',
              name: 'Тотоша',
              alternateName: 'Totosha Kids',
              url: 'https://www.totoshakids.kz',
              logo: 'https://www.totoshakids.kz/icon.svg',
              description: 'Современный частный детский сад в Астане с видеонаблюдением, логопедом, английским языком, дополнительными занятиями и цифровыми сервисами, которые запускаются поэтапно.',
              telephone: '+7 776 700 29 29',
              areaServed: 'Астана, Казахстан',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'ул. Алихана Бокейхана, 29А',
                addressLocality: 'Астана',
                addressCountry: 'KZ',
              },
              openingHoursSpecification: [{
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '07:30',
                closes: '19:00',
              }],
              sameAs: [
                'https://www.instagram.com/totoshakids/',
                'https://t.me/totoshakids',
              ],
            }),
          }}
        />
        <script
          id="totosha-photo-protection"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', function(e) {
                if (e.target && e.target.tagName === 'IMG') e.preventDefault();
              });
              document.addEventListener('dragstart', function(e) {
                if (e.target && e.target.tagName === 'IMG') e.preventDefault();
              });
            `,
          }}
        />
        <script
          id="totosha-life-top-button"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function mountLifeTopButton() {
                  if (window.location.pathname !== '/life') return;
                  if (document.getElementById('totosha-life-floating')) return;
                  var wrap = document.createElement('div');
                  wrap.id = 'totosha-life-floating';
                  wrap.className = 'life-floating';
                  var btn = document.createElement('a');
                  btn.className = 'life-to-top';
                  btn.href = '#';
                  btn.setAttribute('aria-label', 'Наверх');
                  btn.textContent = '↑';
                  btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  });
                  wrap.appendChild(btn);
                  document.body.appendChild(wrap);
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', mountLifeTopButton);
                } else {
                  mountLifeTopButton();
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
