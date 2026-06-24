import type { Metadata } from 'next';
import { ArrowUpRight, BadgeCheck, BriefcaseBusiness, Clock3, ExternalLink, GraduationCap, HeartHandshake, MapPin, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { JobApplicationForm } from '../../components/JobApplicationForm';
import { PremiumFooter } from '../../components/PremiumFooter';
import { PremiumHeader } from '../../components/PremiumHeader';
import { loadPublicVacancies } from '../../lib/vacancySources';
import { formatVacancySalary } from '../../lib/totoshaVacancies';

export const metadata: Metadata = {
  title: 'Вакансии детского сада Тотоша в Астане',
  description: 'Работа в детском саду Тотоша: вакансии воспитателя, помощника воспитателя и педагогов дополнительного образования.',
  alternates: { canonical: '/vacancies' },
};

export const revalidate = 300;

export default async function VacanciesPage() {
  const vacancies = await loadPublicVacancies();

  return (
    <main className="premium-site vacancies-page">
      <PremiumHeader />

      <section className="vacancies-hero">
        <div className="premium-shell vacancies-hero-grid">
          <div className="vacancies-hero-copy">
            <div className="premium-eyebrow"><Sparkles size={16} /> Работа в Тотоша</div>
            <h1>Собираем сильную и заботливую команду</h1>
            <p>Мы ищем людей, которые уважают ребёнка, умеют работать спокойно и ответственно и готовы развиваться вместе с детским садом.</p>
            <div className="premium-home-actions">
              <a className="premium-btn premium-btn-navy" href="#openings">Смотреть вакансии <ArrowUpRight size={18} /></a>
              <a className="premium-btn premium-btn-ghost" href="#application">Отправить резюме</a>
            </div>
            <div className="vacancies-trust-row">
              <span><ShieldCheck size={17} /> Понятные обязанности</span>
              <span><UsersRound size={17} /> Командная работа</span>
              <span><HeartHandshake size={17} /> Уважение к детям</span>
            </div>
          </div>

          <div className="vacancies-hero-panel">
            <small>Тотоша · Астана</small>
            <strong>{vacancies.length}</strong>
            <span>позиции для отклика</span>
            <div className="vacancies-hero-note"><BriefcaseBusiness size={20} /> Все анкеты поступают напрямую администрации детского сада.</div>
          </div>
        </div>
      </section>

      <section className="premium-section premium-section-paper" id="openings">
        <div className="premium-shell">
          <div className="premium-section-head">
            <div className="premium-section-head-copy">
              <div className="premium-eyebrow"><BriefcaseBusiness size={16} /> Открытые позиции</div>
              <h2>Вакансии только детского сада Тотоша</h2>
              <p>На этой странице нет предложений сторонних работодателей. Внешние площадки используются только как дополнительные каналы публикации наших вакансий.</p>
            </div>
          </div>

          <div className="vacancies-grid">
            {vacancies.map((vacancy) => (
              <article className="vacancy-card" key={vacancy.id} id={vacancy.slug}>
                <div className="vacancy-card-top">
                  <span className="vacancy-source">{vacancy.source === 'hh' ? 'hh.kz' : 'Тотоша'}</span>
                  <span className="vacancy-status"><BadgeCheck size={15} /> Приём резюме</span>
                </div>
                <h3>{vacancy.title}</h3>
                <p>{vacancy.summary}</p>
                <div className="vacancy-meta">
                  <span><MapPin size={15} /> {vacancy.location}</span>
                  <span><Clock3 size={15} /> {vacancy.schedule}</span>
                  <span><BriefcaseBusiness size={15} /> {vacancy.employment}</span>
                </div>
                <div className="vacancy-salary">{formatVacancySalary(vacancy)}</div>

                <details>
                  <summary>Обязанности и требования</summary>
                  <div className="vacancy-detail-columns">
                    <div><h4>Обязанности</h4><ul>{vacancy.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
                    <div><h4>Требования</h4><ul>{vacancy.requirements.map((item) => <li key={item}>{item}</li>)}</ul></div>
                    <div><h4>Условия</h4><ul>{vacancy.conditions.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  </div>
                </details>

                <div className="vacancy-card-actions">
                  <a className="premium-btn premium-btn-navy" href={`#application`}>Откликнуться</a>
                  {vacancy.externalUrl && <a className="vacancy-external" href={vacancy.externalUrl} target="_blank" rel="noopener noreferrer">Открыть на hh.kz <ExternalLink size={15} /></a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section vacancies-values">
        <div className="premium-shell">
          <div className="premium-section-head">
            <div className="premium-section-head-copy">
              <div className="premium-eyebrow"><HeartHandshake size={16} /> Принципы команды</div>
              <h2>Что для нас действительно важно</h2>
              <p>Мы оцениваем не только опыт, но и отношение к детям, дисциплину, спокойную коммуникацию и готовность соблюдать единые правила.</p>
            </div>
          </div>
          <div className="vacancies-values-grid">
            <article><span><HeartHandshake size={24} /></span><h3>Бережное отношение</h3><p>Без давления, грубости и формального отношения к ребёнку.</p></article>
            <article><span><GraduationCap size={24} /></span><h3>Профессиональный рост</h3><p>Открытость к обучению, обратной связи и новым рабочим инструментам.</p></article>
            <article><span><ShieldCheck size={24} /></span><h3>Ответственность</h3><p>Соблюдение режима, безопасности и договорённостей внутри команды.</p></article>
            <article><span><UsersRound size={24} /></span><h3>Командность</h3><p>Уважительное взаимодействие с коллегами, родителями и администрацией.</p></article>
          </div>
        </div>
      </section>

      <section className="premium-section vacancy-platforms-section">
        <div className="premium-shell vacancy-platforms">
          <div>
            <div className="premium-eyebrow"><ExternalLink size={16} /> Каналы публикации</div>
            <h2>Единая вакансия — несколько площадок</h2>
            <p>Сайт Тотоша остаётся основным источником. HeadHunter подключается по API, а для Enbek.kz, Rabota.kz и агрегаторов подготовлен единый экспорт вакансий.</p>
          </div>
          <div className="vacancy-platform-list">
            <span>hh.kz</span><span>Enbek.kz</span><span>Rabota.kz</span><span>XML/JSON feed</span>
          </div>
        </div>
      </section>

      <section className="premium-section vacancy-application-section" id="application">
        <div className="premium-shell">
          <JobApplicationForm vacancies={vacancies} />
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
