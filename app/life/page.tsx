import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { ArrowDown, Camera, Images, Instagram, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { PremiumFooter } from '../../components/PremiumFooter';
import { PremiumHeader } from '../../components/PremiumHeader';
import { PremiumLifeGallery, PremiumLifeItem } from '../../components/PremiumLifeGallery';
import { TOTOSHA_CONTACTS, TOTOSHA_VERSION } from '../../lib/totoshaConfig';

export const metadata: Metadata = {
  title: 'Жизнь Тотоша — фото детского сада в Астане',
  description: 'Реальные фотографии праздников, занятий и повседневной жизни частного детского сада Тотоша в Астане.',
  alternates: { canonical: '/life' },
};

type CatalogItem = PremiumLifeItem & {
  group?: string;
  holiday?: string;
  description?: string;
};

function readCatalog(): CatalogItem[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'totosha-media', 'catalog.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function timeOf(item: CatalogItem) {
  const time = new Date(item.date || '').getTime();
  return Number.isFinite(time) ? time : 0;
}

function clean(item: CatalogItem): CatalogItem {
  const event = item.event && !item.event.toLowerCase().includes('не определ')
    ? item.event
    : 'Повседневная жизнь Тотоша';
  const category = item.category && !item.category.toLowerCase().includes('не определ')
    ? item.category
    : 'Жизнь детского сада';
  return { ...item, event, category };
}

export default function LifePage() {
  const catalog = readCatalog()
    .map(clean)
    .filter((item) => Boolean(item.src) && !item.src.endsWith('.jpg.jpg'))
    .sort((a, b) => timeOf(b) - timeOf(a));

  const years = [...new Set(catalog.map((item) => item.year))].sort((a, b) => Number(b) - Number(a));
  const events = [...new Set(catalog.map((item) => item.event))];
  const latest = catalog.slice(0, 3);
  const initialYear = years[0] || '';
  const whatsappHref = `${TOTOSHA_CONTACTS.whatsappUrl}?text=${encodeURIComponent('Здравствуйте. Хочу узнать подробнее о детском саде Тотоша и записаться на экскурсию.')}`;

  return (
    <main className="premium-site premium-life-page">
      <PremiumHeader />

      <section className="premium-life-hero">
        <div className="premium-shell premium-life-hero-grid">
          <div className="premium-life-hero-copy">
            <div className="premium-eyebrow"><Sparkles size={16} /> Жизнь Тотоша</div>
            <h1>Счастливые моменты настоящего детства</h1>
            <p>
              Праздники, занятия, творчество и обычные тёплые дни. Здесь собраны реальные фотографии детей и атмосферы нашего сада.
            </p>
            <div className="premium-home-actions">
              <a className="premium-btn premium-btn-navy" href="#archive">
                Смотреть фото <ArrowDown size={18} />
              </a>
              <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.instagramUrl} target="_blank" rel="noopener noreferrer">
                <Instagram size={17} /> Instagram
              </a>
            </div>
            <div className="premium-life-hero-stats">
              <div><strong>{catalog.length}</strong><span>фотографий</span></div>
              <div><strong>{years.length}</strong><span>лет архива</span></div>
              <div><strong>{events.length}</strong><span>событий</span></div>
            </div>
            <small className="premium-life-release">TOTOSHA {TOTOSHA_VERSION}</small>
          </div>

          <div className="premium-life-hero-visual" aria-label="Свежие фотографии Тотоша">
            {latest[0] && (
              <div className="premium-life-hero-main">
                <img src={latest[0].src} alt={latest[0].event} loading="eager" decoding="async" draggable={false} />
                <span><Camera size={16} /> {latest[0].event}</span>
              </div>
            )}
            <div className="premium-life-hero-side">
              {latest.slice(1, 3).map((item) => (
                <div key={item.id}>
                  <img src={item.src} alt={item.event} loading="eager" decoding="async" draggable={false} />
                </div>
              ))}
            </div>
            <div className="premium-life-hero-note">
              <Images size={21} />
              <div><strong>Реальная жизнь сада</strong><small>Без постановочных обещаний</small></div>
            </div>
          </div>
        </div>
      </section>

      <PremiumLifeGallery items={catalog} initialYear={initialYear} />

      <section className="premium-section premium-life-cta-section">
        <div className="premium-shell premium-inner-cta">
          <div>
            <div className="premium-card-kicker premium-card-kicker-light">Первое знакомство</div>
            <h2>Лучше один раз увидеть Тотоша лично</h2>
            <p>Приходите на экскурсию: покажем пространство, познакомим с режимом и спокойно ответим на вопросы семьи.</p>
          </div>
          <div className="premium-inner-cta-actions">
            <a className="premium-btn premium-btn-gold" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> Написать в WhatsApp
            </a>
            <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}>
              <Phone size={17} /> Позвонить
            </a>
          </div>
        </div>
      </section>

      <PremiumFooter />
      <div className="premium-mobile-dock">
        <a className="premium-btn premium-btn-navy" href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp</a>
        <a className="premium-btn premium-btn-gold" href={TOTOSHA_CONTACTS.telUrl}><Phone size={17} /> Позвонить</a>
      </div>
    </main>
  );
}
