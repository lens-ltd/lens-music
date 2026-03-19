import store from 'store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/constants/environments.constants';
import { GroupedStaticReleaseNavigation } from '@/types/models/staticReleaseNavigation.types';
import { ReleaseNavigationFlow } from '@/types/models/releaseNavigationFlow.types';

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
        query: ({ size, page }) => `/artists?size=${size}&page=${page}`,
      }),

      // LIST LABELS
      fetchLabels: builder.query({
        query: ({ size, page }) => `/labels?size=${size}&page=${page}`,
      }),

      // FETCH RELEASES
      fetchReleases: builder.query({
        query: ({ size, page }) => `/releases?size=${size}&page=${page}`,
      }),

      // GET RELEASE
      getRelease: builder.query({
        query: ({ id }) => `/releases/${id}`,
      }),

      // FETCH STATIC RELEASE NAVIGATION
      fetchStaticReleaseNavigation: builder.query<
        { message: string; data: GroupedStaticReleaseNavigation },
        void
      >({
        query: () => '/static-release-navigation',
      }),

      // FETCH RELEASE NAVIGATION FLOWS
      fetchReleaseNavigationFlows: builder.query<
        { message: string; data: ReleaseNavigationFlow[] },
        { releaseId: string }
      >({
        query: ({ releaseId }) => `/release-navigation-flows?releaseId=${releaseId}`,
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
} = apiQuerySlice;
export default apiQuerySlice;
