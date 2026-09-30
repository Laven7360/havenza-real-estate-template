import { Link } from 'react-router-dom'
import { properties } from '../../data/properties'
import { formatPrice, padIndex } from '../../data/discovery'
import Photo from '../ui/Photo'
import Reveal from '../ui/Reveal'
import { propertyDetailPhotography } from '../../data/photography'

const chapters = [
  { id: 'hz-001', title: 'Above the everyday.', className: 'chapter-sky' },
  { id: 'hz-002', title: 'A quieter kind of city.', className: 'chapter-courtyard' },
  { id: 'hz-006', title: 'Let the outside in.', className: 'chapter-green' },
]

export default function ResidenceChapters() {
  return <section className="residences" aria-labelledby="residences-heading">
    <div className="container residences-heading"><p className="eyebrow">02 / In residence</p><div className="section-heading"><h2 id="residences-heading">Selected<br />residences.</h2><p>Three homes.<br />Three ways to belong.</p></div></div>
    {chapters.map((chapter, index) => {
      const property = properties.find(item => item.id === chapter.id)
      return <article className={`residence-chapter ${chapter.className}`} key={property.id}>
        <div className="chapter-image"><Photo image={index < 2 ? propertyDetailPhotography[property.id] : property.image} /><span className="chapter-number">{padIndex(index + 1)}</span></div>
        <div className="chapter-story"><p className="eyebrow">{property.title}</p><Reveal><h3>{chapter.title}</h3></Reveal><dl className="chapter-facts"><Reveal><dt>Place</dt><dd>{property.location} / {property.state}</dd></Reveal><Reveal><dt>Space</dt><dd>{property.size.toLocaleString('en-MY')} sq ft</dd></Reveal><Reveal><dt>Life</dt><dd>{padIndex(property.bedrooms)} bedrooms / {property.atmosphere}</dd></Reveal><Reveal><dt>Value</dt><dd>{formatPrice(property)}</dd></Reveal></dl><Link to={`/properties/${property.id}`} className="line-link">Explore residence <span aria-hidden="true">↗</span></Link></div>
      </article>
    })}
  </section>
}
