import type { Metadata } from 'next';
import { ArrowUpRight, BadgeCheck, BriefcaseBusiness, Clock3, GraduationCap, HeartHandshake, MapPin, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { JobApplicationForm } from '../../components/JobApplicationForm';
import { PremiumFooter } from '../../components/PremiumFooter';
import { PremiumHeader } from '../../components/PremiumHeader';
import { loadPublicVacancies } from '../../lib/vacancySources';
import { formatVacancySalary } from '../../lib/totoshaVacancies';

export const metadata: Metadata = {
  title: 'Вакансии детского сада Тотоша в Астане',
  description: 'Работа в детском саду Тотоша: воспитатели, помощники и педагоги.',
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
            <p>Мы ищем людей, которые уважают ребёнка, работают спокойно и ответственно и готовы развиваться вместе с детским садом.</p>
            <div className="premium-home-actions"><a className="premium-btn premium-btn-navy" href="#openings">Смотреть вакансии <ArrowUpRight size={18} /></a><a className="premium-btn premium-btn-ghost" href="#application">Отправить резюме</a></div>
            <div className="vacancies-trust-row"><span><ShieldCheck size={17} /> Понятные обязанности</span><span><UsersRound size={17} /> Командная работа</span><span><HeartHandshake size={17} /> Уважение к детям</span></div>
          </div>
          <div className="vacancies-hero-panel"><small>Тотоша · Астана</small><strong>{vacancies.length}</strong><span>позиции для отклика</span><div className="vacancies-hero-note"><BriefcaseBusiness size={20} /> Все анкеты поступают напрямую администрации сада.</div></div>
        </div>
      </section>

      <section className="premium-section premium-section-paper" id="openings">
        <div className="premium-shell">
          <div className="premium-section-head"><div className="premium-section-head-copy"><div className="premium-eyebrow"><BriefcaseBusiness size={16} /> Открытые позиции</div><h2>Вакансии только детского сада Тотоша</h2><p>Сторонних работодателей и платных площадок здесь нет. Все отклики собираются в собственной CRM Тотоша.</p></div></div>
          <div className="vacancies-grid">
            {vacancies.map((vacancy) => (
              <article className="vacancy-card" key={vacancy.id} id={vacancy.slug}>
                <div className="vacancy-card-top"><span className="vacancy-source">Тотоша</span><span className="vacancy-status"><BadgeCheck size={15} /> Приём резюме</span></div>
                <h3>{vacancy.title}</h3><p>{vacancy.summary}</p>
                <div className="vacancy-meta"><span><MapPin size={15} /> {vacancy.location}</span><span><Clock3 size={15} /> {vacancy.schedule}</span><span><BriefcaseBusiness size={15} /> {vacancy.employment}</span></div>
                <div className="vacancy-salary">{formatVacancySalary(vacancy)}</div>
                <details><summary>Обязанности и требования</summary><div className="vacancy-detail-columns"><div><h4>Обязанности</h4><ul>{vacancy.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>Требования</h4><ul>{vacancy.requirements.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>Условия</h4><ul>{vacancy.conditions.map((item) => <li key={item}>{item}</li>)}</ul></div></div></details>
                <div className="vacancy-card-actions"><a className="premium-btn premium-btn-navy" href="#application">Откликнуться</a></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section vacancies-values"><div className="premium-shell"><div className="premium-section-head"><div className="premium-section-head-copy"><div className="premium-eyebrow"><HeartHandshake size={16} /> Принципы команды</div><h2>Что для нас действительно важно</h2><p>Опыт, отношение к детям, дисциплина, спокойная коммуникация и готовность соблюдать единые правила.</p></div></div><div className="vacancies-values-grid"><article><span><HeartHandshake size={24} /></span><h3>Бережное отношение</h3><p>Без давления и формального отношения к ребёнку.</p></article><article><span><GraduationCap size={24} /></span><h3>Профессиональный рост</h3><p>Открытость к обучению и обратной связи.</p></article><article><span><ShieldCheck size={24} /></span><h3>Ответственность</h3><p>Соблюдение режима и правил безопасности.</p></article><article><span><UsersRound size={24} /></span><h3>Командность</h3><p>Уважительное взаимодействие с коллегами и родителями.</p></article></div></div></section>

      <section className="premium-section vacancy-platforms-section"><div className="premium-shell vacancy-platforms"><div><div className="premium-eyebrow"><Sparkles size={16} /> Бесплатные каналы</div><h2>Одна вакансия — бесплатное распространение</h2><p>Используем сайт Тотоша, государственную биржу Enbek.kz, собственные Instagram и Telegram, WhatsApp-сообщества и карьерные центры колледжей и вузов.</p></div><div className="vacancy-platform-list"><span>Сайт Тотоша</span><span>Enbek.kz</span><span>Instagram / Telegram</span><span>Колледжи и вузы</span></div></div></section>

      <section className="premium-section vacancy-application-section" id="application"><div className="premium-shell"><JobApplicationForm vacancies={vacancies} /></div></section>
      <PremiumFooter />
    </main>
  );
}
