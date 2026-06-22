import type { Metadata } from 'next';
import { TOTOSHA_CONTACTS } from '../../lib/totoshaConfig';

export const metadata: Metadata = {
  title: 'Обработка персональных данных — Тотоша',
  description: 'Информация об обработке контактных данных, оставленных через сайт детского сада Тотоша.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
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
            <div className="actions">
              <a className="btn btn-dark" href="/contacts">Контакты</a>
            </div>
          </div>
        </div>
      </header>

      <section className="hero seo-unified-hero">
        <div className="container">
          <div className="badge">Конфиденциальность</div>
          <h1>Обработка контактных данных</h1>
          <p className="lead">
            Мы используем сведения из формы только для ответа на обращение, записи на экскурсию и консультации по детскому саду.
          </p>
        </div>
      </section>

      <section className="section white seo-landing__content">
        <div className="container seo-detail-list">
          <article className="seo-detail">
            <h2>Какие данные передаются</h2>
            <p>Имя, номер телефона, выбранная тема обращения и комментарий, который родитель указывает добровольно.</p>
          </article>
          <article className="seo-detail">
            <h2>Для чего они нужны</h2>
            <p>Чтобы заведующая могла связаться с родителем, ответить на вопросы, уточнить возраст ребёнка и согласовать экскурсию.</p>
          </article>
          <article className="seo-detail">
            <h2>Чего мы не делаем</h2>
            <p>Не продаём контактные данные, не используем их для сторонней рекламы и не публикуем в открытом доступе.</p>
          </article>
          <article className="seo-detail">
            <h2>Как отозвать обращение</h2>
            <p>
              Напишите в WhatsApp или позвоните по номеру <a href={TOTOSHA_CONTACTS.telUrl}>{TOTOSHA_CONTACTS.phoneDisplay}</a> и попросите удалить контактные сведения из обращения.
            </p>
          </article>
          <article className="seo-detail">
            <h2>Персональные данные детей</h2>
            <p>Данные ребёнка, медицинские сведения, документы, фото и информация об оплатах не собираются через публичную форму сайта.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
