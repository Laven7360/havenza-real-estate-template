import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { properties } = await server.ssrLoadModule('/src/data/properties.js')
  const { representedPlaces, contactResidence, enquiryMessage, validateContact } = await server.ssrLoadModule('/src/data/editorialPages.js')
  const { developer, developerActions } = await server.ssrLoadModule('/src/data/developer.js')
  const { readDiscovery, filterProperties } = await server.ssrLoadModule('/src/data/propertyDiscovery.js')
  const About = (await server.ssrLoadModule('/src/pages/About.jsx')).default
  const Contact = (await server.ssrLoadModule('/src/pages/Contact.jsx')).default
  const Developer = (await server.ssrLoadModule('/src/components/contact/DeveloperContact.jsx')).default
  const render = (Page, route) => renderToString(React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(Page)))
  assert.deepEqual(representedPlaces.map(place => place.state), [...new Set(properties.map(property => property.state))])
  const about = render(About, '/about')
  assert.equal((about.match(/<h1[ >]/g) || []).length, 1)
  assert.ok(about.includes('No properties are actually offered for sale or rent through Havenza.'))
  assert.ok(!/properties sold|years in business|award-winning|licensed agents/i.test(about))
  for (const place of representedPlaces) {
    assert.deepEqual(place.residences, properties.filter(property => property.state === place.state))
    assert.ok(about.includes(place.state))
  }
  for (const match of about.matchAll(/href="(\/properties[^"#]*)"/g)) {
    assert.ok(filterProperties(properties, readDiscovery(match[1].split('?')[1] || '')).length)
  }
  for (const property of properties) {
    assert.equal(contactResidence(property.id), property)
    assert.ok(enquiryMessage(property.id).includes(property.title))
    const contact = render(Contact, `/contact?property=${property.id}`)
    assert.ok(contact.includes(`value="${property.id}" selected=""`), 'Correct preselected option')
    assert.ok(contact.includes(`interested in ${property.title}.`))
    for (const item of properties) assert.ok(contact.includes(`value="${item.id}"`))
    assert.equal((contact.match(/<option /g) || []).length, properties.length + 1)
    assert.equal((contact.match(/<h1[ >]/g) || []).length, 1)
  }
  assert.equal(contactResidence('missing'), null)
  const invalid = render(Contact, '/contact?property=not-real')
  assert.ok(invalid.includes('value="" selected=""'))
  assert.ok(invalid.includes('Demo only — information entered here is not transmitted or stored.'))
  for (const name of ['name', 'email', 'phone', 'message', 'residence']) assert.ok(invalid.includes(`name="${name}"`))
  for (const path of ['/properties', '/buy', '/rent', '#property-enquiry', '#developer-enquiry']) assert.ok(invalid.includes(`href="${path}"`))
  const valid = { residence: properties[0].id, name: 'Example', email: 'example@example.com', phone: '', message: 'A demo question.' }
  assert.deepEqual(validateContact(valid), {})
  assert.deepEqual(validateContact({ ...valid, residence: '' }), {})
  assert.ok(validateContact({ ...valid, residence: 'invalid' }).residence)
  assert.deepEqual(Object.keys(validateContact({ name: ' ', email: '', message: '\n' })), ['name', 'email', 'message'])
  assert.ok(validateContact({ ...valid, email: 'invalid' }).email)
  assert.ok(validateContact({ ...valid, message: 'x'.repeat(2001) }).message)
  assert.deepEqual(developerActions({}), [])
  assert.deepEqual(developerActions(), developerActions(developer))
  const publicActions = developerActions()
  const whatsapp = new URL(publicActions.find(action => action.label === 'WhatsApp the developer').href)
  assert.equal(whatsapp.origin, 'https://wa.me')
  assert.equal(whatsapp.pathname, '/60167938894')
  assert.equal(whatsapp.searchParams.get('text'), 'Hi, I came across your Havenza real-estate website project and would like to enquire about a website.')
  assert.equal(publicActions.find(action => action.label === 'Email the developer').href, 'mailto:s.lavenraj2002@gmail.com')
  assert.equal(publicActions.find(action => action.label === 'Developer GitHub profile').href, 'https://github.com/Laven7360')
  const published = renderToString(React.createElement(Developer))
  assert.ok(published.includes('LAVEN RAJ A/L SAHADEVAN'))
  assert.ok(published.includes('not a property-agent service'))
  assert.equal((published.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 2)
  const empty = renderToString(React.createElement(Developer, { config: {} }))
  assert.ok(empty.includes('not published in this demonstration'))
  assert.ok(!empty.includes('<a '))
  // Synthetic fixtures only; never published as actual developer contacts.
  const configured = renderToString(React.createElement(Developer, { config: { email: 'developer@example.com', whatsapp: '+60123456789', portfolio: 'https://example.com', github: 'https://github.com/example' } }))
  assert.ok(configured.includes('mailto:developer@example.com'))
  assert.ok(configured.includes('https://wa.me/60123456789'))
  assert.ok(configured.includes('rel="noopener noreferrer"'))
  assert.deepEqual(developerActions({ email: 'bad\n@example.com', whatsapp: 'not-a-number', portfolio: 'javascript:alert(1)', github: 'http://example.com' }), [])
  const source = await readFile(new URL('../src/components/contact/DemoContactForm.jsx', import.meta.url), 'utf8')
  assert.ok(!/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|console\.|sendBeacon/.test(source))
  assert.ok(source.includes('form.reset()') && source.includes("setMessage('')"))
  const dossierForm = await readFile(new URL('../src/components/residence/EnquiryDialog.jsx', import.meta.url), 'utf8')
  assert.ok(!/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|console\.|sendBeacon/.test(dossierForm))
  assert.ok(source.includes('event.preventDefault()') && dossierForm.includes('event.preventDefault()'))
  const Footer = (await server.ssrLoadModule('/src/components/layout/Footer.jsx')).default
  const footer = render(Footer, '/contact')
  for (const path of ['/properties', '/buy', '/rent', '/about', '/contact']) assert.ok(footer.includes(`href="${path}"`))
  console.log('PASS: About data/states/Atlas links/transparency; every Contact preselection and option; invalid query fallback; validation; conditional developer links; submission privacy guard; footer routes.')
} finally { await server.close() }
