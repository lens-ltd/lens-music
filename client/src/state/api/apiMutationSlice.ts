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
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: "/auth/login",
          method: "POST",
          body: { email, password },
        }),
      }),

      createInvitation: builder.mutation({
        query: ({ email }) => ({
          url: "/auth/invitations",
          method: "POST",
          body: { email },
        }),
      }),

      validateInvitationToken: builder.mutation({
        query: ({ token }) => ({
          url: `/auth/invitations/${token}`,
          method: "GET",
        }),
      }),

      completeInvitation: builder.mutation({
        query: ({ token, name, phoneNumber, password }) => ({
          url: "/auth/invitations/complete",
          method: "POST",
          body: {
            token,
            name,
            phoneNumber,
            password,
          },
        }),
      }),

      requestPasswordReset: builder.mutation({
        query: ({ email }) => ({
          url: "/auth/password-reset/request",
          method: "POST",
          body: { email },
        }),
      }),

      validatePasswordResetToken: builder.mutation({
        query: ({ token }) => ({
          url: `/auth/password-reset/${token}`,
          method: "GET",
        }),
      }),

      confirmPasswordReset: builder.mutation({
        query: ({ token, password }) => ({
          url: "/auth/password-reset/confirm",
          method: "POST",
          body: { token, password },
        }),
      }),

      listArtists: builder.query({
        query: ({ size, page }) => ({
          url: "/artists",
          method: "GET",
          params: { size, page },
        }),
      }),

      listLabels: builder.query({
        query: ({ size, page }) => ({
          url: "/labels",
          method: "GET",
          params: { size, page },
        }),
      }),

      createArtist: builder.mutation({
        query: ({ formData }) => ({
          url: "/artists",
          method: "POST",
          body: formData,
          formData: true,
        }),
      }),

      createRelease: builder.mutation({
        query: ({ title, type }) => ({
          url: "/releases",
          method: "POST",
          body: { title, type },
        }),
      }),

      deleteRelease: builder.mutation({
        query: ({ id }) => ({
          url: `/releases/${id}`,
          method: "DELETE",
        }),
      }),

      uploadReleaseCoverArt: builder.mutation({
        query: ({ id, formData }: { id: string; formData: FormData }) => ({
          url: `/releases/${id}/cover-art`,
          method: "POST",
          body: formData,
          formData: true,
        }),
      }),

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

      createReleaseNavigationFlow: builder.mutation({
        query: ({ releaseId, staticReleaseNavigationId }) => ({
          url: "/release-navigation-flows",
          method: "POST",
          body: { releaseId, staticReleaseNavigationId },
        }),
      }),

      completeReleaseNavigationFlow: builder.mutation({
        query: ({ id, isCompleted }) => ({
          url: `/release-navigation-flows/${id}/complete`,
          method: "PATCH",
          body: { isCompleted },
        }),
      }),

      createContributor: builder.mutation({
        query: (body: CreateContributorPayload) => ({
          url: "/contributors",
          method: "POST",
          body,
        }),
      }),

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

      deleteContributor: builder.mutation({
        query: ({ id }) => ({
          url: `/contributors/${id}`,
          method: "DELETE",
        }),
      }),

      createContributorMembership: builder.mutation({
        query: (body: CreateContributorMembershipPayload) => ({
          url: "/contributor-memberships",
          method: "POST",
          body,
        }),
      }),

      deleteContributorMembership: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/contributor-memberships/${id}`,
          method: "DELETE",
        }),
      }),

      createTrack: builder.mutation({
        query: ({ title, releaseId, titleVersion }) => ({
          url: "/tracks",
          method: "POST",
          body: { title, releaseId, titleVersion },
        }),
      }),

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

      uploadTrackAudio: builder.mutation({
        query: ({ id, formData }: { id: string; formData: FormData }) => ({
          url: `/tracks/${id}/audio`,
          method: "POST",
          body: formData,
          formData: true,
        }),
      }),

      deleteTrackAudio: builder.mutation({
        query: ({ id, audioFileId }: { id: string; audioFileId: string }) => ({
          url: `/tracks/${id}/audio/${audioFileId}`,
          method: "DELETE",
        }),
      }),

      validateTrack: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/tracks/${id}/validate`,
          method: "POST",
        }),
      }),

      createTrackContributor: builder.mutation({
        query: (body: { trackId: string; contributorId: string; role: string }) => ({
          url: "/track-contributors",
          method: "POST",
          body,
        }),
      }),

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
  useCreateInvitationMutation,
  useValidateInvitationTokenMutation,
  useCompleteInvitationMutation,
  useRequestPasswordResetMutation,
  useValidatePasswordResetTokenMutation,
  useConfirmPasswordResetMutation,
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
