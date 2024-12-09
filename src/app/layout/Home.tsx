import { observer } from 'mobx-react-lite'
import FiveEvents from '../../features/events/FiveEvents'
import FooterComponent from './Footer'
import Navbar from '../../features/Navbar/navbar.tsx'
import './home.css'
const Home = () => {
  return (
    <div>
      <Navbar/>
      <div className='home-page'>
        <FiveEvents />
        <FooterComponent />
      </div>
    </div>
  )
}

export default observer(Home)
