import { useState } from 'react'
import { Link } from 'react-router-dom'
import { properties } from '../../data/properties'
import { enquiryMessage, validateContact } from '../../data/editorialPages'

export default function DemoContactForm({ initialResidence = '' }) {
  const [residence, setResidence] = useState(initialResidence)
  const [message, setMessage] = useState(() => enquiryMessage(initialResidence))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  function selectResidence(event) {
    const next = event.target.value
    setMessage(previous => previous === enquiryMessage(residence) ? enquiryMessage(next) : previous)
    setResidence(next)
  }
  function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = validateContact(Object.fromEntries(new FormData(form)))
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { form.elements.namedItem(Object.keys(nextErrors)[0])?.focus(); return }
    // Demo only: never transmit, persist or log submitted fields.
    form.reset()
    setMessage('')
    setResidence('')
    setSubmitted(true)
  }
  if (submitted) return <div className="contact-demo-success"><p className="eyebrow">Havenza / Demo only</p><h3 tabIndex={-1} ref={element => { element?.focus() }}>Demo enquiry received</h3><p role="status">This portfolio demonstration does not send or store property enquiries.</p><Link className="line-link" to="/properties">Return to Property Atlas <span aria-hidden="true">→</span></Link></div>
  return <form className="contact-demo-form" noValidate onSubmit={submit} aria-label="Demo property enquiry" aria-describedby="contact-demo-disclosure">
    <p id="contact-demo-disclosure" className="contact-demo-disclosure">Demo only — information entered here is not transmitted or stored.</p><p className="contact-required-note">Fields marked * are required.</p>
    {Object.keys(errors).length > 0 && <p className="contact-form-error" role="alert">Please check the marked fields below.</p>}
    <div className="contact-field"><label htmlFor="contact-residence">Residence (optional)</label><select id="contact-residence" name="residence" value={residence} onChange={selectResidence} aria-invalid={Boolean(errors.residence)} aria-describedby={errors.residence ? 'contact-error-residence' : undefined}><option value="">Explore the collection / No preference</option>{properties.map(property => <option key={property.id} value={property.id}>{property.title} — {property.location}</option>)}</select>{errors.residence && <p id="contact-error-residence" className="contact-form-error">{errors.residence}</p>}</div>
    <div className="contact-field-pair">{[{ name: 'name', label: 'Name *', type: 'text', max: 100 }, { name: 'email', label: 'Email *', type: 'email', max: 254 }].map(field => <div className="contact-field" key={field.name}><label htmlFor={`contact-${field.name}`}>{field.label}</label><input id={`contact-${field.name}`} name={field.name} type={field.type} autoComplete={field.name} required maxLength={field.max} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `contact-error-${field.name}` : undefined} />{errors[field.name] && <p id={`contact-error-${field.name}`} className="contact-form-error">{errors[field.name]}</p>}</div>)}</div>
    <div className="contact-field"><label htmlFor="contact-phone">Phone (optional)</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'contact-error-phone' : undefined} />{errors.phone && <p id="contact-error-phone" className="contact-form-error">{errors.phone}</p>}</div>
    <div className="contact-field"><label htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" rows={5} required maxLength={2000} value={message} onChange={event => setMessage(event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-error-message' : undefined} />{errors.message && <p id="contact-error-message" className="contact-form-error">{errors.message}</p>}</div>
    <button type="submit" className="contact-demo-submit">Submit demo enquiry <span aria-hidden="true">→</span></button>
  </form>
}
