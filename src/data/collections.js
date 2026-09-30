import { properties } from './properties'
import { lifestyles } from './discovery'
import { defaults, filterProperties, placeOptions, writeDiscovery } from './propertyDiscovery'
import { photography } from './photography'

export const collectionPath = (purpose, filters = {}) => `/properties?${writeDiscovery({ ...defaults, ...filters, purpose })}`
export function getCollection(purpose) {
  const residences = filterProperties(properties, { ...defaults, purpose })
  const selected = purpose === 'sale'
    ? [...residences].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3)
    : residences
  const places = placeOptions.map(place => ({ ...place, matches: filterProperties(residences, { ...defaults, state: place.value }) })).filter(place => place.matches.length)
  const atmospheres = lifestyles.map(lifestyle => ({ ...lifestyle, matches: filterProperties(residences, { ...defaults, atmosphere: lifestyle.id }) })).filter(lifestyle => lifestyle.matches.length)
  const grounding = selected.find(property => property.images.length > 1 && property.type === 'Semi-detached house') || selected[0]
  return { purpose, residences, selected, places, atmospheres, path: collectionPath(purpose),
    hero: purpose === 'sale' ? grounding.images.at(-1) : photography.urbanResidence,
    closing: purpose === 'sale' ? (residences.find(property => !selected.includes(property)) || residences[0]).image : photography.courtyardDetail,
    editorial: photography.closingGarden,
  }
}
