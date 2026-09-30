import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { properties } from '../data/properties'
import { formatPrice, lifestyles, padIndex } from '../data/discovery'
import { atlasReturnPath, nextResidence, resolveResidence } from '../data/residenceDossier'
import useSavedProperties from '../hooks/useSavedProperties'
import Photo from '../components/ui/Photo'
import ImageViewer from '../components/residence/ImageViewer'
import EnquiryDialog from '../components/residence/EnquiryDialog'
import '../styles/residence.css'

function SaveResidence({ property }) {
  const { savedIds, toggleSaved } = useSavedProperties()
  const saved = savedIds.includes(property.id)
  return <button type="button" className="dossier-save" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${property.title}`} onClick={() => toggleSaved(property.id)}>{saved ? 'Saved ✓' : 'Save +'}</button>
}

function ResidenceDossier({ property, atlasFrom }) {
  const [viewer, setViewer] = useState(null)
  const [enquiry, setEnquiry] = useState(false)
  const index = properties.findIndex(item => item.id === property.id)
  const next = nextResidence(property)
  const matches = lifestyles.filter(lifestyle => property.lifestyles.includes(lifestyle.id))
  const purpose = property.purpose === 'sale' ? 'For sale' : 'For rent'
  const facts = [
    { label: 'Bedrooms', value: padIndex(property.bedrooms) },
    { label: 'Bathrooms', value: padIndex(property.bathrooms) },
    { label: 'Square feet', value: property.size.toLocaleString('en-MY') },
    { label: 'Property type', value: property.type },
    { label: 'Purpose', value: purpose },
  ]
  return <article className="residence-dossier">
    <header className="dossier-cover">
      <Photo image={property.image} eager className="dossier-cover-image" />
      <div className="dossier-cover-shade" />
      <div className="dossier-cover-top container"><nav aria-label="Breadcrumb"><Link to={atlasFrom}>← Property Atlas</Link><Link to="/">Home</Link></nav><SaveResidence property={property} /></div>
      <button type="button" className="dossier-cover-open" onClick={() => setViewer(0)} aria-haspopup="dialog">View photographs / {padIndex(property.images.length)} <span aria-hidden="true">↗</span></button>
      <div className="dossier-cover-copy container"><div><p className="eyebrow">HAV / {padIndex(index + 1)} <span>{purpose}</span></p><h1>{property.title}</h1><p className="dossier-cover-place">{property.location} <span>/ {property.state}</span></p></div><div className="dossier-cover-price"><p>{formatPrice(property)}</p><button type="button" className="line-link" onClick={() => setEnquiry(true)} aria-haspopup="dialog">Enquire about this residence <span aria-hidden="true">→</span></button></div></div>
    </header>

    <div className="container">
      <dl className="dossier-facts" aria-label="Residence quick facts">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
      <p className="dossier-disclosure">Fictional residence. Photography is illustrative.</p>

      <section className="dossier-story" aria-labelledby="residence-story-heading"><div><p className="eyebrow">01 / The residence</p><h2 id="residence-story-heading">{property.story.heading}</h2></div><div><p className="dossier-atmosphere">{property.atmosphere}</p><p className="dossier-story-copy">{property.story.body}</p><p className="dossier-description">{property.description}</p></div></section>

      <section className="dossier-gallery" aria-labelledby="dossier-gallery-heading">
        <div className="dossier-section-label"><h2 id="dossier-gallery-heading" className="eyebrow">02 / A photographic study</h2><span>{padIndex(property.images.length)} {property.images.length === 1 ? 'reference' : 'references'}</span></div>
        {property.images.map((image, imageIndex) => <figure className={`dossier-image-study study-${imageIndex % 2 === 0 ? 'wide' : 'offset'}`} key={image.src}>
          <button type="button" onClick={() => setViewer(imageIndex)} aria-haspopup="dialog" aria-label={`Open photograph ${imageIndex + 1} of ${property.images.length}: ${image.alt}`}><Photo image={image} /><span className="dossier-image-open" aria-hidden="true">View photograph ↗</span></button>
          <figcaption><span className="eyebrow">{padIndex(imageIndex + 1)} / Visual reference</span><p>{imageIndex === 0 ? property.story.note : image.alt}</p><span className="dossier-image-credit">Photography / {image.credit}</span></figcaption>
        </figure>)}
      </section>

      <div className="dossier-practical">
        <div>
          <section className="dossier-space" aria-labelledby="dossier-space-heading"><p className="eyebrow">03 / Composition</p><h2 id="dossier-space-heading">The space.</h2><p className="dossier-area">{property.size.toLocaleString('en-MY')} <span>sq ft</span></p><p className="dossier-room-count">{padIndex(property.bedrooms)} bedrooms <span>/</span> {padIndex(property.bathrooms)} bathrooms</p><dl className="dossier-highlights">{property.highlights.map(highlight => <div key={highlight.label}><dt>{highlight.label}</dt><dd>{highlight.value}</dd></div>)}</dl></section>
          <section className="dossier-amenities" aria-labelledby="dossier-amenities-heading"><p className="eyebrow">04 / Everyday essentials</p><h2 id="dossier-amenities-heading">Part of<br />the residence.</h2><ol>{property.amenities.map((amenity, amenityIndex) => <li key={amenity}><span>{padIndex(amenityIndex + 1)}</span>{amenity}</li>)}</ol></section>
        </div>
        <aside className="dossier-decision" aria-labelledby="dossier-decision-heading"><p className="eyebrow">Your next chapter / {purpose}</p><h2 id="dossier-decision-heading">{property.title}</h2><p className="dossier-decision-location">{property.location} / {property.state}</p><p className="dossier-decision-price">{formatPrice(property)}</p><p className="dossier-decision-facts">{property.bedrooms} bed <span>·</span> {property.bathrooms} bath <span>·</span> {property.size.toLocaleString('en-MY')} sq ft</p><p className="dossier-decision-type">{property.type}</p><button className="dossier-primary" type="button" onClick={() => setEnquiry(true)} aria-haspopup="dialog">Enquire about<br />this residence <span aria-hidden="true">→</span></button><SaveResidence property={property} /><p className="dossier-demo-note">A portfolio demonstration.<br />Enquiries are not sent or stored.</p></aside>
      </div>
    </div>

    <section className="dossier-place" aria-labelledby="dossier-place-heading"><div className="container dossier-place-grid"><div><p className="eyebrow">05 / Neighbourhood context</p><h2 id="dossier-place-heading">The place.</h2><p className="dossier-place-note">An imagined residence in {property.location}. This is an editorial neighbourhood reference; no exact address is represented.</p><Link className="line-link" to={`/properties?state=${property.state.toLowerCase().replaceAll(' ', '-')}`}>Explore {property.state} <span aria-hidden="true">→</span></Link></div><div className="dossier-place-composition"><p className="eyebrow">Malaysia / {property.state}</p><p className="dossier-place-name">{property.location}</p><div className="dossier-place-line" aria-hidden="true"><span /></div><p>{property.atmosphere}</p><span className="eyebrow">A place in the Havenza index</span></div></div></section>

    <section className="dossier-life container" aria-labelledby="dossier-life-heading"><div><p className="eyebrow">06 / Life index</p><h2 id="dossier-life-heading">A way<br />of living.</h2></div><div className="dossier-life-links">{matches.length ? matches.map(match => <div key={match.id}><h3>{match.title}</h3><p>{match.description}</p><Link className="line-link" to={`/properties?atmosphere=${match.id}`}>Explore {match.title.toLowerCase()} homes <span aria-hidden="true">→</span></Link></div>) : <div><h3>{property.atmosphere}</h3><p>A home with its own rhythm. Discover the wider residence index.</p><Link className="line-link" to="/properties">Explore homes <span aria-hidden="true">→</span></Link></div>}</div></section>

    <section className="dossier-next" aria-labelledby="dossier-next-heading"><div className="container dossier-next-heading"><h2 id="dossier-next-heading">Next residence</h2><span className="eyebrow">The index continues / {padIndex(properties.findIndex(item => item.id === next.id) + 1)}</span></div><Link className="dossier-next-link" to={`/properties/${next.id}`} state={{ atlasFrom }} aria-label={`Continue to ${next.title}`}><Photo image={next.image} /><div className="dossier-next-shade" /><div className="container dossier-next-copy"><div><p className="eyebrow">{next.location} / {next.state}</p><h3>{next.title}</h3><p>{formatPrice(next)}</p></div><span className="line-link" aria-hidden="true">Continue <span>→</span></span></div></Link><div className="container dossier-return"><Link className="line-link" to={atlasFrom}>Return to Property Atlas <span aria-hidden="true">→</span></Link><p>Fictional residence. Photography is illustrative.</p></div></section>

    {viewer !== null && <ImageViewer property={property} initialIndex={viewer} onClose={() => setViewer(null)} />}
    {enquiry && <EnquiryDialog property={property} onClose={() => setEnquiry(false)} />}
  </article>
}

export default function PropertyDetails() {
  const { propertyId } = useParams()
  const location = useLocation()
  const property = resolveResidence(propertyId)
  const atlasFrom = atlasReturnPath(location.state)
  if (!property) return <section className="residence-missing container"><nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">← Home</Link><span>/</span><Link to={atlasFrom}>Property Atlas</Link></nav><p className="eyebrow">Havenza / Residence index</p><h1>Residence<br />not found.</h1><p>This residence does not appear in the index. Discover a different place to begin.</p><Link className="line-link" to={atlasFrom}>Return to the Atlas <span aria-hidden="true">→</span></Link></section>
  return <ResidenceDossier key={property.id} property={property} atlasFrom={atlasFrom} />
}
