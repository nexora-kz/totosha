'use client';

import { useState } from 'react';
import { Baby, CalendarDays, Menu, Phone, Sparkles, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

const links = [
  { href: '/about', label: 'О нас' },
  { href: '/programs', label: 'Программы' },
  { href: '/parents', label: 'Родителям' },
  { href: '/cabinet', label: 'Технологии' },
  { href: '/franchise', label: 'Франшиза' },
  { href: '/contacts', label: 'Контакты' },
] as const;

export function PremiumHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="premium-header">
      <style>{`.premium-site{overflow:visible;overflow-x:clip}`}</style>
      <div className="premium-shell">
        <div className="premium-nav">
          <a className="premium-brand" href="/" aria-label="Тотоша — главная">
            <span className="premium-logo-mark" aria-hidden="true">
              <Baby size={24} strokeWidth={1.65} />
              <i className="premium-logo-star premium-logo-star-one">✦</i>
              <i className="premium-logo-star premium-logo-star-two">✧</i>
            </span>
            <span className="premium-brand-copy">
              <strong>Тотоша</strong>
              <small>детский сад нового поколения</small>
            </span>
          </a>

          <nav className="premium-links" aria-label="Основная навигация">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={active ? 'is-active' : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="premium-header-actions">
            <a className="premium-btn premium-btn-ghost premium-header-call" href={TOTOSHA_CONTACTS.telUrl}>
              <Phone size={17} />
              <span>Позвонить</span>
            </a>
            <a className="premium-btn premium-btn-navy" href="/contacts">
              <CalendarDays size={18} />
              <span>Записаться</span>
            </a>
          </div>

          <button
            type="button"
            className="premium-menu-toggle"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        <div className={`premium-mobile-menu ${open ? 'is-open' : ''}`}>
          <div className="premium-mobile-note">
            <Sparkles size={16} />
            <span>Премиальный детский сад в Астане</span>
          </div>
          <nav aria-label="Мобильная навигация">
            <a href="/" className={pathname === '/' ? 'is-active' : undefined}>Главная</a>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'is-active' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="premium-mobile-actions">
            <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}>
              <Phone size={17} /> Позвонить
            </a>
            <a className="premium-btn premium-btn-navy" href="/contacts">
              <CalendarDays size={17} /> Записаться
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
