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
      // LIST ALL ARTISTS
      fetchArtists: builder.query({
        query: ({ size, page }) => {
          return {
            url: "/artists",
            method: "GET",
            params: {
              size,
              page,
            },
          };
        },
      }),

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
    };
  },
});

export const {
  useLazyFetchInvitationsQuery,
  useLazyFetchUsersQuery,
  useLazyFetchArtistsQuery,
  useLazyFetchLabelsQuery,
  useLazyFetchReleasesQuery,
  useLazyFetchStaticReleaseNavigationQuery,
  useLazyFetchReleaseNavigationFlowsQuery,
  useLazyGetReleaseQuery,
  useLazyGetContributorQuery,
  useLazyFetchContributorsQuery,
  useLazyFetchContributorMembershipsQuery,
  useLazyFetchTracksQuery,
  useLazyGetTrackQuery,
  useLazyFetchTrackContributorsQuery,
} = apiQuerySlice;
export default apiQuerySlice;
