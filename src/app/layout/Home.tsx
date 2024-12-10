import { observer } from 'mobx-react-lite'
import FiveEvents from '../../features/events/FiveEvents'
import FooterComponent from './Footer'

const Home = () => {
  return (
    <div>
      <FiveEvents />
      <FooterComponent />
    </div>
  )
}

export default observer(Home)
