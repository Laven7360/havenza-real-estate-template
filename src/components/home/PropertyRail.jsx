import { Link } from 'react-router-dom'
import { properties } from '../../data/properties'
import { formatPrice, padIndex } from '../../data/discovery'
import Photo from '../ui/Photo'
import usePropertyRail from '../../hooks/usePropertyRail'
import { propertyDetailPhotography } from '../../data/photography'

const newest = [...properties].reverse().slice(0, 5)

export default function PropertyRail() {
  const { railRef, active, browse, handlers } = usePropertyRail(newest.length)
  return <section className="property-rail" aria-labelledby="new-heading">
    <div className="container">
      <p className="eyebrow">05 / Fresh perspectives</p>
      <div className="section-heading"><h2 id="new-heading">New to<br />Havenza.</h2><p>New places.<br />New possibilities.</p></div>
    </div>
    <div className="rail-browser">
      <div id="new-residences" ref={railRef} className="rail-track" role="region" aria-label="New Havenza properties" aria-describedby="rail-instructions" tabIndex={0} {...handlers}>
        {newest.map((property, index) => <Link key={property.id} className="rail-item" to={`/properties/${property.id}`} draggable={false}>
          <div className="rail-image">
            <Photo image={propertyDetailPhotography[property.id] || property.image} />
            <span className="rail-index">{padIndex(index + 1)}</span>
            <span className="rail-arrow" aria-hidden="true">↗</span>
            <span className="rail-hover-facts">{padIndex(property.bedrooms)} bed <span> / </span>{padIndex(property.bathrooms)} bath <span> / </span>{property.size.toLocaleString('en-MY')} sq ft</span>
          </div>
          <p className="eyebrow">{property.location} / {property.state}</p>
          <h3>{property.title}</h3>
          <p className="rail-price">{formatPrice(property)}</p>
        </Link>)}
      </div>
      <div className="rail-toolbar container" role="group" aria-label="Property browsing controls">
        <p className="rail-progress" role="status" aria-live="polite" aria-atomic="true"><span className="sr-only">Property </span>{padIndex(active + 1)} <span>/ {padIndex(newest.length)}</span></p>
        <span className="rail-gesture-hint" aria-hidden="true"><span className="desktop-gesture">Drag / scroll</span><span className="touch-gesture">Swipe to explore</span> →</span>
        <div className="rail-controls"><button type="button" onClick={() => browse(-1)} disabled={active === 0} aria-label="Previous property" aria-controls="new-residences">←</button><button type="button" onClick={() => browse(1)} disabled={active === newest.length - 1} aria-label="Next property" aria-controls="new-residences">→</button></div>
      </div>
      <p id="rail-instructions" className="sr-only">Use the previous and next buttons, swipe, or drag to browse. When this gallery is focused, use Left and Right arrow keys, Home for the first property, or End for the last. Tab reaches each residence link.</p>
    </div>
  </section>
}
