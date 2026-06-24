'use client';

import { FormEvent, useMemo, useState } from 'react';
import { MessageCircle, Phone, Send } from 'lucide-react';
import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

type PremiumLeadFormProps = {
  title?: string;
  description?: string;
  defaultIntent?: string;
  intentOptions?: string[];
  source?: string;
  submitLabel?: string;
  compact?: boolean;
};

type FormMessage = { type: 'success' | 'error'; text: string } | null;

const DEFAULT_OPTIONS = [
  'Записаться на экскурсию',
  'Узнать подходящую группу',
  'Уточнить формат посещения',
  'Получить консультацию',
];

function formatPhone(digits: string) {
  return `+7 ${[
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ].filter(Boolean).join(' ')}`;
}

export function PremiumLeadForm({
  title = 'Записаться на экскурсию',
  description = 'Оставьте контакт — мы уточним возраст ребёнка и предложим удобное время.',
  defaultIntent = 'Записаться на экскурсию',
  intentOptions = DEFAULT_OPTIONS,
  source = 'totoshakids.kz premium form',
  submitLabel = 'Отправить заявку',
  compact = false,
}: PremiumLeadFormProps) {
  const options = useMemo(
    () => intentOptions.includes(defaultIntent) ? intentOptions : [defaultIntent, ...intentOptions],
    [defaultIntent, intentOptions],
  );
  const [name, setName] = useState('');
  const [digits, setDigits] = useState('');
  const [intent, setIntent] = useState(defaultIntent);
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<FormMessage>(null);

  const phone = formatPhone(digits);
  const fallbackText = `Здравствуйте. Меня зовут ${name.trim() || 'родитель'}. ${intent}. Телефон: ${phone}${comment.trim() ? `. Комментарий: ${comment.trim()}` : ''}`;
  const whatsappHref = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent(fallbackText)}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setMessage(null);

    if (name.trim().length < 2) {
      setMessage({ type: 'error', text: 'Введите имя.' });
      return;
    }
    if (digits.length !== 10) {
      setMessage({ type: 'error', text: 'Введите 10 цифр телефона после +7.' });
      return;
    }
    if (!consent) {
      setMessage({ type: 'error', text: 'Подтвердите согласие на обработку контактных данных.' });
      return;
    }

    const fingerprint = `${digits}:${intent}:${comment.trim()}`;
    const previous = typeof window !== 'undefined' ? sessionStorage.getItem('totosha:last-lead') : null;
    if (previous) {
      try {
        const parsed = JSON.parse(previous) as { fingerprint?: string; createdAt?: number };
        if (parsed.fingerprint === fingerprint && Date.now() - Number(parsed.createdAt || 0) < 30_000) {
          setMessage({ type: 'success', text: 'Заявка уже отправлена. Мы свяжемся с вами.' });
          return;
        }
      } catch {
        sessionStorage.removeItem('totosha:last-lead');
      }
    }

    setSending(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          intent,
          comment: comment.trim(),
          website,
          source,
          path: window.location.pathname,
        }),
      });
      const result = await response.json().catch(() => null) as null | {
        ok?: boolean;
        accepted?: boolean;
        stored?: boolean;
        telegram?: { sent?: boolean };
        error?: string;
      };
      const delivered = Boolean(result?.ok && (result.accepted || result.stored || result.telegram?.sent));
      if (!response.ok || !delivered) throw new Error(result?.error || 'delivery failed');

      sessionStorage.setItem('totosha:last-lead', JSON.stringify({ fingerprint, createdAt: Date.now() }));
      setMessage({ type: 'success', text: 'Заявка доставлена. Мы свяжемся с вами, чтобы согласовать удобное время.' });
      setName('');
      setDigits('');
      setComment('');
      setConsent(false);
    } catch {
      setMessage({ type: 'error', text: 'Автоматическая отправка временно недоступна. Используйте WhatsApp или звонок.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className={`premium-lead-form ${compact ? 'is-compact' : ''}`} onSubmit={submit} noValidate>
      <h3>{title}</h3>
      <p>{description}</p>

      <div className="premium-field">
        <label htmlFor={`${source}-name`}>Ваше имя</label>
        <input
          id={`${source}-name`}
          name="name"
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Как к вам обращаться"
          autoComplete="name"
          required
        />
      </div>

      <div className="premium-field">
        <label htmlFor={`${source}-phone`}>Телефон</label>
        <div className="premium-phone-field">
          <span>+7</span>
          <input
            id={`${source}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={digits}
            onChange={(event) => setDigits(event.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="701 234 56 78"
            autoComplete="tel"
            required
          />
        </div>
      </div>

      <div className="premium-field">
        <label htmlFor={`${source}-intent`}>Что вас интересует</label>
        <select id={`${source}-intent`} name="intent" value={intent} onChange={(event) => setIntent(event.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="premium-field">
        <label htmlFor={`${source}-comment`}>Комментарий</label>
        <textarea
          id={`${source}-comment`}
          name="comment"
          rows={compact ? 2 : 3}
          maxLength={1000}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Возраст ребёнка, город или удобное время для звонка"
        />
      </div>

      <div className="premium-honeypot" aria-hidden="true">
        <label htmlFor={`${source}-website`}>Сайт</label>
        <input id={`${source}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>

      <label className="premium-consent">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
        <span>Согласен на обработку контактных данных для ответа на обращение. <a href="/privacy">Подробнее</a>.</span>
      </label>

      <button className="premium-btn premium-btn-navy" type="submit" disabled={sending} style={{ width: '100%' }}>
        <Send size={17} /> {sending ? 'Отправляем…' : submitLabel}
      </button>

      <div className="premium-form-live" aria-live="polite" aria-atomic="true">
        {message && (
          <div className={`premium-form-message ${message.type === 'success' ? 'is-success' : ''}`}>
            {message.text}
            {message.type === 'error' && (
              <div className="premium-form-fallbacks">
                <a className="premium-btn premium-btn-ghost" href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp</a>
                <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}><Phone size={16} /> Позвонить</a>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
