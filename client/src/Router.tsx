import { Routes, Route } from "react-router-dom";
import { ReactElement } from "react";
import Login from "./pages/authentication/Login";
import RequestInvitation from "./pages/authentication/RequestInvitation";
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
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import ArtistAgreement from "./pages/legal/ArtistAgreement";
import RolesPage from "./pages/roles/RolesPage";
import CreateRolePage from "./pages/roles/CreateRolePage";
import RoleDetailsPage from "./pages/roles/RoleDetailsPage";
import EditRolePage from "./pages/roles/EditRolePage";
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
import UserDetailsPage from "./pages/users/UserDetailsPage";
import UserInvitationsPage from "./pages/users/UserInvitationsPage";
import CreateUserInvitationPage from "./pages/users/CreateUserInvitationPage";
import StoresPage from "./pages/stores/StoresPage";
import StoreDetailsPage from "./pages/stores/StoreDetailsPage";
import ReleaseReviewPage from "./pages/releases/review/ReleaseReviewPage";
import ContributorVerificationQueuePage from "./pages/contributors/ContributorVerificationQueuePage";
import UserProfilePage from "./pages/profile/UserProfilePage";

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
  requestInvitation: {
    title: "Request Invitation",
    description:
      "Request access to Lens Music so an admin can review and send you an invitation.",
  },
  dashboard: {
    title: "Dashboard Overview",
    description:
      "Track catalog health, release workflow progress, and store delivery status from your Lens Music dashboard.",
  },
  labels: {
    title: "Labels",
    description:
      "View and manage record label details connected to your Lens Music distribution workflow.",
  },
  stores: {
    title: "Stores",
    description:
      "Configure store delivery metadata and DDEX destination settings for Lens Music distribution.",
  },
  storeDetails: {
    title: "Store Details",
    description:
      "View store identity and update DDEX delivery settings for a distribution destination.",
  },
  releases: {
    title: "Releases",
    description:
      "Track release status, organize catalog delivery, and manage publishing workflows inside Lens Music.",
  },
  releaseReview: {
    title: "Release Review",
    description:
      "Review releases submitted for approval, approve them for delivery, or request changes with feedback.",
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
  contributorVerification: {
    title: "Contributor Verification",
    description:
      "Review contributors awaiting verification and approve or reject their verified status.",
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
  userDetails: {
    title: "User Details",
    description:
      "Review a Lens Music user's identity, account status, and access context.",
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
  profile: {
    title: "User Profile",
    description:
      "View and manage your personal profile information, account details, and permissions in Lens Music.",
  },
  notFound: {
    title: "Page Not Found",
    description:
      "The page you requested could not be found. Return to Lens Music to continue browsing or managing your catalog.",
  },
  privacyPolicy: {
    title: "Privacy Policy",
    description:
      "Learn how Lens Music collects, uses, and protects your personal information and data privacy rights.",
  },
  termsOfService: {
    title: "Terms of Service",
    description:
      "Review the terms and conditions governing your use of the Lens Music platform and distribution services.",
  },
  artistAgreement: {
    title: "Artist Agreement",
    description:
      "Understand the distribution rights, revenue share model, and obligations for artists using Lens Music.",
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

        {/* LEGAL PAGES */}
        <Route
          path="/privacy-policy"
          element={withSeo(<PrivacyPolicy />, routeSeo.privacyPolicy)}
        />
        <Route
          path="/terms-of-service"
          element={withSeo(<TermsOfService />, routeSeo.termsOfService)}
        />
        <Route
          path="/artist-agreement"
          element={withSeo(<ArtistAgreement />, routeSeo.artistAgreement)}
        />

        {/* AUTHENTICATION */}
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/auth/request-invitation"
          element={withSeo(<RequestInvitation />, routeSeo.requestInvitation)}
        />
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

          <Route path="/stores">
            <Route
              path=""
              element={withSeo(<StoresPage />, routeSeo.stores)}
            />
            <Route
              path=":id"
              element={withSeo(<StoreDetailsPage />, routeSeo.storeDetails)}
            />
          </Route>

          {/* RELEASE ROUTES */}
          <Route path="/releases">
            <Route
              path=""
              element={withSeo(<ReleasesPage />, routeSeo.releases)}
            />
            <Route
              path="review"
              element={withSeo(<ReleaseReviewPage />, routeSeo.releaseReview)}
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
              path="verification"
              element={withSeo(
                <ContributorVerificationQueuePage />,
                routeSeo.contributorVerification,
              )}
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
            <Route
              path=":id"
              element={withSeo(<UserDetailsPage />, routeSeo.userDetails)}
            />
          </Route>

          {/* ROLES ROUTES */}
          <Route path="/roles">
            <Route path="" element={withSeo(<RolesPage />, routeSeo.roles)} />
            <Route
              path="create"
              element={withSeo(<CreateRolePage />, routeSeo.roles)}
            />
            <Route
              path=":id"
              element={withSeo(<RoleDetailsPage />, routeSeo.roles)}
            />
            <Route
              path=":id/edit"
              element={withSeo(<EditRolePage />, routeSeo.roles)}
            />
          </Route>

          {/* PROFILE ROUTE */}
          <Route
            path="/profile"
            element={withSeo(<UserProfilePage />, routeSeo.profile)}
          />
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
