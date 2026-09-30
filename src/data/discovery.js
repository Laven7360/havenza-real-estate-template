import { properties } from './properties'
import { photography } from './photography'

export const atlasProperties = ['hz-003', 'hz-001', 'hz-002', 'hz-004', 'hz-006', 'hz-007'].map(id => properties.find(property => property.id === id))
export const livingIndex = [
  { id: 'hz-001', feeling: 'High above the city' },
  { id: 'hz-002', feeling: 'Behind the trees' },
  { id: 'hz-004', feeling: 'Room for everyone' },
  { id: 'hz-007', feeling: 'A quieter future' },
].map(item => ({ ...item, property: properties.find(property => property.id === item.id) }))

export const lifestyles = [
  { id: 'connected', title: 'Connected', description: 'Everything within reach.', locations: ['KLCC', 'Mont Kiara', 'Bangsar'], image: photography.towers },
  { id: 'quiet', title: 'Quiet', description: 'A little distance from the noise.', locations: ['Shah Alam', 'Subang Jaya'], image: photography.garden },
  { id: 'open', title: 'Open', description: 'More room for the life around you.', locations: ['Petaling Jaya', 'Subang Jaya'], image: photography.interior },
  { id: 'green', title: 'Green', description: 'Closer to landscape.', locations: ['Cyberjaya', 'Shah Alam'], image: photography.retreat },
].map(lifestyle => ({ ...lifestyle, matches: properties.filter(property => property.lifestyles.includes(lifestyle.id)) }))

export function formatPrice(property) {
  return `RM ${property.price.toLocaleString('en-MY')}${property.purpose === 'rent' ? ' / month' : ''}`
}

export const padIndex = number => String(number).padStart(2, '0')
