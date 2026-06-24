'use client';

import { FormEvent, useState } from 'react';
import { LockKeyhole, LogIn } from 'lucide-react';

export function CrmLoginForm({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || loading) return;
    setLoading(true);
    setError('');
    const response = await fetch('/api/crm/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const result = await response.json().catch(() => null) as null | { ok?: boolean; error?: string };
    if (response.ok && result?.ok) window.location.href = '/crm/leads';
    else setError(result?.error || 'Не удалось войти');
    setLoading(false);
  }

  return (
    <form className="crm-login-card" onSubmit={submit}>
      <div className="crm-login-icon"><LockKeyhole size={28} /></div>
      <h1>CRM Тотоша</h1>
      <p>Закрытый кабинет для обработки заявок с сайта.</p>
      {!configured && <div className="crm-alert is-error">Доступ ещё не активирован в настройках сервера.</div>}
      <label>
        <span>Пароль администратора</span>
        <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={!configured} required />
      </label>
      <button type="submit" disabled={!configured || loading}><LogIn size={18} /> {loading ? 'Входим…' : 'Войти'}</button>
      {error && <div className="crm-alert is-error" aria-live="polite">{error}</div>}
    </form>
  );
}
