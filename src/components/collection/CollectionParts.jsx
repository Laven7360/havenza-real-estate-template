import { Link } from 'react-router-dom'
import { collectionPath } from '../../data/collections'
import { formatPrice, padIndex } from '../../data/discovery'
import useSavedProperties from '../../hooks/useSavedProperties'
import Photo from '../ui/Photo'

export function CollectionHero({ collection, title, description, label, number, action }) {
  const name = collection.purpose === 'sale' ? 'Buy' : 'Rent'
  return <header className="collection-opening container"><nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">← Home</Link><span>/</span><span aria-current="page">{name}</span></nav><div className="collection-hero"><div className="collection-hero-copy"><p className="eyebrow">{number} / {label}</p><h1>{title}</h1><p className="collection-support">{description}</p><Link className="line-link" to={collection.path}>{action} <span aria-hidden="true">↗</span></Link><p className="collection-meta eyebrow">{name} / Malaysia <span>{padIndex(collection.residences.length)} residences</span></p></div><figure className="collection-hero-image"><Photo image={collection.hero} eager /><figcaption className="eyebrow">{collection.purpose === 'sale' ? 'A study in material and light' : 'A city in motion'} / MY</figcaption></figure></div></header>
}

export function ResidenceInformation({ property, index, path }) {
  const { savedIds, toggleSaved } = useSavedProperties()
  const saved = savedIds.includes(property.id)
  return <div className="collection-residence-info"><p className="eyebrow">{padIndex(index + 1)} / {property.location}</p><h3><Link to={`/properties/${property.id}`} state={{ atlasFrom: path }}>{property.title}</Link></h3><p className="collection-residence-location">{property.state} / {property.type}</p><p className="collection-residence-price">{formatPrice(property)}</p><p className="collection-residence-facts">{property.bedrooms} bed <span>·</span> {property.bathrooms} bath <span>·</span> {property.size.toLocaleString('en-MY')} sq ft</p><div className="collection-residence-actions"><Link className="line-link" to={`/properties/${property.id}`} state={{ atlasFrom: path }}>View residence <span aria-hidden="true">→</span></Link><button type="button" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${property.title}`} onClick={() => toggleSaved(property.id)}>{saved ? 'Saved ✓' : 'Save +'}</button></div></div>
}

export function CollectionPlaces({ collection, title }) {
  return <section className="collection-places container" aria-labelledby="collection-places-heading"><div className="collection-section-heading"><p className="eyebrow">Place index / Malaysia</p><h2 id="collection-places-heading">{title}</h2><p>Find a setting for everyday life.</p></div><div className="collection-place-links">{collection.places.map((place, index) => <Link key={place.value} to={collectionPath(collection.purpose, { state: place.value })}><span className="eyebrow">{padIndex(index + 1)} / {padIndex(place.matches.length)} {place.matches.length === 1 ? 'residence' : 'residences'}</span><h3>{place.label}</h3><p>{[...new Set(place.matches.map(property => property.location))].join(' / ')}</p><span className="collection-place-action">Explore {place.label} <span aria-hidden="true">↗</span></span></Link>)}</div></section>
}

export function CollectionAtmospheres({ collection, title }) {
  return <section className="collection-atmospheres" aria-labelledby="collection-atmospheres-heading"><div className="container collection-atmosphere-layout"><div className="collection-section-heading"><p className="eyebrow">Life index / {collection.purpose === 'sale' ? 'Ownership' : 'Renting'}</p><h2 id="collection-atmospheres-heading">{title}</h2><p>A feeling is a good place to begin.</p></div><div>{collection.atmospheres.map((atmosphere, index) => <Link className="collection-atmosphere-link" key={atmosphere.id} to={collectionPath(collection.purpose, { atmosphere: atmosphere.id })}><span className="eyebrow">{padIndex(index + 1)}</span><div><h3>{atmosphere.title}</h3><p>{atmosphere.description}</p></div><span className="collection-match-count">{padIndex(atmosphere.matches.length)} <span className="sr-only">matching residences</span><span aria-hidden="true">↗</span></span></Link>)}</div></div></section>
}

export function CollectionClosing({ collection, title, action }) {
  return <section className="collection-closing" aria-labelledby="collection-closing-heading"><Photo image={collection.closing} /><div className="collection-closing-shade" /><div className="container collection-closing-copy"><p className="eyebrow">Your next chapter / Havenza</p><h2 id="collection-closing-heading">{title}</h2><Link className="line-link" to={collection.path}>{action} <span aria-hidden="true">↗</span></Link></div><p className="container collection-disclosure">Fictional residences. Photography is illustrative.</p></section>
}
