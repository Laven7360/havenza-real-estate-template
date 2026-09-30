import { useEffect, useRef, useState } from 'react'

export default function usePropertyRail(count) {
  const railRef = useRef(null)
  const [active, setActive] = useState(0)
  const requested = useRef(null)
  const drag = useRef(null)
  const suppressClick = useRef(false)

  function targets() {
    const rail = railRef.current
    const first = rail.firstElementChild.offsetLeft
    return Array.from(rail.children, item => Math.max(0, Math.min(item.offsetLeft - first, rail.scrollWidth - rail.clientWidth)))
  }

  function nearest() {
    const position = railRef.current.scrollLeft
    return targets().reduce((best, point, index, points) => Math.abs(point - position) < Math.abs(points[best] - position) ? index : best, 0)
  }

  function goTo(index, instant = false) {
    const next = Math.max(0, Math.min(count - 1, index))
    requested.current = next
    railRef.current.scrollTo({ left: targets()[next], behavior: instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  function browse(direction) { goTo((requested.current ?? nearest()) + direction) }

  useEffect(() => {
    const rail = railRef.current
    let frame = 0
    let settled
    function update() {
      frame = 0
      const first = rail.firstElementChild.offsetLeft
      const max = rail.scrollWidth - rail.clientWidth
      const points = Array.from(rail.children, item => Math.max(0, Math.min(item.offsetLeft - first, max)))
      const index = points.reduce((best, point, current) => Math.abs(point - rail.scrollLeft) < Math.abs(points[best] - rail.scrollLeft) ? current : best, 0)
      setActive(index)
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
      clearTimeout(settled)
      settled = setTimeout(() => { requested.current = null }, 180)
    }
    const observer = new ResizeObserver(onScroll)
    observer.observe(rail)
    for (const item of rail.children) observer.observe(item)
    rail.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settled)
      observer.disconnect()
      rail.removeEventListener('scroll', onScroll)
    }
  }, [])

  function finishDrag(event) {
    const gesture = drag.current
    if (!gesture) return
    drag.current = null
    const rail = railRef.current
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId)
    if (gesture.moved) {
      rail.classList.remove('is-dragging')
      goTo(nearest())
    }
  }

  const handlers = {
    onKeyDown(event) {
      suppressClick.current = false
      if (event.target !== railRef.current) return
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      if (event.key === 'Home') goTo(0)
      else if (event.key === 'End') goTo(count - 1)
      else browse(event.key === 'ArrowRight' ? 1 : -1)
    },
    onWheel() { requested.current = null },
    onPointerDown(event) {
      requested.current = null
      suppressClick.current = false
      if (event.pointerType !== 'mouse' || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      drag.current = { x: event.clientX, y: event.clientY, scroll: railRef.current.scrollLeft, moved: false }
    },
    onPointerMove(event) {
      const gesture = drag.current
      if (!gesture) return
      if (!event.buttons) { finishDrag(event); return }
      const distance = event.clientX - gesture.x
      if (!gesture.moved && Math.abs(distance) > 7 && Math.abs(distance) > Math.abs(event.clientY - gesture.y)) {
        gesture.moved = true
        suppressClick.current = true
        railRef.current.setPointerCapture(event.pointerId)
        railRef.current.classList.add('is-dragging')
        railRef.current.focus({ preventScroll: true })
      }
      if (gesture.moved) {
        event.preventDefault()
        railRef.current.scrollTo({ left: gesture.scroll - distance, behavior: 'instant' })
      }
    },
    onPointerUp: finishDrag,
    onPointerCancel: finishDrag,
    onLostPointerCapture: finishDrag,
    onDragStart(event) { event.preventDefault() },
    onClickCapture(event) {
      if (suppressClick.current) {
        event.preventDefault()
        event.stopPropagation()
        suppressClick.current = false
      }
    },
  }

  return { railRef, active, browse, handlers }
}
