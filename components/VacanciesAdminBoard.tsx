'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, ExternalLink, RefreshCcw, Save, Send, Trash2, UsersRound } from 'lucide-react';

type Vacancy = Record<string, any>;
type Application = Record<string, any>;
type Channel = Record<string, any>;

const emptyVacancy = {
  title: '',
  slug: '',
  summary: '',
  responsibilities: '',
  requirements: '',
  conditions: '',
  employment: 'Полная занятость',
  schedule: 'Пн–Пт',
  location: 'Астана, ул. Алихана Бокейхана, 29А',
  salaryFrom: '',
  salaryTo: '',
  currency: 'KZT',
  active: true,
};

const applicationStatuses = {
  new: 'Новый отклик',
  contacted: 'Связались',
  interview: 'Собеседование',
  reserve: 'Кадровый резерв',
  hired: 'Принят',
  rejected: 'Отказ',
};

function asText(value: unknown) {
  if (Array.isArray(value)) return value.join('\n');
  return String(value || '');
}

export function VacanciesAdminBoard() {
  const [tab, setTab] = useState<'vacancies' | 'applications' | 'integrations'>('vacancies');
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [draft, setDraft] = useState<any>(emptyVacancy);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function request(url: string, options?: RequestInit) {
    const response = await fetch(url, { cache: 'no-store', ...options });
    if (response.status === 401) {
      window.location.href = '/office/login';
      throw new Error('Unauthorized');
    }
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) throw new Error(result?.error || 'Ошибка запроса');
    return result;
  }

  async function loadVacancies() {
    setLoading(true);
    try {
      const result = await request('/api/vacancies/admin');
      setVacancies(result.vacancies || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось загрузить вакансии');
    } finally { setLoading(false); }
  }

  async function loadApplications() {
    setLoading(true);
    try {
      const result = await request('/api/job-applications/admin');
      setApplications(result.applications || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось загрузить отклики');
    } finally { setLoading(false); }
  }

  async function loadIntegrations() {
    setLoading(true);
    try {
      const result = await request('/api/integrations/recruiting');
      setChannels(result.channels || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось загрузить интеграции');
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (tab === 'vacancies') loadVacancies();
    if (tab === 'applications') loadApplications();
    if (tab === 'integrations') loadIntegrations();
  }, [tab]);

  const metrics = useMemo(() => ({
    active: vacancies.filter((item) => item.active).length,
    external: vacancies.filter((item) => item.source === 'hh').length,
    newApplications: applications.filter((item) => (item.status || 'new') === 'new').length,
  }), [vacancies, applications]);

  function edit(vacancy: Vacancy) {
    setDraft({
      ...vacancy,
      salaryFrom: vacancy.salary_from || '',
      salaryTo: vacancy.salary_to || '',
      responsibilities: asText(vacancy.responsibilities),
      requirements: asText(vacancy.requirements),
      conditions: asText(vacancy.conditions),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveVacancy(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const editing = Boolean(draft.id);
      await request('/api/vacancies/admin', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      setDraft(emptyVacancy);
      setMessage(editing ? 'Вакансия обновлена.' : 'Вакансия создана.');
      await loadVacancies();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось сохранить вакансию');
    } finally { setLoading(false); }
  }

  async function seed() {
    setLoading(true);
    try {
      const result = await request('/api/vacancies/admin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'seed' }),
      });
      setMessage(`Добавлено позиций: ${result.seeded || 0}.`);
      await loadVacancies();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Не удалось добавить позиции'); }
    finally { setLoading(false); }
  }

  async function removeVacancy(id: string) {
    if (!window.confirm('Удалить вакансию?')) return;
    setLoading(true);
    try {
      await request(`/api/vacancies/admin?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setMessage('Вакансия удалена.');
      await loadVacancies();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Не удалось удалить вакансию'); }
    finally { setLoading(false); }
  }

  async function saveApplication() {
    if (!selectedApplication) return;
    setLoading(true);
    try {
      await request('/api/job-applications/admin', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          id: selectedApplication.id,
          status: selectedApplication.status,
          notes: selectedApplication.notes,
          assignedTo: selectedApplication.assigned_to,
        }),
      });
      setMessage('Отклик обновлён.');
      await loadApplications();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Не удалось сохранить отклик'); }
    finally { setLoading(false); }
  }

  async function syncHh() {
    setLoading(true);
    try {
      const result = await request('/api/integrations/recruiting', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'sync_hh' }),
      });
      setMessage(`Импортировано из hh.kz: ${result.imported || 0}.`);
      await loadIntegrations();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Синхронизация не выполнена'); }
    finally { setLoading(false); }
  }

  return (
    <main className="crm-app vacancy-admin-app">
      <header className="crm-topbar">
        <div><small>Тотоша CRM</small><h1>Вакансии и подбор</h1></div>
        <div className="crm-topbar-actions"><a href="/admin"><ArrowLeft size={17} /> Заявки родителей</a><a href="/vacancies" target="_blank">Открыть страницу <ExternalLink size={16} /></a></div>
      </header>

      <nav className="vacancy-admin-tabs">
        <button className={tab === 'vacancies' ? 'is-active' : ''} onClick={() => setTab('vacancies')}><BriefcaseBusiness size={17} /> Вакансии</button>
        <button className={tab === 'applications' ? 'is-active' : ''} onClick={() => setTab('applications')}><UsersRound size={17} /> Отклики</button>
        <button className={tab === 'integrations' ? 'is-active' : ''} onClick={() => setTab('integrations')}><RefreshCcw size={17} /> Интеграции</button>
      </nav>

      <section className="crm-metrics vacancy-admin-metrics">
        <article><strong>{metrics.active}</strong><span>Активных вакансий</span></article>
        <article><strong>{metrics.external}</strong><span>Импортировано из hh.kz</span></article>
        <article><strong>{metrics.newApplications}</strong><span>Новых откликов</span></article>
      </section>

      {message && <div className="crm-alert" aria-live="polite">{message}</div>}

      {tab === 'vacancies' && (
        <div className="vacancy-admin-grid">
          <form className="vacancy-editor" onSubmit={saveVacancy}>
            <div className="vacancy-editor-head"><h2>{draft.id ? 'Редактировать вакансию' : 'Новая вакансия'}</h2><button type="button" onClick={() => setDraft(emptyVacancy)}>Очистить</button></div>
            <label><span>Название</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label>
            <label><span>Краткое описание</span><textarea rows={3} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} /></label>
            <label><span>Обязанности — по одной строке</span><textarea rows={5} value={draft.responsibilities} onChange={(event) => setDraft({ ...draft, responsibilities: event.target.value })} /></label>
            <label><span>Требования — по одной строке</span><textarea rows={5} value={draft.requirements} onChange={(event) => setDraft({ ...draft, requirements: event.target.value })} /></label>
            <label><span>Условия — по одной строке</span><textarea rows={5} value={draft.conditions} onChange={(event) => setDraft({ ...draft, conditions: event.target.value })} /></label>
            <div className="vacancy-editor-row"><label><span>Занятость</span><input value={draft.employment} onChange={(event) => setDraft({ ...draft, employment: event.target.value })} /></label><label><span>График</span><input value={draft.schedule} onChange={(event) => setDraft({ ...draft, schedule: event.target.value })} /></label></div>
            <label><span>Адрес</span><input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></label>
            <div className="vacancy-editor-row"><label><span>Зарплата от</span><input type="number" value={draft.salaryFrom} onChange={(event) => setDraft({ ...draft, salaryFrom: event.target.value })} /></label><label><span>Зарплата до</span><input type="number" value={draft.salaryTo} onChange={(event) => setDraft({ ...draft, salaryTo: event.target.value })} /></label></div>
            <label className="vacancy-editor-check"><input type="checkbox" checked={draft.active !== false} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /><span>Показывать на сайте</span></label>
            <button className="primary" type="submit" disabled={loading}><Save size={17} /> Сохранить вакансию</button>
          </form>

          <section className="vacancy-admin-list">
            <div className="vacancy-admin-list-head"><h2>Все позиции</h2><button onClick={seed} disabled={loading}>Добавить стартовый набор</button></div>
            {vacancies.length === 0 ? <div className="crm-empty">В базе пока нет вакансий.</div> : vacancies.map((vacancy) => <article key={vacancy.id}><div><small>{vacancy.source || 'totosha'} · {vacancy.active ? 'активна' : 'скрыта'}</small><h3>{vacancy.title}</h3><p>{vacancy.summary}</p></div><div className="vacancy-admin-card-actions"><button onClick={() => edit(vacancy)}>Изменить</button><button className="danger" onClick={() => removeVacancy(vacancy.id)}><Trash2 size={15} /></button></div></article>)}
          </section>
        </div>
      )}

      {tab === 'applications' && (
        <section className="vacancy-applications-list">
          {applications.length === 0 ? <div className="crm-empty">Откликов пока нет.</div> : applications.map((application) => <article key={application.id} onClick={() => setSelectedApplication(application)}><div><small>{new Date(application.created_at).toLocaleString('ru-RU')}</small><h3>{application.name}</h3><p>{application.vacancy_title}</p></div><div><strong>{application.phone}</strong><span>{applicationStatuses[application.status as keyof typeof applicationStatuses] || application.status}</span></div></article>)}
        </section>
      )}

      {tab === 'integrations' && (
        <section className="vacancy-integrations-grid">
          {channels.map((channel) => <article key={channel.id}><div className="vacancy-integration-status"><span className={channel.configured ? 'is-ready' : ''}>{channel.configured ? 'Готово' : 'Нужна настройка'}</span><small>{channel.mode}</small></div><h3>{channel.name}</h3><p>{channel.note}</p>{channel.xmlUrl && <a href={channel.xmlUrl} target="_blank">XML feed <ExternalLink size={14} /></a>}{channel.jsonUrl && <a href={channel.jsonUrl} target="_blank">JSON feed <ExternalLink size={14} /></a>}{channel.externalUrl && <a href={channel.externalUrl} target="_blank">Открыть сервис <ExternalLink size={14} /></a>}{channel.id === 'hh' && <button onClick={syncHh} disabled={loading}><RefreshCcw size={16} /> Синхронизировать hh.kz</button>}</article>)}
        </section>
      )}

      {selectedApplication && <div className="crm-drawer-backdrop" onClick={() => setSelectedApplication(null)}><aside className="crm-drawer" onClick={(event) => event.stopPropagation()}><button className="crm-drawer-close" onClick={() => setSelectedApplication(null)}>×</button><h2>{selectedApplication.name}</h2><a href={`tel:${selectedApplication.phone}`}>{selectedApplication.phone}</a><p><b>Вакансия:</b> {selectedApplication.vacancy_title}</p><p><b>Опыт:</b> {selectedApplication.experience || 'Не указан'}</p><p><b>Комментарий:</b> {selectedApplication.comment || 'Нет'}</p>{selectedApplication.resume_url && <a href={selectedApplication.resume_url} target="_blank">Открыть резюме <ExternalLink size={14} /></a>}<label><span>Статус</span><select value={selectedApplication.status || 'new'} onChange={(event) => setSelectedApplication({ ...selectedApplication, status: event.target.value })}>{Object.entries(applicationStatuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>Ответственный</span><input value={selectedApplication.assigned_to || ''} onChange={(event) => setSelectedApplication({ ...selectedApplication, assigned_to: event.target.value })} /></label><label><span>Заметки</span><textarea rows={5} value={selectedApplication.notes || ''} onChange={(event) => setSelectedApplication({ ...selectedApplication, notes: event.target.value })} /></label><div className="crm-drawer-actions"><button onClick={saveApplication} disabled={loading}><CheckCircle2 size={16} /> Сохранить</button></div></aside></div>}
    </main>
  );
}
