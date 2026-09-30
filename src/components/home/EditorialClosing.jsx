import { Link } from 'react-router-dom'
import Photo from '../ui/Photo'
import Reveal from '../ui/Reveal'
import { photography } from '../../data/photography'

export default function EditorialClosing() {
  return <><section className="editorial container" aria-labelledby="editorial-heading"><div><p className="eyebrow">A note on living</p><Reveal><h2 id="editorial-heading">A home is not<br />a set of numbers.</h2></Reveal><p className="editorial-note">It’s where your ordinary days happen.</p></div><Photo image={photography.doorway} /></section>
    <section className="closing" aria-labelledby="closing-heading"><Photo image={photography.closingGarden} /><div className="closing-shade" /><div className="closing-content container"><p className="eyebrow">Your next chapter starts somewhere.</p><Reveal><h2 id="closing-heading">Ready to find<br />your place?</h2></Reveal><Link to="/properties" className="line-link">Explore the atlas <span aria-hidden="true">↗</span></Link><span className="closing-signature">HAVENZA / MY</span></div></section></>
}
