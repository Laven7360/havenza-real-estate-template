import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useSavedProperties from '../../hooks/useSavedProperties'

export default function Navbar({ onMenuOpen, menuButtonRef, menuOpen }) {
  const { pathname } = useLocation()
  const { savedIds } = useSavedProperties()
  const [scroll, setScroll] = useState(() => ({ scrolled: typeof window !== 'undefined' && window.scrollY > 40, compact: false }))
  useEffect(() => {
    let frame = 0
    const hero = document.querySelector('.arrival-stage')
    function update() {
      frame = 0
      const scrolled = window.scrollY > 40
      const compact = window.scrollY > (hero ? hero.offsetTop + hero.offsetHeight - 88 : 120)
      setScroll(previous => previous.scrolled === scrolled && previous.compact === compact ? previous : { scrolled, compact })
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pathname])
  return <header className={`site-header ${pathname === '/' && !scroll.scrolled ? 'over-photo' : ''} ${scroll.compact ? 'is-compact' : ''}`}>
    <div className="navbar container">
      <NavLink className="wordmark" to="/" end aria-label="Havenza home">HAVENZA <span>/ MY</span></NavLink>
      <NavLink to="/properties" className="atlas-nav">Property Atlas</NavLink>
      <Link className="saved-indicator" to="/properties?saved=1" aria-label={`Saved residences, ${savedIds.length}`}>Saved <span>{String(savedIds.length).padStart(2, '0')}</span></Link>
      <button className="menu-toggle" ref={menuButtonRef} onClick={onMenuOpen} aria-expanded={menuOpen} aria-controls="site-menu">Menu <span aria-hidden="true">+</span></button>
    </div>
  </header>
}
