import { useState } from 'react'
import { Link } from 'react-router-dom'
import PhotoSwap from '../ui/PhotoSwap'
import { atlasProperties, formatPrice, padIndex } from '../../data/discovery'

export default function PropertyAtlas() {
  const [active, setActive] = useState(2)
  const property = atlasProperties[active]
  return <section id="property-atlas" className="property-atlas section-dark" aria-labelledby="atlas-heading">
    <div className="container">
      <div className="section-topline eyebrow"><span>01 / Discovery</span><span>Malaysia, in perspective</span></div>
      <div className="section-heading"><h2 id="atlas-heading">The property<br /><span className="text-offset">atlas.</span></h2><p>Explore homes through place.<br />Find a different point of view.</p></div>
      <div className="atlas-view" id="atlas-residence">
        <div className="atlas-visual"><PhotoSwap items={atlasProperties.map(item => item.image)} active={active} /><span className="image-stamp eyebrow">{padIndex(active + 1)} / {property.location}</span></div>
        <div className="atlas-info" aria-live="polite" aria-atomic="true"><div key={property.id} className="atlas-info-inner"><p className="eyebrow">{property.state} / For {property.purpose === 'sale' ? 'sale' : 'rent'}</p><h3>{property.title}</h3><p className="atlas-location">{property.location}</p><p className="atlas-price">{formatPrice(property)}</p><dl className="property-facts"><div><dt>Bed</dt><dd>{padIndex(property.bedrooms)}</dd></div><div><dt>Bath</dt><dd>{padIndex(property.bathrooms)}</dd></div><div><dt>Sq ft</dt><dd>{property.size.toLocaleString('en-MY')}</dd></div></dl><Link className="line-link" to={`/properties/${property.id}`}>View residence <span aria-hidden="true">↗</span></Link></div></div>
      </div>
      <div className="atlas-navigator" role="group" aria-label="Choose a location">
        {atlasProperties.map((item, index) => <button key={item.id} type="button" aria-pressed={active === index} aria-controls="atlas-residence" onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(index) }} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>{padIndex(index + 1)}</span>{item.location}</button>)}
      </div>
      <p className="atlas-disclosure">Fictional residences. Photography is illustrative.</p>
    </div>
  </section>
}
