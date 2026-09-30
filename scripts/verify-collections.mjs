import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

// Collection data and route markup checks, not live layout/interaction tests.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { properties } = await server.ssrLoadModule('/src/data/properties.js')
  const { getCollection, collectionPath } = await server.ssrLoadModule('/src/data/collections.js')
  const { readDiscovery, writeDiscovery, filterProperties } = await server.ssrLoadModule('/src/data/propertyDiscovery.js')
  const { formatPrice, padIndex } = await server.ssrLoadModule('/src/data/discovery.js')
  for (const [page, purpose] of [['Buy', 'sale'], ['Rent', 'rent']]) {
    const collection = getCollection(purpose)
    assert.deepEqual(collection.residences, properties.filter(property => property.purpose === purpose))
    assert.ok(collection.selected.length >= 3)
    assert.ok(collection.selected.every(property => property.purpose === purpose && properties.includes(property)))
    for (const place of collection.places) {
      assert.ok(place.matches.length > 0)
      assert.deepEqual(place.matches, collection.residences.filter(property => property.state === place.label))
    }
    for (const atmosphere of collection.atmospheres) {
      assert.ok(atmosphere.matches.length > 0)
      assert.deepEqual(atmosphere.matches, collection.residences.filter(property => property.lifestyles.includes(atmosphere.id)))
    }
    const images = [collection.hero, collection.closing, ...collection.selected.map(property => property.image), ...(purpose === 'rent' ? [collection.editorial] : [])]
    assert.equal(new Set(images.map(image => image.src)).size, images.length, 'Avoid repeated images on a page')
    const Page = (await server.ssrLoadModule(`/src/pages/${page}.jsx`)).default
    const markup = renderToString(React.createElement(MemoryRouter, { initialEntries: [`/${page.toLowerCase()}`] }, React.createElement(Page))).replace(/<!--.*?-->/g, '')
    assert.equal((markup.match(/<h1[ >]/g) || []).length, 1)
    assert.ok(markup.includes('href="/"') && markup.includes('aria-label="Breadcrumb"'))
    assert.ok(markup.includes(`${padIndex(collection.residences.length)} residences`))
    assert.ok(markup.includes('Fictional residences. Photography is illustrative.'))
    assert.equal((markup.match(/data-residence=/g) || []).length, collection.selected.length)
    for (const property of collection.selected) {
      assert.ok(markup.includes(`data-residence="${property.id}"`))
      assert.ok(markup.includes(formatPrice(property)))
      assert.ok(markup.includes(`aria-label="Save ${property.title}"`))
      assert.ok(markup.includes(property.size.toLocaleString('en-MY')))
    }
    for (const match of markup.matchAll(/href="([^"#]+)"/g)) {
      const path = match[1].replaceAll('&amp;', '&')
      if (path.startsWith('/properties/')) {
        const property = properties.find(item => item.id === path.split('/')[2])
        assert.ok(property && property.purpose === purpose)
      } else if (path.startsWith('/properties?')) {
        const raw = path.split('?')[1]
        const filters = readDiscovery(raw)
        assert.equal(filters.purpose, purpose)
        assert.equal(writeDiscovery(filters).toString(), raw, 'Only supported canonical query values')
        assert.ok(filterProperties(properties, filters).length > 0, path)
      }
    }
    assert.ok(markup.includes(`href="${collectionPath(purpose)}"`))
    if (purpose === 'rent') {
      assert.ok(markup.includes('aria-label="Rental residences"'))
      assert.ok(markup.includes('aria-label="Previous rental"') && markup.includes('aria-label="Next rental"'))
      assert.ok(markup.includes('role="status"') && markup.includes('id="rental-instructions"'))
    }
    console.log(`PASS: ${page}, ${collection.residences.length} matching residences, curated subset, unique imagery, counts, saved controls, detail links and all query destinations.`)
  }
  const usePropertyRail = (await server.ssrLoadModule('/src/hooks/usePropertyRail.js')).default
  const previousWindow = globalThis.window
  try {
    globalThis.window = { matchMedia: () => ({ matches: false }) }
    for (const width of [1920, 1440, 1366, 1024, 768, 430, 390]) {
      let controls
      function Probe({ capture }) { capture(usePropertyRail(3)); return null }
      renderToString(React.createElement(Probe, { capture: value => { controls = value } }))
      const frameWidth = width <= 760 ? width * .84 : width <= 1024 ? width * .78 : Math.max(540, Math.min(1100, width * .68))
      const gap = Math.max(24, Math.min(48, width * .03))
      const step = frameWidth + gap
      const rail = {
        scrollLeft: 0, clientWidth: width, scrollWidth: width + step * 2,
        firstElementChild: { offsetLeft: 20 },
        children: [0, 1, 2].map(index => ({ offsetLeft: 20 + step * index })),
        scrollTo({ left }) { this.scrollLeft = left },
      }
      controls.railRef.current = rail
      controls.browse(1)
      assert.ok(Math.abs(rail.scrollLeft - step) < .01)
      controls.browse(1)
      assert.ok(Math.abs(rail.scrollLeft - step * 2) < .01)
      controls.browse(1)
      assert.ok(Math.abs(rail.scrollLeft - step * 2) < .01)
      controls.handlers.onKeyDown({ target: rail, key: 'Home', preventDefault() {} })
      assert.equal(rail.scrollLeft, 0)
      controls.handlers.onKeyDown({ target: rail, key: 'End', preventDefault() {} })
      assert.ok(Math.abs(rail.scrollLeft - step * 2) < .01)
    }
    console.log('PASS: three-residence rail handlers at seven width fixtures, repeated arrows, endpoints and Home/End. Not a browser layout test.')
  } finally { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow }
} finally { await server.close() }
