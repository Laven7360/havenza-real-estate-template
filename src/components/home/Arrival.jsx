import { Link } from 'react-router-dom'
import { useRef } from 'react'
import Photo from '../ui/Photo'
import { photography } from '../../data/photography'
import useScrollProgress from '../../hooks/useScrollProgress'

export default function Arrival() {
  const stage = useRef(null)
  useScrollProgress(stage)
  return <div ref={stage} className="arrival-stage">
    <section className="arrival" aria-labelledby="arrival-heading">
      <Photo image={photography.courtyard} eager className="arrival-image" />
      <div className="arrival-shade" />
      <div className="arrival-content container">
        <p className="eyebrow arrival-kicker">A different perspective on home.</p>
        <h1 id="arrival-heading"><span>Where</span><span>would you live</span><span>next<span className="hero-question">?</span></span></h1>
        <div className="arrival-bottom"><div><p>Places for the life you’re building.</p><Link to="/properties" className="line-link">Begin exploring <span aria-hidden="true">↘</span></Link></div><p className="arrival-edition eyebrow">HAV / 001<br />Malaysia<br />Property Atlas / 2026</p><span className="arrival-index">01 <span>/ 05</span></span></div>
      </div>
    </section>
  </div>
}
