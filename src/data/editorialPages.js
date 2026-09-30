import { properties } from './properties'
import { photography } from './photography'
import { validateEnquiry } from './residenceDossier'

export const representedPlaces = [...new Set(properties.map(property => property.state))].map(state => ({
  state,
  residences: properties.filter(property => property.state === state),
}))
export const editorialImages = {
  aboutOpening: photography.botanicalDetail,
  malaysia: [properties[0].image, properties.find(property => property.state !== properties[0].state && property.featured).image],
  aboutClosing: photography.courtyard,
  contact: photography.courtyardDetail,
}
export const contactResidence = id => properties.find(property => property.id === id) || null
export const enquiryMessage = id => {
  const property = contactResidence(id)
  return property ? `I'm interested in ${property.title}.` : ''
}
export function validateContact(values) {
  const errors = validateEnquiry(values)
  if (values.residence && !contactResidence(values.residence)) errors.residence = 'Please choose a residence from the list.'
  return errors
}
