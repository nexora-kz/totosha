'use client';

import { useEffect, useMemo, useState } from 'react';

const labels: Record<string, string> = {
  new: 'Новая',
  contacted: 'Связались',
  excursion_scheduled: 'Экскурсия назначена',
  excursion_done: 'Экскурсия проведена',
  waiting: 'Ожидает решения',
  enrolled: 'Зачислен',
  rejected: 'Отказ',
};

export default function AdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ status, q: query, limit: '200' });
    const response = await fetch(`/api/crm/leads?${params}`);
    if (response.status === 401) {
      window.location.href = '/office/login';
      return;
    }
    const data = await response.json().catch(() => null);
    if (response.ok && data?.ok) setItems(data.leads || []);
    else setMessage(data?.error || 'Не удалось загрузить заявки');
    setLoading(false);
  }

  useEffect(() => { load(); }, [status]);

  const stats = useMemo(() => ({
    new: items.filter((item) => (item.status || 'new') === 'new').length,
    excursions: items.filter((item) => item.status === 'excursion_scheduled').length,
    enrolled: items.filter((item) => item.status === 'enrolled').length,
    total: items.length,
  }), [items]);

  async function save(action = 'update') {
    if (!selected) return;
    setLoading(true);
    const response = await fetch('/api/crm/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selected, action }),
    });
    const data = await response.json().catch(() => null);
    setMessage(response.ok && data?.ok ? (action === 'convert' ? 'Черновик карточки ребёнка создан' : 'Заявка обновлена') : data?.error || 'Ошибка сохранения');
    await load();
    setLoading(false);
  }

  async function logout() {
    await fetch('/api/crm/session', { method: 'DELETE' });
    window.location.href = '/office/login';
  }

  return (
    <main className="crm-app">
      <header className="crm-topbar">
        <div><small>Тотоша CRM</small><h1>Заявки с сайта</h1></div>
        <div className="crm-topbar-actions"><button onClick={load}>Обновить</button><button onClick={logout}>Выйти</button></div>
      </header>

      <section className="crm-metrics">
        <article><strong>{stats.new}</strong><span>Новых</span></article>
        <article><strong>{stats.excursions}</strong><span>Экскурсий</span></article>
        <article><strong>{stats.enrolled}</strong><span>Зачислено</span></article>
        <article><strong>{stats.total}</strong><span>Всего</span></article>
      </section>

      <section className="crm-toolbar">
        <form onSubmit={(event) => { event.preventDefault(); load(); }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Имя, телефон или запрос" /><button type="submit">Найти</button></form>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">Все статусы</option>
          {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </section>

      {message && <div className="crm-alert">{message}</div>}

      <section className="crm-leads-table-wrap">
        {loading && !items.length ? <div className="crm-empty">Загрузка…</div> : (
          <table className="crm-leads-table">
            <thead><tr><th>Родитель</th><th>Запрос</th><th>Статус</th><th>Ответственный</th><th>Дата</th></tr></thead>
            <tbody>{items.map((item) => <tr key={String(item.id)} onClick={() => setSelected(item)}><td><strong>{item.name || 'Без имени'}</strong><span>{item.phone || '—'}</span></td><td><strong>{item.intent || 'Заявка'}</strong><span>{item.source || '—'}</span></td><td>{labels[item.status || 'new']}</td><td>{item.assigned_to || 'Не назначен'}</td><td>{item.created_at ? new Date(item.created_at).toLocaleString('ru-RU') : '—'}</td></tr>)}</tbody>
          </table>
        )}
      </section>

      {selected && <div className="crm-drawer-backdrop" onClick={() => setSelected(null)}><aside className="crm-drawer" onClick={(event) => event.stopPropagation()}><button className="crm-drawer-close" onClick={() => setSelected(null)}>×</button><h2>{selected.name || 'Без имени'}</h2><a href={`tel:${selected.phone || ''}`}>{selected.phone || 'Телефон не указан'}</a><p><b>Запрос:</b> {selected.intent || '—'}</p><p><b>Комментарий:</b> {selected.comment || '—'}</p><label><span>Статус</span><select value={selected.status || 'new'} onChange={(event) => setSelected({ ...selected, status: event.target.value })}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>Ответственный</span><input value={selected.assigned_to || ''} onChange={(event) => setSelected({ ...selected, assigned_to: event.target.value })} /></label><label><span>Возраст ребёнка</span><input value={selected.child_age || ''} onChange={(event) => setSelected({ ...selected, child_age: event.target.value })} /></label><label><span>Следующее действие</span><input type="datetime-local" value={selected.next_follow_up_at?.slice(0, 16) || ''} onChange={(event) => setSelected({ ...selected, next_follow_up_at: event.target.value })} /></label><label><span>Заметки</span><textarea rows={5} value={selected.notes || ''} onChange={(event) => setSelected({ ...selected, notes: event.target.value })} /></label><div className="crm-drawer-actions"><button onClick={() => save()}>Сохранить</button><button onClick={() => save('convert')}>Создать черновик карточки ребёнка</button></div></aside></div>}
    </main>
  );
}
