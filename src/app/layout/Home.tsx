import { observer } from 'mobx-react-lite'
import FiveEvents from '../../features/events/FiveEvents'
import FooterComponent from './Footer'
import HeroSection from "./HeroSection"
import Navbar from '../../features/Navbar/navbar.tsx'
import './home.css'
import RecentEvents from '../../features/events/RecentEvents.tsx'
import PopularEvents from '../../features/events/PopularEvents.tsx'
const Home = () => {
  return (
    <div>
      <Navbar/>
      <div className='home-page'>
        <div id="mainScrollContainer">
          <HeroSection />
          <RecentEvents />
          <PopularEvents />
          <FooterComponent />
        </div>
      </div>
    </div>
  )
}

export default observer(Home)
