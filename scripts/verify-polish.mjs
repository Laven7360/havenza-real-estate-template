import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { createServer } from 'vite'

// Server-rendered route/link and metadata checks. Not a browser or layout test.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { properties } = await server.ssrLoadModule('/src/data/properties.js')
  const { routeTitle, routeMetadata, applyRouteMetadata } = await server.ssrLoadModule('/src/data/siteMetadata.js')
  const Layout = (await server.ssrLoadModule('/src/components/layout/MainLayout.jsx')).default
  const pages = [['/', 'Home'], ['/properties', 'Properties'], ['/buy', 'Buy'], ['/rent', 'Rent'], ['/about', 'About'], ['/contact', 'Contact']]
  const definitions = await Promise.all([...pages, ['/properties/:propertyId', 'PropertyDetails'], ['*', 'NotFound']].map(async ([path, name]) => ({ path, Component: (await server.ssrLoadModule(`/src/pages/${name}.jsx`)).default })))
  const paths = [...pages.map(([path]) => path), ...properties.flatMap(property => [`/properties/${property.id}`, `/properties/${property.slug}`]), '/missing', '/properties/missing', '/contact?property=hz-001#property-enquiry', '/properties?saved=1', '/properties?purpose=rent&state=johor']
  for (const path of paths) {
    const markup = renderToString(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(Routes, null,
      React.createElement(Route, { element: React.createElement(Layout) }, definitions.map(({ path: routePath, Component }) => React.createElement(Route, { key: routePath, path: routePath, element: React.createElement(Component) }))))))
    assert.equal((markup.match(/<h1[ >]/g) || []).length, 1, `${path}: one h1`)
    assert.equal((markup.match(/<main[ >]/g) || []).length, 1, `${path}: one main`)
    assert.ok(markup.includes('portfolio demonstration'), `${path}: shared disclosure`)
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])
    assert.equal(new Set(ids).size, ids.length, `${path}: no duplicate DOM IDs`)
    for (const [, raw] of markup.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const href = raw.replaceAll('&amp;', '&')
      if (href.startsWith('#')) assert.ok(ids.includes(href.slice(1)), `${path}: missing anchor ${href}`)
      else if (href.startsWith('/')) assert.ok(routeMetadata(new URL(href, 'https://example.test').pathname).known, `${path}: broken internal link ${href}`)
    }
  }
  for (const property of properties) {
    for (const identifier of [property.id, property.slug]) {
      const metadata = routeMetadata(`/properties/${identifier}/`)
      assert.equal(metadata.title, `${property.title} — Havenza`)
      assert.equal(metadata.path, `/properties/${property.id}`)
      assert.ok(metadata.description.includes('portfolio demonstration'))
      assert.equal(metadata.robots, 'index, follow')
    }
  }
  assert.equal(routeTitle('/ABOUT/'), 'About — Havenza')
  assert.equal(routeTitle('/contact/'), 'Contact — Havenza')
  assert.equal(routeTitle('/properties/%68z-001'), `${properties[0].title} — Havenza`)
  for (const path of ['/missing', '/properties/missing', '/properties/hz-001/extra', '/%E0%A4']) {
    assert.equal(routeMetadata(path).robots, 'noindex, follow')
  }

  // A tiny document fixture verifies metadata replacement/removal, not browser behavior.
  const tags = []
  const doc = {
    title: '',
    head: {
      querySelector(selector) {
        const [, tag, attr, value] = selector.match(/^(\w+)\[([^=]+)="([^"]+)"\]$/)
        return tags.find(node => node.tag === tag && node[attr] === value) || null
      },
      appendChild(node) { tags.push(node) },
    },
    createElement(tag) { return { tag, setAttribute(name, value) { this[name] = value }, remove() { tags.splice(tags.indexOf(this), 1) } } },
  }
  const meta = selector => doc.head.querySelector(selector)
  applyRouteMetadata('/about', doc, '')
  assert.equal(doc.title, 'About — Havenza')
  assert.equal(meta('link[rel="canonical"]'), null)
  applyRouteMetadata('/properties/the-terrace-mont-kiara', doc, 'https://example.test')
  assert.equal(meta('link[rel="canonical"]').href, 'https://example.test/properties/hz-001')
  applyRouteMetadata('/missing', doc, 'https://example.test')
  assert.equal(meta('meta[name="robots"]').content, 'noindex, follow')
  assert.equal(meta('link[rel="canonical"]'), null)
  assert.equal(meta('meta[property="og:url"]'), null)
  applyRouteMetadata('/contact', doc, 'https://example.test')
  assert.equal(meta('meta[name="robots"]').content, 'index, follow')
  assert.equal(meta('meta[property="og:title"]').content, doc.title)
  assert.equal(meta('meta[name="twitter:description"]').content, meta('meta[name="description"]').content)
  assert.equal(tags.filter(tag => tag.name === 'description').length, 1)
  applyRouteMetadata('/contact', doc, '')
  assert.equal(meta('link[rel="canonical"]'), null)

  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  assert.ok(html.includes('lang="en"') && html.includes('/favicon.svg'))
  assert.ok(!/vite\.svg|react\.svg|Vite \+ React/.test(html))
  assert.ok(html.includes('property="og:image"') && html.includes('name="twitter:card"'))
  const png = await readFile(new URL('../public/social-preview.png', import.meta.url))
  assert.equal(png.subarray(1, 4).toString(), 'PNG')
  assert.equal(png.readUInt32BE(16), 1200)
  assert.equal(png.readUInt32BE(20), 630)
  assert.ok(png.length < 300_000)
  const rewritten = await server.transformIndexHtml('/', html)
  assert.ok(rewritten.includes('/social-preview.png'))
  const configure = (await import('../vite.config.js')).default
  const previousOrigin = process.env.VITE_SITE_URL
  try {
    process.env.VITE_SITE_URL = 'https://example.test'
    const configured = configure({ mode: 'production' })
    const social = configured.plugins.find(plugin => plugin.name === 'havenza-social-origin')
    const result = social.transformIndexHtml(html)
    assert.equal((result.match(/content="https:\/\/example.test\/social-preview.png"/g) || []).length, 2)
    for (const invalid of ['http://example.test', 'https://example.test/path', 'https://example.test?x=1', 'https://user:secret@example.test']) {
      process.env.VITE_SITE_URL = invalid
      assert.throws(() => configure({ mode: 'production' }))
    }
  } finally {
    if (previousOrigin === undefined) delete process.env.VITE_SITE_URL
    else process.env.VITE_SITE_URL = previousOrigin
  }
  const hosting = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
  assert.ok(hosting.rewrites.some(rule => rule.source === '/(.*)' && rule.destination === '/index.html'))
  console.log(`PASS: ${paths.length} full-layout route cases, all rendered internal links/anchors, unique IDs, metadata/404 transitions, social image and SPA fallback configuration. Browser QA remains manual.`)
} finally { await server.close() }
