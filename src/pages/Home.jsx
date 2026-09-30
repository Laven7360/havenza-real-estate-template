import Arrival from '../components/home/Arrival'
import PropertyAtlas from '../components/home/PropertyAtlas'
import ResidenceChapters from '../components/home/ResidenceChapters'
import LifeMatch from '../components/home/LifeMatch'
import LivingIndex from '../components/home/LivingIndex'
import PropertyRail from '../components/home/PropertyRail'
import EditorialClosing from '../components/home/EditorialClosing'
import '../styles/home.css'

export default function Home() {
  return <div className="home"><Arrival /><PropertyAtlas /><ResidenceChapters /><LifeMatch /><LivingIndex /><PropertyRail /><EditorialClosing /></div>
}
