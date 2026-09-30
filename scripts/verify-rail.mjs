import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

// Test the real hook's input handlers against measured-geometry fixtures.
// This does not simulate browser layout, touch inertia, sticky positioning, or scroll events.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const previousWindow = globalThis.window
let reduced = false
globalThis.window = { matchMedia: () => ({ matches: reduced }) }
try {
  const usePropertyRail = (await server.ssrLoadModule('/src/hooks/usePropertyRail.js')).default
  for (const width of [1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390]) {
    let api
    function Probe({ capture }) { capture(usePropertyRail(5)); return null }
    renderToString(React.createElement(Probe, { capture: controls => { api = controls } }))
    const itemWidth = width <= 760 ? width * .86 : Math.max(300, Math.min(760, width * .42))
    const gap = Math.max(16, Math.min(40, width * .025))
    const gutter = Math.max(20, Math.min(80, width * .042))
    const step = itemWidth + gap
    const captures = new Set()
    const classes = new Set()
    let lastBehavior
    const rail = {
      clientWidth: width,
      scrollWidth: width + step * 4,
      scrollLeft: 0,
      children: Array.from({ length: 5 }, (_, index) => ({ offsetLeft: gutter + index * step })),
      scrollTo({ left, behavior }) { this.scrollLeft = Math.max(0, Math.min(this.scrollWidth - this.clientWidth, left)); lastBehavior = behavior },
      hasPointerCapture: id => captures.has(id),
      setPointerCapture: id => captures.add(id),
      releasePointerCapture: id => captures.delete(id),
      classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
      focus() {},
    }
    rail.firstElementChild = rail.children[0]
    api.railRef.current = rail
    const near = expected => assert.ok(Math.abs(rail.scrollLeft - expected) < .01)
    for (let index = 1; index <= 4; index++) { api.browse(1); near(step * index) }
    api.browse(1); near(step * 4)
    for (let index = 3; index >= 0; index--) { api.browse(-1); near(step * index) }
    api.browse(-1); near(0)
    const key = name => api.handlers.onKeyDown({ target: rail, key: name, preventDefault() {} })
    key('End'); near(step * 4)
    key('Home'); near(0)
    key('ArrowRight'); near(step)
    key('ArrowLeft'); near(0)
    // Native horizontal input updates the baseline for the next button.
    rail.scrollLeft = step * 2.1
    api.handlers.onWheel()
    api.browse(1); near(step * 3)
    reduced = true
    key('Home'); assert.equal(lastBehavior, 'instant')
    reduced = false
    key('ArrowRight'); assert.equal(lastBehavior, 'smooth')
    // A sub-threshold movement keeps an ordinary residence click intact.
    const pointer = { pointerType: 'mouse', button: 0, buttons: 1, pointerId: 1, clientX: 1000, clientY: 100, preventDefault() {} }
    api.handlers.onPointerDown(pointer)
    api.handlers.onPointerMove({ ...pointer, clientX: 996 })
    api.handlers.onPointerUp(pointer)
    let prevented = false
    const click = { preventDefault() { prevented = true }, stopPropagation() {} }
    api.handlers.onClickCapture(click)
    assert.equal(prevented, false)
    // An intentional drag moves, snaps, and suppresses its synthetic click once.
    api.handlers.onPointerDown(pointer)
    api.handlers.onPointerMove({ ...pointer, clientX: 1000 - step * .8 })
    assert.ok(classes.has('is-dragging'))
    api.handlers.onPointerUp(pointer)
    near(step * 2)
    assert.equal(classes.has('is-dragging'), false)
    api.handlers.onClickCapture(click)
    assert.equal(prevented, true)
    prevented = false
    api.handlers.onClickCapture(click)
    assert.equal(prevented, false)
    // Vertical gestures and touch pointers are left to native scrolling.
    const before = rail.scrollLeft
    api.handlers.onPointerDown(pointer)
    api.handlers.onPointerMove({ ...pointer, clientX: 995, clientY: 200 })
    api.handlers.onPointerCancel(pointer)
    near(before)
    api.handlers.onPointerDown({ ...pointer, pointerType: 'touch' })
    api.handlers.onPointerMove({ ...pointer, pointerType: 'touch', clientX: 100 })
    near(before)
    console.log(`PASS ${width}px geometry: repeated navigation, boundaries, native-scroll baseline, keyboard, drag, click suppression, reduced motion.`)
  }
} finally {
  if (previousWindow === undefined) delete globalThis.window
  else globalThis.window = previousWindow
  await server.close()
}
