import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

type PremiumMapProps = {
  compact?: boolean;
};

export function PremiumMap({ compact = false }: PremiumMapProps) {
  return (
    <section className={`premium-map-card ${compact ? 'is-compact' : ''}`} aria-label="Карта и маршрут до детского сада Тотоша">
      <style>{`
        .premium-map-card{margin-top:28px;overflow:hidden;border:1px solid rgba(200,155,74,.24);border-radius:32px;background:#fffdf8;box-shadow:0 22px 60px rgba(36,31,22,.08)}
        .premium-map-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;padding:28px 30px 22px}
        .premium-map-title{display:flex;align-items:flex-start;gap:14px;min-width:0}
        .premium-map-icon{display:grid;place-items:center;flex:0 0 auto;width:46px;height:46px;border-radius:16px;color:#8f6829;background:linear-gradient(145deg,#f8e8bc,#d2a758)}
        .premium-map-title h3{margin:0;color:#0d1b3a;font-family:var(--font-premium-serif),Georgia,serif;font-size:clamp(24px,2.2vw,34px);line-height:1.05}
        .premium-map-title p{margin:8px 0 0;color:#5f6879;font-size:15px;line-height:1.55}
        .premium-map-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px}
        .premium-map-action{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 16px;border:1px solid rgba(13,27,58,.14);border-radius:14px;color:#0d1b3a;background:#fff;text-decoration:none;font-size:14px;font-weight:750;transition:.2s ease}
        .premium-map-action:hover{transform:translateY(-1px);border-color:rgba(200,155,74,.5);box-shadow:0 10px 24px rgba(36,31,22,.08)}
        .premium-map-action.primary{border-color:#0d1b3a;color:#fff;background:#0d1b3a}
        .premium-map-frame{position:relative;height:430px;background:#f4ead8}
        .premium-map-frame iframe{display:block;width:100%;height:100%;border:0}
        .premium-map-card.is-compact .premium-map-frame{height:360px}
        @media(max-width:820px){.premium-map-head{flex-direction:column;padding:24px 20px 18px}.premium-map-actions{justify-content:flex-start;width:100%}.premium-map-action{flex:1 1 180px}.premium-map-frame,.premium-map-card.is-compact .premium-map-frame{height:340px}}
      `}</style>

      <div className="premium-map-head">
        <div className="premium-map-title">
          <span className="premium-map-icon"><MapPin size={22} /></span>
          <div>
            <h3>Проложить маршрут до Тотоша</h3>
            <p>{TOTOSHA_CONTACTS.address}<br />Пн–Пт · 07:30–19:00</p>
          </div>
        </div>
        <div className="premium-map-actions">
          <a className="premium-map-action primary" href={TOTOSHA_CONTACTS.mapUrl} target="_blank" rel="noopener noreferrer">
            <Navigation size={17} /> Открыть в 2ГИС
          </a>
          <a className="premium-map-action" href={TOTOSHA_CONTACTS.yandexMapUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} /> Яндекс Карты
          </a>
        </div>
      </div>

      <div className="premium-map-frame">
        <iframe
          src={TOTOSHA_CONTACTS.yandexMapEmbedUrl}
          title="Интерактивная карта детского сада Тотоша"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
