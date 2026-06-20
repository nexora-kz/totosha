import fs from 'fs';
import path from 'path';
import { TOTOSHA_BUILD_DATE, TOTOSHA_DEPLOY_LABEL, TOTOSHA_VERSION } from '../../lib/totoshaConfig';

type MediaItem = {
  id: string;
  year: string;
  event: string;
  category: string;
  group?: string;
  src: string;
  date?: string;
  holiday?: string;
  description?: string;
};

function readCatalog(): MediaItem[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'totosha-media', 'catalog.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function timeOf(item: MediaItem) {
  const time = new Date(item.date || '').getTime();
  return Number.isFinite(time) ? time : 0;
}

function latestTime(items: MediaItem[]) {
  return Math.max(...items.map(timeOf), 0);
}

function clean(item: MediaItem): MediaItem {
  const event = item.event && !item.event.toLowerCase().includes('не определ') ? item.event : 'Повседневная жизнь Тотоша';
  const category = item.category && !item.category.toLowerCase().includes('не определ') ? item.category : 'Жизнь детского сада';
  const group = item.group && !item.group.toLowerCase().includes('не определ') ? item.group : 'Группа уточняется';
  return { ...item, event, category, group };
}

function eventIntro(event: string) {
  if (event.includes('8 Марта')) return 'Дети поздравляют мам, дарят тёплые эмоции, улыбки и праздничное настроение.';
  if (event.includes('Наурыз')) return 'Праздник весны, традиций, национального колорита и радостных детских выступлений.';
  if (event.includes('Новый год')) return 'Волшебная атмосфера, утренники, подарки и самые яркие моменты детства.';
  if (event.includes('Выпускной')) return 'Тёплые воспоминания, первые достижения и важный шаг к новому этапу.';
  if (event.includes('День защиты детей')) return 'День радости, игр, внимания и счастливых улыбок наших воспитанников.';
  if (event.includes('Осенний')) return 'Яркий сезонный праздник с творчеством, костюмами и уютной атмосферой.';
  return 'Сохраняем живые моменты, занятия, эмоции и атмосферу детского сада Тотоша.';
}

function eventEmoji(event: string) {
  if (event.includes('8 Марта')) return '🌸';
  if (event.includes('Наурыз')) return '🌿';
  if (event.includes('Новый год')) return '🎄';
  if (event.includes('Выпускной')) return '🎓';
  if (event.includes('День защиты детей')) return '🎈';
  if (event.includes('Осенний')) return '🍂';
  return '✨';
}

export default function MediaTestPage() {
  const catalog = readCatalog()
    .map(clean)
    .filter((item) => Boolean(item.src) && !item.src.endsWith('.jpg.jpg'))
    .sort((a, b) => timeOf(b) - timeOf(a));

  const years = [...new Set(catalog.map((x) => x.year || 'Год уточняется'))].sort((a, b) => {
    const numA = Number(a);
    const numB = Number(b);
    if (Number.isFinite(numA) && Number.isFinite(numB)) return numB - numA;
    return String(b).localeCompare(String(a), 'ru');
  });

  const eventsAll = [...new Set(catalog.map((x) => x.event))];
  const newest = catalog.slice(0, 6);
  const march8Count = catalog.filter((x) => x.event.includes('8 Марта')).length;

  return (
    <main className="life-page">
      <div className="version-badge" title="NEXORA automated release marker">
        <strong>TOTOSHA {TOTOSHA_VERSION}</strong>
        <span>Build {TOTOSHA_BUILD_DATE}</span>
        <em>{TOTOSHA_DEPLOY_LABEL}</em>
      </div>

      <section className="life-hero">
        <a className="life-back" href="/">← На сайт Тотоша</a>
        <div className="eyebrow">Медиаархив Тотоша</div>
        <h1>Жизнь Тотоша</h1>
        <p>
          Настоящие моменты детского сада: праздники, занятия, улыбки, развитие и заботливая атмосфера.
          Самые свежие фотографии отображаются первыми.
        </p>
        <div className="life-hero-grid">
          <div className="life-feature">
            {newest[0] && <img src={newest[0].src} alt={newest[0].event} draggable={false} />}
            <div><span>{newest[0]?.event || 'Жизнь Тотоша'}</span><b>Сохраняем важные моменты детства</b></div>
          </div>
          <div className="life-stats">
            <div><b>{catalog.length}</b><span>фото в архиве</span></div>
            <div><b>{years.length}</b><span>лет архива</span></div>
            <div><b>{eventsAll.length}</b><span>событий</span></div>
            <div><b>{march8Count}</b><span>8 Марта</span></div>
          </div>
        </div>
      </section>

      <section className="life-latest">
        <div className="section-head">
          <div><div className="eyebrow">Последние моменты</div><h2>Свежие фото из жизни сада</h2></div>
          <a href="#years">Смотреть по годам ↓</a>
        </div>
        <div className="latest-strip">
          {newest.slice(0, 3).map((item, index) => (
            <a className={`latest-card latest-card-${index}`} href={`#year-${item.year}`} key={item.id}>
              <img src={item.src} alt={item.event} draggable={false} />
              <span>{item.event}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="life-years" id="years">
        <h2>Годы</h2>
        <div className="life-pills">{years.map((year) => <a key={year} href={`#year-${year}`}>{year}</a>)}</div>
      </section>

      {years.map((year) => {
        const yearItems = catalog.filter((x) => (x.year || 'Год уточняется') === year);
        const events = [...new Set(yearItems.map((x) => x.event))].sort((a, b) => {
          const aItems = yearItems.filter((x) => x.event === a);
          const bItems = yearItems.filter((x) => x.event === b);
          return latestTime(bItems) - latestTime(aItems);
        });

        return (
          <section className="life-year" id={`year-${year}`} key={year}>
            <div className="life-year-title"><span>{year}</span><small>{yearItems.length} фото</small></div>
            {events.map((event) => {
              const items = yearItems.filter((x) => x.event === event).sort((a, b) => timeOf(b) - timeOf(a));
              const cover = items[0];
              const visible = items.slice(0, 24);
              return (
                <article className="event-showcase" key={event}>
                  <div className="event-cover">
                    {cover && <img src={cover.src} alt={event} draggable={false} />}
                    <div className="event-cover-overlay">
                      <span>{eventEmoji(event)}</span>
                      <h3>{event}</h3>
                      <p>{eventIntro(event)}</p>
                      <small>{items.length} фото события</small>
                    </div>
                  </div>
                  <div className="event-gallery">
                    {visible.map((item, index) => (
                      <div className={`event-photo event-photo-${index % 7}`} key={item.id}>
                        <img src={item.src} alt={item.event} draggable={false} />
                        <span className="watermark">Тотоша</span>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>
        );
      })}
    </main>
  );
}
