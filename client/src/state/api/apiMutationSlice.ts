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

      createBulkInvitations: builder.mutation({
        query: (body: { emails: string[] }) => ({
          url: "/auth/invitations/bulk",
          method: "POST",
          body,
        }),
      }),

      revokeInvitation: builder.mutation({
        query: (id: string) => ({
          url: `/auth/invitations/${id}/revoke`,
          method: "POST",
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

      listLabels: builder.query({
        query: ({ size, page }) => ({
          url: "/labels",
          method: "GET",
          params: { size, page },
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

      updateReleaseTerritories: builder.mutation({
        query: ({
          id,
          territories,
        }: {
          id: string;
          territories: string[];
        }) => ({
          url: `/releases/${id}/territories`,
          method: "PATCH",
          body: { territories },
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

      validateRelease: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/releases/${id}/validate`,
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

      createReleaseContributor: builder.mutation({
        query: (body: { releaseId: string; contributorId: string; role: string }) => ({
          url: "/release-contributors",
          method: "POST",
          body,
        }),
      }),

      deleteReleaseContributor: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/release-contributors/${id}`,
          method: "DELETE",
        }),
      }),

      createLyrics: builder.mutation({
        query: (body: Record<string, unknown>) => ({
          url: "/lyrics",
          method: "POST",
          body,
        }),
      }),

      updateLyrics: builder.mutation({
        query: ({ id, body }: { id: string; body: Record<string, unknown> }) => ({
          url: `/lyrics/${id}`,
          method: "PATCH",
          body,
        }),
      }),

      deleteLyrics: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/lyrics/${id}`,
          method: "DELETE",
        }),
      }),
    };
  },
});

export const {
  useLoginMutation,
  useCreateInvitationMutation,
  useCreateBulkInvitationsMutation,
  useRevokeInvitationMutation,
  useValidateInvitationTokenMutation,
  useCompleteInvitationMutation,
  useRequestPasswordResetMutation,
  useValidatePasswordResetTokenMutation,
  useConfirmPasswordResetMutation,
  useLazyListLabelsQuery,
  useCreateReleaseMutation,
  useDeleteReleaseMutation,
  useUploadReleaseCoverArtMutation,
  useUpdateReleaseOverviewMutation,
  useUpdateReleaseTerritoriesMutation,
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
  useValidateReleaseMutation,
  useCreateTrackContributorMutation,
  useDeleteTrackContributorMutation,
  useCreateReleaseContributorMutation,
  useDeleteReleaseContributorMutation,
  useCreateLyricsMutation,
  useUpdateLyricsMutation,
  useDeleteLyricsMutation,
} = apiMutationSlice;
export default apiMutationSlice;
