import { Link } from 'react-router-dom'
export default function MagneticLink({ children, className = '', ...props }) {
  function move(event) {
    if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--shift-x', `${(event.clientX - bounds.left - bounds.width / 2) * 0.035}px`)
    event.currentTarget.style.setProperty('--shift-y', `${(event.clientY - bounds.top - bounds.height / 2) * 0.08}px`)
  }
  function reset(event) { event.currentTarget.style.setProperty('--shift-x', '0px'); event.currentTarget.style.setProperty('--shift-y', '0px') }
  return <Link {...props} className={`magnetic-link ${className}`} onPointerMove={move} onPointerLeave={reset} onBlur={reset}>{children}<span aria-hidden="true">↗</span></Link>
}
