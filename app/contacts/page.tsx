import type { Metadata } from 'next';
import { Clock3, Instagram, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { PremiumFooter } from '../../components/PremiumFooter';
import { PremiumHeader } from '../../components/PremiumHeader';
import { PremiumLeadForm } from '../../components/PremiumLeadForm';
import { PremiumMap } from '../../components/PremiumMap';
import { TOTOSHA_CONTACTS } from '../../lib/totoshaConfig';

export const metadata: Metadata = {
  title: 'Контакты детского сада Тотоша в Астане',
  description: 'Адрес, телефон, WhatsApp, Instagram, режим работы и маршрут до детского сада Тотоша.',
  alternates: { canonical: '/contacts' },
};

export default function ContactsPage() {
  const whatsappHref = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent('Здравствуйте. Хочу записаться на экскурсию в Тотоша.')}`;

  return (
    <main className="premium-site premium-contacts-page">
      <PremiumHeader />

      <section className="premium-inner-hero premium-contacts-hero">
        <div className="premium-shell premium-contacts-grid">
          <div className="premium-inner-copy">
            <div className="premium-eyebrow"><Sparkles size={16} /> Контакты</div>
            <h1>Будем рады познакомиться</h1>
            <p>Напишите, позвоните или оставьте заявку. Мы ответим на вопросы и предложим удобное время экскурсии.</p>
            <div className="premium-contact-quick-grid">
              <a href={TOTOSHA_CONTACTS.telUrl}><Phone size={20} /><span><small>Телефон</small><strong>{TOTOSHA_CONTACTS.phoneDisplay}</strong></span></a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /><span><small>WhatsApp</small><strong>Написать сообщение</strong></span></a>
              <a href={TOTOSHA_CONTACTS.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={20} /><span><small>Instagram</small><strong>@totoshakids</strong></span></a>
              <a href={TOTOSHA_CONTACTS.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={20} /><span><small>Адрес</small><strong>{TOTOSHA_CONTACTS.address}</strong></span></a>
            </div>
            <div className="premium-contact-hours-line"><Clock3 size={18} /> Пн–Пт · 07:30–19:00</div>
          </div>

          <PremiumLeadForm
            title="Записаться на экскурсию"
            description="Телефон в поле указан только как пример формата. Введите свой номер."
            defaultIntent="Записаться на экскурсию"
            intentOptions={['Записаться на экскурсию', 'Уточнить наличие мест', 'Задать вопрос', 'Узнать подходящую группу']}
            source="totoshakids.kz contacts"
          />
        </div>
      </section>

      <section className="premium-section premium-section-paper">
        <div className="premium-shell">
          <div className="premium-section-head">
            <div className="premium-section-head-copy">
              <div className="premium-eyebrow"><MapPin size={15} /> Маршрут</div>
              <h2>Тотоша на карте Астаны</h2>
              <p>Адрес и прямые кнопки маршрута доступны даже при медленной загрузке встроенной карты.</p>
            </div>
          </div>
          <PremiumMap />
        </div>
      </section>

      <PremiumFooter />
      <div className="premium-mobile-dock">
        <a className="premium-btn premium-btn-navy" href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp</a>
        <a className="premium-btn premium-btn-gold" href={TOTOSHA_CONTACTS.telUrl}><Phone size={17} /> Позвонить</a>
      </div>
    </main>
  );
}
