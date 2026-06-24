'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, LogOut, MessageSquare, Phone, RefreshCcw, Search, UserRound, UsersRound, X } from 'lucide-react';

type Lead = {
  id: string | number;
  name?: string;
  phone?: string;
  intent?: string;
  comment?: string;
  source?: string;
  status?: string;
  assigned_to?: string | null;
  child_age?: string | null;
  notes?: string | null;
  next_follow_up_at?: string | null;
  created_at?: string;
};

const STATUS_OPTIONS = [
  ['new', 'Новая'],
  ['contacted', 'Связались'],
  ['excursion_scheduled', 'Экскурсия назначена'],
  ['excursion_done', 'Экскурсия проведена'],
  ['waiting', 'Ожидает решения'],
  ['enrolled', 'Зачислен'],
  ['rejected', 'Отказ'],
] as const;

const statusLabel = Object.fromEntries(STATUS_OPTIONS);

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

export function CrmLeadsBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ status, q: query, limit: '200' });
    const response = await fetch(`/api/crm/leads?${params.toString()}`, { cache: 'no-store' });
    const result = await response.json().catch(() => null) as null | { ok?: boolean; leads?: Lead[]; error?: string };
    if (response.status === 401) window.location.href = '/crm/login';
    if (response.ok && result?.ok) setLeads(result.leads || []);
    else setMessage(result?.error || 'Не удалось загрузить заявки');
    setLoading(false);
  }

  useEffect(() => { load(); }, [status]);

  const metrics = useMemo(() => ({
    new: leads.filter((lead) => (lead.status || 'new') === 'new').length,
    scheduled: leads.filter((lead) => lead.status === 'excursion_scheduled').length,
    enrolled: leads.filter((lead) => lead.status === 'enrolled').length,
    total: leads.length,
  }), [leads]);

  async function saveLead(action = 'update') {
    if (!selected) return;
    setSaving(true);
    setMessage('');
    const response = await fetch('/api/crm/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selected, action }),
    });
    const result = await response.json().catch(() => null) as null | { ok?: boolean; error?: string };
    if (response.ok && result?.ok) {
      setMessage(action === 'convert' ? 'Черновик карточки ребёнка создан.' : 'Заявка обновлена.');
      await load();
      if (action === 'convert') setSelected({ ...selected, status: 'enrolled' });
    } else setMessage(result?.error || 'Не удалось сохранить изменения');
    setSaving(false);
  }

  async function logout() {
    await fetch('/api/crm/session', { method: 'DELETE' });
    window.location.href = '/crm/login';
  }

  return (
    <div className="crm-app">
      <header className="crm-topbar">
        <div><small>Тотоша CRM</small><h1>Заявки с сайта</h1></div>
        <div className="crm-topbar-actions">
          <button onClick={load}><RefreshCcw size={17} /> Обновить</button>
          <button onClick={logout}><LogOut size={17} /> Выйти</button>
        </div>
      </header>

      <section className="crm-metrics">
        <article><span><MessageSquare size={20} /></span><div><strong>{metrics.new}</strong><small>Новых</small></div></article>
        <article><span><CalendarClock size={20} /></span><div><strong>{metrics.scheduled}</strong><small>Экскурсий</small></div></article>
        <article><span><CheckCircle2 size={20} /></span><div><strong>{metrics.enrolled}</strong><small>Зачислено</small></div></article>
        <article><span><UsersRound size={20} /></span><div><strong>{metrics.total}</strong><small>Всего в выборке</small></div></article>
      </section>

      <section className="crm-toolbar">
        <form onSubmit={(event) => { event.preventDefault(); load(); }}>
          <Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Имя, телефон или запрос" />
          <button type="submit">Найти</button>
        </form>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">Все статусы</option>
          {STATUS_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </section>

      {message && <div className="crm-alert" aria-live="polite">{message}</div>}

      <section className="crm-leads-table-wrap">
        {loading ? <div className="crm-empty">Загружаем заявки…</div> : leads.length === 0 ? <div className="crm-empty">Заявок по выбранному фильтру нет.</div> : (
          <table className="crm-leads-table">
            <thead><tr><th>Родитель</th><th>Запрос</th><th>Статус</th><th>Ответственный</th><th>Создана</th></tr></thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={String(lead.id)} onClick={() => setSelected({ ...lead, status: lead.status || 'new' })}>
                  <td><strong>{lead.name || 'Без имени'}</strong><span>{lead.phone || '—'}</span></td>
                  <td><strong>{lead.intent || 'Заявка с сайта'}</strong><span>{lead.source || '—'}</span></td>
                  <td><span className={`crm-status is-${lead.status || 'new'}`}>{statusLabel[lead.status || 'new'] || lead.status}</span></td>
                  <td>{lead.assigned_to || 'Не назначен'}</td>
                  <td>{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selected && (
        <div className="crm-drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="crm-drawer" onClick={(event) => event.stopPropagation()}>
            <button className="crm-drawer-close" onClick={() => setSelected(null)}><X size={20} /></button>
            <div className="crm-drawer-person"><span><UserRound size={24} /></span><div><small>Заявка #{selected.id}</small><h2>{selected.name || 'Без имени'}</h2><a href={`tel:${selected.phone || ''}`}><Phone size={15} /> {selected.phone || 'Телефон не указан'}</a></div></div>

            <div className="crm-drawer-summary"><div><small>Запрос</small><strong>{selected.intent || '—'}</strong></div><div><small>Источник</small><strong>{selected.source || '—'}</strong></div><div><small>Комментарий</small><p>{selected.comment || 'Нет комментария'}</p></div></div>

            <label><span>Статус</span><select value={selected.status || 'new'} onChange={(event) => setSelected({ ...selected, status: event.target.value })}>{STATUS_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label><span>Ответственный</span><input value={selected.assigned_to || ''} onChange={(event) => setSelected({ ...selected, assigned_to: event.target.value })} placeholder="Имя сотрудника" /></label>
            <label><span>Возраст ребёнка</span><input value={selected.child_age || ''} onChange={(event) => setSelected({ ...selected, child_age: event.target.value })} placeholder="Например: 4 года" /></label>
            <label><span>Следующее действие</span><input type="datetime-local" value={selected.next_follow_up_at?.slice(0, 16) || ''} onChange={(event) => setSelected({ ...selected, next_follow_up_at: event.target.value })} /></label>
            <label><span>Рабочие заметки</span><textarea rows={5} value={selected.notes || ''} onChange={(event) => setSelected({ ...selected, notes: event.target.value })} placeholder="Результат звонка, договорённости, важные детали" /></label>

            <div className="crm-drawer-actions">
              <button className="primary" onClick={() => saveLead()} disabled={saving}>{saving ? 'Сохраняем…' : 'Сохранить'}</button>
              <button onClick={() => saveLead('convert')} disabled={saving || selected.status === 'enrolled'}>Создать черновик карточки ребёнка</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
