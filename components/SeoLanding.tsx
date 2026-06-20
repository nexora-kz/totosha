import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

type Detail = {
  title: string;
  text: string;
};

type Faq = {
  question: string;
  answer: string;
};

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

export function SeoLanding({
  eyebrow,
  title,
  description,
  bullets,
  details = [],
  faq = [],
  cta = 'Записаться на экскурсию',
}: SeoLandingProps) {
  return (
    <main className="seo-landing seo-page-unified">
      <header className="header seo-unified-header">
        <div className="container">
          <div className="nav">
            <a className="brand" href="/" aria-label="На главную Тотоша">
              <div className="logo">🧸</div>
              <div>
                <div className="brand-title">Тотоша</div>
                <div className="brand-sub">детский сад нового поколения</div>
              </div>
            </a>
            <div className="links">
              {nav.slice(1).map(([href, label]) => (
                <a key={href} href={href}>{label}</a>
              ))}
            </div>
            <div className="actions">
              <a className="btn btn-light" href="/cabinet">Цифровой кабинет</a>
              <a className="btn btn-dark" href="/contacts">Записаться</a>
            </div>
          </div>
        </div>
      </header>

      <section className="hero seo-unified-hero">
        <div className="orb1" />
        <div className="orb2" />
        <div className="container hero-grid seo-hero-grid">
          <div>
            <div className="badge">✨ {eyebrow}</div>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent('Здравствуйте. Хочу записаться на экскурсию в Тотоша.')}`}>{cta}</a>
              <a className="btn btn-light" href={TOTOSHA_CONTACTS.telUrl}>Позвонить: {TOTOSHA_CONTACTS.phoneDisplay}</a>
            </div>
          </div>
          <div className="hero-card hero-card-v035 seo-hero-card">
            <div className="hero-scene hero-scene-v035 seo-hero-scene">
              <div className="bubble b1" />
              <div className="bubble b2" />
              <div className="bubble b3" />
              <div className="emoji e1">🧸</div>
              <div className="emoji e2">🎨</div>
              <div className="emoji e3">📚</div>
              <div className="mini mini-top">
                <b>Тотоша</b>
                <small>безопасность, развитие и забота</small>
              </div>
              <div className="mini dash">
                <div className="dash-head">
                  <div><small>Сегодня</small><h3>День ребёнка под контролем</h3></div>
                  <div className="pill">✓</div>
                </div>
                {['Забота и адаптация', 'Развитие по возрасту', 'Связь с родителями', 'Цифровой контроль'].map((item) => (
                  <div className="dash-row" key={item}><span>{item}</span><b>OK</b></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section white seo-landing__content">
        <div className="container">
          <div className="section-title">
            <div className="eyebrow">Что важно знать</div>
            <h2>Почему родители выбирают Тотоша</h2>
          </div>
          <div className="grid grid-3">
            {bullets.map((item) => (
              <article className="card" key={item}>
                <div className="icon">✓</div>
                <h3>{item}</h3>
                <p>Мы соединяем заботу, безопасность, развитие и современные технологии в понятную систему для семьи.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {details.length > 0 && (
        <section className="section seo-landing__content seo-landing__details">
          <div className="container">
            <div className="section-title">
              <div className="eyebrow">Подробнее</div>
              <h2>Сильные стороны Тотоша</h2>
            </div>
            <div className="seo-detail-list">
              {details.map((item) => (
                <article className="seo-detail" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="section white seo-landing__content seo-landing__faq">
          <div className="container">
            <div className="section-title">
              <div className="eyebrow">Вопросы родителей</div>
              <h2>Коротко о главном</h2>
            </div>
            <div className="seo-faq-list">
              {faq.map((item) => (
                <article className="seo-faq" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="seo-landing__footer">
        {nav.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        <a href="/life">Жизнь Тотоша</a>
      </section>
    </main>
  );
}
