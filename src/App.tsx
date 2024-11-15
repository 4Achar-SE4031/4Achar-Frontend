import { Outlet, useLocation } from 'react-router-dom'
import './App.css'

function App() {
  const location = useLocation();
  console.log("Hello world")
  return (
    <>
      {location.pathname === "/" ? (
        <div></div>
      ) : (
        <>
          <Outlet />
        </>
      )}  </>
  )
}



  export default App
