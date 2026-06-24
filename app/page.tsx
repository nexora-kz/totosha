'use client';

import {
  ArrowUpRight,
  Baby,
  BookOpen,
  CalendarDays,
  Camera,
  Clock3,
  CreditCard,
  HeartHandshake,
  Languages,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShieldCheck,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Users,
} from 'lucide-react';
import { PremiumFooter } from '../components/PremiumFooter';
import { PremiumHeader } from '../components/PremiumHeader';
import { PremiumLeadForm } from '../components/PremiumLeadForm';
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

function whatsappUrl(text: string) {
  return `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const analyticsWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, ...payload });
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
              <a className="premium-btn premium-btn-navy" href="#home-lead" onClick={() => track('premium_hero_form')}>
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

      <section className="premium-section premium-section-paper" id="home-lead">
        <div className="premium-shell">
          <div className="premium-contact-section">
            <div className="premium-contact-copy">
              <div className="premium-card-kicker premium-card-kicker-light">Контакты</div>
              <h2>Будем рады познакомиться</h2>
              <p>Оставьте заявку, позвоните или напишите в WhatsApp. Экскурсия не обязывает к зачислению.</p>
              <div className="premium-contact-list">
                <a href={TOTOSHA_CONTACTS.telUrl}><span><Phone size={18} /></span>{TOTOSHA_CONTACTS.phoneDisplay}</a>
                <a href={TOTOSHA_CONTACTS.mapUrl} target="_blank" rel="noopener noreferrer"><span><MapPin size={18} /></span>{TOTOSHA_CONTACTS.address}</a>
                <div><span><Clock3 size={18} /></span>Пн–Пт · 07:30–19:00</div>
              </div>
            </div>
            <PremiumLeadForm
              title="Записаться на экскурсию"
              description="Телефон в поле приведён только как пример формата. Введите свой номер."
              defaultIntent="Записаться на экскурсию"
              intentOptions={['Записаться на экскурсию', 'Узнать подходящую группу', 'Уточнить формат посещения', 'Получить консультацию']}
              source="totoshakids.kz home"
            />
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
