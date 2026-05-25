'use client';

import { useEffect, useState } from 'react';

type Proposal = {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  status: string;
  action_key: string | null;
  created_at?: string;
};

export default function AdminPage() {
  const [items, setItems] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  async function load() {
    try {
      setError('');
      const res = await fetch('/api/nexora/proposals', {
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        setError(data.error || 'Ошибка загрузки предложений');
        setItems([]);
        return;
      }

      setItems(data.items || []);
      setLastUpdate(new Date().toLocaleString('ru-RU'));
    } catch (err) {
      setError('Не удалось подключиться к API NEXORA');
      setItems([]);
    }
  }

  async function decide(
    id: string,
    decision: 'approved' | 'rejected' | 'discussion'
  ) {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/nexora/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        setError(data.error || 'Ошибка сохранения решения');
        return;
      }

      await load();
    } catch (err) {
      setError('Не удалось отправить решение');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 32,
        fontFamily: 'Arial, sans-serif',
        background: '#fff8ee',
        color: '#0f172a',
      }}
    >
      <h1 style={{ fontSize: 64, marginBottom: 12 }}>
        NEXORA Control Center
      </h1>

      <p style={{ fontSize: 20, marginBottom: 24 }}>
        AI-предложения для Тотоша
      </p>

      <button
        onClick={load}
        disabled={loading}
        style={{
          padding: '12px 18px',
          borderRadius: 12,
          border: '1px solid #ddd',
          cursor: 'pointer',
          marginBottom: 20,
        }}
      >
        Обновить предложения
      </button>

      {lastUpdate && (
        <p style={{ color: '#64748b' }}>
          Последнее обновление: {lastUpdate}
        </p>
      )}

      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: 16,
            borderRadius: 12,
            marginTop: 16,
            maxWidth: 760,
          }}
        >
          <b>Ошибка:</b> {error}
        </div>
      )}

      {!error && items.length === 0 && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 24,
            marginTop: 24,
            maxWidth: 760,
          }}
        >
          Пока нет активных предложений NEXORA.
        </div>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 20,
            padding: 24,
            marginTop: 20,
            maxWidth: 820,
            boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
          }}
        >
          <h2 style={{ fontSize: 28, marginBottom: 12 }}>{item.title}</h2>

          <p style={{ fontSize: 18, lineHeight: 1.5 }}>
            {item.description}
          </p>

          <p>
            <b>Тип:</b> {item.type || 'system'}
          </p>

          <p>
            <b>Статус:</b> {item.status}
          </p>

          <p>
            <b>Действие:</b> {item.action_key || 'none'}
          </p>

          <div style={{ marginTop: 20 }}>
            <button
              disabled={loading}
              onClick={() => decide(item.id, 'approved')}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: 0,
                background: '#16a34a',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Да, запускаем
            </button>

            <button
              disabled={loading}
              onClick={() => decide(item.id, 'discussion')}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: '1px solid #ddd',
                background: '#fff',
                marginLeft: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Обсудить
            </button>

            <button
              disabled={loading}
              onClick={() => decide(item.id, 'rejected')}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: 0,
                background: '#dc2626',
                color: '#fff',
                marginLeft: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Нет
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}
