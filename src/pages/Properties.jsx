import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { properties } from '../data/properties'
import { formatPrice, padIndex } from '../data/discovery'
import { describeFilters, filterKeys, filterProperties, placeOptions, readDiscovery, resetDiscovery, resolveActive, sortOptions, writeDiscovery } from '../data/propertyDiscovery'
import useSavedProperties from '../hooks/useSavedProperties'
import DiscoveryControls from '../components/discovery/DiscoveryControls'
import AtlasPhoto from '../components/discovery/AtlasPhoto'
import Photo from '../components/ui/Photo'
import '../styles/discovery.css'

function SaveButton({ property, savedIds, toggleSaved }) {
  const saved = savedIds.includes(property.id)
  return <button className="discovery-save" type="button" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${property.title}`} onClick={() => toggleSaved(property.id)}>{saved ? 'Saved ✓' : 'Save +'}</button>
}

export default function Properties() {
  const [params, setParams] = useSearchParams()
  const filters = readDiscovery(params)
  const canonical = writeDiscovery(filters).toString()
  const search = params.toString()
  const detailState = { atlasFrom: `/properties${canonical ? `?${canonical}` : ''}` }
  const { savedIds, toggleSaved } = useSavedProperties()
  const [selectedId, setSelectedId] = useState(null)
  const resultIndex = useRef(null)
  const results = filterProperties(properties, filters, savedIds)
  const active = resolveActive(results, selectedId)
  const activeIndex = active ? results.findIndex(property => property.id === active.id) : -1
  const filtered = filterKeys.some(key => filters[key] !== '')
  useEffect(() => {
    if (search !== canonical) setParams(canonical, { replace: true })
  }, [search, canonical, setParams])
  useEffect(() => { resultIndex.current?.scrollTo({ top: 0, behavior: 'instant' }) }, [canonical])
  function change(next) {
    setParams(writeDiscovery(readDiscovery(writeDiscovery(next))))
    setSelectedId(null)
  }
  const reset = () => change(resetDiscovery(filters))
  return <div className="discovery-page container">
    <header className="discovery-intro">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">← Home</Link><span aria-hidden="true">/</span><span aria-current="page">Property Atlas</span></nav>
      <div className="discovery-intro-grid"><div><p className="eyebrow">01 / Property Atlas</p><h1>Find a place<br />that fits.</h1></div><div className="discovery-intro-note"><p>Explore residences through place, space and the way you want to live.</p><p className="eyebrow">Malaysia <span>{padIndex(properties.length)} residences</span></p></div></div>
    </header>
    <section className="discovery-workspace" aria-label="Discover residences">
      <DiscoveryControls filters={filters} onChange={change} savedIds={savedIds} />
      <div className="discovery-summary"><div><span className="eyebrow">Showing</span><p>{describeFilters(filters)}</p></div><p className="discovery-count" role="status" aria-live="polite">{padIndex(results.length)} <span>{results.length === 1 ? 'residence' : 'residences'}</span></p>{filtered && <button type="button" className="discovery-reset" onClick={reset}>Reset filters ×</button>}</div>
      <div className="discovery-toolbar"><div className="discovery-views" role="group" aria-label="View residences"><span className="eyebrow">View</span>{['atlas', 'index'].map(view => <button type="button" key={view} aria-pressed={filters.view === view} onClick={() => change({ ...filters, view })}>{view}</button>)}</div><label className="discovery-sort"><span className="eyebrow">Sort</span><select value={filters.sort} onChange={event => change({ ...filters, sort: event.target.value })}>{sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div>
      {!results.length ? <div className="discovery-empty"><p className="eyebrow">00 / Your index</p><h2>No place<br />matches that index.</h2><p>Try widening your search{filters.saved ? ' or saving a residence from the full collection' : ''}.</p><button className="line-link" type="button" onClick={reset}>Reset filters <span aria-hidden="true">→</span></button></div> :
        <div className={`discovery-results mode-${filters.view}`}>
          {filters.view === 'atlas' && <aside id="atlas-preview" className="discovery-stage" aria-label="Selected residence preview">
            <AtlasPhoto property={active} /><div className="discovery-stage-shade" />
            <div className="discovery-stage-top"><span className="eyebrow">The residence index</span><span>{padIndex(activeIndex + 1)} / {padIndex(results.length)}</span></div>
            <div className="discovery-stage-copy"><p className="eyebrow">{active.state} / {active.purpose === 'sale' ? 'For purchase' : 'For rent'}</p><h2>{active.location}</h2><p>{active.title}</p><div><span>{formatPrice(active)}</span><Link className="line-link" to={`/properties/${active.id}`} state={detailState} aria-label={`View ${active.title}`}>View property <span aria-hidden="true">↗</span></Link></div></div>
          </aside>}
          <div className="discovery-result-index" ref={resultIndex}><div className="discovery-index-heading"><span className="eyebrow">Residences / {padIndex(results.length)}</span><span>{filters.view === 'atlas' ? 'Select a place to look closer' : 'A collection, considered'}</span></div>
            <ol className="discovery-list" aria-label="Property results">{results.map((property, index) => <li key={property.id} className={`discovery-row ${active?.id === property.id ? 'is-active' : ''}`} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelectedId(property.id) }} onFocus={() => setSelectedId(property.id)}>
              <div className="discovery-row-image"><Photo image={property.image} /></div>
              <div className="discovery-row-body"><div className="discovery-row-top"><span className="eyebrow">{padIndex(index + 1)} / {property.location}</span><span className="eyebrow">{property.purpose === 'sale' ? 'Buy' : 'Rent'}</span></div>
                {filters.view === 'atlas' ? <button type="button" className="discovery-select" aria-pressed={active?.id === property.id} aria-controls="atlas-preview" onClick={() => setSelectedId(property.id)} aria-label={`Preview ${property.title}`}><span className="discovery-property-title">{property.title}</span><span aria-hidden="true">{active?.id === property.id ? '−' : '+'}</span></button> : <h3><Link to={`/properties/${property.id}`} state={detailState}>{property.title} <span aria-hidden="true">↗</span></Link></h3>}
                {filters.view === 'atlas' && <h3 className="discovery-mobile-title"><Link to={`/properties/${property.id}`} state={detailState}>{property.title} <span aria-hidden="true">↗</span></Link></h3>}
                <p className="discovery-row-location">{property.state} / {property.type}</p>
                <p className="discovery-row-facts">{property.bedrooms} bed <span>·</span> {property.bathrooms} bath <span>·</span> {property.size.toLocaleString('en-MY')} sq ft</p>
                <div className="discovery-row-bottom"><p className="discovery-row-price">{formatPrice(property)}</p><SaveButton property={property} savedIds={savedIds} toggleSaved={toggleSaved} /></div>
                <Link className="discovery-view-property" to={`/properties/${property.id}`} state={detailState}>View property <span aria-hidden="true">↗</span><span className="sr-only"> — {property.title}</span></Link>
              </div>
            </li>)}</ol>
          </div>
        </div>}
      {filters.view === 'atlas' && <nav className="discovery-regions" aria-label="Editorial region navigation"><div><p className="eyebrow">Malaysia / Place index</p><span>Editorial navigation, not a geographic map.</span></div><div className="region-stops"><button type="button" aria-pressed={!filters.state} onClick={() => change({ ...filters, state: '' })}><span aria-hidden="true">○</span> All Malaysia</button>{placeOptions.map((place, index) => <button type="button" key={place.value} style={{ '--region-step': index }} aria-pressed={filters.state === place.value} onClick={() => change({ ...filters, state: place.value })}><span aria-hidden="true">{filters.state === place.value ? '●' : '○'}</span> {place.label} <small>{padIndex(place.count)}</small></button>)}</div></nav>}
      <div className="discovery-colophon"><p>Fictional residences. Photography is illustrative.</p><p>Havenza / Places for the life you’re building.</p></div>
    </section>
  </div>
}
