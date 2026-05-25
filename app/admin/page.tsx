'use client';

import { useEffect, useState } from 'react';

type Proposal = {
  id: string;
  title: string;
  description: string;
  status: string;
  action_key: string;
};

export default function AdminPage() {
  const [items, setItems] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/nexora/proposals');
    const data = await res.json();
    setItems(data.items || []);
  }

  async function decide(
    id: string,
    decision: 'approved' | 'rejected' | 'discussion'
  ) {
    setLoading(true);

    await fetch('/api/nexora/decide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, decision }),
    });

    setLoading(false);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
      <h1>NEXORA Control Center</h1>
      <p>AI-предложения для Тотоша</p>

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: 16,
            padding: 20,
            marginTop: 16,
            maxWidth: 720,
          }}
        >
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <p>
            <b>Статус:</b> {item.status}
          </p>
          <p>
            <b>Действие:</b> {item.action_key}
          </p>

          <button disabled={loading} onClick={() => decide(item.id, 'approved')}>
            Да, запускаем
          </button>

          <button
            disabled={loading}
            onClick={() => decide(item.id, 'discussion')}
            style={{ marginLeft: 12 }}
          >
            Обсудить
          </button>

          <button
            disabled={loading}
            onClick={() => decide(item.id, 'rejected')}
            style={{ marginLeft: 12 }}
          >
            Нет
          </button>
        </div>
      ))}
    </main>
  );
}
