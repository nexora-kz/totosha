import { ArrowUpRight, Baby, Clock3, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

const footerLinks = [
  { href: '/about', label: 'О нас' },
  { href: '/programs', label: 'Программы' },
  { href: '/parents', label: 'Родителям' },
  { href: '/cabinet', label: 'Технологии' },
  { href: '/life', label: 'Жизнь Тотоша' },
  { href: '/privacy', label: 'Обработка данных' },
] as const;

export function PremiumFooter() {
  const whatsapp = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent('Здравствуйте. Хочу узнать подробнее про Тотоша.')}`;

  return (
    <footer className="premium-footer">
      <div className="premium-shell premium-footer-grid">
        <div className="premium-footer-brand">
          <a className="premium-brand premium-brand-light" href="/" aria-label="Тотоша — главная">
            <span className="premium-logo-mark" aria-hidden="true"><Baby size={24} strokeWidth={1.65} /></span>
            <span className="premium-brand-copy">
              <strong>Тотоша</strong>
              <small>детский сад нового поколения</small>
            </span>
          </a>
          <p>Забота, гармоничное развитие и открытая связь с семьёй — каждый день.</p>
          <div className="premium-footer-socials">
            <a href={TOTOSHA_CONTACTS.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram Тотоша"><Instagram size={18} /></a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Тотоша"><MessageCircle size={18} /></a>
          </div>
        </div>

        <div className="premium-footer-column">
          <h3>Навигация</h3>
          <div className="premium-footer-links">
            {footerLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </div>
        </div>

        <div className="premium-footer-column">
          <h3>Контакты</h3>
          <a className="premium-footer-contact" href={TOTOSHA_CONTACTS.telUrl}>
            <Phone size={18} />
            <span><small>Телефон</small><strong>{TOTOSHA_CONTACTS.phoneDisplay}</strong></span>
          </a>
          <a className="premium-footer-contact" href={TOTOSHA_CONTACTS.mapUrl} target="_blank" rel="noopener noreferrer">
            <MapPin size={18} />
            <span><small>Адрес</small><strong>Астана, Алихана Бокейхана, 29А</strong></span>
          </a>
          <div className="premium-footer-contact">
            <Clock3 size={18} />
            <span><small>Режим работы</small><strong>Пн–Пт · 07:30–19:00</strong></span>
          </div>
        </div>

        <div className="premium-footer-cta">
          <small>Первое знакомство</small>
          <h3>Приходите на экскурсию</h3>
          <p>Покажем пространство и ответим на вопросы семьи.</p>
          <a className="premium-btn premium-btn-gold" href="/contacts">Записаться <ArrowUpRight size={18} /></a>
        </div>
      </div>
      <div className="premium-shell premium-footer-bottom">
        <span>© {new Date().getFullYear()} Тотоша</span>
        <span>Частный детский сад в Астане</span>
      </div>
    </footer>
  );
}
