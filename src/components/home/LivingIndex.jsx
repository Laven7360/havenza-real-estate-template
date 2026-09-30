import { useState } from 'react'
import { Link } from 'react-router-dom'
import { livingIndex, formatPrice, padIndex } from '../../data/discovery'
import Photo from '../ui/Photo'
import PhotoSwap from '../ui/PhotoSwap'

export default function LivingIndex() {
  const [active, setActive] = useState(0)
  const selected = livingIndex[active].property
  return <section className="living-index container" aria-labelledby="living-heading"><p className="eyebrow">04 / Neighbourhood notes</p><div className="section-heading"><h2 id="living-heading">The living<br />index.</h2><p>Places, considered<br />by how they feel.</p></div>
    <div className="living-layout"><div className="living-visual"><PhotoSwap items={livingIndex.map(item => item.property.image)} active={active} /><div className="living-caption"><span key={active} className="living-count">{padIndex(active + 1)}</span><p>{selected.title}<span>{selected.bedrooms} bedrooms · {selected.size.toLocaleString('en-MY')} sq ft</span></p></div></div>
      <ol className="living-rows">{livingIndex.map((item, index) => <li key={item.id} className={active === index ? 'is-active' : ''}><button type="button" onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(index) }} onFocus={() => setActive(index)} onClick={() => setActive(index)} aria-pressed={active === index}><span className="row-index">{padIndex(index + 1)}</span><span className="row-place">{item.property.location}<span>{item.feeling}</span></span><span className="row-arrow" aria-hidden="true">↗</span></button><div className="living-row-detail"><div className="living-mobile-image">{active === index && <Photo image={item.property.image} />}</div><div className="living-row-meta"><span>{formatPrice(item.property)}</span><Link to={`/properties/${item.id}`} aria-label={`View ${item.property.title}`}>View residence ↗</Link></div></div></li>)}</ol></div>
  </section>
}
