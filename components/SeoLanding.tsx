import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

type SeoLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cta?: string;
};

export function SeoLanding({ eyebrow, title, description, bullets, cta = 'Записаться на экскурсию' }: SeoLandingProps) {
  return (
    <main className="seo-landing">
      <section className="seo-landing__hero">
        <a className="seo-landing__brand" href="/" aria-label="На главную Тотоша">
          <span className="seo-landing__logo">🧸</span>
          <span><b>Тотоша</b><small>детский сад нового поколения</small></span>
        </a>
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

      <section className="seo-landing__footer">
        <a href="/">Главная</a>
        <a href="/programs">Программы</a>
        <a href="/parents">Родителям</a>
        <a href="/contacts">Контакты</a>
        <a href="/life">Жизнь Тотоша</a>
      </section>
    </main>
  );
}
