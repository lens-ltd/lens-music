import store from 'store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/constants/environments.constants';

export const apiQuerySlice = createApi({
  reducerPath: 'apiQuery',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = store.get('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
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
            url: '/artists',
            method: 'GET',
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
            url: '/labels',
            method: 'GET',
            params: {
              size,
              page,
            },
          };
        },
      }),

      // FETCH RELEASES
      fetchReleases: builder.query({
        query: ({ size, page }) => {
          return {
            url: '/releases',
            method: 'GET',
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
        query: () => '/static-release-navigation',
      }),

      // FETCH RELEASE NAVIGATION FLOWS
      fetchReleaseNavigationFlows: builder.query({
        query: ({ releaseId }) => {
          return {
            url: '/release-navigation-flows',
            method: 'GET',
            params: {
              releaseId: releaseId,
            },
          };
        },
      }),

      // FETCH CONTRIBUTORS
      fetchContributors: builder.query({
        query: ({ page, size }) => {
          return {
            url: '/contributors',
            method: 'GET',
            params: {
              page,
              size,
            },
          };
        },
      }),

      // GET CONTRIBUTOR
      getContributor: builder.query({
        query: ({ id }) => `/contributors/${id}`,
      }),
    };
  },
});

export const {
  useLazyFetchArtistsQuery,
  useLazyFetchLabelsQuery,
  useLazyFetchReleasesQuery,
  useLazyFetchStaticReleaseNavigationQuery,
  useLazyFetchReleaseNavigationFlowsQuery,
  useLazyGetReleaseQuery,
  useLazyGetContributorQuery,
  useLazyFetchContributorsQuery,
} = apiQuerySlice;
export default apiQuerySlice;
