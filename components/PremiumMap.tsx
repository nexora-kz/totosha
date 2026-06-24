'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, LoaderCircle, MapPin, Navigation, Phone } from 'lucide-react';
import { TOTOSHA_CONTACTS } from '../lib/totoshaConfig';

type PremiumMapProps = {
  compact?: boolean;
};

export function PremiumMap({ compact = false }: PremiumMapProps) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className={`premium-map-card ${compact ? 'is-compact' : ''}`} aria-label="Карта и маршрут до детского сада Тотоша">
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

      <div className={`premium-map-frame ${loaded ? 'is-loaded' : ''}`}>
        <iframe
          src={TOTOSHA_CONTACTS.yandexMapEmbedUrl}
          title="Интерактивная карта детского сада Тотоша"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <div className="premium-map-loader" aria-live="polite">
            <LoaderCircle size={28} className="premium-map-spinner" />
            <strong>{timedOut ? 'Карта загружается дольше обычного' : 'Загружаем карту'}</strong>
            <p>Адрес уже доступен. Маршрут можно открыть напрямую в приложении карт.</p>
            <div className="premium-map-loader-actions">
              <a className="premium-btn premium-btn-navy" href={TOTOSHA_CONTACTS.mapUrl} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> 2ГИС</a>
              <a className="premium-btn premium-btn-ghost" href={TOTOSHA_CONTACTS.telUrl}><Phone size={16} /> Позвонить</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
