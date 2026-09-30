import { properties } from './properties'
import { readDiscovery, writeDiscovery } from './propertyDiscovery'

export const resolveResidence = id => properties.find(property => property.id === id || property.slug === id) || null
export function nextResidence(property) {
  const index = properties.findIndex(item => item.id === property.id)
  return properties[(index + 1) % properties.length]
}
export function atlasReturnPath(state) {
  const path = state?.atlasFrom
  if (typeof path !== 'string' || !/^\/properties(?:\?|$)/.test(path)) return '/properties'
  const query = writeDiscovery(readDiscovery(path.split('?')[1] || '')).toString()
  return `/properties${query ? `?${query}` : ''}`
}
export const moveImage = (index, direction, length) => length > 0 ? (index + direction + length) % length : 0
export function validateEnquiry(values) {
  const errors = {}
  if (!values.name?.trim()) errors.name = 'Please enter your name.'
  else if (values.name.trim().length > 100) errors.name = 'Please use 100 characters or fewer.'
  if (!values.email?.trim()) errors.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.email.length > 254) errors.email = 'Please enter a valid email address.'
  if (values.phone && values.phone.length > 40) errors.phone = 'Please use 40 characters or fewer.'
  if (!values.message?.trim()) errors.message = 'Please add a message.'
  else if (values.message.trim().length > 2000) errors.message = 'Please use 2,000 characters or fewer.'
  return errors
}
