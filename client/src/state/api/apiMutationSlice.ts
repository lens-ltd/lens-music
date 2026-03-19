import store from 'store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/constants/environments.constants';

export const apiMutationSlice = createApi({
  reducerPath: 'apiMutation',
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
      // LOGIN
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: '/auth/login',
          method: 'POST',
          body: {
            email,
            password,
          },
        }),
      }),

      // SIGNUP
      signup: builder.mutation({
        query: ({ email, name, phone, password }) => ({
          url: '/auth/signup',
          method: 'POST',
          body: {
            email,
            password,
            name,
            phone,
          },
        }),
      }),

      // LIST ALL ARTISTS
      listArtists: builder.query({
        query: ({ size, page }) => `/artists?size=${size}&page=${page}`,
      }),

      // LIST LABELS
      listLabels: builder.query({
        query: ({ size, page }) => `/labels?size=${size}&page=${page}`,
      }),

      // CREATE ARTIST
      createArtist: builder.mutation({
        query: ({ formData }) => ({
          url: '/artists',
          method: 'POST',
          body: formData,
          formData: true,
        }),
      }),

      // CREATE RELEASE
      createRelease: builder.mutation({
        query: ({ title, type }) => ({
          url: '/releases',
          method: 'POST',
          body: {
            title,
            type,
          },
        }),
      }),

      // CREATE RELEASE NAVIGATION FLOW
      createReleaseNavigationFlow: builder.mutation({
        query: ({ releaseId, staticReleaseNavigationId }) => ({
          url: '/release-navigation-flows',
          method: 'POST',
          body: {
            releaseId,
            staticReleaseNavigationId,
          },
        }),
      }),

      // COMPLETE RELEASE NAVIGATION FLOW
      completeReleaseNavigationFlow: builder.mutation({
        query: ({ id, isCompleted }) => ({
          url: `/release-navigation-flows/${id}/complete`,
          method: 'PATCH',
          body: {
            isCompleted,
          },
        }),
      }),
    };
  },
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLazyListArtistsQuery,
  useLazyListLabelsQuery,
  useCreateArtistMutation,
  useCreateReleaseMutation,
  useCreateReleaseNavigationFlowMutation,
  useCompleteReleaseNavigationFlowMutation,
} = apiMutationSlice;
export default apiMutationSlice;
