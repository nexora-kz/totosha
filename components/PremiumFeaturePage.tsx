import { ArrowUpRight, Check, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { PremiumFooter } from './PremiumFooter';
import { PremiumHeader } from './PremiumHeader';
import { PremiumLeadForm } from './PremiumLeadForm';
import { PremiumPageVariant, PremiumVisual } from './PremiumVisual';
import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

type Card = { title: string; text: string };
type Faq = { question: string; answer: string };

type PremiumFeaturePageProps = {
  variant: PremiumPageVariant;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cards: Card[];
  faq?: Faq[];
  primaryLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  cardsTitle: string;
  cardsDescription: string;
  finalTitle: string;
  finalDescription: string;
  formTitle: string;
  formDescription: string;
  formIntent: string;
  formOptions?: string[];
  whatsappIntent: string;
};

export function PremiumFeaturePage({
  variant,
  eyebrow,
  title,
  description,
  bullets,
  cards,
  faq = [],
  primaryLabel,
  sectionTitle,
  sectionDescription,
  cardsTitle,
  cardsDescription,
  finalTitle,
  finalDescription,
  formTitle,
  formDescription,
  formIntent,
  formOptions,
  whatsappIntent,
}: PremiumFeaturePageProps) {
  const whatsappHref = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent(whatsappIntent)}`;

  return (
    <main className={`premium-site premium-inner-page premium-inner-${variant}`}>
      <PremiumHeader />

      <section className="premium-inner-hero">
        <div className="premium-shell premium-inner-grid">
          <div className="premium-inner-copy">
            <div className="premium-eyebrow"><Sparkles size={16} /> {eyebrow}</div>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="premium-home-actions">
              <a className="premium-btn premium-btn-navy" href="#lead-form">{primaryLabel} <ArrowUpRight size={18} /></a>
              <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}><Phone size={17} /> {TOTOSHA_CONTACTS.phoneDisplay}</a>
            </div>
            <div className="premium-inner-points">
              {bullets.slice(0, 3).map((item) => (
                <div className="premium-inner-point" key={item}>
                  <span><Check size={16} /></span>
                  <div><strong>{item}</strong><small>Подробности на консультации</small></div>
                </div>
              ))}
            </div>
          </div>
          <PremiumVisual variant={variant} />
        </div>
      </section>

      <section className="premium-info-section">
        <div className="premium-shell">
          <div className="premium-section-head">
            <div className="premium-section-head-copy">
              <div className="premium-eyebrow"><Check size={15} /> Главное</div>
              <h2>{sectionTitle}</h2>
              <p>{sectionDescription}</p>
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

      <section className="premium-section premium-section-dark">
        <div className="premium-shell">
          <div className="premium-section-head">
            <div className="premium-section-head-copy">
              <div className="premium-eyebrow"><Sparkles size={15} /> Подробнее</div>
              <h2>{cardsTitle}</h2>
              <p>{cardsDescription}</p>
            </div>
          </div>
          <div className="premium-details-grid">
            {cards.map((item) => (
              <article className="premium-detail-card" key={item.title}>
                <span><Check size={20} /></span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {faq.length > 0 && (
        <section className="premium-section premium-section-paper">
          <div className="premium-shell">
            <div className="premium-section-head">
              <div className="premium-section-head-copy">
                <div className="premium-eyebrow"><MessageCircle size={15} /> Вопросы</div>
                <h2>Ответы без сложных формулировок</h2>
              </div>
            </div>
            <div className="premium-faq-list">
              {faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
            </div>
          </div>
        </section>
      )}

      <section className="premium-section premium-section-lead" id="lead-form">
        <div className="premium-shell premium-lead-layout">
          <div className="premium-lead-copy">
            <div className="premium-card-kicker premium-card-kicker-light">Следующий шаг</div>
            <h2>{finalTitle}</h2>
            <p>{finalDescription}</p>
            <div className="premium-lead-direct-actions">
              <a className="premium-btn premium-btn-gold" href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={18} /></a>
              <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}><Phone size={17} /> Позвонить</a>
            </div>
          </div>
          <PremiumLeadForm
            title={formTitle}
            description={formDescription}
            defaultIntent={formIntent}
            intentOptions={formOptions}
            source={`totoshakids.kz ${variant}`}
            submitLabel={primaryLabel}
            compact
          />
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
