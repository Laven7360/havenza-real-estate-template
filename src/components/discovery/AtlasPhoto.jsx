import { useState } from 'react'

// Mount only the current and previous selection, never the full collection.
export default function AtlasPhoto({ property }) {
  const [frame, setFrame] = useState({ property, previous: null, ready: false, failed: false })
  if (frame.property.id !== property.id) {
    setFrame({ property, previous: frame.ready && !frame.failed ? frame.property : frame.previous, ready: false, failed: false })
  }
  const loaded = failed => setFrame(previous => previous.property.id === property.id ? { ...previous, ready: true, failed } : previous)
  return <div className="discovery-photo">
    {frame.previous && <img className="discovery-photo-previous" src={frame.previous.image.src} alt="" aria-hidden="true" style={{ objectPosition: frame.previous.image.position }} />}
    {frame.failed ? <div className="discovery-photo-fallback" role="img" aria-label={property.image.alt}><span>H / MY</span><p>Image unavailable</p></div> :
      <img key={property.id} className={frame.ready ? 'is-ready' : ''} src={property.image.src} alt={property.image.alt} style={{ objectPosition: property.image.position }} onLoad={() => loaded(false)} onError={() => loaded(true)} decoding="async" />}
  </div>
}
