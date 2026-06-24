import type { Metadata } from 'next';
import { ArrowUpRight, Ban, MessageCircle, Phone, ShieldCheck, Sparkles, Target, Trash2, UserRound } from 'lucide-react';
import { PremiumFooter } from '../../components/PremiumFooter';
import { PremiumHeader } from '../../components/PremiumHeader';
import { TOTOSHA_CONTACTS } from '../../lib/totoshaConfig';

export const metadata: Metadata = {
  title: 'Обработка персональных данных — Тотоша',
  description: 'Информация об обработке контактных данных, оставленных через сайт детского сада Тотоша.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

const items = [
  {
    icon: UserRound,
    title: 'Какие данные передаются',
    text: 'Имя, номер телефона, выбранная тема обращения и комментарий, который посетитель указывает добровольно.',
  },
  {
    icon: Target,
    title: 'Для чего они нужны',
    text: 'Чтобы представитель детского сада мог ответить на вопросы и согласовать удобное время знакомства.',
  },
  {
    icon: Ban,
    title: 'Чего мы не делаем',
    text: 'Не продаём контактные данные, не используем их для сторонней рекламы и не публикуем в открытом доступе.',
  },
  {
    icon: Trash2,
    title: 'Как отозвать обращение',
    text: 'Свяжитесь с нами по телефону или в WhatsApp и сообщите, что хотите отозвать ранее отправленное обращение.',
  },
  {
    icon: ShieldCheck,
    title: 'Что не запрашивает форма',
    text: 'Публичная форма не предназначена для передачи документов, медицинской информации или платёжных сведений.',
  },
  {
    icon: ShieldCheck,
    title: 'Ответственный подход',
    text: 'Доступ к обращениям получают только сотрудники, которым эта информация нужна для обратной связи.',
  },
] as const;

export default function PrivacyPage() {
  const whatsappHref = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent('Здравствуйте. Хочу уточнить вопрос по обработке данных на сайте Тотоша.')}`;

  return (
    <main className="premium-site premium-privacy-page">
      <PremiumHeader />

      <section className="premium-privacy-hero">
        <div className="premium-shell premium-privacy-hero-grid">
          <div>
            <div className="premium-eyebrow"><ShieldCheck size={16} /> Конфиденциальность</div>
            <h1>Контактные данные под бережной защитой</h1>
            <p>Мы используем сведения из формы только для ответа на обращение, записи на экскурсию и консультации по детскому саду.</p>
            <div className="premium-home-actions">
              <a className="premium-btn premium-btn-navy" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Задать вопрос <ArrowUpRight size={18} />
              </a>
              <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}>
                <Phone size={17} /> {TOTOSHA_CONTACTS.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="premium-privacy-shield-card">
            <span><ShieldCheck size={42} /></span>
            <small>Принцип Тотоша</small>
            <strong>Только необходимое. Только для обратной связи.</strong>
            <p>Через публичную форму отправляются только сведения, необходимые для ответа на обращение.</p>
          </div>
        </div>
      </section>

      <section className="premium-privacy-content">
        <div className="premium-shell">
          <div className="premium-section-head">
            <div className="premium-section-head-copy">
              <div className="premium-eyebrow"><Sparkles size={15} /> Простыми словами</div>
              <h2>Как мы обращаемся с данными</h2>
              <p>Что передаётся, зачем это нужно и как обратиться по вопросу ранее отправленного обращения.</p>
            </div>
          </div>
          <div className="premium-privacy-grid">
            {items.map(({ icon: Icon, title, text }) => (
              <article className="premium-privacy-card" key={title}>
                <span><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section premium-privacy-contact-section">
        <div className="premium-shell premium-inner-cta">
          <div>
            <div className="premium-card-kicker premium-card-kicker-light">Обратная связь</div>
            <h2>Остались вопросы?</h2>
            <p>Свяжитесь с нами удобным способом, и мы поможем разобраться.</p>
          </div>
          <div className="premium-inner-cta-actions">
            <a className="premium-btn premium-btn-gold" href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp</a>
            <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}><Phone size={17} /> Позвонить</a>
          </div>
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
