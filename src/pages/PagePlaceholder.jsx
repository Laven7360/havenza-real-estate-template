import { Link } from 'react-router-dom'

export default function PagePlaceholder({ number, label, title, description, children, parent }) {
  return <section className="page-intro container">
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/"><span aria-hidden="true">←</span> Home</Link>
      <span aria-hidden="true">/</span>
      {parent && <><Link to={parent.to}>{parent.label}</Link><span aria-hidden="true">/</span></>}
      <span aria-current="page">{label}</span>
    </nav>
    <div className="page-intro-body">
      <span className="section-number">{number}</span>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
      {children}
    </div>
  </section>
}
