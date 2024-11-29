import { observer } from 'mobx-react-lite'
import FiveEvents from '../../features/events/FiveEvents'
import FooterComponent from './Footer'
import Navbar from '../../features/Navbar/navbar'
const Home = () => {
  return (
    <div>
      <Navbar/>
      <FiveEvents />
      <FooterComponent />
    </div>
  )
}

export default observer(Home)
