import fs from 'fs'
import path from 'path'

type MediaItem = {
  id:string
  year:string
  event:string
  category:string
  group?:string
  src:string
  date?:string
  holiday?:string
  description?:string
}

function readCatalog(): MediaItem[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'totosha-media', 'catalog.json')
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return []
  }
}

function timeOf(item: MediaItem) {
  const raw = item.date || ''
  const time = new Date(raw).getTime()
  return Number.isFinite(time) ? time : 0
}

function latestTime(items: MediaItem[]) {
  return Math.max(...items.map(timeOf), 0)
}

export default function MediaTestPage() {
  const catalog = readCatalog()
    .map((item) => ({
      ...item,
      event: item.event && !item.event.toLowerCase().includes('не определ') ? item.event : 'Повседневная жизнь Тотоша',
      category: item.category && !item.category.toLowerCase().includes('не определ') ? item.category : 'Жизнь детского сада',
      group: item.group && !item.group.toLowerCase().includes('не определ') ? item.group : 'Группа уточняется',
    }))
    .sort((a, b) => timeOf(b) - timeOf(a))

  const years = [...new Set(catalog.map((x) => x.year || 'Год уточняется'))]
    .sort((a, b) => {
      const numA = Number(a)
      const numB = Number(b)
      if (Number.isFinite(numA) && Number.isFinite(numB)) return numB - numA
      return String(b).localeCompare(String(a), 'ru')
    })

  const eventCount = new Set(catalog.map((x) => x.event)).size
  const march8Count = catalog.filter((x) => x.event.includes('8 Марта')).length

  return (
    <main className="media-page">
      <section className="media-hero">
        <a className="media-back" href="/">← На сайт Тотоша</a>
        <div className="eyebrow">Медиаархив Тотоша</div>
        <h1>Жизнь Тотоша</h1>
        <p>
          Самые свежие фотографии отображаются первыми. Архив сгруппирован по годам,
          событиям и направлениям, не затрагивая структуру основного сайта.
        </p>
        <div className="media-stats">
          <div><b>{catalog.length}</b><span>фото в тесте</span></div>
          <div><b>{years.length}</b><span>года</span></div>
          <div><b>{eventCount}</b><span>событий</span></div>
          <div><b>{march8Count}</b><span>8 Марта</span></div>
        </div>
      </section>

      <section className="media-filters">
        <h2>Годы</h2>
        <div className="media-pills">
          {years.map((year) => <a key={year} href={`#year-${year}`}>{year}</a>)}
        </div>
      </section>

      {years.map((year) => {
        const yearItems = catalog.filter((x) => (x.year || 'Год уточняется') === year)

        const events = [...new Set(yearItems.map((x) => x.event))]
          .sort((a, b) => {
            const aItems = yearItems.filter((x) => x.event === a)
            const bItems = yearItems.filter((x) => x.event === b)
            return latestTime(bItems) - latestTime(aItems)
          })

        return (
          <section className="media-year" id={`year-${year}`} key={year}>
            <h2>{year}</h2>
            {events.map((event) => {
              const items = yearItems
                .filter((x) => x.event === event)
                .sort((a, b) => timeOf(b) - timeOf(a))

              const description = items[0]?.description

              return (
                <div className="media-event" key={event}>
                  <h3>{event}</h3>
                  {description && <p>{description}</p>}
                  <div className="media-grid">
                    {items.map((item) => (
                      <article className="media-card" key={item.id}>
                        <div className="photo-protected">
                          <img src={item.src} alt={item.event} draggable={false} />
                          <span className="watermark">Тотоша</span>
                        </div>
                        <div className="media-meta">
                          <b>{item.event}</b>
                          <span>{item.group || 'Группа уточняется'}</span>
                          <small>{item.date || item.category}</small>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </main>
  )
}
