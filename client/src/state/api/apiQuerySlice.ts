import store from "store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constants/environments.constants";
import { UUID } from "@/types/common.types";

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
      // LIST LABELS
      fetchLabels: builder.query({
        query: ({ size, page }) => {
          return {
            url: "/labels",
            method: "GET",
            params: {
              size,
              page,
            },
          };
        },
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
        }: {
          page: number;
          size: number;
          type?: string;
          searchKey?: string;
          searchName?: string;
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
            },
          };
        },
      }),

      // GET CONTRIBUTOR
      getContributor: builder.query({
        query: ({ id }) => `/contributors/${id}`,
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


      // FETCH STORES
      fetchStores: builder.query({
        query: () => ({
          url: '/stores',
          method: 'GET',
        }),
      }),

      // FETCH RELEASE STORES
      fetchReleaseStores: builder.query({
        query: ({ releaseId }: { releaseId: string }) => ({
          url: `/releases/${releaseId}/stores`,
          method: 'GET',
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
  useLazyFetchInvitationsQuery,
  useLazyFetchUsersQuery,
  useLazyFetchLabelsQuery,
  useLazyFetchGenresQuery,
  useLazyFetchReleasesQuery,
  useLazyFetchStaticReleaseNavigationQuery,
  useLazyFetchReleaseNavigationFlowsQuery,
  useLazyFetchReleaseGenresQuery,
  useLazyGetReleaseQuery,
  useLazyGetContributorQuery,
  useLazyFetchContributorsQuery,
  useLazyFetchContributorMembershipsQuery,
  useLazyFetchTracksQuery,
  useLazyGetTrackQuery,
  useLazyFetchReleaseDealsQuery,
  useLazyFetchTrackRightsControllersQuery,
  useLazyFetchTrackContributorsQuery,
  useLazyFetchReleaseContributorsQuery,
  useLazyFetchStoresQuery,
  useLazyFetchReleaseStoresQuery,
  useLazyFetchLyricsQuery,
  useLazyGetLyricsQuery,
} = apiQuerySlice;
export default apiQuerySlice;
