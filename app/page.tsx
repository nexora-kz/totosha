'use client';

import React, { useState } from 'react';
import {
  ArrowUp,
  Baby,
  Bell,
  Camera,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Dumbbell,
  HeartHandshake,
  Image as ImageIcon,
  Languages,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Utensils,
  Video,
  X,
} from 'lucide-react';
import { HOME_GALLERY, TOTOSHA_CONTACTS } from '../lib/totoshaConfig';
import styles from './wave1.module.css';

const nav = [
  ['/about', 'О нас'],
  ['/programs', 'Программы'],
  ['/parents', 'Родителям'],
  ['/cabinet', 'Технологии'],
  ['/franchise', 'Франшиза'],
  ['/contacts', 'Контакты'],
] as const;

const intentOptions = [
  'Записаться на экскурсию',
  'Узнать подходящую группу',
  'Уточнить формат посещения',
  'Получить консультацию',
] as const;

function whatsappUrl(text: string) {
  return `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

function scrollTop() {
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.scrollTo({ top: 0, behavior: 'smooth' });
}

function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const analyticsWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, ...payload });
}

function IconBox({ children }: { children: React.ReactNode }) {
  return <div className="icon">{children}</div>;
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="section-title"><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{text && <p className="lead">{text}</p>}</div>;
}

function Card({ icon, title, text, tags }: { icon: React.ReactNode; title: string; text: string; tags?: string[] }) {
  return <article className="card"><IconBox>{icon}</IconBox><h3>{title}</h3><p>{text}</p>{tags && <div className="feature-list">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}</article>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="container"><div className="nav"><a className="brand" href="/" aria-label="На главную Тотоша"><div className="logo"><Baby size={25} /></div><div><div className="brand-title">Тотоша</div><div className="brand-sub">детский сад нового поколения</div></div></a><nav className="links" aria-label="Основная навигация">{nav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav><div className="actions"><a className="btn btn-light" href="/parents">Родителям</a><a className="btn btn-dark" href="/contacts">Записаться</a></div><button className="mobile-btn" type="button" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button></div><div className={`mobile-menu ${open ? 'open' : ''}`}><a href="/">Главная</a>{nav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</div></div></header>;
}

function Hero() {
  const facts = [['07:30–19:00', 'режим полного дня'], ['Полдня', 'доступный формат посещения'], ['3 группы', 'по возрасту детей'], ['Астана', 'ул. Алихана Бокейхана, 29А']];
  return <section className="hero"><div className="orb1" /><div className="orb2" /><div className="container hero-grid"><div><div className="badge"><Sparkles size={17} /> Частный детский сад в Астане</div><h1>Тотоша — место, где забота стала системой</h1><p className="lead">Безопасность, развитие, понятный режим и открытая связь с семьёй. Мы не обещаем лишнего — показываем, как устроен детский сад сегодня и что развивается поэтапно.</p><div className="hero-actions"><a className="btn btn-primary" href={whatsappUrl('Здравствуйте. Хочу записаться на экскурсию в Тотоша.')} onClick={() => track('cta_whatsapp', { location: 'hero', intent: 'excursion' })}>Записаться на экскурсию <ChevronRight size={20} /></a><a className="btn btn-light" href="#family-path">Как проходит знакомство</a></div><div className={styles.trustStrip}>{facts.map(([title, text]) => <div className={styles.trustItem} key={title}><strong>{title}</strong><span>{text}</span></div>)}</div></div><div className={styles.honestPanel}><small>Цифровая экосистема Тотоша</small><h3>Запускается поэтапно после тестирования</h3>{[['Приход и уход ребёнка', 'тестирование'], ['Уведомления родителям', 'подготовлено'], ['Фотоотчёты', 'закрытый доступ'], ['Оплаты и документы', 'следующий этап']].map(([label, status]) => <div className={styles.statusRow} key={label}><span>{label}</span><span className={styles.status}>{status}</span></div>)}</div></div></section>;
}

function Why() {
  const items = [
    [<Video key="video" />, 'Видеонаблюдение', 'Возможность наблюдать за ребёнком в доступном для родителей формате.', ['Работает']],
    [<Stethoscope key="doctor" />, 'Врач-педиатр', 'Внимание к самочувствию и индивидуальным особенностям ребёнка.', ['По графику']],
    [<MessageCircle key="speech" />, 'Логопед', 'Поддержка речи, общения и уверенности ребёнка.', ['Дополнительное направление']],
    [<Languages key="language" />, 'Английский язык', 'Знакомство с языком через игру и ежедневную коммуникацию.', ['В программе']],
    [<Mic key="music" />, 'Вокал и хореография', 'Музыка, движение, чувство ритма и самовыражение.', ['В программе']],
    [<Dumbbell key="sport" />, 'Таэквондо', 'Физическая активность, координация и дисциплина.', ['В программе']],
    [<Utensils key="food" />, 'Питание', 'Режим питания и фиксация индивидуальных особенностей ребёнка.', ['Уточняется при зачислении']],
    [<HeartHandshake key="contact" />, 'Связь с семьёй', 'WhatsApp, телефон, экскурсия и личное общение с заведующей.', ['Доступно сейчас']],
  ] as const;
  return <section className="section white"><div className="container"><SectionTitle eyebrow="Что получает семья" title="Понятные условия без рекламных преувеличений" text="Перед зачислением родители знакомятся с пространством, режимом, группой и правилами детского сада." /><div className="grid grid-4">{items.map(([icon, title, text, tags]) => <Card key={title} icon={icon} title={title} text={text} tags={[...tags]} />)}</div></div></section>;
}

function Development() {
  const items = [['🧠', 'Мышление и логика', 'Внимание, память, анализ и самостоятельное мышление.'], ['🗣', 'Речь и коммуникация', 'Уверенное общение, взаимодействие и развитие речи.'], ['🎨', 'Творческое развитие', 'Воображение, музыка, творчество и самовыражение.'], ['🤸', 'Физическая активность', 'Движение, дисциплина, энергия и координация.'], ['❤️', 'Эмоциональное развитие', 'Уверенность, самостоятельность и спокойная адаптация.'], ['🎓', 'Подготовка к школе', 'Чтение, письмо, математика и интерес к знаниям.']];
  return <section className="section"><div className="container"><SectionTitle eyebrow="Развитие ребёнка" title="Развитие через интерес и устойчивый режим" /><div className="grid grid-3">{items.map(([emoji, title, text]) => <Card key={title} icon={<span style={{ fontSize: 24 }}>{emoji}</span>} title={title} text={text} />)}</div></div></section>;
}

function Day() {
  const rows = [['07:30', 'Приём детей'], ['08:30', 'Завтрак'], ['09:00', 'Развивающие занятия'], ['10:30', 'Прогулка'], ['12:00', 'Обед'], ['13:00', 'Отдых'], ['15:30', 'Полдник'], ['16:00', 'Дополнительные занятия'], ['17:30', 'Игры и свободная деятельность'], ['19:00', 'Завершение дня']];
  return <section className="section white"><div className="container split"><div><SectionTitle eyebrow="Режим дня" title="Предсказуемый день помогает ребёнку адаптироваться" text="Фактический режим группы может корректироваться по возрасту и потребностям детей." /><div className="premium-band"><h3>Форматы посещения</h3><p>Полдня и полный день. Подходящий вариант подбирается после знакомства с ребёнком и семьёй.</p></div></div><div className="timeline">{rows.map(([time, label]) => <div className="time-row" key={time}><div className="time">{time}</div><b>{label}</b></div>)}</div></div></section>;
}

function DigitalStatus() {
  const items = [
    [<ClipboardCheck key="attendance" />, 'Посещаемость', 'События прихода и ухода проходят техническое тестирование.', ['Тестирование']],
    [<Bell key="notification" />, 'Уведомления', 'Подготовлена логика уведомлений для родителей.', ['Подготовлено']],
    [<Camera key="photo" />, 'Фотоотчёты', 'Планируется закрытый доступ только для своей семьи.', ['Следующий этап']],
    [<CreditCard key="payments" />, 'Оплаты', 'Баланс, история и напоминания будут подключаться после пилота.', ['Следующий этап']],
    [<LayoutDashboard key="team" />, 'Приложение персонала', 'Сотрудники смогут отмечать события со смартфона без отдельного компьютера.', ['Прототип готов']],
    [<ShieldCheck key="security" />, 'Доступ и безопасность', 'Роли, журнал действий и раздельный доступ заложены в архитектуру.', ['Подготовлено']],
  ] as const;
  return <section className="section dark"><div className="container"><SectionTitle eyebrow="Технологии" title="Честный статус цифровых функций" text="Полный кабинет ещё не запущен для всех родителей. Сначала мы тестируем безопасность и реальные сценарии на небольшой группе." /><div className="grid grid-3">{items.map(([icon, title, text, tags]) => <Card key={title} icon={icon} title={title} text={text} tags={[...tags]} />)}</div><div className="hero-actions" style={{ marginTop: 24 }}><a className="btn btn-light" href="/cabinet">Подробнее о развитии экосистемы</a></div></div></section>;
}

function FamilyPath() {
  const steps = [['1', 'Заявка', 'Вы оставляете телефон и выбираете тему обращения.'], ['2', 'Связь', 'Заведующая уточняет возраст ребёнка и отвечает на вопросы.'], ['3', 'Экскурсия', 'Вы знакомитесь с пространством, режимом и правилами.'], ['4', 'Решение', 'После знакомства выбирается группа и формат посещения.']];
  return <section id="family-path" className="section"><div className="container"><SectionTitle eyebrow="После заявки" title="Понятный путь семьи без давления" text="Заявка не обязывает к зачислению. Сначала знакомство, ответы на вопросы и только потом решение." /><div className={styles.processGrid}>{steps.map(([number, title, text]) => <article className={styles.processStep} key={number}><div className={styles.processNumber}>{number}</div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>;
}

function LeadForm() {
  const [name, setName] = useState('');
  const [digits, setDigits] = useState('');
  const [intent, setIntent] = useState<(typeof intentOptions)[number]>('Записаться на экскурсию');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const phone = `+7 ${[digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean).join(' ')}`;
  const message = `Здравствуйте. Меня зовут ${name.trim() || 'родитель'}. ${intent}. Телефон: ${phone}${comment.trim() ? `. Комментарий: ${comment.trim()}` : ''}`;

  async function submit() {
    setError(''); setSent(false);
    if (!name.trim()) return setError('Введите имя.');
    if (digits.length !== 10) return setError('Введите ровно 10 цифр телефона после +7.');
    if (!consent) return setError('Подтвердите согласие на обработку данных для обратной связи.');
    const payload = { name: name.trim(), phone, intent, comment: comment.trim(), source: 'totoshakids.kz', path: window.location.pathname, date: new Date().toISOString() };
    setSending(true); track('lead_submit_started', { intent, path: payload.path });
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`Lead API returned ${response.status}`);
      try {
        const old = JSON.parse(localStorage.getItem('totosha_leads') || '[]');
        localStorage.setItem('totosha_leads', JSON.stringify([payload, ...old].slice(0, 20)));
      } catch {}
      setSent(true); track('lead_submit_success', { intent, path: payload.path });
    } catch {
      setError('Не удалось отправить автоматически. Напишите нам в WhatsApp или позвоните — сообщение уже подготовлено.');
      track('lead_submit_fallback', { intent, path: payload.path });
    } finally { setSending(false); }
  }

  return <div className="form"><h3>Записаться на знакомство</h3><label className={styles.formLabel} htmlFor="lead-name">Ваше имя</label><input id="lead-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" /><label className={styles.formLabel} htmlFor="lead-phone">Телефон</label><div className="phone-wrap"><span className="phone-prefix">+7</span><input id="lead-phone" type="tel" inputMode="numeric" maxLength={10} value={digits} onChange={(event) => setDigits(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="7071230108" /></div><div className="phone-help">Введите 10 цифр после +7.</div><label className={styles.formLabel} htmlFor="lead-intent">Что вас интересует</label><select id="lead-intent" value={intent} onChange={(event) => setIntent(event.target.value as (typeof intentOptions)[number])}>{intentOptions.map((option) => <option key={option}>{option}</option>)}</select><label className={styles.formLabel} htmlFor="lead-comment">Комментарий</label><textarea id="lead-comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Возраст ребёнка или удобное время для звонка" rows={4} /><label className={styles.consent}><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Согласен на обработку контактных данных для ответа на обращение. <a href="/privacy">Подробнее</a>.</span></label><button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} type="button" onClick={submit} disabled={sending}><Send size={18} /> {sending ? 'Отправляем...' : 'Отправить заявку'}</button>{error && <div className={styles.fallback}>{error}<div className={styles.successActions}><a className="btn btn-light" href={whatsappUrl(message)}>Написать в WhatsApp</a><a className="btn btn-light" href={TOTOSHA_CONTACTS.telUrl}>Позвонить</a></div></div>}{sent && <div className="success"><b>Заявка отправлена</b><p>Заведующая свяжется с вами для уточнения возраста ребёнка и удобного времени экскурсии.</p><div className={styles.successActions}><a className="btn btn-light" href={whatsappUrl(message)}>Дополнить в WhatsApp</a><a className="btn btn-light" href={TOTOSHA_CONTACTS.telUrl}>Позвонить сейчас</a></div></div>}</div>;
}

function ContactsSection() {
  const facts = [[<MapPin key="map" />, 'Адрес', 'Астана, ул. Алихана Бокейхана, 29А', TOTOSHA_CONTACTS.mapUrl], [<Phone key="phone" />, 'Телефон', TOTOSHA_CONTACTS.phoneDisplay, TOTOSHA_CONTACTS.telUrl], [<MessageCircle key="wa" />, 'WhatsApp', 'Быстрая связь с детским садом', whatsappUrl('Здравствуйте. Хочу узнать подробнее про Тотоша.')], [<ImageIcon key="instagram" />, 'Instagram', '@totoshakids', TOTOSHA_CONTACTS.instagramUrl]] as const;
  return <section className="section white"><div className="container split"><div><SectionTitle eyebrow="Контакты" title="Свяжитесь удобным способом" text={`Основной контакт — ${TOTOSHA_CONTACTS.contactPerson}, ${TOTOSHA_CONTACTS.contactRole.toLowerCase()}.`} /><div className={styles.contactFacts}>{facts.map(([icon, title, text, href]) => <div className={styles.contactFact} key={title}><IconBox>{icon}</IconBox><div><strong>{title}</strong><a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{text}</a></div></div>)}</div></div><LeadForm /></div></section>;
}

function LifeTeaser() {
  return <section id="life" className="home-life home-life-v035"><div className="home-life__text"><div className="eyebrow">Жизнь Тотоша</div><h2>Настоящие моменты детского сада</h2><p>Праздники, занятия и атмосфера заботы собраны в фотоархиве. Публично размещаются только выбранные материалы.</p><a className="btn btn-primary" href="/life">Открыть фотоархив</a></div><div className="home-life__photos">{HOME_GALLERY.map((item) => <span className="home-life__photo" key={item.src}><img src={item.src} alt={item.alt} draggable={false} /><span className="home-life__caption">{item.title}</span></span>)}</div></section>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-row"><div><div className="brand-title">Тотоша</div><div className="brand-sub">Частный детский сад в Астане</div><div className={styles.footerMeta}>Алихана Бокейхана, 29А · Пн–Пт, 07:30–19:00</div></div><div className={styles.footerLinks}><a href="/contacts">Контакты</a><a href="/parents">Родителям</a><a href="/privacy">Обработка данных</a><a href={TOTOSHA_CONTACTS.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a></div></div></footer>;
}

export default function HomePage() {
  return <div className="page"><Header /><main><Hero /><Why /><Development /><Day /><DigitalStatus /><FamilyPath /><LifeTeaser /><ContactsSection /></main><Footer /><div className="floating"><button className="float-btn float-top" aria-label="Наверх" onClick={scrollTop}><ArrowUp /></button></div><div className={styles.mobileDock} aria-label="Быстрая связь"><a href={whatsappUrl('Здравствуйте. Хочу узнать подробнее про Тотоша.')}><MessageCircle size={18} /> WhatsApp</a><a href={TOTOSHA_CONTACTS.telUrl}><Phone size={18} /> Позвонить</a></div></div>;
}
