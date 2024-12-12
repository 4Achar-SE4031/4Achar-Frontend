import { observer } from 'mobx-react-lite'
import FiveEvents from '../../features/events/FiveEvents'
import FooterComponent from './Footer'
import HeroSection from "./HeroSection"

const Home = () => {
  return (
    <div id="mainScrollContainer">
      <HeroSection />
      <FiveEvents />
      <FooterComponent />
    </div>
  )
}

export default observer(Home)
