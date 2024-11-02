import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import AuthProvider from './features/user/Authentication/authProvider';

function App() {
  const location = useLocation();
  console.log("Hello world")
  return (
    <>
      {location.pathname === "/" ? (
        <div> gh</div>
      ) : (
        <>
        <AuthProvider>
          <Outlet />
          </AuthProvider>
        </>
      )}  </>
  )
}



  export default App
