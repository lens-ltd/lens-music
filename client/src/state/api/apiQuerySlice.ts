import store from 'store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LOCAL_API_URL } from '@/constants/environments.constants';

export const apiQuerySlice = createApi({
  reducerPath: 'apiQuery',
  baseQuery: fetchBaseQuery({
    baseUrl: LOCAL_API_URL,
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
    };
  },
});

export const {
  useLazyFetchArtistsQuery,
  useLazyFetchLabelsQuery,
  useLazyFetchReleasesQuery,
} = apiQuerySlice;
export default apiQuerySlice;
