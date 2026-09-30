import { getCollection } from '../data/collections'
import { CollectionHero, CollectionPlaces, CollectionAtmospheres, CollectionClosing, ResidenceInformation } from '../components/collection/CollectionParts'
import Photo from '../components/ui/Photo'
import Reveal from '../components/ui/Reveal'
import '../styles/collections.css'

const considerations = [
  ['Place', 'Consider how the neighbourhood fits everyday routines.'],
  ['Space', 'Think beyond bedroom count. Circulation and usable space shape daily life.'],
  ['Pace', 'Leave room for the life you have now and what may change.'],
  ['Context', 'Look at a residence together with its surrounding environment.'],
]
export default function Buy() {
  const collection = getCollection('sale')
  return <div className="collection-page collection-buy">
    <CollectionHero collection={collection} number="02" label="Ownership" title={<>A place<br />to keep.</>} description="Residences considered for the life you’re building toward." action="Explore all homes for sale" />
    <section className="collection-owned container" aria-labelledby="ownership-heading"><div className="collection-section-heading"><p className="eyebrow">01 / Places to put down roots</p><h2 id="ownership-heading">For<br />ownership.</h2><p>{collection.selected.length} considered residences from the ownership index.</p></div><div className="ownership-sequence">{collection.selected.map((property, index) => <article className={`ownership-residence ownership-residence-${index + 1}`} key={property.id} data-residence={property.id}><Reveal className="ownership-image"><Photo image={property.image} /></Reveal><ResidenceInformation property={property} index={index} path={collection.path} /></article>)}</div></section>
    <CollectionPlaces collection={collection} title={<>Where roots<br />take hold.</>} />
    <CollectionAtmospheres collection={collection} title={<>Own it<br />your way.</>} />
    <section className="collection-considerations container" aria-labelledby="considerations-heading"><div className="collection-section-heading"><p className="eyebrow">A note on everyday living</p><h2 id="considerations-heading">Before<br />the address.</h2><p>Four things to make room for.</p></div><ol>{considerations.map(([title, copy], index) => <li key={title}><span className="eyebrow">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></section>
    <CollectionClosing collection={collection} title={<>The right place<br />is somewhere<br />in the Atlas.</>} action="Explore homes for sale" />
  </div>
}
