import { useState } from 'react'
import Photo from './Photo'

// Load selections on demand; retain the last ready image while its replacement loads.
export default function PhotoSwap({ items, active, className = '' }) {
  const src = items[active].src
  const [visited, setVisited] = useState([src])
  const [ready, setReady] = useState([])
  const [lastReady, setLastReady] = useState(null)
  if (!visited.includes(src)) setVisited([...visited, src])
  if (ready.includes(src) && lastReady !== src) setLastReady(src)
  const visible = ready.includes(src) ? src : lastReady
  const markReady = source => setReady(previous => previous.includes(source) ? previous : [...previous, source])
  return <div className={`photo-swap ${className}`}>
    {items.map((image, index) => visited.includes(image.src) && <div key={`${image.src}-${index}`} className={`photo-layer ${visible === image.src ? 'is-active' : ''}`} aria-hidden={visible !== image.src}>
      <Photo image={image} onLoad={() => markReady(image.src)} onError={() => markReady(image.src)} />
    </div>)}
  </div>
}
