import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { applyRouteMetadata } from '../../data/siteMetadata'
import MenuOverlay from './MenuOverlay'
import Footer from './Footer'
import '../../styles/navigation.css'
export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null), mainRef = useRef(null)
  const { pathname, hash } = useLocation()
  const previousPath = useRef(pathname)
  useEffect(() => {
    const changed = previousPath.current !== pathname
    previousPath.current = pathname
    applyRouteMetadata(pathname)
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) {
      target.scrollIntoView({ behavior: 'instant' })
      target.focus({ preventScroll: true })
    } else if (changed || !hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (changed) mainRef.current?.focus({ preventScroll: true })
    }
  }, [pathname, hash])
  return <><a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar onMenuOpen={() => setMenuOpen(true)} menuButtonRef={menuButtonRef} menuOpen={menuOpen} />
    <main id="main-content" ref={mainRef} tabIndex={-1}><Outlet /></main><Footer />
    <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuButtonRef} />
  </>
}
