import { Link, useSearchParams } from 'react-router-dom'
import { contactResidence, editorialImages } from '../data/editorialPages'
import DemoContactForm from '../components/contact/DemoContactForm'
import DeveloperContact from '../components/contact/DeveloperContact'
import Photo from '../components/ui/Photo'
import '../styles/editorial.css'

export default function Contact() {
  const [params] = useSearchParams()
  const property = contactResidence(params.get('property'))
  function focusSection(id) { document.getElementById(id)?.focus({ preventScroll: true }) }
  return <div className="editorial-page contact-page">
    <header className="contact-opening container"><nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">← Home</Link><span>/</span><span aria-current="page">Contact</span></nav><div><p className="eyebrow">05 / Contact</p><h1>Start with<br />a place.</h1></div><p>Ask about a fictional residence, explore the collection, or get in touch about the website itself.</p></header>
    <nav className="contact-pathways container" aria-label="Choose your enquiry"><a href="#property-enquiry" onClick={() => focusSection('property-enquiry')}><p className="eyebrow">01 / Fictional property collection</p><h2>Property<br />enquiry.</h2><p>Explore the fictional Havenza collection.<br />This enquiry is a demonstration only.</p><span className="line-link">Start demo enquiry <span aria-hidden="true">→</span></span></a><a href="#developer-enquiry" onClick={() => focusSection('developer-enquiry')}><p className="eyebrow">02 / Website and freelance projects</p><h2>Developer<br />enquiry.</h2><p>Interested in a website like Havenza?<br />Developer contact information is separate.</p><span className="line-link">Contact the developer <span aria-hidden="true">→</span></span></a></nav>
    <section className="contact-property container editorial-split" id="property-enquiry" tabIndex={-1} aria-labelledby="contact-property-heading"><div><p className="eyebrow">01 / Demo property enquiry</p><h2 id="contact-property-heading">A place<br />to begin.</h2><p>Choose a residence or leave the possibilities open. Try the enquiry experience without contacting an agent.</p><Link className="line-link" to="/properties">Look through the Atlas <span aria-hidden="true">↗</span></Link></div><DemoContactForm key={property?.id || 'general'} initialResidence={property?.id || ''} /></section>
    <section className="contact-photo-moment" aria-labelledby="contact-photo-heading"><Photo image={editorialImages.contact} /><div className="editorial-photo-shade" /><div className="container"><p className="eyebrow">A thought on beginnings</p><h2 id="contact-photo-heading">Every place<br />starts with<br />a conversation.</h2></div></section>
    <DeveloperContact />
    <section className="contact-explore container" aria-labelledby="contact-explore-heading"><h2 id="contact-explore-heading">Keep<br />exploring.</h2><nav aria-label="Continue exploring"><Link to="/properties">Property Atlas <span aria-hidden="true">↗</span></Link><Link to="/buy">Buy <span aria-hidden="true">↗</span></Link><Link to="/rent">Rent <span aria-hidden="true">↗</span></Link></nav></section>
  </div>
}
