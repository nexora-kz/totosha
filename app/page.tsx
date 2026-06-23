'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  Baby,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  CreditCard,
  HeartHandshake,
  Languages,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Users,
} from 'lucide-react';
import { PremiumFooter } from '../components/PremiumFooter';
import { PremiumHeader } from '../components/PremiumHeader';
import { PremiumMap } from '../components/PremiumMap';
import { HOME_GALLERY, TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

const journeySteps = [
  { icon: MapPin, title: 'Экскурсия', text: 'Покажем пространство и ответим на вопросы' },
  { icon: Users, title: 'Знакомство с группой', text: 'Расскажем о режиме и ежедневных процессах' },
  { icon: HeartHandshake, title: 'Первые дни', text: 'Подберём спокойный формат знакомства' },
  { icon: MessageCircle, title: 'Обратная связь', text: 'Остаёмся на связи с семьёй' },
  { icon: Camera, title: 'Фотоотчёты', text: 'Закрытый формат запускается поэтапно' },
  { icon: CreditCard, title: 'Оплаты и документы', text: 'Подключаются после безопасного пилота' },
];

const services = [
  { icon: Languages, title: 'Английский', text: 'Игровые занятия, песни и простые фразы по расписанию.' },
  { icon: Stethoscope, title: 'Логопед', text: 'Поддержка речи и уверенного общения в согласованном формате.' },
  { icon: Sprout, title: 'Хореография', text: 'Движение, координация, грация и чувство ритма.' },
  { icon: Music2, title: 'Вокал', text: 'Музыка, слух, голос и уверенность в самовыражении.' },
  { icon: ShieldCheck, title: 'Таэквондо', text: 'Физическая активность, дисциплина и уважение к правилам.' },
  { icon: BookOpen, title: 'Подготовка к школе', text: 'Речь, мышление, внимание и базовые учебные навыки.' },
];

const features = [
  { icon: Clock3, title: '07:30–19:00', text: 'Понятный режим полного дня' },
  { icon: Users, title: '3 группы', text: 'Младшая, средняя и старшая' },
  { icon: Languages, title: 'Английский', text: 'Занятия в игровой форме' },
  { icon: Stethoscope, title: 'Логопед', text: 'Поддержка речи и общения' },
  { icon: Camera, title: 'Видеонаблюдение', text: 'Доступ в установленном формате' },
];

const intentOptions = [
  'Записаться на экскурсию',
  'Узнать подходящую группу',
  'Уточнить формат посещения',
  'Получить консультацию',
] as const;

function whatsappUrl(text: string) {
  return `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const analyticsWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, ...payload });
}

function PremiumLeadForm() {
  const [name, setName] = useState('');
  const [digits, setDigits] = useState('');
  const [intent, setIntent] = useState<(typeof intentOptions)[number]>('Записаться на экскурсию');
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const phone = `+7 ${[digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean).join(' ')}`;
  const fallbackText = `Здравствуйте. Меня зовут ${name.trim() || 'родитель'}. ${intent}. Телефон: ${phone}${comment.trim() ? `. Комментарий: ${comment.trim()}` : ''}`;

  async function submit() {
    setMessage(null);
    if (name.trim().length < 2) return setMessage({ type: 'error', text: 'Введите имя.' });
    if (digits.length !== 10) return setMessage({ type: 'error', text: 'Введите 10 цифр телефона после +7.' });
    if (!consent) return setMessage({ type: 'error', text: 'Подтвердите согласие на обработку контактных данных.' });

    const payload = {
      name: name.trim(),
      phone,
      intent,
      comment: comment.trim(),
      website,
      source: 'totoshakids.kz premium',
      path: window.location.pathname,
    };

    setSending(true);
    track('premium_lead_started', { intent });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null) as null | {
        ok?: boolean;
        accepted?: boolean;
        stored?: boolean;
        telegram?: { sent?: boolean };
      };
      const delivered = Boolean(result?.ok && (result.accepted || result.stored || result.telegram?.sent));
      if (!response.ok || !delivered) throw new Error('delivery failed');

      setMessage({ type: 'success', text: 'Заявка доставлена. Заведующая свяжется с вами, чтобы согласовать удобное время.' });
      setName('');
      setDigits('');
      setComment('');
      setConsent(false);
      track('premium_lead_success', { intent });
    } catch {
      setMessage({ type: 'error', text: 'Автоматическая отправка временно недоступна. Используйте WhatsApp или звонок ниже.' });
      track('premium_lead_fallback', { intent });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="premium-lead-form">
      <h3>Записаться на экскурсию</h3>
      <p>Оставьте контакт — мы уточним возраст ребёнка и предложим удобное время.</p>

      <div className="premium-field">
        <label htmlFor="premium-name">Ваше имя</label>
        <input id="premium-name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" autoComplete="name" />
      </div>

      <div className="premium-field">
        <label htmlFor="premium-phone">Телефон</label>
        <div className="premium-phone-field">
          <span>+7</span>
          <input id="premium-phone" type="tel" inputMode="numeric" maxLength={10} value={digits} onChange={(event) => setDigits(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="707 123 01 08" autoComplete="tel" />
        </div>
      </div>

      <div className="premium-field">
        <label htmlFor="premium-intent">Что вас интересует</label>
        <select id="premium-intent" value={intent} onChange={(event) => setIntent(event.target.value as (typeof intentOptions)[number])}>
          {intentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="premium-field">
        <label htmlFor="premium-comment">Комментарий</label>
        <textarea id="premium-comment" rows={3} maxLength={1000} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Возраст ребёнка или удобное время для звонка" />
      </div>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="premium-website">Сайт</label>
        <input id="premium-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>

      <label className="premium-consent">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>Согласен на обработку контактных данных для ответа на обращение. <a href="/privacy">Подробнее</a>.</span>
      </label>

      <button className="premium-btn premium-btn-navy" type="button" onClick={submit} disabled={sending} style={{ width: '100%' }}>
        <Send size={17} /> {sending ? 'Отправляем…' : 'Отправить заявку'}
      </button>

      {message && (
        <div className={`premium-form-message ${message.type === 'success' ? 'is-success' : ''}`}>
          {message.text}
          {message.type === 'error' && (
            <div className="premium-home-actions" style={{ marginTop: 12 }}>
              <a className="premium-btn premium-btn-ghost" href={whatsappUrl(fallbackText)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}>Позвонить</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const excursionWhatsapp = whatsappUrl('Здравствуйте. Хочу записаться на экскурсию в Тотоша.');

  return (
    <main className="premium-site">
      <PremiumHeader />

      <section className="premium-home-hero">
        <div className="premium-shell premium-home-grid">
          <div className="premium-home-copy">
            <div className="premium-eyebrow"><Star size={15} /> Современный детский сад в Астане</div>
            <h1>Тотоша — место, где забота стала системой</h1>
            <p>Безопасность, гармоничное развитие и понятный распорядок дня. Мы рядом с ребёнком и семьёй — открыто, бережно и каждый день.</p>
            <div className="premium-home-actions">
              <a className="premium-btn premium-btn-navy" href={excursionWhatsapp} target="_blank" rel="noopener noreferrer" onClick={() => track('premium_hero_whatsapp')}>
                <CalendarDays size={18} /> Записаться на экскурсию
              </a>
              <a className="premium-btn premium-btn-ghost" href="#family-journey">
                <Sparkles size={17} /> Как проходит знакомство
              </a>
            </div>
            <div className="premium-trust-row">
              <div className="premium-trust-item"><span><ShieldCheck size={18} /></span><div><strong>Безопасность</strong><small>Контроль и понятные правила</small></div></div>
              <div className="premium-trust-item"><span><Users size={18} /></span><div><strong>Забота и развитие</strong><small>Три возрастные группы</small></div></div>
              <div className="premium-trust-item"><span><MessageCircle size={18} /></span><div><strong>Открытая связь</strong><small>Телефон, WhatsApp, экскурсия</small></div></div>
            </div>
          </div>

          <div className="premium-journey-stage" id="family-journey">
            <div className="premium-journey-layout">
              <div className="premium-journey-copy">
                <small>Путь семьи в Тотоша</small>
                <h2>Мы рядом<br />на каждом этапе</h2>
                <div className="premium-journey-list">
                  {journeySteps.map(({ icon: Icon, title, text }, index) => (
                    <div className="premium-journey-step" key={title}>
                      <b>{String(index + 1).padStart(2, '0')}</b>
                      <div><strong>{title}</strong><small>{text}</small></div>
                      <Icon size={18} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="premium-journey-photo">
                <img src={HOME_GALLERY[0].src} alt="Атмосфера детского сада Тотоша" draggable={false} />
                <div className="premium-journey-seal"><Baby size={27} /><strong>Забота и внимание — каждый день</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-shell premium-feature-strip">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="premium-feature" key={title}>
              <span><Icon size={21} /></span>
              <div><strong>{title}</strong><small>{text}</small></div>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-section premium-section-paper">
        <div className="premium-shell">
          <div className="premium-section-head">
            <div className="premium-section-head-copy">
              <div className="premium-eyebrow"><Sparkles size={15} /> Программы развития</div>
              <h2>Баланс движения, творчества и познания</h2>
              <p>Направления распределяются по расписанию группы. Актуальный график и формат занятий можно уточнить во время экскурсии.</p>
            </div>
            <a className="premium-btn premium-btn-ghost" href="/programs">Все программы <ArrowUpRight size={17} /></a>
          </div>
          <div className="premium-card-grid">
            {services.map(({ icon: Icon, title, text }) => (
              <article className="premium-service-card" key={title}>
                <span className="premium-service-icon"><Icon size={23} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href="/programs">Подробнее <ArrowUpRight size={14} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-shell premium-life-grid">
          <div className="premium-life-copy">
            <div className="premium-eyebrow"><Camera size={15} /> Жизнь Тотоша</div>
            <h2>Настоящие моменты детского сада</h2>
            <p>Праздники, занятия и атмосфера заботы собраны в фотоархиве. Публично размещаются только выбранные материалы.</p>
            <div className="premium-home-actions"><a className="premium-btn premium-btn-navy" href="/life">Открыть фотоархив <ArrowUpRight size={17} /></a></div>
          </div>
          <div className="premium-life-collage">
            {HOME_GALLERY.map((item) => (
              <a className="premium-life-photo" href="/life" key={item.src}>
                <img src={item.src} alt={item.alt} draggable={false} />
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section premium-section-paper">
        <div className="premium-shell">
          <div className="premium-contact-section">
            <div className="premium-contact-copy">
              <div className="premium-card-kicker premium-card-kicker-light">Контакты</div>
              <h2>Будем рады познакомиться</h2>
              <p>Основной контакт — Айшагуль Галымжановна, заведующая детским садом.</p>
              <div className="premium-contact-list">
                <a href={TOTOSHA_CONTACTS.telUrl}><span><Phone size={18} /></span>{TOTOSHA_CONTACTS.phoneDisplay}</a>
                <a href={TOTOSHA_CONTACTS.mapUrl} target="_blank" rel="noopener noreferrer"><span><MapPin size={18} /></span>{TOTOSHA_CONTACTS.address}</a>
                <div><span><Clock3 size={18} /></span>Пн–Пт · 07:30–19:00</div>
              </div>
            </div>
            <PremiumLeadForm />
          </div>
          <PremiumMap compact />
        </div>
      </section>

      <PremiumFooter />
      <div className="premium-mobile-dock">
        <a className="premium-btn premium-btn-navy" href={excursionWhatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp</a>
        <a className="premium-btn premium-btn-gold" href={TOTOSHA_CONTACTS.telUrl}><Phone size={17} /> Позвонить</a>
      </div>
    </main>
  );
}
