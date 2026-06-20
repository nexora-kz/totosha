'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowUp,
  Baby,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Camera,
  CheckCircle2,
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
  UserRound,
  Utensils,
  Video,
  WalletCards,
  X,
} from 'lucide-react';
import {
  HOME_GALLERY,
  TOTOSHA_BUILD_DATE,
  TOTOSHA_CONTACTS,
  TOTOSHA_DEPLOY_LABEL,
  TOTOSHA_VERSION,
} from '../lib/totoshaConfig';

type Page = 'home' | 'about' | 'programs' | 'parents' | 'cabinet' | 'franchise' | 'contacts';

const nav = [
  ['about', 'О нас'],
  ['programs', 'Программы'],
  ['parents', 'Родителям'],
  ['cabinet', 'Технологии'],
  ['franchise', 'Франшиза'],
  ['contacts', 'Контакты'],
] as const;

function wa(text: string) {
  window.open(`${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

function ext(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function top() {
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.scrollTo({ top: 0, behavior: 'smooth' });
}

function Btn({
  children,
  onClick,
  kind = 'primary',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: 'primary' | 'dark' | 'light';
  disabled?: boolean;
}) {
  return (
    <button className={`btn btn-${kind}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return <div className="icon">{children}</div>;
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-title">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {text && <p className="lead">{text}</p>}
    </div>
  );
}

