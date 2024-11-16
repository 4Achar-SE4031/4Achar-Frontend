import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import AuthProvider from './features/user/Authentication/authProvider';

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" ? (
        <div></div>
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
