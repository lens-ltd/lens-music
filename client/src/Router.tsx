import { Routes, Route } from "react-router-dom";
import { ReactElement } from "react";
import Login from "./pages/authentication/Login";
import CompleteInvitation from "./pages/authentication/CompleteInvitation";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ResetPassword from "./pages/authentication/ResetPassword";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AuthenticatedRoutes from "./outlets/AuthenticatedRoutes";
import ListLabels from "./pages/labels/ListLabels";
import ReleasesPage from "./pages/releases/ReleasesPage";
import CreateRelase from "./pages/releases/CreateRelase";
import LandingPage from "./pages/landing/LandingPage";
import ListLyrics from "./pages/lyrics/ListLyrics";
import CreateLyrics from "./pages/lyrics/CreateLyrics";
import SyncLyrics from "./pages/lyrics/SyncLyrics";
import NotFoundPage from "./pages/common/NotFoundPage";
import RolesPage from "./pages/roles/RolesPage";
import ReleaseWizardPage from "./pages/releases/ReleaseWizardPage";
import ContributorsPage from "./pages/contributors/ContributorsPage";
import CreateContributorPage from "./pages/contributors/CreateContributorPage";
import UpdateContributorPage from "./pages/contributors/UpdateContributorPage";
import ContributorDetailsPage from "./pages/contributors/ContributorDetailsPage";
import ContributorMembershipsPage from "./pages/contributors/ContributorMembershipsPage";
import ManageReleaseTrack from "./pages/tracks/ManageReleaseTrack";
import TrackDetailsPage from "./pages/tracks/TrackDetailsPage";
import Seo, { SeoProps } from "@/components/seo/Seo";
import UsersPage from "./pages/users/UsersPage";
import UserInvitationsPage from "./pages/users/UserInvitationsPage";
import CreateUserInvitationPage from "./pages/users/CreateUserInvitationPage";

type RouteSeoConfig = Omit<SeoProps, "children">;

const routeSeo = {
  landing: {
    title: "Music Distribution for Independent Artists",
    description:
      "Lens Music helps artists distribute releases, manage contributors, and track performance with one modern workspace.",
  },
  login: {
    title: "Sign In",
    description:
      "Access your Lens Music dashboard to manage releases, contributors, lyrics, and catalog performance.",
  },
  signup: {
    title: "Create Account",
    description:
      "Create your Lens Music account and start distributing music, organizing contributors, and managing releases.",
  },
  dashboard: {
    title: "Dashboard Overview",
    description:
      "Monitor release performance, streams, downloads, and revenue trends from your Lens Music dashboard.",
  },
  labels: {
    title: "Labels",
    description:
      "View and manage record label details connected to your Lens Music distribution workflow.",
  },
  releases: {
    title: "Releases",
    description:
      "Track release status, organize catalog delivery, and manage publishing workflows inside Lens Music.",
  },
  releaseWizard: {
    title: "Release Wizard",
    description:
      "Complete release setup, upload assets, and finalize distribution details for your next Lens Music release.",
  },
  manageTrack: {
    title: "Manage Release Track",
    description:
      "Edit track details, contributors, rights, and metadata for a release track in Lens Music.",
  },
  trackDetails: {
    title: "Track Details",
    description:
      "View track metadata, audio files, contributors, and lyrics for a release track in Lens Music.",
  },
  contributors: {
    title: "Contributors",
    description:
      "Manage contributor records, roles, profile links, and membership relationships across your catalog.",
  },
  createContributor: {
    title: "Create Contributor",
    description:
      "Add a new contributor profile with identity, role, and store metadata in Lens Music.",
  },
  updateContributor: {
    title: "Update Contributor",
    description:
      "Edit contributor details, status, and profile information in your Lens Music workspace.",
  },
  contributorMemberships: {
    title: "Contributor Memberships",
    description:
      "Review and manage membership relationships attached to a contributor in Lens Music.",
  },
  contributorDetails: {
    title: "Contributor Details",
    description:
      "View contributor identity, profile links, verification status, and related memberships in Lens Music.",
  },
  lyrics: {
    title: "Lyrics",
    description:
      "Manage lyric records, synchronization workflows, and catalog text assets in Lens Music.",
  },
  createLyrics: {
    title: "Create Lyrics",
    description:
      "Add new lyric content and prepare it for your Lens Music release workflow.",
  },
  syncLyrics: {
    title: "Sync Lyrics",
    description:
      "Synchronize timed lyrics for tracks and keep listening experiences aligned across platforms.",
  },
  roles: {
    title: "Roles",
    description:
      "Review role definitions and access-related configuration inside the Lens Music client.",
  },
  users: {
    title: "Users",
    description:
      "Review user records and access-related configuration inside the Lens Music client.",
  },
  userInvitations: {
    title: "User Invitations",
    description:
      "Review invitation status, resend failed invitations, and revoke pending access requests.",
  },
  createUserInvitation: {
    title: "Create User Invitation",
    description:
      "Send single or bulk invitations to teammates who need access to the Lens Music dashboard.",
  },
  notFound: {
    title: "Page Not Found",
    description:
      "The page you requested could not be found. Return to Lens Music to continue browsing or managing your catalog.",
  },
} satisfies Record<string, RouteSeoConfig>;

