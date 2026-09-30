import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { createServer } from 'vite'

// Rendering/data smoke checks. These do not replace browser interaction or viewport QA.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { properties } = await server.ssrLoadModule('/src/data/properties.js')
  const { lifestyles, atlasProperties, livingIndex, formatPrice } = await server.ssrLoadModule('/src/data/discovery.js')
  const { photography, propertyDetailPhotography } = await server.ssrLoadModule('/src/data/photography.js')
  assert.equal(properties.length, 8)
  assert.equal(new Set(properties.map(property => property.id)).size, 8)
  assert.equal(new Set(properties.map(property => property.slug)).size, 8)
  assert.equal(new Set(properties.map(property => property.image.src)).size, 8, 'Unrelated properties must not share a primary image')
  const propertyImages = properties.map(property => property.image.src)
  for (const image of Object.values(propertyDetailPhotography)) {
    assert.ok(!propertyImages.includes(image.src), 'Secondary images must not represent another property')
    propertyImages.push(image.src)
  }
  for (const property of properties) {
    assert.ok(property.image.src && property.image.alt)
    assert.ok(formatPrice(property).startsWith('RM '))
    assert.equal(formatPrice(property).includes('/ month'), property.purpose === 'rent')
  }
  for (const item of lifestyles) {
    assert.deepEqual(item.matches.map(property => property.id), properties.filter(property => item.locations.includes(property.location)).map(property => property.id))
    assert.ok(item.matches.length > 0)
  }
  assert.equal(atlasProperties.length, 6)
  assert.equal(livingIndex.length, 4)
  for (const image of Object.values(photography)) {
    for (const src of [image.src, image.mobile].filter(Boolean)) {
      const bytes = await readFile(new URL('..' + src, import.meta.url))
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF')
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP')
      assert.ok(bytes.length < 700_000, `Image too large: ${src}`)
    }
  }
  console.log('PASS: 8 property records, 6 Atlas locations, 4 index rows, lifestyle matches, and all local WebP files.')

  const cases = [
    ['Home', '/', 'arrival-heading'],
    ['Properties', '/properties', 'Find a place'],
    ['Buy', '/buy', 'to keep.'],
    ['Rent', '/rent', 'life is now.'],
    ['About', '/about', 'differently.'],
    ['Contact', '/contact', 'Start with'],
    ['PropertyDetails', '/properties/hz-001', 'The Terrace, Mont Kiara'],
    ['PropertyDetails', '/properties/courtyard-house-bangsar', 'Courtyard House'],
    ['PropertyDetails', '/properties/missing', 'not found.'],
    ['NotFound', '/missing', 'A little off the map.'],
  ]
  for (const [page, path, expected] of cases) {
    const Component = (await server.ssrLoadModule(`/src/pages/${page}.jsx`)).default
    const routePath = page === 'PropertyDetails' ? '/properties/:propertyId' : '*'
    const markup = renderToString(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(Routes, null, React.createElement(Route, { path: routePath, element: React.createElement(Component) }))))
    assert.ok(markup.includes(expected), `${path}: missing expected content`)
    assert.equal((markup.match(/<h1[ >]/g) || []).length, 1, `${path}: expected one h1`)
    if (page !== 'Home') assert.ok(markup.includes('aria-label="Breadcrumb"') && markup.includes('href="/"'))
    else {
      for (const section of ['atlas-heading', 'residences-heading', 'life-heading', 'living-heading', 'new-heading', 'editorial-heading', 'closing-heading']) assert.ok(markup.includes(`id="${section}"`))
      for (const match of markup.matchAll(/href="\/properties\/([^"#?]+)"/g)) assert.ok(properties.some(property => property.id === match[1]))
      assert.ok(markup.includes('aria-pressed="true"'))
      assert.ok(markup.includes('fetchPriority="high"'))
      assert.ok(markup.includes('aria-label="New Havenza properties"'))
      assert.ok(markup.includes('aria-label="Previous property"') && markup.includes('aria-label="Next property"'))
      assert.ok(markup.includes('role="status"') && markup.includes('id="rail-instructions"'))
    }
    console.log(`PASS: ${path}`)
  }
  const Navbar = (await server.ssrLoadModule('/src/components/layout/Navbar.jsx')).default
  const navbar = renderToString(React.createElement(MemoryRouter, { initialEntries: ['/properties'] }, React.createElement(Navbar, { menuOpen: false })))
  assert.ok(navbar.includes('href="/"') && navbar.includes('aria-current="page"') && navbar.includes('aria-controls="site-menu"'))
  const Menu = (await server.ssrLoadModule('/src/components/layout/MenuOverlay.jsx')).default
  const menu = renderToString(React.createElement(MemoryRouter, null, React.createElement(Menu, { open: false, triggerRef: { current: null } })))
  for (const path of ['/', '/properties', '/buy', '/rent', '/about', '/contact']) assert.ok(menu.includes(`href="${path}"`))
  assert.ok(menu.includes('<dialog'))
  console.log('PASS: home control, active Atlas navigation, dialog structure, and all menu destinations.')
} finally {
  await server.close()
}
