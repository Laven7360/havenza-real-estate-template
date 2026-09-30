import { resolveResidence } from './residenceDossier'

export const siteDescription = 'Havenza is a fictional Malaysian property discovery experience created as a web design and development portfolio project.'
export function routeTitle(pathname) {
  let path
  try { path = decodeURIComponent(pathname).replace(/\/+$/, '') || '/' } catch { path = pathname }
  if (path === '/') return 'Havenza — The Property Atlas'
  const titles = { '/properties': 'Property Atlas', '/buy': 'Buy Property', '/rent': 'Rent Property', '/about': 'About', '/contact': 'Contact' }
  if (titles[path.toLowerCase()]) return `${titles[path.toLowerCase()]} — Havenza`
  const match = path.match(/^\/properties\/([^/]+)$/i)
  if (match) return `${resolveResidence(match[1])?.title || 'Residence not found'} — Havenza`
  return '404 — Off the Atlas — Havenza'
}

export function routeMetadata(pathname) {
  let path
  try { path = decodeURIComponent(pathname).replace(/\/+$/, '') || '/' } catch { path = pathname }
  const descriptions = {
    '/': siteDescription,
    '/properties': 'Explore eight fictional Malaysian residences by place, purpose, space and atmosphere in the Havenza Property Atlas. A portfolio demonstration.',
    '/buy': 'Explore the ownership collection in Havenza, a fictional Malaysian property discovery portfolio. No properties are offered for sale.',
    '/rent': 'Discover the rental collection in Havenza, a fictional Malaysian property discovery portfolio. No properties are offered for rent.',
    '/about': 'The ideas behind Havenza: place, space and everyday life. Learn about this fictional Malaysian property discovery portfolio project.',
    '/contact': 'Try a demo property enquiry or learn how to contact the website developer. Havenza does not send or store property enquiries.',
  }
  const match = path.match(/^\/properties\/([^/]+)$/i)
  const residence = match ? resolveResidence(match[1]) : null
  const known = Boolean(descriptions[path.toLowerCase()] || residence)
  return {
    title: routeTitle(pathname),
    description: residence ? `${residence.title}, ${residence.location}. ${residence.description} Illustrative photography; portfolio demonstration only.` : descriptions[path.toLowerCase()] || 'This place is off the Havenza Atlas. Return home or explore the fictional residence collection.',
    path: residence ? `/properties/${residence.id}` : path.toLowerCase(),
    robots: known ? 'index, follow' : 'noindex, follow',
    known,
  }
}

// Client navigation metadata. Social crawlers receive the static build-time head.
export function applyRouteMetadata(pathname, doc = document, siteUrl = import.meta.env.VITE_SITE_URL) {
  const metadata = routeMetadata(pathname)
  doc.title = metadata.title
  for (const [attribute, name, content] of [
    ['name', 'description', metadata.description],
    ['name', 'robots', metadata.robots],
    ['property', 'og:title', metadata.title],
    ['property', 'og:description', metadata.description],
    ['name', 'twitter:title', metadata.title],
    ['name', 'twitter:description', metadata.description],
  ]) {
    let tag = doc.head.querySelector(`meta[${attribute}="${name}"]`)
    if (!tag) { tag = doc.createElement('meta'); tag.setAttribute(attribute, name); doc.head.appendChild(tag) }
    tag.setAttribute('content', content)
  }
  for (const [selector, type] of [['link[rel="canonical"]', 'canonical'], ['meta[property="og:url"]', 'url']]) {
    let tag = doc.head.querySelector(selector)
    if (!siteUrl || !metadata.known) { tag?.remove(); continue }
    const url = new URL(metadata.path, siteUrl).href
    if (!tag) {
      tag = doc.createElement(type === 'canonical' ? 'link' : 'meta')
      tag.setAttribute(type === 'canonical' ? 'rel' : 'property', type === 'canonical' ? 'canonical' : 'og:url')
      doc.head.appendChild(tag)
    }
    tag.setAttribute(type === 'canonical' ? 'href' : 'content', url)
  }
}
