import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { createServer } from 'vite'

// Data, route rendering and interaction logic. Does not replace live browser QA.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { properties } = await server.ssrLoadModule('/src/data/properties.js')
  const { formatPrice, lifestyles } = await server.ssrLoadModule('/src/data/discovery.js')
  const { resolveResidence, nextResidence, atlasReturnPath, moveImage, validateEnquiry } = await server.ssrLoadModule('/src/data/residenceDossier.js')
  const Page = (await server.ssrLoadModule('/src/pages/PropertyDetails.jsx')).default
  const render = (identifier, state) => renderToString(React.createElement(MemoryRouter, { initialEntries: [{ pathname: `/properties/${identifier}`, state }] }, React.createElement(Routes, null, React.createElement(Route, { path: '/properties/:propertyId', element: React.createElement(Page) }))))
  for (const property of properties) {
    assert.equal(resolveResidence(property.id), property)
    assert.equal(resolveResidence(property.slug), property)
    for (const field of ['id', 'slug', 'title', 'location', 'state', 'type', 'description', 'atmosphere']) assert.ok(typeof property[field] === 'string' && property[field].length > 0)
    for (const field of ['price', 'bedrooms', 'bathrooms', 'size']) assert.ok(Number.isFinite(property[field]) && property[field] > 0)
    assert.ok(['sale', 'rent'].includes(property.purpose))
    for (const field of ['heading', 'body', 'note']) assert.ok(property.story[field].length > 0)
    assert.ok(property.images.length > 0)
    assert.equal(new Set(property.images.map(image => image.src)).size, property.images.length)
    for (const image of property.images) {
      assert.ok(image.src && image.alt && image.credit)
      const bytes = await readFile(new URL('..' + image.src, import.meta.url))
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF')
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP')
    }
    for (const highlight of property.highlights) assert.ok(property.amenities.includes(highlight.value), 'Highlights must use assigned amenities')
    const next = nextResidence(property)
    assert.ok(next && next.id !== property.id)
    const from = '/properties?purpose=sale&state=selangor&beds=3&sort=price-desc&view=index'
    const markup = render(property.id, { atlasFrom: from }).replace(/<!--.*?-->/g, '')
    const slugMarkup = render(property.slug)
    assert.ok(markup.includes(property.title) && slugMarkup.includes(property.title))
    assert.ok(markup.includes(formatPrice(property)))
    assert.ok(markup.includes(property.story.heading))
    assert.ok(markup.includes(property.story.body))
    assert.ok(markup.includes(`${property.size.toLocaleString('en-MY')}`))
    assert.ok(markup.includes(`${String(property.bedrooms).padStart(2, '0')} bedrooms`))
    assert.ok(markup.includes(`${String(property.bathrooms).padStart(2, '0')} bathrooms`))
    assert.ok(markup.includes(property.type) && markup.includes(property.location) && markup.includes(property.state))
    for (const amenity of property.amenities) assert.ok(markup.includes(amenity))
    for (const id of property.lifestyles) {
      assert.ok(lifestyles.some(lifestyle => lifestyle.id === id))
      assert.ok(markup.includes(`href="/properties?atmosphere=${id}"`))
    }
    assert.equal((markup.match(/<h1[ >]/g) || []).length, 1)
    assert.ok(markup.includes(`href="/properties/${next.id}"`))
    assert.ok(markup.includes('href="/properties?purpose=sale&amp;state=selangor&amp;beds=3&amp;sort=price-desc&amp;view=index"'))
    assert.ok(markup.includes(`aria-label="Save ${property.title}"`))
    assert.ok(markup.includes('aria-haspopup="dialog"'))
    assert.ok(markup.includes('Fictional residence. Photography is illustrative.'))
    assert.ok(markup.includes('loading="eager"') && markup.includes('loading="lazy"'))
    console.log(`PASS: ${property.id} + slug, facts, imagery, amenities, lifestyle, save/enquiry controls and next residence.`)
  }
  assert.equal(nextResidence(properties.at(-1)).id, properties[0].id)
  assert.equal(resolveResidence('not-a-real-property'), null)
  const missing = render('not-a-real-property')
  assert.ok(missing.includes('Residence<br/>not found.') && missing.includes('Return to the Atlas'))
  assert.ok(!missing.includes('residence-dossier'))
  assert.equal(atlasReturnPath({ atlasFrom: '/properties?view=index&purpose=sale&state=selangor&unknown=bad' }), '/properties?purpose=sale&state=selangor&view=index')
  for (const value of [undefined, null, '/properties-other', '/properties/hz-001', '//example.com', 'https://example.com', {}, '/buy', 'javascript:alert(1)']) assert.equal(atlasReturnPath({ atlasFrom: value }), '/properties')
  assert.equal(atlasReturnPath(null), '/properties')
  console.log('PASS: curated cycle, missing route, direct ID/slug rendering and safe Atlas return state.')

  for (const property of properties) {
    const length = property.images.length
    assert.equal(moveImage(length - 1, 1, length), 0)
    assert.equal(moveImage(0, -1, length), length - 1)
  }
  const Viewer = (await server.ssrLoadModule('/src/components/residence/ImageViewer.jsx')).default
  const viewer = renderToString(React.createElement(Viewer, { property: properties[0], initialIndex: 1, onClose: () => {} }))
  assert.ok(viewer.includes('<dialog') && viewer.includes('aria-labelledby="residence-viewer-title"'))
  assert.ok(viewer.includes(properties[0].images[1].src))
  assert.ok(viewer.includes('aria-label="Previous photograph"') && viewer.includes('aria-label="Next photograph"'))
  assert.ok(viewer.includes('role="status"'))
  const Enquiry = (await server.ssrLoadModule('/src/components/residence/EnquiryDialog.jsx')).default
  for (const property of properties) {
    const enquiry = renderToString(React.createElement(Enquiry, { property, onClose: () => {} }))
    for (const name of ['name', 'email', 'phone', 'message']) assert.ok(enquiry.includes(`name="${name}"`))
    assert.ok(enquiry.includes(`interested in ${property.title}.`))
    assert.ok(enquiry.includes('Your enquiry is not sent or stored.'))
  }
  const valid = { name: 'Alex', email: 'alex@example.com', phone: '', message: "I'm interested in this residence." }
  assert.deepEqual(validateEnquiry(valid), {})
  assert.deepEqual(validateEnquiry({ ...valid, phone: '+60 12 345 6789' }), {})
  assert.deepEqual(Object.keys(validateEnquiry({ name: ' ', email: '', message: '\n' })), ['name', 'email', 'message'])
  for (const email of ['invalid', 'a@', '@example.com', 'a b@example.com', 'a@example']) assert.ok(validateEnquiry({ ...valid, email }).email)
  assert.ok(validateEnquiry({ ...valid, name: 'x'.repeat(101) }).name)
  assert.ok(validateEnquiry({ ...valid, message: 'x'.repeat(2001) }).message)
  assert.ok(validateEnquiry({ ...valid, phone: 'x'.repeat(41) }).phone)
  console.log('PASS: image navigation boundaries/viewer rendering and all enquiry fields/defaults/validation cases.')
} finally { await server.close() }
