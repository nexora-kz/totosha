'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import type { TotoshaVacancy } from '../lib/totoshaVacancies';

type Props = {
  vacancies: TotoshaVacancy[];
  initialVacancyId?: string;
};

export function JobApplicationForm({ vacancies, initialVacancyId }: Props) {
  const initial = useMemo(
    () => vacancies.find((item) => item.id === initialVacancyId) || vacancies[0],
    [vacancies, initialVacancyId],
  );
  const [name, setName] = useState('');
  const [digits, setDigits] = useState('');
  const [vacancyId, setVacancyId] = useState(initial?.id || 'talent-pool');
  const [experience, setExperience] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selected = vacancies.find((item) => item.id === vacancyId);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setMessage(null);

    if (name.trim().length < 2) {
      setMessage({ type: 'error', text: 'Укажите имя.' });
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

    setSending(true);
    try {
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: `+7 ${digits}`,
          vacancyId,
          vacancyTitle: selected?.title || 'Кадровый резерв Тотоша',
          experience: experience.trim(),
          resumeUrl: resumeUrl.trim(),
          comment: comment.trim(),
          website,
          source: 'totoshakids.kz/vacancies',
        }),
      });
      const result = await response.json().catch(() => null) as null | { ok?: boolean; accepted?: boolean; error?: string };
      if (!response.ok || !result?.ok || !result.accepted) throw new Error(result?.error || 'Не удалось отправить анкету');

      setMessage({ type: 'success', text: 'Анкета отправлена. Мы свяжемся с вами, если опыт соответствует текущим задачам.' });
      setName('');
      setDigits('');
      setExperience('');
      setResumeUrl('');
      setComment('');
      setConsent(false);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Не удалось отправить анкету.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="vacancy-application-form" onSubmit={submit} noValidate>
      <div className="vacancy-form-heading">
        <small>Анкета кандидата</small>
        <h2>Откликнуться в Тотоша</h2>
        <p>Достаточно заполнить одну форму. Ссылка на резюме в Google Drive или другом бесплатном хранилище необязательна.</p>
      </div>

      <div className="vacancy-form-grid">
        <label>
          <span>Имя и фамилия</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" autoComplete="name" required />
        </label>
        <label>
          <span>Телефон</span>
          <div className="vacancy-phone-field"><b>+7</b><input value={digits} onChange={(event) => setDigits(event.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="701 234 56 78" autoComplete="tel" required /></div>
        </label>
        <label className="vacancy-form-wide">
          <span>Интересующая позиция</span>
          <select value={vacancyId} onChange={(event) => setVacancyId(event.target.value)}>
            {vacancies.map((vacancy) => <option value={vacancy.id} key={vacancy.id}>{vacancy.title}</option>)}
            <option value="talent-pool">Кадровый резерв Тотоша</option>
          </select>
        </label>
        <label className="vacancy-form-wide">
          <span>Опыт работы</span>
          <textarea value={experience} onChange={(event) => setExperience(event.target.value)} rows={4} maxLength={2000} placeholder="Кратко расскажите об опыте с детьми, образовании и сильных сторонах" />
        </label>
        <label className="vacancy-form-wide">
          <span>Ссылка на резюме</span>
          <input value={resumeUrl} onChange={(event) => setResumeUrl(event.target.value)} placeholder="Google Drive, OneDrive или другое бесплатное хранилище" inputMode="url" />
        </label>
        <label className="vacancy-form-wide">
          <span>Комментарий</span>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} maxLength={3000} placeholder="Удобное время для звонка, желаемый график или другие детали" />
        </label>
      </div>

      <div className="vacancy-honeypot" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>

      <label className="vacancy-consent">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>Согласен на обработку контактных данных для рассмотрения моей кандидатуры. <a href="/privacy">Подробнее</a>.</span>
      </label>

      <button type="submit" disabled={sending} className="premium-btn premium-btn-gold vacancy-submit">
        <Send size={18} /> {sending ? 'Отправляем…' : 'Отправить анкету'}
      </button>

      {message && (
        <div className={`vacancy-form-message ${message.type === 'success' ? 'is-success' : 'is-error'}`} aria-live="polite">
          {message.type === 'success' && <CheckCircle2 size={18} />}
          <span>{message.text}</span>
        </div>
      )}
    </form>
  );
}
