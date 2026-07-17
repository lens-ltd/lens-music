import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthenticatedRoutes = () => {
  // STATE VARIABLES
  const { token, user } = useSelector((state: RootState) => state.auth);

  const location = useLocation();

  if (!user?.id || !token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AuthenticatedRoutes;
