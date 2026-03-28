import { RootState } from '@/state/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthenticatedRoutes = () => {
  // STATE VARIABLES
  const { token, user } = useSelector((state: RootState) => state.auth);

  // NAVIGATION
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id || !token) {
      navigate('/auth/login');
    }
  }, [navigate, token, user]);

  return <Outlet />;
};

export default AuthenticatedRoutes;
