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

export default function MediaTestPage(){

let catalog:MediaItem[]=[]

try{
  const filePath=path.join(process.cwd(),'public','totosha-media','catalog.json')
  catalog=JSON.parse(fs.readFileSync(filePath,'utf8'))
}catch{
  catalog=[]
}

const years=[...new Set(catalog.map(x=>x.year))].sort()
const march8Count=catalog.filter(x=>String(x.event).includes('8 Марта')).length

return(
<main style={{padding:'40px',maxWidth:'1400px',margin:'0 auto'}}>
  <a href="/" style={{display:'inline-block',marginBottom:'20px',fontWeight:800}}>← На сайт Тотоша</a>
  <h1>Медиа Тотоша</h1>
  <p>Фото подключены отдельным разделом и не ломают основной сайт.</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'16px',margin:'24px 0'}}>
    <div style={{background:'#fff',border:'1px solid #eee',borderRadius:'18px',padding:'18px'}}><b>{catalog.length}</b><br/>фото в тесте</div>
    <div style={{background:'#fff',border:'1px solid #eee',borderRadius:'18px',padding:'18px'}}><b>{years.length}</b><br/>года</div>
    <div style={{background:'#fff',border:'1px solid #eee',borderRadius:'18px',padding:'18px'}}><b>{march8Count}</b><br/>8 Марта</div>
  </div>

  {years.map(year=>{
    const items=catalog.filter(x=>x.year===year)
    const events=[...new Set(items.map(x=>x.event))].sort()
    return(
      <section key={year} style={{marginTop:'38px'}}>
        <h2>{year}</h2>
        {events.map(event=>{
          const eventItems=items.filter(x=>x.event===event)
          return(
            <div key={event} style={{marginTop:'24px'}}>
              <h3>{event}</h3>
              {event.includes('8 Марта') && <p style={{color:'#667085'}}>Международный женский день — дети поздравляют мам.</p>}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'20px'}}>
                {eventItems.map(item=>(
                  <div key={item.id} style={{position:'relative',border:'1px solid #eee',padding:'10px',borderRadius:'18px',background:'#fff',overflow:'hidden'}}>
                    <img src={item.src} alt={item.event} draggable={false} style={{width:'100%',height:'210px',objectFit:'cover',borderRadius:'14px',userSelect:'none'}}/>
                    <div style={{position:'absolute',right:'16px',bottom:'58px',background:'rgba(255,255,255,.8)',padding:'5px 9px',borderRadius:'999px',fontWeight:800,fontSize:'12px'}}>Тотоша</div>
                    <div style={{padding:'10px 2px 4px'}}>
                      <b>{item.event}</b>
                      <div style={{color:'#667085',fontSize:'14px'}}>{item.group || 'Группа не определена'}</div>
                    </div>
                  </div>
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
