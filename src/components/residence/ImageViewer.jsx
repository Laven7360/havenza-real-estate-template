import { useState } from 'react'
import ResidenceDialog from './ResidenceDialog'
import Photo from '../ui/Photo'
import { padIndex } from '../../data/discovery'
import { moveImage } from '../../data/residenceDossier'

export default function ImageViewer({ property, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex)
  const image = property.images[index]
  const navigate = direction => setIndex(current => moveImage(current, direction, property.images.length))
  return <ResidenceDialog labelId="residence-viewer-title" className="residence-viewer" onClose={onClose} onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); navigate(event.key === 'ArrowLeft' ? -1 : 1) }
  }}>
    <header><div><h2 id="residence-viewer-title">{property.title}</h2><p className="eyebrow" role="status" aria-live="polite">{padIndex(index + 1)} / {padIndex(property.images.length)} — Illustrative photography</p></div><button type="button" onClick={onClose}>Close ×</button></header>
    <div className="residence-viewer-image"><Photo key={image.src} image={{ ...image, mobile: undefined }} eager /></div>
    <footer><button type="button" disabled={property.images.length < 2} onClick={() => navigate(-1)} aria-label="Previous photograph">← <span>Previous</span></button><p>{image.alt}<span>Photography: {image.credit}</span></p><button type="button" disabled={property.images.length < 2} onClick={() => navigate(1)} aria-label="Next photograph"><span>Next</span> →</button></footer>
  </ResidenceDialog>
}
