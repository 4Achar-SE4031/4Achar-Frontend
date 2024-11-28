import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import AuthProvider from './features/user/Authentication/authProvider';
import { ToastContainer } from 'react-toastify';

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" ? (
        <div></div>
      ) : (
        <>
          <ToastContainer closeOnClick className="toastify-container" position="top-right" toastStyle={{ backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7" }} pauseOnHover={false} autoClose={3000} />        <AuthProvider>
            <Outlet />
          </AuthProvider>
        </>
      )}  </>
  )
}



export default App
