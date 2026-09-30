import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer className="site-footer"><div className="footer container">
    <div className="footer-top"><p>Different places.<br />Different possibilities.</p><span className="eyebrow">Property Atlas<br />Malaysia / 2026</span></div>
    <Link to="/" className="footer-brand" aria-label="Havenza home">HAVENZA<span aria-hidden="true">↗</span></Link>
    <div className="footer-navigation"><span>Find your place.</span><nav aria-label="Footer navigation"><Link to="/">Home</Link><Link to="/properties">Property Atlas</Link><Link to="/buy">Buy</Link><Link to="/rent">Rent</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></nav></div>
    <div className="footer-bottom"><p>Havenza is a fictional real-estate concept created as a portfolio demonstration.</p><p>Photography is illustrative, not actual listings.</p><a href="#main-content">Back to top ↑</a></div>
  </div></footer>
}
