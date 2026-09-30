import { getCollection } from '../data/collections'
import { CollectionHero, CollectionPlaces, CollectionAtmospheres, CollectionClosing } from '../components/collection/CollectionParts'
import RentalSequence from '../components/collection/RentalSequence'
import Photo from '../components/ui/Photo'
import '../styles/collections.css'
export default function Rent() {
  const collection = getCollection('rent')
  return <div className="collection-page collection-rent">
    <CollectionHero collection={collection} number="03" label="Renting" title={<>For where<br />life is now.</>} description="Spaces with room for change." action="Explore rental homes" />
    <RentalSequence collection={collection} />
    <CollectionAtmospheres collection={collection} title={<>Choose<br />your pace.</>} />
    <CollectionPlaces collection={collection} title={<>A place in<br />your day.</>} />
    <section className="collection-rental-moment container" aria-labelledby="rental-moment-heading"><div><p className="eyebrow">A note on belonging</p><h2 id="rental-moment-heading">Not every home<br />has to be forever<br />to matter.</h2><p>Some places belong to a particular chapter.</p></div><figure className="collection-moment-image"><Photo image={collection.editorial} /></figure></section>
    <CollectionClosing collection={collection} title={<>Find the place<br />for this chapter.</>} action="Explore rentals" />
  </div>
}