const withSeo = (element: ReactElement, seo: RouteSeoConfig) => (
  <Seo {...seo}>{element}</Seo>
);

const Router = () => {
  return (
    <>
      <Routes>
        {/* REDIRECT */}
        {/* LANDING PAGE */}
        <Route path="/" element={withSeo(<LandingPage />, routeSeo.landing)} />

        {/* AUTHENTICATION */}
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/auth/invitation/:token"
          element={<CompleteInvitation />}
        />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

        {/* AUTHENTICATED ROUTES */}
        <Route element={<AuthenticatedRoutes />}>
          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={withSeo(<UserDashboard />, routeSeo.dashboard)}
          />

          {/* LABEL ROUTES */}
          <Route path="/labels">
            <Route path="" element={withSeo(<ListLabels />, routeSeo.labels)} />
          </Route>

          {/* RELEASE ROUTES */}
          <Route path="/releases">
            <Route
              path=""
              element={withSeo(<ReleasesPage />, routeSeo.releases)}
            />
            <Route
              path=":id/wizard"
              element={withSeo(<ReleaseWizardPage />, routeSeo.releaseWizard)}
            />
            <Route
              path=":id/manage-tracks/:trackId"
              element={withSeo(<ManageReleaseTrack />, routeSeo.manageTrack)}
            />
            <Route
              path=":id/tracks/:trackId"
              element={withSeo(<TrackDetailsPage />, routeSeo.trackDetails)}
            />
          </Route>

          {/* CONTRIBUTORS ROUTES */}
          <Route path="/contributors">
            <Route
              path=""
              element={withSeo(<ContributorsPage />, routeSeo.contributors)}
            />
            <Route
              path="create"
              element={withSeo(
                <CreateContributorPage />,
                routeSeo.createContributor,
              )}
            />
            <Route
              path=":id/update"
              element={withSeo(
                <UpdateContributorPage />,
                routeSeo.updateContributor,
              )}
            />
            <Route
              path=":id/memberships"
              element={withSeo(
                <ContributorMembershipsPage />,
                routeSeo.contributorMemberships,
              )}
            />
            <Route
              path=":id"
              element={withSeo(
                <ContributorDetailsPage />,
                routeSeo.contributorDetails,
              )}
            />
          </Route>

          {/* LYRICS ROUTES */}
          <Route path="/lyrics">
            <Route path="" element={withSeo(<ListLyrics />, routeSeo.lyrics)} />
            <Route
              path="create"
              element={withSeo(<CreateLyrics />, routeSeo.createLyrics)}
            />
            <Route
              path="sync"
              element={withSeo(<SyncLyrics />, routeSeo.syncLyrics)}
            />
          </Route>

          {/* USERS ROUTES */}
          <Route path="/users">
            <Route path="" element={withSeo(<UsersPage />, routeSeo.users)} />
            <Route
              path="invitations"
              element={withSeo(
                <UserInvitationsPage />,
                routeSeo.userInvitations,
              )}
            />
            <Route
              path="invitations/create"
              element={withSeo(
                <CreateUserInvitationPage />,
                routeSeo.createUserInvitation,
              )}
            />
          </Route>
        </Route>

        {/* ROLES ROUTES */}
        <Route path="/roles">
          <Route path="" element={withSeo(<RolesPage />, routeSeo.roles)} />
        </Route>

        {/* NOT FOUND */}
        <Route
          path="*"
          element={withSeo(<NotFoundPage />, routeSeo.notFound)}
        />
      </Routes>
      <CreateRelase />
    </>
  );
};

export default Router;
