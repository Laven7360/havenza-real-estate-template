import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import PhotoSwap from '../ui/PhotoSwap'
import { photography } from '../../data/photography'

const destinations = [
  { label: 'Home', path: '/', title: 'Find your place.', note: 'Malaysia / 2026', image: photography.courtyard },
  { label: 'Property Atlas', path: '/properties', title: 'Explore by place.', note: 'KL / PJ / Shah Alam / Cyberjaya', image: photography.towers },
  { label: 'Buy', path: '/buy', title: 'For ownership.', note: 'A considered collection of Malaysian residences.', image: photography.interior },
  { label: 'Rent', path: '/rent', title: 'For now.', note: 'Spaces for the life you’re living today.', image: photography.lounge },
  { label: 'About', path: '/about', title: 'Our point of view.', note: 'Property should begin with people, not square footage.', image: photography.garden },
  { label: 'Contact', path: '/contact', title: 'Start a conversation.', note: 'Malaysia', image: photography.doorway },
]

export default function MenuOverlay({ open, onClose, triggerRef }) {
  const dialogRef = useRef(null)
  const previousOverflow = useRef(null)
  const openedLocation = useRef(null)
  const location = useLocation()
  const [preview, setPreview] = useState(0)

  useEffect(() => {
    const dialog = dialogRef.current
    let timeout
    if (open) {
      if (previousOverflow.current === null) {
        previousOverflow.current = document.body.style.overflow
        openedLocation.current = location.key
      }
      document.body.style.overflow = 'hidden'
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      timeout = window.setTimeout(() => {
        dialog.close()
        document.body.style.overflow = previousOverflow.current ?? ''
        previousOverflow.current = null
        const destination = location.hash && document.getElementById(location.hash.slice(1))
        const target = openedLocation.current === location.key ? triggerRef.current : destination || document.getElementById('main-content')
        target?.focus({ preventScroll: true })
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220)
    }
    return () => window.clearTimeout(timeout)
  }, [open, triggerRef, location.key, location.hash])

  useEffect(() => () => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current
      previousOverflow.current = null
    }
  }, [])

  function trapFocus(event) {
    if (event.key !== 'Tab') return
    const controls = dialogRef.current.querySelectorAll('button, a[href]')
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return <dialog ref={dialogRef} id="site-menu" className={`menu-overlay ${open ? 'is-open' : 'is-closing'}`} aria-label="Explore Havenza" onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={trapFocus}>
    <div className="menu-inner">
      <div className="menu-header"><Link to="/" className="wordmark" aria-label="Havenza home" onClick={onClose}>HAVENZA <span>/ MY</span></Link><button autoFocus className="menu-toggle" onClick={onClose}>Close <span aria-hidden="true">×</span></button></div>
      <div className="menu-body"><nav aria-label="Full navigation">
        {destinations.map((item, index) => <NavLink style={{ '--index': index }} key={item.path} to={item.path} end={item.path === '/'} onClick={onClose} onPointerEnter={event => { if (event.pointerType === 'mouse') setPreview(index) }} onFocus={() => setPreview(index)}><span className="menu-number">0{index + 1}</span><span>{item.label}</span><span className="menu-link-arrow" aria-hidden="true">↗</span></NavLink>)}
      </nav><div className="menu-preview"><PhotoSwap items={destinations.map(item => item.image)} active={preview} /><div className="menu-preview-shade" /><div className="menu-preview-copy"><span className="eyebrow">Destination / 0{preview + 1}</span><p key={preview}>{destinations[preview].title}</p><span>{destinations[preview].note}</span></div></div></div>
    </div>
  </dialog>
}