function Card({ icon, title, text, tags }: { icon: React.ReactNode; title: string; text: string; tags?: string[] }) {
  return (
    <div className="card">
      <IconBox>{icon}</IconBox>
      <h3>{title}</h3>
      <p>{text}</p>
      {tags && (
        <div className="feature-list">
          {tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Header({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const go = (p: Page) => {
    setPage(p);
    setOpen(false);
    top();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="nav">
          <button className="brand" onClick={() => go('home')}>
            <div className="logo"><Baby size={25} /></div>
            <div>
              <div className="brand-title">Тотоша</div>
              <div className="brand-sub">детский сад нового поколения</div>
            </div>
          </button>
          <div className="links">
            {nav.map(([id, label]) => (
              <button key={id} onClick={() => go(id as Page)} style={{ color: page === id ? '#f97316' : undefined }}>
                {label}
              </button>
            ))}
          </div>
          <div className="actions">
            <Btn kind="light" onClick={() => go('cabinet')}>Цифровой кабинет</Btn>
            <Btn kind="dark" onClick={() => go('contacts')}>Записаться</Btn>
          </div>
          <button className="mobile-btn" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        <div className={`mobile-menu ${open ? 'open' : ''}`}>
          {(['home', 'about', 'programs', 'parents', 'cabinet', 'franchise', 'contacts'] as Page[]).map((id) => (
            <button key={id} onClick={() => go(id)}>{id === 'home' ? 'Главная' : nav.find(([x]) => x === id)?.[1]}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

function Hero({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="hero">
      <div className="orb1" />
      <div className="orb2" />
      <div className="container hero-grid">
        <div>
          <div className="badge"><Sparkles size={17} /> Работает на NEXORA AI Platform</div>
          <h1>Тотоша — место, где забота стала системой</h1>
          <p className="lead">
            Безопасность • Развитие • Технологии • Забота. Современный детский сад с видеонаблюдением,
            Цифровым кабинетом и вниманием к каждому ребёнку.
          </p>
          <div className="hero-actions">
            <Btn onClick={() => wa('Здравствуйте. Хочу записаться на экскурсию в Тотоша.')}>
              Записаться на экскурсию <ChevronRight size={20} />
            </Btn>
            <Btn kind="light" onClick={() => setPage('cabinet')}><LayoutDashboard size={20} /> Открыть Цифровой кабинет</Btn>
          </div>
          <div className="stats">
            {[
              ['50+', 'детей уже сейчас'],
              ['130+', 'цель загрузки'],
              ['550 м²', 'пространства'],
              ['07:30–19:00', 'время работы'],
              ['24/7', 'цифровой контроль'],
            ].map(([a, b]) => (
              <div className="stat" key={a}><b>{a}</b><span>{b}</span></div>
            ))}
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="hero-card hero-card-v035">
      <div className="hero-scene hero-scene-v035">
        <div className="bubble b1" />
        <div className="bubble b2" />
        <div className="bubble b3" />
        <div className="emoji e1">🧸</div>
        <div className="emoji e2">🎨</div>
        <div className="emoji e3">📚</div>
        <div className="mini mini-top">
          <b style={{ display: 'flex', gap: 7, alignItems: 'center' }}><ShieldCheck size={18} color="#16a34a" /> Безопасность</b>
          <small>видеонаблюдение и отчёты</small>
        </div>
        <div className="mini dash">
          <div className="dash-head">
            <div><small>Сегодня</small><h3>Группа “Солнышко”</h3></div>
            <div className="pill">92%</div>
          </div>
          {['Завтрак отмечен', 'Развивающее занятие', 'Фотоотчёт отправлен', 'Оплата подтверждена'].map((x) => (
            <div className="dash-row" key={x}><span>{x}</span><CheckCircle2 size={20} color="#16a34a" /></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Why() {
  const items = [
    [<Video />, 'Онлайн видеонаблюдение', 'Прозрачность и спокойствие родителей каждый день.'],
    [<Stethoscope />, 'Врач-педиатр', 'Внимание к самочувствию и индивидуальным особенностям ребёнка.'],
    [<MessageCircle />, 'Логопед', 'Развитие речи, коммуникации и уверенности в общении.'],
    [<Languages />, 'Английский язык', 'Знакомство с языком в игровой и естественной среде.'],
    [<Mic />, 'Вокал и хореография', 'Творчество, музыка, движение и самовыражение.'],
    [<Dumbbell />, 'Таэквондо', 'Дисциплина, координация и физическая активность.'],
    [<LayoutDashboard />, 'Цифровой кабинет', 'Посещаемость, питание, фото, уведомления и оплаты.'],
    [<Utensils />, 'Сбалансированное питание', 'Продуманный рацион и внимание к особенностям ребёнка.'],
  ];

  return (
    <section className="section white">
      <div className="container">
        <SectionTitle eyebrow="Преимущества" title="Почему выбирают Тотоша" text="Мы объединяем заботу, развитие, безопасность и современные технологии в одну понятную систему." />
        <div className="grid grid-4">{items.map(([i, t, d]) => <Card key={String(t)} icon={i} title={String(t)} text={String(d)} />)}</div>
      </div>
    </section>
  );
}

function Safety() {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="Безопасность и забота" title="Спокойствие родителей начинается с доверия" />
        <div className="grid grid-3">
          <Card icon={<Video />} title="Онлайн видеонаблюдение" text="Родители могут быть спокойны: безопасность и прозрачность находятся в центре нашей работы." />
          <Card icon={<ShieldCheck />} title="Безопасная среда" text="Продуманное пространство, порядок и ежедневное внимание к важным деталям." />
          <Card icon={<HeartHandshake />} title="Заботливая атмосфера" text="Ребёнок чувствует поддержку, уважение и внимание каждый день." />
        </div>
      </div>
    </section>
  );
}

function Development() {
  const arr = [
    ['Мышление и логика', 'Внимание, память, анализ и самостоятельное мышление.', '🧠'],
    ['Речь и коммуникация', 'Уверенное общение, взаимодействие и развитие речи.', '🗣'],
    ['Творческое развитие', 'Воображение, музыка, творчество и самовыражение.', '🎨'],
    ['Физическая активность', 'Движение, дисциплина, энергия и координация.', '🤸'],
    ['Эмоциональное развитие', 'Уверенность, самостоятельность и спокойная адаптация.', '❤️'],
    ['Подготовка к школе', 'Чтение, письмо, математика и интерес к знаниям.', '🎓'],
  ];

  return (
    <section className="section white">
      <div className="container">
        <SectionTitle eyebrow="Развитие ребёнка" title="Гармоничное развитие через интерес" text="Ребёнок развивается постепенно: через знания, творчество, движение, общение и заботу." />
        <div className="grid grid-3">{arr.map(([t, d, e]) => <Card key={t} icon={<span style={{ fontSize: 24 }}>{e}</span>} title={t} text={d} />)}</div>
      </div>
    </section>
  );
}

function Directions() {
  const items = [
    ['📚', 'Английский язык', 'Язык через игру и естественную коммуникацию.'],
    ['🗣', 'Логопед', 'Поддержка развития речи и уверенности.'],
    ['🎤', 'Вокал', 'Музыка, дыхание и самовыражение.'],
    ['💃', 'Хореография', 'Движение, пластика и чувство ритма.'],
    ['🤼', 'Таэквондо', 'Физическая активность и дисциплина.'],
    ['🧠', 'Развитие мышления', 'Логика, внимание, память и любознательность.'],
    ['📖', 'Подготовка к школе', 'Навыки для уверенного перехода к обучению.'],
    ['👨‍⚕️', 'Врач-педиатр', 'Внимание к здоровью и самочувствию.'],
  ];

  return (
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="Направления" title="Дополнительные возможности развития" />
        <div className="grid grid-4">{items.map(([e, t, d]) => <Card key={t} icon={<span style={{ fontSize: 24 }}>{e}</span>} title={t} text={d} />)}</div>
      </div>
    </section>
  );
}

function Day() {
  const rows = [
    ['07:30', 'Приём детей'],
    ['08:30', 'Завтрак'],
    ['09:00', 'Развитие и занятия'],
    ['10:30', 'Прогулка'],
    ['12:00', 'Обед'],
    ['13:00', 'Отдых'],
    ['15:30', 'Полдник'],
    ['16:00', 'Кружки и дополнительные занятия'],
    ['17:30', 'Игры и свободная деятельность'],
    ['19:00', 'Завершение дня'],
  ];

  return (
    <section className="section white">
      <div className="container split">
        <div>
          <SectionTitle eyebrow="Режим дня" title="Один день в Тотоша" text="Режим помогает ребёнку чувствовать стабильность, спокойствие и уверенность." />
          <div className="premium-band"><h3>Формат посещения</h3><p>Полдня и полный день. Детский сад работает с 07:30 до 19:00.</p></div>
        </div>
        <div className="timeline">{rows.map(([a, b]) => <div className="time-row" key={a}><div className="time">{a}</div><b>{b}</b></div>)}</div>
      </div>
    </section>
  );
}

function Parents() {
  const items = [
    [<LayoutDashboard />, 'Цифровой кабинет', 'Посещаемость, питание, баланс, фотоотчёты и уведомления.'],
    [<Camera />, 'Фотоотчёты', 'Важные моменты дня ребёнка в удобном формате.'],
    [<Bell />, 'Уведомления', 'Приход, уход, новости и индивидуальные сообщения.'],
    [<CreditCard />, 'Удобная оплата', 'Баланс, история оплат и напоминания.'],
    [<MessageCircle />, 'Быстрая связь', 'Коммуникация с администратором и воспитателем.'],
    [<ClipboardCheck />, 'Посещаемость', 'Информация о приходе, уходе и отсутствии ребёнка.'],
  ];

  return (
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="Родителям" title="Комфорт и прозрачность для семьи" text="Вся важная информация о ребёнке находится под рукой." />
        <div className="grid grid-3">{items.map(([i, t, d]) => <Card key={String(t)} icon={i} title={String(t)} text={String(d)} />)}</div>
      </div>
    </section>
  );
}

function Cabinet() {
  const [role, setRole] = useState('parent');
  const data = useMemo(() => ({
    parent: [['Ребёнок', 'Айлин, группа Солнышко'], ['Сегодня', 'Пришла в 08:42'], ['Питание', 'Завтрак и обед отмечены'], ['Баланс', '0 ₸']],
    admin: [['Заявки', '12 новых за неделю'], ['Группы', 'Солнышко: 24 / 26'], ['Оплаты', '3 напоминания сегодня'], ['Договоры', 'готовы к проверке']],
    owner: [['Загрузка', '50 детей сейчас'], ['Цель', '130+ детей'], ['Финансы', 'прогноз выручки'], ['KPI', 'контроль процессов']],
  }[role] || []), [role]);

  const cards = [
    [<UserRound />, 'Карточка ребёнка', 'Контакты, группа, особенности, договор и история посещений.'],
    [<WalletCards />, 'Финансы', 'Начисления, оплаты, баланс, скидки и отчёты.'],
    [<BarChart3 />, 'Аналитика', 'Загрузка групп, заявки, KPI и контроль качества.'],
    [<Bot />, 'AI-помощник', 'Сообщения, напоминания, отчёты и контроль задач.'],
    [<Camera />, 'Фотоотчёты', 'Безопасная публикация моментов для родителей.'],
    [<Bell />, 'Уведомления', 'Важные сообщения и события без человеческого фактора.'],
  ];

  return (
    <section className="section dark">
      <div className="container">
        <SectionTitle eyebrow="Цифровой кабинет" title="Тотоша управляется как система" text="Понятный кабинет для родителей, администратора и руководителя." />
        <div className="tabs">
          <button className={`tab ${role === 'parent' ? 'active' : ''}`} onClick={() => setRole('parent')}>Родитель</button>
          <button className={`tab ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Администратор</button>
          <button className={`tab ${role === 'owner' ? 'active' : ''}`} onClick={() => setRole('owner')}>Руководитель</button>
        </div>
        <div className="panel">
          <div className="panel-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div><small style={{ color: '#94a3b8' }}>Панель</small><h3>{role === 'parent' ? 'Кабинет родителя' : role === 'admin' ? 'Панель администратора' : 'Панель руководителя'}</h3></div>
              <LayoutDashboard color="#fb923c" />
            </div>
            <div className="demo-grid">{data.map(([a, b]) => <div className="demo-item" key={a}><span>{a}</span><b>{b}</b></div>)}</div>
          </div>
        </div>
        <div className="grid grid-3" style={{ marginTop: 22 }}>{cards.map(([i, t, d]) => <Card key={String(t)} icon={i} title={String(t)} text={String(d)} />)}</div>
      </div>
    </section>
  );
}

function LeadForm({ title = 'Записаться на экскурсию', intent = 'Записаться на экскурсию' }: { title?: string; intent?: string }) {
  const [name, setName] = useState('');
  const [digits, setDigits] = useState('');
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  function handle(v: string) {
    setDigits(v.replace(/\D/g, '').slice(0, 10));
  }

  function fmt(d: string) {
    return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(' ');
  }

  async function submit() {
    setError('');
    if (!name.trim()) {
      setError('Введите имя.');
      return;
    }
    if (digits.length < 10) {
      setError('Введите 10 цифр телефона после +7.');
      return;
    }

    const phone = '+7 ' + fmt(digits);
    const payload = { name: name.trim(), phone, intent, comment: comment.trim(), source: 'totoshakids.kz', date: new Date().toISOString() };
    setSending(true);

    try {
      const old = JSON.parse(localStorage.getItem('totosha_leads') || '[]');
      localStorage.setItem('totosha_leads', JSON.stringify([payload, ...old]));
    } catch {
      // localStorage может быть недоступен в приватном режиме, заявка всё равно отправится в API/WhatsApp.
    }

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // WhatsApp остаётся резервным каналом заявки.
    }

    setSending(false);
    setSent(true);
    wa(`Здравствуйте. Меня зовут ${payload.name}. ${intent}. Телефон: ${phone}${payload.comment ? '. Комментарий: ' + payload.comment : ''}`);
  }

  return (
    <div className="form">
      <h3>{title}</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
      <div className="phone-wrap"><span className="phone-prefix">+7</span><input type="tel" inputMode="numeric" maxLength={10} value={digits} onChange={(e) => handle(e.target.value)} placeholder="7071230108" /></div>
      <div className="phone-help">Введите ровно 10 цифр после +7. Например: 7071230108</div>
      <select value={intent} onChange={() => {}}><option>{intent}</option></select>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Комментарий" rows={4} />
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={submit} disabled={sending}>
        <Send size={18} /> {sending ? 'Отправляем...' : 'Отправить заявку'}
      </button>
      {error && <div className="form-error">{error}</div>}
      {sent && <div className="success"><b>Заявка принята</b><p>Открыт WhatsApp с готовым сообщением для администратора.</p></div>}
    </div>
  );
}

function ProgramsPage() {
  return (
    <>
      <Directions />
      <Development />
      <Day />
      <section className="section"><div className="container split"><LeadForm title="Узнать программу для ребёнка" intent="Хочу узнать программу для ребёнка" /><Card icon={<BookOpen />} title="Русский и Казахский" text="Сайт подготовлен под развитие двуязычной коммуникации с родителями и будущую версию на Казахском языке." /></div></section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section className="section"><div className="container"><SectionTitle eyebrow="О нас" title="Тотоша — современная образовательная среда" text="Здесь забота, развитие, безопасность и технологии соединены в одну систему." /><div className="grid grid-2"><Card icon={<HeartHandshake />} title="Наша идея" text="Создать детский сад, которому родители доверяют через прозрачные процессы и уважительное отношение к ребёнку." /><Card icon={<ShieldCheck />} title="Наш стандарт" text="Безопасность, чистота, режим, развитие, открытость и управленческая дисциплина внутри команды." /></div></div></section>
      <Safety />
      <section className="section white"><div className="container"><SectionTitle eyebrow="Принципы" title="Стандарты Тотоша" /><div className="grid grid-3">{[['🧼', 'Чистота и порядок', 'Комфортная и организованная среда каждый день.'], ['❤️', 'Заботливое отношение', 'Внимание, поддержка и уважение к каждому ребёнку.'], ['🤝', 'Партнёрство с родителями', 'Открытость, прозрачность и совместное участие в развитии ребёнка.']].map(([e, t, d]) => <Card key={t} icon={<span style={{ fontSize: 24 }}>{e}</span>} title={t} text={d} />)}</div></div></section>
    </>
  );
}

function ParentsPage() {
  return (
    <>
      <Parents />
      <section className="section white"><div className="container split"><div><SectionTitle eyebrow="FAQ" title="Частые вопросы" /><div className="faq grid">{[['Как проходит адаптация?', 'Постепенно и спокойно, с вниманием к характеру ребёнка и обратной связью для родителей.'], ['Есть ли группы на полдня?', 'Да, доступны форматы на полдня и полный день.'], ['Как учитываются аллергии?', 'Индивидуальные особенности ребёнка фиксируются и учитываются в питании и уходе.'], ['Есть ли дополнительные занятия?', 'Да: Английский язык, логопед, вокал, хореография, таэквондо и подготовка к школе.'], ['Как работает Цифровой кабинет?', 'Родитель видит посещаемость, питание, фотоотчёты, уведомления и оплату.'], ['Как записаться?', 'Оставьте заявку или напишите в WhatsApp — администратор подберёт удобное время экскурсии.']].map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div><LeadForm title="Записаться на экскурсию" intent="Хочу записаться на экскурсию в Тотоша" /></div></section>
    </>
  );
}

function Franchise() {
  return (
    <section className="section"><div className="container"><SectionTitle eyebrow="Франшиза" title="Откройте Тотоша в своём городе" text="Франшиза строится на системе: стандарты, Цифровой кабинет, обучение, продажи, финансы и контроль качества." /><div className="split"><div className="premium-band"><h3>Что получает партнёр</h3>{['Бренд и стандарты Тотоша', 'Методология запуска', 'Цифровой кабинет и AI-помощник', 'Скрипты продаж и маркетинг', 'Финансовая модель', 'Обучение команды'].map((x) => <p key={x}>✓ {x}</p>)}</div><LeadForm title="Получить презентацию франшизы" intent="Интересует франшиза Тотоша" /></div></div></section>
  );
}

function Contacts() {
  const contacts = [
    [<MessageCircle />, 'WhatsApp', 'Написать администратору', () => wa('Здравствуйте. Хочу узнать подробнее про Тотоша.')],
    [<Phone />, 'Позвонить', `Позвонить на ${TOTOSHA_CONTACTS.phoneDisplay}`, () => ext(TOTOSHA_CONTACTS.telUrl)],
    [<ImageIcon />, 'Instagram @totoshakids', 'Открыть официальный профиль', () => ext(TOTOSHA_CONTACTS.instagramUrl)],
    [<Send />, 'Telegram', 'Открыть Telegram', () => ext(TOTOSHA_CONTACTS.telegramUrl)],
    [<MapPin />, 'Карта 2ГИС', 'Открыть маршрут к Тотоша', () => ext(TOTOSHA_CONTACTS.mapUrl)],
  ];

  return (
    <section className="section"><div className="container"><SectionTitle eyebrow="Контакты" title="Связаться с Тотоша" text="Выберите удобный способ связи или оставьте заявку." /><div className="split"><div className="grid">{contacts.map(([i, t, d, fn]: any) => <button className="contact-card" key={t} onClick={fn}><IconBox>{i}</IconBox><div><h3>{t}</h3><p>{d}</p></div></button>)}</div><LeadForm title="Оставить заявку" intent="Хочу связаться с Тотоша" /></div></div></section>
  );
}

function HomeLifeTeaser() {
  return (
    <section id="life" className="home-life home-life-v035">
      <div className="home-life__text">
        <div className="eyebrow">Жизнь Тотоша</div>
        <h2>Настоящие моменты детского сада</h2>
        <p>Праздники, занятия, улыбки, развитие и ежедневная атмосфера заботы — всё собрано в защищённом фотоархиве Тотоша.</p>
        <a className="btn btn-primary" href="/life">Открыть фотоархив</a>
      </div>
      <div className="home-life__photos">
        {HOME_GALLERY.map((item) => (
          <span className="home-life__photo" key={item.src}>
            <img src={item.src} alt={item.alt} draggable={false} />
            <span className="home-life__caption">{item.title}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function SEOBlock() {
  return (
    <section className="section"><div className="container"><SectionTitle eyebrow="Для поиска" title="Детский сад Тотоша в Астане" /><p className="seo-text">Тотоша — частный детский сад в Астане с современным подходом к развитию детей. В детском саду предусмотрены онлайн видеонаблюдение, врач-педиатр, логопед, Английский язык, вокал, хореография, таэквондо, подготовка к школе, фотоотчёты, Цифровой кабинет, группы на полдня и полный день. Время работы: 07:30–19:00.</p></div></section>
  );
}

function Home({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      <Hero setPage={setPage} />
      <Why />
      <Safety />
      <Directions />
      <Day />
      <Development />
      <Parents />
      <Cabinet />
      <HomeLifeTeaser />
      <SEOBlock />
      <section className="section white"><div className="container split"><div><SectionTitle eyebrow="Первое знакомство" title="Путь семьи в Тотоша" text="Заявка → экскурсия → знакомство с пространством → адаптация → комфортное посещение → развитие ребёнка." /><Btn onClick={() => wa('Здравствуйте. Хочу записаться на экскурсию в Тотоша.')}>Записаться в WhatsApp</Btn></div><LeadForm title="Записаться на экскурсию" intent="Хочу записаться на экскурсию в Тотоша" /></div></section>
    </>
  );
}

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="footer"><div className="container footer-row"><div><div className="brand-title">Тотоша</div><div className="brand-sub">Детский сад нового поколения. Powered by NEXORA.</div></div><div className="hero-actions" style={{ marginTop: 0 }}><Btn kind="light" onClick={() => wa('Здравствуйте. Хочу узнать подробнее про Тотоша.')}>WhatsApp</Btn><Btn kind="light" onClick={() => ext(TOTOSHA_CONTACTS.instagramUrl)}>Instagram</Btn><Btn kind="light" onClick={() => setPage('cabinet')}>Цифровой кабинет</Btn></div></div></footer>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const current = {
    home: <Home setPage={setPage} />,
    about: <AboutPage />,
    programs: <ProgramsPage />,
    parents: <ParentsPage />,
    cabinet: <Cabinet />,
    franchise: <Franchise />,
    contacts: <Contacts />,
  }[page];

  return (
    <div className="page">
      <Header page={page} setPage={setPage} />
      <main>
        <div className="version-badge" title="NEXORA automated release marker">
          <strong>TOTOSHA {TOTOSHA_VERSION}</strong>
          <span>Build {TOTOSHA_BUILD_DATE}</span>
          <em>{TOTOSHA_DEPLOY_LABEL}</em>
        </div>
        {current}
      </main>
      <Footer setPage={setPage} />
      <div className="floating">
        <button className="float-btn float-whatsapp" onClick={() => wa('Здравствуйте. Хочу узнать подробнее про Тотоша.')}><MessageCircle /></button>
        <button className="float-btn float-top" onClick={top}><ArrowUp /></button>
      </div>
    </div>
  );
}
