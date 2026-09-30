import { useState } from 'react'
import ResidenceDialog from './ResidenceDialog'
import { validateEnquiry } from '../../data/residenceDossier'

export default function EnquiryDialog({ property, onClose }) {
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    const nextErrors = validateEnquiry(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { form.elements.namedItem(Object.keys(nextErrors)[0])?.focus(); return }
    // No network, analytics, storage or logging of enquiry contents.
    form.reset()
    setSubmitted(true)
  }
  return <ResidenceDialog labelId="enquiry-heading" className="residence-enquiry" onClose={onClose}>
    <header><p className="eyebrow">Havenza / Residence enquiry</p><button type="button" onClick={onClose}>Close ×</button></header>
    {submitted ? <div className="enquiry-confirmation"><p className="eyebrow">For {property.title}</p><h2 id="enquiry-heading" tabIndex={-1} ref={element => { element?.focus() }}>Demo enquiry</h2><p>This portfolio demonstration does not send or store property enquiries.</p><button type="button" className="line-link" onClick={onClose}>Return to the residence <span aria-hidden="true">→</span></button></div> : <>
      <div className="enquiry-intro"><h2 id="enquiry-heading">A conversation<br />about this place.</h2><p>{property.title} / {property.location}</p><p id="enquiry-disclosure">Demo only. Your enquiry is not sent or stored.</p></div>
      <form noValidate onSubmit={submit} className="residence-enquiry-form" aria-describedby="enquiry-disclosure">
        <p className="eyebrow">Name, email and message are required.</p>
        {Object.keys(errors).length > 0 && <p role="alert" className="enquiry-errors">Please check the marked fields below.</p>}
        {[{ name: 'name', label: 'Name', type: 'text', max: 100, autocomplete: 'name' }, { name: 'email', label: 'Email', type: 'email', max: 254, autocomplete: 'email' }, { name: 'phone', label: 'Phone (optional)', type: 'tel', max: 40, autocomplete: 'tel' }].map(field => <div key={field.name}><label htmlFor={`enquiry-${field.name}`}>{field.label}</label><input id={`enquiry-${field.name}`} name={field.name} type={field.type} autoComplete={field.autocomplete} required={field.name !== 'phone'} maxLength={field.max} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} />{errors[field.name] && <p id={`error-${field.name}`} className="field-error">{errors[field.name]}</p>}</div>)}
        <div><label htmlFor="enquiry-message">Message</label><textarea id="enquiry-message" name="message" rows={4} required maxLength={2000} defaultValue={`I'm interested in ${property.title}.`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'error-message' : undefined} />{errors.message && <p className="field-error" id="error-message">{errors.message}</p>}</div>
        <button type="submit" className="dossier-primary" aria-describedby="enquiry-disclosure">Preview demo enquiry <span aria-hidden="true">→</span></button>
      </form>
    </>}
  </ResidenceDialog>
}
