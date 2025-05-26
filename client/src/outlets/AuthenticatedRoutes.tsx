import { RootState } from '@/state/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthenticatedRoutes = () => {
  // STATE VARIABLES
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.user);

  // NAVIGATION
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate('/auth/login');
    }
  }, [navigate, token, user]);

  return <Outlet />;
};

export default AuthenticatedRoutes;
