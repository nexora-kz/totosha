import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  CreditCard,
  Flower2,
  Heart,
  Languages,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShieldCheck,
  Sparkles,
  Sprout,
  Star,
  Users,
} from 'lucide-react';
import { PREMIUM_VISUALS, TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

export type PremiumPageVariant = 'about' | 'programs' | 'parents' | 'technology' | 'franchise' | 'contacts';

const visualImage = {
  about: PREMIUM_VISUALS.about,
  programs: PREMIUM_VISUALS.programs,
  parents: PREMIUM_VISUALS.parents,
} as const;

function PhotoFrame({ src, alt, badge }: { src: string; alt: string; badge: string }) {
  return (
    <div className="premium-photo-frame">
      <img src={src} alt={alt} draggable={false} loading="eager" decoding="async" />
      <span className="premium-photo-glow" />
      <div className="premium-photo-badge">
        <Sparkles size={16} />
        <span>{badge}</span>
      </div>
    </div>
  );
}

function AboutVisual() {
  return (
    <div className="premium-visual premium-visual-about">
      <PhotoFrame src={visualImage.about.src} alt={visualImage.about.alt} badge="Забота в каждой детали" />
      <div className="premium-floating-note premium-floating-note-top">
        <span className="premium-note-icon"><Heart size={19} /></span>
        <div><small>Главный принцип</small><strong>Сначала доверие</strong></div>
      </div>
      <div className="premium-visual-card premium-team-card">
        <span className="premium-card-kicker">Команда Тотоша</span>
        <h3>Мы рядом с семьёй</h3>
        {[
          ['Заведующая', 'Личный контакт и экскурсия'],
          ['Воспитатели', 'Ежедневная забота и развитие'],
          ['Специалисты', 'Занятия по расписанию'],
        ].map(([title, text]) => (
          <div className="premium-team-row" key={title}>
            <span><Check size={14} /></span>
            <div><strong>{title}</strong><small>{text}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramsVisual() {
  const groups = [
    { title: 'Младшая', icon: Sprout },
    { title: 'Средняя', icon: Flower2 },
    { title: 'Старшая', icon: Star },
  ];
  return (
    <div className="premium-visual premium-visual-programs">
      <div className="premium-programs-layout">
        <div className="premium-group-stack">
          <span className="premium-card-kicker">Возрастные группы</span>
          {groups.map(({ title, icon: Icon }, index) => (
            <div className="premium-group-card" key={title}>
              <span><Icon size={22} /></span>
              <div><strong>{title}</strong><small>{index === 0 ? 'Мягкое знакомство с режимом' : index === 1 ? 'Общение и самостоятельность' : 'Подготовка к следующему этапу'}</small></div>
            </div>
          ))}
        </div>
        <PhotoFrame src={visualImage.programs.src} alt={visualImage.programs.alt} badge="Развитие через интерес" />
      </div>
      <div className="premium-week-card">
        <span className="premium-card-kicker premium-card-kicker-light">Ритм недели</span>
        <div className="premium-week-days"><b>ПН</b><span>ВТ</span><span>СР</span><span>ЧТ</span><span>ПТ</span></div>
        <p>Гармоничное чередование движения, творчества, познания и общения.</p>
        <div className="premium-week-icons">
          <span><Users size={17} /> Общение</span>
          <span><Music2 size={17} /> Творчество</span>
          <span><BookOpen size={17} /> Познание</span>
          <span><Languages size={17} /> Языки</span>
        </div>
      </div>
    </div>
  );
}

function ParentsVisual() {
  const steps = [
    ['01', 'Экскурсия', 'Знакомимся с пространством'],
    ['02', 'Вопросы', 'Обсуждаем режим и формат'],
    ['03', 'Первые дни', 'Подбираем спокойный старт'],
    ['04', 'Связь', 'Остаёмся на связи с семьёй'],
  ];
  return (
    <div className="premium-visual premium-visual-parents">
      <PhotoFrame src={visualImage.parents.src} alt={visualImage.parents.alt} badge="Спокойное знакомство" />
      <div className="premium-parent-path">
        <span className="premium-card-kicker">Путь семьи</span>
        <h3>Понятно на каждом этапе</h3>
        {steps.map(([number, title, text]) => (
          <div className="premium-parent-step" key={number}>
            <b>{number}</b>
            <div><strong>{title}</strong><small>{text}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnologyVisual() {
  const rows = [
    { icon: CalendarDays, title: 'Посещаемость', state: 'Тестирование' },
    { icon: Bell, title: 'Уведомления', state: 'Подготовлено' },
    { icon: Camera, title: 'Фотоотчёты', state: 'Следующий этап' },
    { icon: CreditCard, title: 'Оплаты', state: 'После пилота' },
  ];
  return (
    <div className="premium-visual premium-visual-technology">
      <div className="premium-tech-orbit premium-tech-orbit-one" />
      <div className="premium-tech-orbit premium-tech-orbit-two" />
      <div className="premium-tech-panel">
        <div className="premium-tech-head">
          <div><span className="premium-card-kicker premium-card-kicker-light">TOTOSHA DIGITAL</span><h3>Единая экосистема</h3></div>
          <span className="premium-tech-shield"><ShieldCheck size={28} /></span>
        </div>
        <div className="premium-tech-status">
          {rows.map(({ icon: Icon, title, state }) => (
            <div className="premium-tech-row" key={title}>
              <span><Icon size={18} /></span>
              <strong>{title}</strong>
              <small>{state}</small>
            </div>
          ))}
        </div>
        <div className="premium-tech-foot"><Check size={16} /> Безопасность и роли проверяются до запуска</div>
      </div>
    </div>
  );
}

function FranchiseVisual() {
  const modules = [
    ['01', 'Бренд', 'Премиальное позиционирование'],
    ['02', 'Запуск', 'Пошаговая операционная модель'],
    ['03', 'Команда', 'Обучение и стандарты'],
    ['04', 'Система', 'Сайт, CRM и приложения'],
  ];
  return (
    <div className="premium-visual premium-visual-franchise">
      <div className="premium-franchise-card">
        <span className="premium-card-kicker">Модель Тотоша</span>
        <h3>Система, а не просто название</h3>
        <div className="premium-franchise-grid">
          {modules.map(([number, title, text]) => (
            <div className="premium-franchise-module" key={number}>
              <b>{number}</b>
              <strong>{title}</strong>
              <small>{text}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="premium-franchise-badge"><Star size={19} /> Партнёрство с едиными стандартами</div>
    </div>
  );
}

function ContactsVisual() {
  const whatsapp = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent('Здравствуйте. Хочу записаться на экскурсию в Тотоша.')}`;
  return (
    <div className="premium-visual premium-visual-contacts">
      <style>{`
        .premium-map-card.premium-map-live::after { display: none; }
        .premium-map-card.premium-map-live { background: #ebe5d8; padding-top: 86px; }
        .premium-map-live iframe { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: calc(100% - 86px); border: 0; }
        .premium-map-summary { position: absolute; z-index: 5; left: 0; right: 0; top: 0; min-height: 86px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 18px; border-bottom: 1px solid rgba(200,155,74,.18); background: #fffdf8; }
        .premium-map-summary strong { display: block; color: #0d1b3a; font-family: var(--font-premium-serif), Georgia, serif; font-size: 22px; }
        .premium-map-summary small { display: block; margin-top: 4px; color: #5f6879; font-size: 9px; }
        .premium-map-open { display: inline-flex; align-items: center; gap: 7px; min-height: 40px; padding: 0 13px; border: 1px solid rgba(200,155,74,.24); border-radius: 14px; color: #0d1b3a; background: #fff; text-decoration: none; font-size: 10px; font-weight: 800; white-space: nowrap; }
        @media (max-width: 720px) { .premium-map-summary { align-items: flex-start; flex-direction: column; min-height: 124px; } .premium-map-card.premium-map-live { padding-top: 124px; } .premium-map-live iframe { height: calc(100% - 124px); } .premium-map-open { width: 100%; justify-content: center; } }
      `}</style>
      <div className="premium-map-card premium-map-live">
        <div className="premium-map-summary">
          <div><strong>Тотоша на карте</strong><small>{TOTOSHA_CONTACTS.address}</small></div>
          <a className="premium-map-open" href={TOTOSHA_CONTACTS.yandexMapUrl} target="_blank" rel="noopener noreferrer">
            Открыть карту <ArrowUpRight size={14} />
          </a>
        </div>
        <iframe
          src={TOTOSHA_CONTACTS.yandexMapEmbedUrl}
          title="Тотоша на карте Астаны"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="premium-contact-concierge">
        <span className="premium-card-kicker">Мы на связи</span>
        <h3>Выберите удобный способ</h3>
        <a href={TOTOSHA_CONTACTS.telUrl}><Phone size={19} /><span><small>Позвонить</small><strong>{TOTOSHA_CONTACTS.phoneDisplay}</strong></span><ArrowUpRight size={16} /></a>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /><span><small>WhatsApp</small><strong>Написать заведующей</strong></span><ArrowUpRight size={16} /></a>
        <a href={TOTOSHA_CONTACTS.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={19} /><span><small>2ГИС</small><strong>Построить маршрут</strong></span><ArrowUpRight size={16} /></a>
        <a href={TOTOSHA_CONTACTS.yandexMapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={19} /><span><small>Яндекс Карты</small><strong>Открыть навигацию</strong></span><ArrowUpRight size={16} /></a>
        <div className="premium-contact-hours"><Clock3 size={17} /> Пн–Пт · 07:30–19:00</div>
      </div>
    </div>
  );
}

export function PremiumVisual({ variant }: { variant: PremiumPageVariant }) {
  if (variant === 'about') return <AboutVisual />;
  if (variant === 'programs') return <ProgramsVisual />;
  if (variant === 'parents') return <ParentsVisual />;
  if (variant === 'technology') return <TechnologyVisual />;
  if (variant === 'franchise') return <FranchiseVisual />;
  return <ContactsVisual />;
}
