import catalog from '@/public/totosha-media/catalog.json';

export default function MediaTestPage() {
  const items = catalog as Array<{id:string;year:string;event:string;category:string;group:string;date:string;src:string;title:string}>;
  const years = Array.from(new Set(items.map(x => x.year))).sort();
  const events = Array.from(new Set(items.map(x => x.event))).slice(0, 18);
  return (
    <main className="media-page">
      <section className="media-hero">
        <a className="media-back" href="/">← На сайт Тотоша</a>
        <div className="eyebrow">Медиаархив Тотоша</div>
        <h1>Тестовый раздел фотографий</h1>
        <p>Фотографии подключены отдельным безопасным разделом, чтобы не ломать структуру основного сайта. Это первый проверочный слой: годы, события, даты и защита от прямого скачивания.</p>
        <div className="media-stats"><div><b>{items.length}</b><span>фото в тесте</span></div><div><b>{years.length}</b><span>лет архива</span></div><div><b>{events.length}</b><span>событий</span></div></div>
      </section>
      <section className="media-filters"><div><h2>Годы</h2><div className="media-pills">{years.map(y => <a key={y} href={`#year-${y}`}>{y}</a>)}</div></div><div><h2>События</h2><div className="media-pills">{events.map(e => <span key={e}>{e}</span>)}</div></div></section>
      {years.map(year => { const yearItems = items.filter(x => x.year === year); const yearEvents = Array.from(new Set(yearItems.map(x => x.event))); return (<section className="media-year" id={`year-${year}`} key={year}><div className="media-year-title"><div><div className="eyebrow">{year}</div><h2>{year} год</h2></div><span>{yearItems.length} фото</span></div>{yearEvents.map(event => { const eventItems = yearItems.filter(x => x.event === event); return (<div className="media-event" key={event}><h3>{event}</h3><div className="media-grid">{eventItems.map(photo => (<figure className="media-card protected-photo-wrap" key={photo.id}><img src={photo.src} alt={photo.title} draggable={false} loading="lazy" /><figcaption><b>{photo.title}</b><span>{photo.category} · {photo.group}</span></figcaption></figure>))}</div></div>); })}</section>); })}
    </main>
  );
}
