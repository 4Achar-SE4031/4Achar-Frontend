import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './authProvider'; // Import your AuthProvider's useAuth

const PrivateRoute = () => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
