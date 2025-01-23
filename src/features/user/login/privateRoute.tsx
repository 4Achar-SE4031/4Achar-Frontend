import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authProvider'; // Import your AuthProvider's useAuth

const PrivateRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
