import { Outlet, useLocation } from 'react-router-dom'
import './App.css'

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" ? (
        <div> gh</div>
      ) : (
        <>
          <Outlet />
        </>
      )}  </>
  )
}



  export default App
