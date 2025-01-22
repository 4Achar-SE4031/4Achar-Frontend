import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
// import '@testing-library/jest-dom';
import AuthProvider from './features/user/Authentication/authProvider';
import { ToastContainer } from 'react-toastify';
import { SearchProvider } from "./features/Search/searchStatus";

function App() {
  const location = useLocation();
  return (
        <>
        <SearchProvider>
          <ToastContainer closeOnClick className="toastify-container" position="top-right" toastStyle={{ backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7" }} pauseOnHover={false} autoClose={3000} />        <AuthProvider>
            <Outlet />
          </AuthProvider>
          </SearchProvider>
        </>
  )
}
export default App
