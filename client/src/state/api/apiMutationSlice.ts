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

      // UPDATE TRACK
      updateTrack: builder.mutation({
        query: ({
          id,
          body,
        }: {
          id: string;
          body: Record<string, unknown>;
        }) => ({
          url: `/tracks/${id}`,
          method: "PATCH",
          body,
        }),
      }),

      // UPLOAD TRACK AUDIO
      uploadTrackAudio: builder.mutation({
        query: ({ id, formData }: { id: string; formData: FormData }) => ({
          url: `/tracks/${id}/audio`,
          method: "POST",
          body: formData,
          formData: true,
        }),
      }),

      // DELETE TRACK AUDIO
      deleteTrackAudio: builder.mutation({
        query: ({ id, audioFileId }: { id: string; audioFileId: string }) => ({
          url: `/tracks/${id}/audio/${audioFileId}`,
          method: "DELETE",
        }),
      }),

      // VALIDATE TRACK
      validateTrack: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/tracks/${id}/validate`,
          method: "POST",
        }),
      }),

      // CREATE TRACK CONTRIBUTOR
      createTrackContributor: builder.mutation({
        query: (body: { trackId: string; contributorId: string; role: string }) => ({
          url: "/track-contributors",
          method: "POST",
          body,
        }),
      }),

      // DELETE TRACK CONTRIBUTOR
      deleteTrackContributor: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/track-contributors/${id}`,
          method: "DELETE",
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
  useUpdateTrackMutation,
  useUploadTrackAudioMutation,
  useDeleteTrackAudioMutation,
  useValidateTrackMutation,
  useCreateTrackContributorMutation,
  useDeleteTrackContributorMutation,
} = apiMutationSlice;
export default apiMutationSlice;
