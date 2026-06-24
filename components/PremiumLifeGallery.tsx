'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Camera, ChevronDown, Sparkles, X } from 'lucide-react';

export type PremiumLifeItem = {
  id: string;
  year: string;
  event: string;
  category: string;
  src: string;
  date?: string;
};

const PAGE_SIZE = 12;
const ALL_EVENTS = 'Все события';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function PremiumLifeGallery({
  items,
  initialYear,
}: {
  items: PremiumLifeItem[];
  initialYear: string;
}) {
  const years = useMemo(
    () => [...new Set(items.map((item) => item.year))].sort((a, b) => Number(b) - Number(a)),
    [items],
  );
  const [year, setYear] = useState(initialYear || years[0] || '');
  const [event, setEvent] = useState(ALL_EVENTS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<PremiumLifeItem | null>(null);

  const yearItems = useMemo(() => items.filter((item) => item.year === year), [items, year]);
  const events = useMemo(
    () => [ALL_EVENTS, ...new Set(yearItems.map((item) => item.event))],
    [yearItems],
  );
  const filtered = useMemo(
    () => yearItems.filter((item) => event === ALL_EVENTS || item.event === event),
    [yearItems, event],
  );
  const visible = filtered.slice(0, visibleCount);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', close);
    };
  }, [selected]);

  function changeYear(nextYear: string) {
    setYear(nextYear);
    setEvent(ALL_EVENTS);
    setVisibleCount(PAGE_SIZE);
  }

  function changeEvent(nextEvent: string) {
    setEvent(nextEvent);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <section className="premium-life-browser" id="archive">
      <div className="premium-shell">
        <div className="premium-life-browser-head">
          <div>
            <div className="premium-eyebrow"><Camera size={16} /> Фотоархив</div>
            <h2>Моменты, которые хочется сохранить</h2>
            <p>Выберите год и событие. Сначала показываем свежие фотографии, остальные загружаются по запросу.</p>
          </div>
          <div className="premium-life-counter">
            <strong>{filtered.length}</strong>
            <span>фото в выбранном разделе</span>
          </div>
        </div>

        <div className="premium-life-filter-panel" aria-label="Фильтры фотоархива">
          <div className="premium-life-filter-group">
            <span><CalendarDays size={16} /> Год</span>
            <div className="premium-life-year-tabs" role="tablist" aria-label="Годы фотоархива">
              {years.map((itemYear) => (
                <button
                  key={itemYear}
                  type="button"
                  role="tab"
                  aria-selected={year === itemYear}
                  className={year === itemYear ? 'is-active' : undefined}
                  onClick={() => changeYear(itemYear)}
                >
                  {itemYear}
                </button>
              ))}
            </div>
          </div>

          <label className="premium-life-event-select">
            <span><Sparkles size={16} /> Событие</span>
            <div>
              <select value={event} onChange={(change) => changeEvent(change.target.value)}>
                {events.map((eventName) => <option value={eventName} key={eventName}>{eventName}</option>)}
              </select>
              <ChevronDown size={17} aria-hidden="true" />
            </div>
          </label>
        </div>

        {visible.length > 0 ? (
          <>
            <div className="premium-life-grid">
              {visible.map((item, index) => (
                <button
                  className={`premium-life-photo-card premium-life-photo-card-${index % 7}`}
                  type="button"
                  key={item.id}
                  onClick={() => setSelected(item)}
                  aria-label={`Открыть фотографию: ${item.event}`}
                  style={{ contentVisibility: 'visible' }}
                >
                  <img
                    src={item.src}
                    alt={item.event}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                  <span className="premium-life-photo-shade" />
                  <span className="premium-life-photo-meta">
                    <strong>{item.event}</strong>
                    <small>{formatDate(item.date)}</small>
                  </span>
                  <span className="premium-life-watermark">Тотоша</span>
                </button>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="premium-life-more">
                <button
                  type="button"
                  className="premium-btn premium-btn-ghost"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  Показать ещё {Math.min(PAGE_SIZE, filtered.length - visibleCount)} фото
                  <ChevronDown size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="premium-life-empty">
            <Camera size={28} />
            <h3>Фотографии готовятся</h3>
            <p>Для выбранного фильтра пока нет опубликованных материалов.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="premium-life-lightbox" role="dialog" aria-modal="true" aria-label={selected.event} onClick={() => setSelected(null)}>
          <button type="button" className="premium-life-lightbox-close" onClick={() => setSelected(null)} aria-label="Закрыть фотографию">
            <X size={23} />
          </button>
          <figure onClick={(click) => click.stopPropagation()}>
            <img src={selected.src} alt={selected.event} draggable={false} />
            <figcaption>
              <strong>{selected.event}</strong>
              <span>{formatDate(selected.date)}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
