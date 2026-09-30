import { useEffect } from 'react'

// Write to a CSS variable, avoiding React renders on every scroll frame.
export default function useScrollProgress(ref) {
  useEffect(() => {
    const element = ref.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    function update() {
      frame = 0
      const bounds = element.getBoundingClientRect()
      const progress = motion.matches ? 0 : Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height - window.innerHeight)))
      element.style.setProperty('--scroll-progress', progress.toFixed(3))
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    motion.addEventListener('change', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      motion.removeEventListener('change', schedule)
    }
  }, [ref])
}
