import { Link } from 'react-router-dom'

export default function NotFound() {
  return <section className="off-atlas container"><nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">← Home</Link><span>/</span><span aria-current="page">Not found</span></nav><p className="eyebrow">404 / Off the Atlas</p><h1>This place<br />doesn’t exist.</h1><p>A little off the map. Let’s find somewhere familiar.</p><div><Link className="line-link" to="/">Return home <span aria-hidden="true">→</span></Link><Link className="line-link" to="/properties">Property Atlas <span aria-hidden="true">→</span></Link></div></section>
}
