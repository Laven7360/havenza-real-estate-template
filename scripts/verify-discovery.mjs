import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

// Data, query, persistence and server-rendering checks; not browser interaction tests.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { properties } = await server.ssrLoadModule('/src/data/properties.js')
  const model = await server.ssrLoadModule('/src/data/propertyDiscovery.js')
  const { defaults, readDiscovery, writeDiscovery, filterProperties, resetDiscovery, resolveActive } = model
  const ids = query => filterProperties(properties, readDiscovery(query)).map(property => Number(property.id.slice(-3)))
  assert.deepEqual(ids(''), [1, 2, 3, 4, 5, 6, 7, 8])
  const cases = {
    purpose: { sale: [1, 2, 4, 6, 8], rent: [3, 5, 7] },
    state: { 'kuala-lumpur': [1, 2, 3], selangor: [4, 5, 6, 7], johor: [8] },
    type: { condominium: [1, 3, 4, 8], 'terrace-house': [2, 5], 'semi-detached-house': [6], studio: [7] },
    beds: { 1: [1, 2, 3, 4, 5, 6, 7, 8], 2: [1, 2, 3, 4, 5, 6, 8], 3: [1, 2, 4, 5, 6, 8], 4: [2, 5, 6] },
    atmosphere: { connected: [1, 2, 3], quiet: [5, 6], open: [4, 5], green: [6, 7] },
  }
  let combinations = 0
  function checkCombinations(entries, query = new URLSearchParams(), expected = [1, 2, 3, 4, 5, 6, 7, 8]) {
    if (!entries.length) { assert.deepEqual(ids(query), expected, query.toString()); combinations++; return }
    const [[key, values], ...remaining] = entries
    for (const [value, expectedIds] of [['', [1, 2, 3, 4, 5, 6, 7, 8]], ...Object.entries(values)]) {
      const next = new URLSearchParams(query)
      if (value) next.set(key, value)
      checkCombinations(remaining, next, expected.filter(id => expectedIds.includes(id)))
    }
  }
  checkCombinations(Object.entries(cases))
  assert.deepEqual(ids('purpose=sale&state=selangor&beds=3'), [4, 6])
  assert.deepEqual(ids('min=3200&max=5800'), [3, 5])
  assert.deepEqual(ids('min=5800&max=3200'), [3, 5])
  assert.deepEqual(ids('purpose=sale&min=880000&max=1750000'), [1, 4, 6])
  assert.deepEqual(ids('min=0&max=0'), [])
  assert.deepEqual(ids('purpose=rent&state=johor'), [])
  assert.deepEqual(readDiscovery('purpose=buy&state=moon&type=castle&beds=-1&atmosphere=nope&sort=newest&view=grid&min=NaN&max=Infinity&saved=yes'), defaults)
  for (const value of ['-1', '1e8', '3.555', '900719925474099200', 'Infinity', 'abc']) assert.equal(readDiscovery(`min=${value}`).min, '')
  const query = 'purpose=sale&state=selangor&type=condominium&beds=3&min=500000&max=900000&atmosphere=open&sort=price-desc&view=index&saved=1'
  assert.equal(writeDiscovery(readDiscovery(query)).toString(), query)
  assert.deepEqual(readDiscovery(writeDiscovery(readDiscovery(query))), readDiscovery(query), 'Refresh round trip')
  assert.equal(writeDiscovery(readDiscovery('unknown=value&purpose=sale&purpose=rent')).toString(), 'purpose=sale')
  assert.deepEqual(resetDiscovery(readDiscovery(query)), { ...defaults, view: 'index', sort: 'price-desc' })
  assert.deepEqual(ids('sort=price-asc'), [7, 5, 3, 8, 4, 1, 6, 2])
  assert.deepEqual(ids('sort=price-desc'), [2, 6, 1, 4, 8, 3, 5, 7])
  assert.deepEqual(ids('sort=size-desc'), [6, 2, 5, 1, 4, 8, 3, 7])
  assert.deepEqual(ids('sort=curated'), [1, 2, 3, 4, 5, 6, 7, 8])
  const rent = filterProperties(properties, readDiscovery('purpose=rent'))
  assert.equal(resolveActive(rent, 'hz-005').id, 'hz-005')
  assert.equal(resolveActive(rent, 'hz-001').id, 'hz-003')
  assert.equal(resolveActive([], 'hz-001'), null)
  assert.deepEqual(model.placeOptions.map(place => place.count), [3, 4, 1])
  for (const property of properties) assert.equal(property.images[0], property.image)
  console.log(`PASS: ${combinations} filter combinations; price boundaries, no results, normalized URL round trips, all sorts, reset, counts and active fallback.`)

  const saved = await server.ssrLoadModule('/src/hooks/useSavedProperties.js')
  for (const value of [null, '{broken', '{}', 'true', '42']) assert.deepEqual(saved.parseSaved(value), [])
  assert.deepEqual(saved.parseSaved('["hz-001","hz-001","missing",1,"hz-008"]'), ['hz-001', 'hz-008'])
  const memory = new Map([[saved.SAVED_KEY, '["hz-008"]']])
  globalThis.window = { localStorage: { getItem: key => memory.get(key), setItem: (key, value) => memory.set(key, value) } }
  saved.toggleSaved('hz-001')
  assert.deepEqual(JSON.parse(memory.get(saved.SAVED_KEY)), ['hz-008', 'hz-001'])
  saved.toggleSaved('hz-008')
  assert.deepEqual(JSON.parse(memory.get(saved.SAVED_KEY)), ['hz-001'])
  saved.toggleSaved('invalid')
  assert.deepEqual(JSON.parse(memory.get(saved.SAVED_KEY)), ['hz-001'])
  assert.deepEqual(filterProperties(properties, readDiscovery('saved=1'), ['hz-001']).map(property => property.id), ['hz-001'])
  window.localStorage.setItem = () => { throw new Error('Storage unavailable') }
  assert.doesNotThrow(() => saved.toggleSaved('hz-002'))
  delete globalThis.window
  console.log('PASS: saved ID validation, load/save/unsave persistence, saved-only filtering and unavailable-storage fallback.')

  const Page = (await server.ssrLoadModule('/src/pages/Properties.jsx')).default
  const render = query => renderToString(React.createElement(MemoryRouter, { initialEntries: [`/properties${query}`] }, React.createElement(Page)))
  for (const query of ['', '?purpose=rent', '?state=selangor&beds=3', '?view=index', '?view=index&sort=price-asc', '?atmosphere=green', '?purpose=invalid', '?purpose=rent&state=johor', '?saved=1']) {
    const markup = render(query)
    const result = filterProperties(properties, readDiscovery(query))
    assert.equal((markup.match(/class="discovery-row /g) || []).length, result.length, query)
    assert.equal((markup.match(/<h1[ >]/g) || []).length, 1)
    assert.ok(markup.includes('href="/"'))
    assert.ok(markup.includes('Fictional residences. Photography is illustrative.'))
    for (const property of result) assert.ok(markup.includes(`href="/properties/${property.id}"`))
    if (!result.length) assert.ok(markup.includes('matches that index.'))
    else if (query.includes('view=index')) assert.ok(!markup.includes('class="discovery-stage"'))
    else assert.ok(markup.includes('class="discovery-stage"'))
  }
  for (const atmosphere of ['connected', 'quiet', 'open', 'green']) assert.ok(ids(`atmosphere=${atmosphere}`).length)
  console.log('PASS: Atlas/Index rendering, filtered result counts, detail links, no-results and homepage lifestyle query destinations.')
} finally {
  delete globalThis.window
  await server.close()
}
