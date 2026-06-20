import type { Metadata } from 'next';
import './globals.css';
import './v035.css';
import './seo.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.totoshakids.kz'),
  title: {
    default: 'Тотоша — детский сад нового поколения в Астане',
    template: '%s | Тотоша',
  },
  description: 'Тотоша — современный детский сад в Астане: видеонаблюдение, логопед, Английский язык, хореография, вокал, таэквондо, врач-педиатр и Цифровой кабинет.',
  keywords: ['детский сад Астана','Тотоша','частный детский сад','детский сад с видеонаблюдением','логопед Астана','подготовка к школе','детский сад левый берег','садик Астана'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Тотоша — место, где забота стала системой',
    description: 'Современный детский сад в Астане: безопасность, развитие, технологии и забота.',
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
  return <html lang="ru"><body>{children}
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
              logo: 'https://www.totoshakids.kz/icon.png',
              description: 'Современный детский сад нового поколения в Астане с видеонаблюдением, цифровым кабинетом, логопедом, английским языком и дополнительными занятиями.',
              telephone: '+7 776 700 29 29',
              areaServed: 'Астана, Казахстан',
              address: {
                '@type': 'PostalAddress',
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
          id="totosha-real-url-navigation-v036"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var routes = {
                  'О нас': '/about',
                  'Программы': '/programs',
                  'Родителям': '/parents',
                  'Технологии': '/cabinet',
                  'Цифровой кабинет': '/cabinet',
                  'Франшиза': '/franchise',
                  'Контакты': '/contacts',
                  'Записаться': '/contacts',
                  'Главная': '/'
                };

                document.addEventListener('click', function(event) {
                  var target = event.target;
                  var button = target && target.closest ? target.closest('.header button') : null;
                  if (!button) return;

                  var text = (button.textContent || '').replace(/\s+/g, ' ').trim();
                  var href = routes[text];
                  if (!href) return;

                  event.preventDefault();
                  event.stopPropagation();
                  if (event.stopImmediatePropagation) event.stopImmediatePropagation();
                  if (window.location.pathname === href) return;
                  window.location.href = href;
                }, true);
              })();
            `,
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
              document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && ['s','u','p'].includes(e.key.toLowerCase())) {
                  e.preventDefault();
                }
              });
            `,
          }}
        />
        <script
          id="totosha-lead-flow-v035"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var blockAutoWhatsAppUntil = 0;
                var lastWhatsAppUrl = '';
                var nativeOpen = window.open;

                window.open = function(url, target, features) {
                  var href = String(url || '');
                  var isWhatsApp = href.indexOf('https://wa.me/') === 0 || href.indexOf('http://wa.me/') === 0;
                  if (isWhatsApp && Date.now() < blockAutoWhatsAppUntil) {
                    lastWhatsAppUrl = href;
                    setTimeout(enhanceSuccessMessage, 80);
                    setTimeout(enhanceSuccessMessage, 300);
                    setTimeout(enhanceSuccessMessage, 900);
                    return null;
                  }
                  return nativeOpen.call(window, url, target, features);
                };

                document.addEventListener('click', function(event) {
                  var target = event.target;
                  var button = target && target.closest ? target.closest('.form .btn-primary') : null;
                  if (!button) return;
                  var form = button.closest('.form');
                  if (!form) return;
                  blockAutoWhatsAppUntil = Date.now() + 5000;
                }, true);

                function enhanceSuccessMessage() {
                  var cards = document.querySelectorAll('.form .success');
                  cards.forEach(function(card) {
                    if (card.dataset.v035Enhanced === '1') return;
                    card.dataset.v035Enhanced = '1';
                    var title = card.querySelector('b');
                    var text = card.querySelector('p');
                    if (title) title.textContent = 'Заявка принята';
                    if (text) text.textContent = 'Спасибо. Айшагуль Галымжановна свяжется с вами в ближайшее время.';

                    var actions = document.createElement('div');
                    actions.className = 'lead-success-actions';

                    var note = document.createElement('span');
                    note.textContent = 'Хотите быстрее? Можно написать напрямую:';
                    actions.appendChild(note);

                    var link = document.createElement('button');
                    link.type = 'button';
                    link.className = 'btn btn-light lead-whatsapp-button';
                    link.textContent = 'Написать в WhatsApp';
                    link.addEventListener('click', function() {
                      var url = lastWhatsAppUrl || 'https://wa.me/77767002929?text=' + encodeURIComponent('Здравствуйте. Хочу узнать подробнее про Тотоша.');
                      nativeOpen.call(window, url, '_blank', 'noopener,noreferrer');
                    });
                    actions.appendChild(link);
                    card.appendChild(actions);
                  });
                }
              })();
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

      </body></html>;
}
