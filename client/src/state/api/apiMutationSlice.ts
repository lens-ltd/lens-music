import store from "store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constants/environments.constants";
import type {
  CreateContributorPayload,
  CreateContributorMembershipPayload,
  UpdateContributorPayload,
} from "@/types/models/contributor.types";

export const apiMutationSlice = createApi({
  reducerPath: "apiMutation",
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
      // LOGIN
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: "/auth/login",
          method: "POST",
          body: {
            email,
            password,
          },
        }),
      }),

      // SIGNUP
      signup: builder.mutation({
        query: ({ email, name, phone, password }) => ({
          url: "/auth/signup",
          method: "POST",
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
      listLabels: builder.query({
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

      // CREATE ARTIST
      createArtist: builder.mutation({
        query: ({ formData }) => ({
          url: "/artists",
          method: "POST",
          body: formData,
          formData: true,
        }),
      }),

      // CREATE RELEASE
      createRelease: builder.mutation({
        query: ({ title, type }) => ({
          url: "/releases",
          method: "POST",
          body: {
            title,
            type,
          },
        }),
      }),

      // DELETE RELEASE
      deleteRelease: builder.mutation({
        query: ({ id }) => ({
          url: `/releases/${id}`,
          method: "DELETE",
        }),
      }),

      // UPLOAD RELEASE COVER ART
      uploadReleaseCoverArt: builder.mutation({
        query: ({ id, formData }: { id: string; formData: FormData }) => ({
          url: `/releases/${id}/cover-art`,
          method: "POST",
          body: formData,
          formData: true,
        }),
      }),

      // UPDATE RELEASE OVERVIEW
      updateReleaseOverview: builder.mutation({
        query: ({
          id,
          body,
        }: {
          id: string;
          body: Record<string, unknown>;
        }) => ({
          url: `/releases/${id}/overview`,
          method: "PATCH",
          body,
        }),
      }),

      // CREATE RELEASE NAVIGATION FLOW
      createReleaseNavigationFlow: builder.mutation({
        query: ({ releaseId, staticReleaseNavigationId }) => ({
          url: "/release-navigation-flows",
          method: "POST",
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
          method: "PATCH",
          body: {
            isCompleted,
          },
        }),
      }),

      // CREATE CONTRIBUTOR
      createContributor: builder.mutation({
        query: (body: CreateContributorPayload) => ({
          url: "/contributors",
          method: "POST",
          body,
        }),
      }),

      // UPDATE CONTRIBUTOR
      updateContributor: builder.mutation({
        query: ({
          id,
          body,
        }: {
          id: string;
          body: UpdateContributorPayload;
        }) => ({
          url: `/contributors/${id}`,
          method: "PATCH",
          body,
        }),
      }),

      // DELETE CONTRIBUTOR
      deleteContributor: builder.mutation({
        query: ({ id }) => ({
          url: `/contributors/${id}`,
          method: "DELETE",
        }),
      }),

      // CREATE CONTRIBUTOR MEMBERSHIP
      createContributorMembership: builder.mutation({
        query: (body: CreateContributorMembershipPayload) => ({
          url: "/contributor-memberships",
          method: "POST",
          body,
        }),
      }),

      // DELETE CONTRIBUTOR MEMBERSHIP
      deleteContributorMembership: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/contributor-memberships/${id}`,
          method: "DELETE",
        }),
      }),

      // CREATE TRACK
      createTrack: builder.mutation({
        query: ({ title, releaseId, titleVersion }) => ({
          url: "/tracks",
          method: "POST",
          body: {
            title,
            releaseId,
            titleVersion,
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
  useDeleteReleaseMutation,
  useUploadReleaseCoverArtMutation,
  useUpdateReleaseOverviewMutation,
  useCreateReleaseNavigationFlowMutation,
  useCompleteReleaseNavigationFlowMutation,
  useCreateContributorMutation,
  useUpdateContributorMutation,
  useDeleteContributorMutation,
  useCreateContributorMembershipMutation,
  useDeleteContributorMembershipMutation,
  useCreateTrackMutation,
} = apiMutationSlice;
export default apiMutationSlice;
