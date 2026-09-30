import { useState } from 'react'

export default function Photo({ image, className = '', eager = false, decorative = false, onLoad, onError }) {
  const [failedSource, setFailedSource] = useState(null)
  const failed = failedSource === image.src
  return <div className={`photo ${className}`}>
    {failed ? <span className="photo-fallback" aria-hidden={decorative || undefined} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : `Image unavailable: ${image.alt}`}>H / MY<span>Image unavailable</span></span> :
      <picture>{image.mobile && <source media="(max-width: 760px)" srcSet={image.mobile} />}<img src={image.src} alt={decorative ? '' : image.alt} style={{ objectPosition: image.position }} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" onLoad={onLoad} onError={() => { setFailedSource(image.src); onError?.() }} /></picture>}
  </div>
}
