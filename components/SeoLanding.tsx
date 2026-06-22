import {
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  HeartHandshake,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PremiumFooter } from './PremiumFooter';
import { PremiumHeader } from './PremiumHeader';
import { PremiumPageVariant, PremiumVisual } from './PremiumVisual';
import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

type Detail = { title: string; text: string };
type Faq = { question: string; answer: string };

type SeoLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  details?: Detail[];
  faq?: Faq[];
  cta?: string;
  variant?: PremiumPageVariant;
  whatsappIntent?: string;
};

const variantByEyebrow: Record<string, PremiumPageVariant> = {
  'О нас': 'about',
  'Программы': 'programs',
  'Родителям': 'parents',
  'Технологии': 'technology',
  'Франшиза': 'franchise',
  'Контакты': 'contacts',
};

const pointMeta = [
  { icon: ShieldCheck, text: 'Проверенные условия' },
  { icon: HeartHandshake, text: 'Открытая связь' },
  { icon: Clock3, text: 'Понятный режим' },
];

const detailIcons = [ShieldCheck, HeartHandshake, BookOpen, Clock3, Sparkles, Check];

export function SeoLanding({
  eyebrow,
  title,
  description,
  bullets,
  details = [],
  faq = [],
  cta = 'Записаться на экскурсию',
  variant,
  whatsappIntent,
}: SeoLandingProps) {
  const resolvedVariant = variant ?? variantByEyebrow[eyebrow] ?? 'about';
  const message = whatsappIntent ?? (
    resolvedVariant === 'technology'
      ? 'Здравствуйте. Хочу узнать подробнее о цифровой экосистеме Тотоша.'
      : resolvedVariant === 'franchise'
        ? 'Здравствуйте. Хочу узнать подробнее о франшизе Тотоша.'
        : resolvedVariant === 'contacts'
          ? 'Здравствуйте. Хочу записаться на экскурсию в Тотоша.'
          : `Здравствуйте. Хочу узнать подробнее: ${eyebrow}.`
  );
  const whatsappHref = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent(message)}`;

  return (
    <main className="premium-site premium-inner-page">
      <PremiumHeader />

      <section className="premium-inner-hero">
        <div className="premium-shell premium-inner-grid">
          <div className="premium-inner-copy">
            <div className="premium-eyebrow"><Sparkles size={16} /> {eyebrow}</div>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="premium-home-actions">
              <a className="premium-btn premium-btn-navy" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                {cta} <ArrowUpRight size={18} />
              </a>
              <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}>
                <Phone size={17} /> {TOTOSHA_CONTACTS.phoneDisplay}
              </a>
            </div>
            <div className="premium-inner-points">
              {pointMeta.map(({ icon: Icon, text }, index) => (
                <div className="premium-inner-point" key={text}>
                  <span><Icon size={16} /></span>
                  <div>
                    <strong>{text}</strong>
                    <small>{bullets[index] ?? 'Подробности на консультации'}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PremiumVisual variant={resolvedVariant} />
        </div>
      </section>

      <section className="premium-info-section">
        <div className="premium-shell">
          <div className="premium-section-head">
            <div className="premium-section-head-copy">
              <div className="premium-eyebrow"><Check size={15} /> Важное о разделе</div>
              <h2>Понятно, спокойно и без мелкого шрифта</h2>
              <p>Главные условия собраны в коротких карточках. Остальные детали можно уточнить у заведующей до экскурсии или во время личного знакомства.</p>
            </div>
          </div>
          <div className="premium-bullet-grid">
            {bullets.map((item, index) => (
              <article className="premium-bullet-card" data-number={String(index + 1).padStart(2, '0')} key={item}>
                <span><Check size={17} /></span>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {details.length > 0 && (
        <section className="premium-section premium-section-dark">
          <div className="premium-shell">
            <div className="premium-section-head">
              <div className="premium-section-head-copy">
                <div className="premium-eyebrow"><Sparkles size={15} /> Подробнее</div>
                <h2>Как это устроено в Тотоша</h2>
                <p>Не рекламные обещания, а понятное объяснение процессов и действующих возможностей.</p>
              </div>
            </div>
            <div className="premium-details-grid">
              {details.map((item, index) => {
                const Icon = detailIcons[index % detailIcons.length];
                return (
                  <article className="premium-detail-card" key={item.title}>
                    <span><Icon size={22} /></span>
                    <div><h3>{item.title}</h3><p>{item.text}</p></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="premium-section premium-section-paper">
          <div className="premium-shell">
            <div className="premium-section-head">
              <div className="premium-section-head-copy">
                <div className="premium-eyebrow"><MessageCircle size={15} /> Вопросы родителей</div>
                <h2>Коротко о главном</h2>
              </div>
            </div>
            <div className="premium-faq-list">
              {faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="premium-section">
        <div className="premium-shell premium-inner-cta">
          <div>
            <div className="premium-card-kicker premium-card-kicker-light">Следующий шаг</div>
            <h2>Познакомьтесь с Тотоша лично</h2>
            <p>Заявка не обязывает к зачислению. Сначала консультация, экскурсия и ответы на вопросы семьи.</p>
          </div>
          <div className="premium-inner-cta-actions">
            <a className="premium-btn premium-btn-gold" href={whatsappHref} target="_blank" rel="noopener noreferrer">Написать в WhatsApp <ArrowUpRight size={18} /></a>
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
