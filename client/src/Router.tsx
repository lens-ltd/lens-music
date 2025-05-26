import { Routes, Route } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';
import UserDashboard from './pages/dashboard/UserDashboard';
import AuthenticatedRoutes from './outlets/AuthenticatedRoutes';
import ListArtists from './pages/artists/ListArtists';
import ListLabels from './pages/labels/ListLabels';
import ListReleases from './pages/releases/ListReleases';
import CreateRelase from './pages/releases/CreateRelase';
import LandingPage from './pages/landing/LandingPage';
import ListLyrics from './pages/lyrics/ListLyrics';
import CreateLyrics from './pages/lyrics/CreateLyrics';
import LyricsGuidelines from './pages/lyrics/LyricsGuidelines';
import SyncLyrics from './pages/lyrics/SyncLyrics';

const Router = () => {
  return (
    <>
      <Routes>
        {/* REDIRECT */}
        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTHENTICATION */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* AUTHENTICATED ROUTES */}
        <Route element={<AuthenticatedRoutes />}>
          {/* DASHBOARD */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* ARTIST ROUTES */}
          <Route path="/artists">
            <Route path="" element={<ListArtists />} />
          </Route>

          {/* LABEL ROUTES */}
          <Route path="/labels">
            <Route path="" element={<ListLabels />} />
          </Route>

          {/* RELEASE ROUTES */}
          <Route path="/releases">
            <Route path="" element={<ListReleases />} />
          </Route>

          {/* LYRICS ROUTES */}
          <Route path="/lyrics">
            <Route path="" element={<ListLyrics />} />
            <Route path="create" element={<CreateLyrics />} />
            <Route path="sync" element={<SyncLyrics />} />
          </Route>
        </Route>
      </Routes>
      <CreateRelase />
      <LyricsGuidelines />
    </>
  );
};

export default Router;
