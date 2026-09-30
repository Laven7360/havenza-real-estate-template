import { properties } from './properties'

export const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const optionsFrom = field => [...new Set(properties.map(property => property[field]))].map(label => ({ value: slugify(label), label, count: properties.filter(property => property[field] === label).length }))
export const placeOptions = optionsFrom('state')
export const typeOptions = optionsFrom('type')
export const atmosphereOptions = [...new Set(properties.flatMap(property => property.lifestyles))].map(value => ({ value, label: value[0].toUpperCase() + value.slice(1), count: properties.filter(property => property.lifestyles.includes(value)).length }))
export const purposeOptions = ['sale', 'rent'].map(value => ({ value, label: value === 'sale' ? 'Buy' : 'Rent', count: properties.filter(property => property.purpose === value).length }))
export const sortOptions = [
  { value: 'curated', label: 'Curated' },
  { value: 'price-asc', label: 'Price — low to high' },
  { value: 'price-desc', label: 'Price — high to low' },
  { value: 'size-desc', label: 'Space — largest' },
]
export const defaults = { purpose: '', state: '', type: '', beds: '', min: '', max: '', atmosphere: '', sort: 'curated', view: 'atlas', saved: '' }
export const filterKeys = ['purpose', 'state', 'type', 'beds', 'min', 'max', 'atmosphere', 'saved']

export function readDiscovery(search) {
  const params = new URLSearchParams(search)
  const result = { ...defaults }
  const allowed = { purpose: purposeOptions, state: placeOptions, type: typeOptions, atmosphere: atmosphereOptions, sort: sortOptions, view: [{ value: 'atlas' }, { value: 'index' }], beds: [1, 2, 3, 4].map(value => ({ value: String(value) })), saved: [{ value: '1' }] }
  for (const [key, options] of Object.entries(allowed)) {
    const value = params.get(key)
    if (options.some(option => option.value === value)) result[key] = value
  }
  for (const key of ['min', 'max']) {
    const value = params.get(key)
    if (value && /^\d+(\.\d{1,2})?$/.test(value) && Number.isSafeInteger(Math.round(Number(value) * 100))) result[key] = String(Number(value))
  }
  // Shared links with reversed endpoints become a useful, ordered range.
  if (result.min !== '' && result.max !== '' && Number(result.min) > Number(result.max)) [result.min, result.max] = [result.max, result.min]
  return result
}

export function writeDiscovery(value) {
  const params = new URLSearchParams()
  for (const key of Object.keys(defaults)) if (value[key] !== undefined && value[key] !== defaults[key] && value[key] !== '') params.set(key, value[key])
  return params
}

export function filterProperties(source, filters, savedIds = []) {
  const result = source.filter(property =>
    (!filters.purpose || property.purpose === filters.purpose) &&
    (!filters.state || slugify(property.state) === filters.state) &&
    (!filters.type || slugify(property.type) === filters.type) &&
    (!filters.beds || property.bedrooms >= Number(filters.beds)) &&
    (filters.min === '' || property.price >= Number(filters.min)) &&
    (filters.max === '' || property.price <= Number(filters.max)) &&
    (!filters.atmosphere || property.lifestyles.includes(filters.atmosphere)) &&
    (!filters.saved || savedIds.includes(property.id)))
  if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price)
  if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price)
  if (filters.sort === 'size-desc') result.sort((a, b) => b.size - a.size)
  return result
}

export const resolveActive = (results, id) => results.find(property => property.id === id) || results[0] || null
export const resetDiscovery = filters => ({ ...defaults, view: filters.view, sort: filters.sort })
export function describeFilters(filters) {
  const labels = []
  for (const [key, options] of [['purpose', purposeOptions], ['state', placeOptions], ['type', typeOptions], ['atmosphere', atmosphereOptions]]) {
    const option = options.find(item => item.value === filters[key])
    if (option) labels.push(option.label)
  }
  if (filters.beds) labels.push(`${filters.beds}+ bedrooms`)
  if (filters.min !== '' || filters.max !== '') labels.push(`RM ${filters.min === '' ? '0' : Number(filters.min).toLocaleString('en-MY')}–${filters.max === '' ? 'any' : Number(filters.max).toLocaleString('en-MY')}`)
  if (filters.saved) labels.push('Saved residences')
  return labels.length ? labels.join(' / ') : 'All residences'
}
