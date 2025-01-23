import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
// import '@testing-library/jest-dom';
import { ToastContainer } from 'react-toastify';
import { SearchProvider } from "./features/Search/searchStatus";
import AuthProvider from './features/user/login/authProvider';

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
