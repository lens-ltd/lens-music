import store from "store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constants/environments.constants";
import { UUID } from "@/types/common.types";
import { DashboardSummaryResponse } from "@/types/models/dashboard.types";

export const apiQuerySlice = createApi({
  reducerPath: "apiQuery",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = store.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      getDashboardSummary: builder.query<DashboardSummaryResponse, void>({
        query: () => ({
          url: "/dashboard/summary",
          method: "GET",
        }),
      }),

      // LIST LABELS
      fetchLabels: builder.query({
        query: ({
          size,
          page,
          searchKey,
        }: {
          size: number;
          page: number;
          searchKey?: string;
        }) => ({
          url: "/labels",
          method: "GET",
          params: {
            size,
            page,
            ...(searchKey ? { searchKey } : {}),
          },
        }),
      }),

      fetchInvitations: builder.query({
        query: ({
          size,
          page,
          status,
        }: {
          size: number;
          page: number;
          status?: string;
        }) => ({
          url: "/auth/invitations",
          method: "GET",
          params: {
            size,
            page,
            ...(status ? { status } : {}),
          },
        }),
      }),

      fetchUsers: builder.query({
        query: ({
          size,
          page,
        }: {
          size: number;
          page: number;
        }) => ({
          url: "/users",
          method: "GET",
          params: {
            size,
            page,
          },
        }),
      }),

      fetchUserById: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/users/${id}`,
          method: "GET",
        }),
      }),

      fetchRoles: builder.query({
        query: ({
          size,
          page,
          ...filters
        }: {
          size: number;
          page: number;
          [key: string]: string | number | undefined;
        }) => ({
          url: "/roles",
          method: "GET",
          params: {
            size,
            page,
            ...Object.fromEntries(
              Object.entries(filters).filter(([, value]) => value !== undefined)
            ),
          },
        }),
      }),

      fetchRoleById: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/roles/${id}`,
          method: "GET",
        }),
      }),

      // FETCH GENRES
      fetchGenres: builder.query({
        query: ({ parentId }: { parentId?: string } = {}) => ({
          url: '/genres',
          method: 'GET',
          params: {
            ...(parentId ? { parentId } : {}),
          },
        }),
      }),

      // FETCH RELEASES
      fetchReleases: builder.query({
        query: ({ size, page }) => {
          return {
            url: "/releases",
            method: "GET",
            params: {
              size,
              page,
            },
          };
        },
      }),

      // FETCH RELEASE REVIEW QUEUE
      fetchReleaseReviewQueue: builder.query({
        query: ({
          size,
          page,
          status,
        }: {
          size: number;
          page: number;
          status?: string;
        }) => {
          return {
            url: "/releases/review/queue",
            method: "GET",
            params: {
              size,
              page,
              ...(status ? { status } : {}),
            },
          };
        },
      }),

      // FETCH RELEASE GENRES
      fetchReleaseGenres: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/releases/${id}/genres`,
          method: 'GET',
        }),
      }),

      // GET RELEASE
      getRelease: builder.query({
        query: ({ id }) => `/releases/${id}`,
      }),

      // FETCH STATIC RELEASE NAVIGATION
      fetchStaticReleaseNavigation: builder.query({
        query: () => "/static-release-navigation",
      }),

      // FETCH RELEASE NAVIGATION FLOWS
      fetchReleaseNavigationFlows: builder.query({
        query: ({ releaseId }) => {
          return {
            url: "/release-navigation-flows",
            method: "GET",
            params: {
              releaseId: releaseId,
            },
          };
        },
      }),

      // FETCH CONTRIBUTORS
      fetchContributors: builder.query({
        query: ({
          page,
          size,
          type,
          searchKey,
          searchName,
          verificationStatus,
        }: {
          page: number;
          size: number;
          type?: string;
          searchKey?: string;
          searchName?: string;
          verificationStatus?: string;
        }) => {
          return {
            url: "/contributors",
            method: "GET",
            params: {
              page,
              size,
              ...(type && { type }),
              ...(searchKey && { searchKey }),
              ...(searchName && { searchName }),
              ...(verificationStatus && { verificationStatus }),
            },
          };
        },
      }),

      // GET CONTRIBUTOR
      getContributor: builder.query({
        query: ({ id }) => `/contributors/${id}`,
      }),

      // LIST CONTRIBUTOR MANAGERS (admin)
      fetchContributorManagers: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/contributors/${id}/managers`,
          method: "GET",
        }),
      }),

      // FETCH CONTRIBUTOR MEMBERSHIPS
      fetchContributorMemberships: builder.query({
        query: ({
          page,
          size,
          parentContributorId,
          memberContributorId,
        }: {
          page: number;
          size: number;
          parentContributorId?: UUID;
          memberContributorId?: UUID;
        }) => {
          return {
            url: "/contributor-memberships",
            method: "GET",
            params: {
              page,
              size,
              parentContributorId,
              memberContributorId,
            },
          };
        },
      }),

      // FETCH TRACKS
      fetchTracks: builder.query({
        query: ({ releaseId }) => {
          return {
            url: "/tracks",
            method: "GET",
            params: {
              releaseId,
            },
          };
        },
      }),

      // GET TRACK
      getTrack: builder.query({
        query: ({ id }) => `/tracks/${id}`,
      }),

      fetchReleaseDeals: builder.query({
        query: ({ releaseId }: { releaseId: string }) =>
          `/releases/${releaseId}/deals`,
      }),

      fetchTrackRightsControllers: builder.query({
        query: ({ trackId }: { trackId: string }) =>
          `/tracks/${trackId}/rights-controllers`,
      }),

      // FETCH TRACK CONTRIBUTORS
      fetchTrackContributors: builder.query({
        query: ({ trackId }: { trackId: string }) => {
          return {
            url: "/track-contributors",
            method: "GET",
            params: {
              trackId,
            },
          };
        },
      }),


      // FETCH STORES (optional isActive for wizard pickers)
      fetchStores: builder.query({
        query: (params?: { isActive?: boolean }) => ({
          url: '/stores',
          method: 'GET',
          params:
            params?.isActive === undefined
              ? undefined
              : { isActive: String(params.isActive) },
        }),
      }),

      getStore: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/stores/${id}`,
          method: 'GET',
        }),
      }),

      getLabel: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/labels/${id}`,
          method: "GET",
        }),
      }),

      // FETCH RELEASE STORES
      fetchReleaseStores: builder.query({
        query: ({ releaseId }: { releaseId: string }) => ({
          url: `/releases/${releaseId}/stores`,
          method: 'GET',
        }),
      }),

      fetchReleaseLabels: builder.query({
        query: ({ releaseId }: { releaseId: string }) => ({
          url: `/releases/${releaseId}/labels`,
          method: "GET",
        }),
      }),

      fetchRelatedReleases: builder.query({
        query: ({ releaseId }: { releaseId: string }) => ({
          url: `/releases/${releaseId}/related-releases`,
          method: "GET",
        }),
      }),

      fetchReleaseTerritoryDetails: builder.query({
        query: ({ releaseId }: { releaseId: string }) => ({
          url: `/releases/${releaseId}/territory-details`,
          method: "GET",
        }),
      }),
      // FETCH RELEASE CONTRIBUTORS
      fetchReleaseContributors: builder.query({
        query: ({ releaseId }: { releaseId: string }) => {
          return {
            url: "/release-contributors",
            method: "GET",
            params: {
              releaseId,
            },
          };
        },
      }),

      // FETCH LYRICS
      fetchLyrics: builder.query({
        query: ({ trackId, size = 100, page = 0 }: { trackId?: string; size?: number; page?: number }) => {
          return {
            url: "/lyrics",
            method: "GET",
            params: {
              trackId,
              size,
              page,
            },
          };
        },
      }),

      // GET LYRICS
      getLyrics: builder.query({
        query: ({ id }: { id: string }) => `/lyrics/${id}`,
      }),
    };
  },
});

