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
};

const nav = [
  ['/', 'Главная'],
  ['/about', 'О нас'],
  ['/programs', 'Программы'],
  ['/parents', 'Родителям'],
  ['/cabinet', 'Технологии'],
  ['/franchise', 'Франшиза'],
  ['/contacts', 'Контакты'],
] as const;

export function SeoLanding({ eyebrow, title, description, bullets, details = [], faq = [], cta = 'Записаться на экскурсию' }: SeoLandingProps) {
  const whatsappHref = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent('Здравствуйте. Хочу записаться на экскурсию в Тотоша.')}`;

  return (
    <main className="seo-landing seo-page-unified">
      <header className="header seo-unified-header">
        <div className="container">
          <div className="nav">
            <a className="brand" href="/" aria-label="На главную Тотоша">
              <div className="logo">🧸</div>
              <div><div className="brand-title">Тотоша</div><div className="brand-sub">детский сад нового поколения</div></div>
            </a>
            <nav className="links" aria-label="Основная навигация">
              {nav.slice(1).map(([href, label]) => <a key={href} href={href}>{label}</a>)}
            </nav>
            <div className="actions">
              <a className="btn btn-light" href="/parents">Родителям</a>
              <a className="btn btn-dark" href="/contacts">Записаться</a>
            </div>
          </div>
        </div>
      </header>

      <section className="hero seo-unified-hero">
        <div className="orb1" /><div className="orb2" />
        <div className="container hero-grid seo-hero-grid">
          <div>
            <div className="badge">✨ {eyebrow}</div>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={whatsappHref}>{cta}</a>
              <a className="btn btn-light" href={TOTOSHA_CONTACTS.telUrl}>Позвонить: {TOTOSHA_CONTACTS.phoneDisplay}</a>
            </div>
          </div>
          <div className="hero-card hero-card-v035 seo-hero-card">
            <div className="hero-scene hero-scene-v035 seo-hero-scene">
              <div className="bubble b1" /><div className="bubble b2" /><div className="bubble b3" />
              <div className="emoji e1">🧸</div><div className="emoji e2">🎨</div><div className="emoji e3">📚</div>
              <div className="mini mini-top"><b>Тотоша</b><small>Астана · 07:30–19:00</small></div>
              <div className="mini dash">
                <div className="dash-head"><div><small>Первое знакомство</small><h3>Сначала экскурсия и ответы на вопросы</h3></div><div className="pill">✓</div></div>
                {['Заявка без обязательств', 'Связь с заведующей', 'Знакомство с группой', 'Решение после экскурсии'].map((item) => (
                  <div className="dash-row" key={item}><span>{item}</span><b>OK</b></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section white seo-landing__content">
        <div className="container">
          <div className="section-title"><div className="eyebrow">Что важно знать</div><h2>Понятно о детском саде</h2></div>
          <div className="grid grid-3">
            {bullets.map((item) => <article className="card" key={item}><div className="icon">✓</div><h3>{item}</h3><p>Подробности можно уточнить у заведующей до экскурсии или во время личного знакомства.</p></article>)}
          </div>
        </div>
      </section>

      {details.length > 0 && <section className="section seo-landing__content seo-landing__details"><div className="container"><div className="section-title"><div className="eyebrow">Подробнее</div><h2>Как это устроено</h2></div><div className="seo-detail-list">{details.map((item) => <article className="seo-detail" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>}

      {faq.length > 0 && <section className="section white seo-landing__content seo-landing__faq"><div className="container"><div className="section-title"><div className="eyebrow">Вопросы родителей</div><h2>Коротко о главном</h2></div><div className="seo-faq-list">{faq.map((item) => <article className="seo-faq" key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div></div></section>}

      <footer className="footer"><div className="container footer-row"><div><div className="brand-title">Тотоша</div><div className="brand-sub">Частный детский сад в Астане</div></div><div className="hero-actions" style={{ marginTop: 0 }}><a className="btn btn-light" href="/contacts">Контакты</a><a className="btn btn-light" href="/privacy">Обработка данных</a></div></div></footer>
    </main>
  );
}
