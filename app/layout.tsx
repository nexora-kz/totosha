import type { Metadata } from 'next';
import './globals.css';
import './v035.css';

export const metadata: Metadata = {
  title: 'Тотоша — детский сад нового поколения в Астане',
  description: 'Тотоша — современный детский сад: видеонаблюдение, логопед, Английский язык, хореография, вокал, таэквондо, врач-педиатр и Цифровой кабинет.',
  keywords: ['детский сад Астана','Тотоша','частный детский сад','детский сад с видеонаблюдением','логопед Астана','подготовка к школе'],
  openGraph: { title: 'Тотоша — место, где забота стала системой', description: 'Безопасность • Развитие • Технологии • Забота', type: 'website', locale: 'ru_KZ' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body>{children}
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
