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
    <main className="seo-landing">
      <section className="seo-landing__hero">
        <a className="seo-landing__brand" href="/" aria-label="На главную Тотоша">
          <span className="seo-landing__logo">🧸</span>
          <span><b>Тотоша</b><small>детский сад нового поколения</small></span>
        </a>

        <nav className="seo-landing__nav" aria-label="Основные страницы">
          <a href="/about">О нас</a>
          <a href="/programs">Программы</a>
          <a href="/parents">Родителям</a>
          <a href="/cabinet">Технологии</a>
          <a href="/contacts">Контакты</a>
        </nav>

        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="seo-landing__actions">
          <a className="btn btn-primary" href={`${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent('Здравствуйте. Хочу записаться на экскурсию в Тотоша.')}`}>{cta}</a>
          <a className="btn btn-light" href={TOTOSHA_CONTACTS.telUrl}>Позвонить: {TOTOSHA_CONTACTS.phoneDisplay}</a>
        </div>
      </section>

      <section className="seo-landing__content">
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
      </section>

      {details.length > 0 && (
        <section className="seo-landing__content seo-landing__details">
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
        </section>
      )}

      {faq.length > 0 && (
        <section className="seo-landing__content seo-landing__faq">
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
        </section>
      )}

      <section className="seo-landing__footer">
        <a href="/">Главная</a>
        <a href="/about">О нас</a>
        <a href="/programs">Программы</a>
        <a href="/parents">Родителям</a>
        <a href="/cabinet">Технологии</a>
        <a href="/franchise">Франшиза</a>
        <a href="/contacts">Контакты</a>
        <a href="/life">Жизнь Тотоша</a>
      </section>
    </main>
  );
}
