import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lifestyles, padIndex } from '../../data/discovery'
import PhotoSwap from '../ui/PhotoSwap'

export default function LifeMatch() {
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState(null)
  const lifestyle = lifestyles[active]
  const chosen = selected === active ? lifestyle : null
  return <section className="life-match section-dark" aria-labelledby="life-heading">
    <div className="container life-opening"><p className="eyebrow">03 / Life match</p><h2 id="life-heading"><span>Don’t search for a property.</span><br />Find the way<br className="life-statement-break" />{' '}you want to live.</h2><p>Start with a feeling. Find your place.</p></div>
    <div className="life-stage"><PhotoSwap items={lifestyles.map(item => item.image)} active={active} /><div className="life-shade" />
      <div className="life-interface container">
        <div className="life-choices"><p className="eyebrow life-instructions" id="life-instructions">Choose a word. Discover your index.</p>
          <div className="life-words" role="group" aria-label="Choose your lifestyle" aria-describedby="life-instructions">
            {lifestyles.map((item, index) => <button key={item.id} type="button" className={index === active ? 'is-previewed' : ''} aria-pressed={selected === index} aria-controls="life-result" onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(index) }} onFocus={() => setActive(index)} onClick={() => { setActive(index); setSelected(index) }}>
              <span className="life-word-index">{padIndex(index + 1)}</span><span className="life-word-label">{item.title}</span><span className="life-word-arrow" aria-hidden="true">{selected === index ? '✓' : '+'}</span>
            </button>)}
          </div>
        </div>
        <div className="life-summary">
          <div className="life-description" aria-live="polite" aria-atomic="true"><div key={active} className="life-description-content"><span className="eyebrow life-preview-index">{chosen ? 'Selected' : 'Explore'} / {padIndex(active + 1)} of {padIndex(lifestyles.length)}</span><p>{lifestyle.description}</p><ul>{lifestyle.locations.map(location => <li key={location}>{location}</li>)}</ul></div></div>
          <div className="life-result" id="life-result" aria-live="polite">{chosen ? <><p className="eyebrow">Your index / {chosen.title}</p><p className="match-count">{padIndex(chosen.matches.length)} <span>matches</span></p><Link className="line-link" to={`/properties?atmosphere=${chosen.id}`}>Explore matches <span aria-hidden="true">→</span></Link></> : <p className="life-hint">Choose {lifestyle.title.toLowerCase()} living.<br /><span>Click, tap, or press Enter on the word<br />to see your matches.</span></p>}</div>
        </div>
      </div>
    </div>
  </section>
}