export const {
  useGetDashboardSummaryQuery,
  useLazyFetchInvitationsQuery,
  useLazyFetchUsersQuery,
  useLazyFetchUserByIdQuery,
  useLazyFetchLabelsQuery,
  useLazyFetchGenresQuery,
  useLazyFetchReleasesQuery,
  useLazyFetchReleaseReviewQueueQuery,
  useLazyFetchStaticReleaseNavigationQuery,
  useLazyFetchReleaseNavigationFlowsQuery,
  useLazyFetchReleaseGenresQuery,
  useLazyGetReleaseQuery,
  useLazyGetContributorQuery,
  useLazyFetchContributorsQuery,
  useLazyFetchContributorManagersQuery,
  useLazyFetchContributorMembershipsQuery,
  useLazyFetchTracksQuery,
  useLazyGetTrackQuery,
  useLazyFetchReleaseDealsQuery,
  useLazyFetchTrackRightsControllersQuery,
  useLazyFetchTrackContributorsQuery,
  useLazyFetchReleaseContributorsQuery,
  useLazyFetchStoresQuery,
  useLazyGetStoreQuery,
  useLazyGetLabelQuery,
  useLazyFetchReleaseStoresQuery,
  useLazyFetchReleaseLabelsQuery,
  useLazyFetchRelatedReleasesQuery,
  useLazyFetchReleaseTerritoryDetailsQuery,
  useLazyFetchLyricsQuery,
  useLazyGetLyricsQuery,
  useLazyFetchRolesQuery,
  useLazyFetchRoleByIdQuery,
} = apiQuerySlice;
export default apiQuerySlice;
