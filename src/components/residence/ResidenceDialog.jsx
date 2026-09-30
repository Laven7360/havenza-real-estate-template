import { useEffect, useRef } from 'react'

// Mounted only while open. Native modal isolation plus explicit keyboard boundaries.
export default function ResidenceDialog({ children, labelId, className = '', onClose, onKeyDown }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    const trigger = document.activeElement
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [])
  function keyboard(event) {
    onKeyDown?.(event)
    if (event.key !== 'Tab') return
    const controls = [...ref.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex="0"]')]
    const first = controls[0], last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  return <dialog className={`residence-dialog ${className}`} ref={ref} aria-labelledby={labelId} onKeyDown={keyboard} onCancel={event => { event.preventDefault(); onClose() }}>{children}</dialog>
}
