import store from "store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constants/environments.constants";
import type {
  CreateContributorPayload,
  CreateContributorMembershipPayload,
  UpdateContributorPayload,
} from "@/types/models/contributor.types";
import type {
  CreateDealPayload,
  UpdateDealPayload,
} from "@/types/models/deal.types";
import type {
  CreateTrackRightsControllerPayload,
  UpdateTrackRightsControllerPayload,
} from "@/types/models/trackRightsController.types";
import type { LabelPayload } from "@/types/models/label.types";
import type {
  CreateReleaseLabelPayload,
  UpdateReleaseLabelPayload,
} from "@/types/models/releaseLabel.types";
import type { RelatedReleasePayload } from "@/types/models/relatedRelease.types";
import type { ReleaseTerritoryDetailPayload } from "@/types/models/releaseTerritoryDetail.types";
import type { UpdateStorePayload } from "@/types/models/store.types";

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

      requestInvitation: builder.mutation({
        query: ({ name, email, phoneNumber }) => ({
          url: "/auth/invitations/request",
          method: "POST",
          body: { name, email, phoneNumber },
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

      approveInvitation: builder.mutation({
        query: (id: string) => ({
          url: `/auth/invitations/${id}/approve`,
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

      createLabel: builder.mutation({
        query: (body: LabelPayload) => ({
          url: "/labels",
          method: "POST",
          body,
        }),
      }),

      updateLabel: builder.mutation({
        query: ({
          id,
          body,
        }: {
          id: string;
          body: Partial<LabelPayload>;
        }) => ({
          url: `/labels/${id}`,
          method: "PATCH",
          body,
        }),
      }),

      createGenre: builder.mutation({
        query: (body: { name: string; parentId?: string }) => ({
          url: '/genres',
          method: 'POST',
          body,
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
          method: 'PATCH',
          body: { territories },
        }),
      }),

      upsertReleaseGenre: builder.mutation({
        query: ({ id, genreId, type }: { id: string; genreId: string; type: string }) => ({
          url: `/releases/${id}/genres`,
          method: 'POST',
          body: { genreId, type },
        }),
      }),

      deleteReleaseGenre: builder.mutation({
        query: ({ id, type }: { id: string; type: string }) => ({
          url: `/releases/${id}/genres`,
          method: 'DELETE',
          params: { type },
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

      submitRelease: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/releases/${id}/submit`,
          method: "POST",
        }),
      }),

      createTrackContributor: builder.mutation({
        query: (body: {
          trackId: string;
          contributorId: string;
          role: string;
          sequenceNumber?: number;
        }) => ({
          url: "/track-contributors",
          method: "POST",
          body,
        }),
      }),

      updateTrackContributor: builder.mutation({
        query: ({
          id,
          body,
        }: {
          id: string;
          body: { sequenceNumber?: number };
        }) => ({
          url: `/track-contributors/${id}`,
          method: "PATCH",
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
        query: (body: {
          releaseId: string;
          contributorId: string;
          role: string;
          sequenceNumber?: number;
        }) => ({
          url: "/release-contributors",
          method: "POST",
          body,
        }),
      }),

      updateReleaseContributor: builder.mutation({
        query: ({
          id,
          body,
        }: {
          id: string;
          body: { sequenceNumber?: number };
        }) => ({
          url: `/release-contributors/${id}`,
          method: "PATCH",
          body,
        }),
      }),

      deleteReleaseContributor: builder.mutation({
        query: ({ id }: { id: string }) => ({
          url: `/release-contributors/${id}`,
          method: "DELETE",
        }),
      }),

      createReleaseDeal: builder.mutation({
        query: ({
          releaseId,
          body,
        }: {
          releaseId: string;
          body: CreateDealPayload;
        }) => ({
          url: `/releases/${releaseId}/deals`,
          method: "POST",
          body,
        }),
      }),

      updateReleaseDeal: builder.mutation({
        query: ({
          releaseId,
          dealId,
          body,
        }: {
          releaseId: string;
          dealId: string;
          body: UpdateDealPayload;
        }) => ({
          url: `/releases/${releaseId}/deals/${dealId}`,
          method: "PATCH",
          body,
        }),
      }),

      deleteReleaseDeal: builder.mutation({
        query: ({
          releaseId,
          dealId,
        }: {
          releaseId: string;
          dealId: string;
        }) => ({
          url: `/releases/${releaseId}/deals/${dealId}`,
          method: "DELETE",
        }),
      }),

      createReleaseLabel: builder.mutation({
        query: ({
          releaseId,
          body,
        }: {
          releaseId: string;
          body: CreateReleaseLabelPayload;
        }) => ({
          url: `/releases/${releaseId}/labels`,
          method: "POST",
          body,
        }),
      }),

      updateReleaseLabel: builder.mutation({
        query: ({
          releaseId,
          releaseLabelId,
          body,
        }: {
          releaseId: string;
          releaseLabelId: string;
          body: UpdateReleaseLabelPayload;
        }) => ({
          url: `/releases/${releaseId}/labels/${releaseLabelId}`,
          method: "PATCH",
          body,
        }),
      }),

      deleteReleaseLabel: builder.mutation({
        query: ({
          releaseId,
          releaseLabelId,
        }: {
          releaseId: string;
          releaseLabelId: string;
        }) => ({
          url: `/releases/${releaseId}/labels/${releaseLabelId}`,
          method: "DELETE",
        }),
      }),

      createRelatedRelease: builder.mutation({
        query: ({
          releaseId,
          body,
        }: {
          releaseId: string;
          body: RelatedReleasePayload;
        }) => ({
          url: `/releases/${releaseId}/related-releases`,
          method: "POST",
          body,
        }),
      }),

      updateRelatedRelease: builder.mutation({
        query: ({
          releaseId,
          relatedReleaseId,
          body,
        }: {
          releaseId: string;
          relatedReleaseId: string;
          body: RelatedReleasePayload;
        }) => ({
          url: `/releases/${releaseId}/related-releases/${relatedReleaseId}`,
          method: "PATCH",
          body,
        }),
      }),

      deleteRelatedRelease: builder.mutation({
        query: ({
          releaseId,
          relatedReleaseId,
        }: {
          releaseId: string;
          relatedReleaseId: string;
        }) => ({
          url: `/releases/${releaseId}/related-releases/${relatedReleaseId}`,
          method: "DELETE",
        }),
      }),

      createReleaseTerritoryDetail: builder.mutation({
        query: ({
          releaseId,
          body,
        }: {
          releaseId: string;
          body: ReleaseTerritoryDetailPayload;
        }) => ({
          url: `/releases/${releaseId}/territory-details`,
          method: "POST",
          body,
        }),
      }),

      updateReleaseTerritoryDetail: builder.mutation({
        query: ({
          releaseId,
          detailId,
          body,
        }: {
          releaseId: string;
          detailId: string;
          body: ReleaseTerritoryDetailPayload;
        }) => ({
          url: `/releases/${releaseId}/territory-details/${detailId}`,
          method: "PATCH",
          body,
        }),
      }),

      deleteReleaseTerritoryDetail: builder.mutation({
        query: ({
          releaseId,
          detailId,
        }: {
          releaseId: string;
          detailId: string;
        }) => ({
          url: `/releases/${releaseId}/territory-details/${detailId}`,
          method: "DELETE",
        }),
      }),

      createTrackRightsController: builder.mutation({
        query: ({
          trackId,
          body,
        }: {
          trackId: string;
          body: CreateTrackRightsControllerPayload;
        }) => ({
          url: `/tracks/${trackId}/rights-controllers`,
          method: "POST",
          body,
        }),
      }),

      updateTrackRightsController: builder.mutation({
        query: ({
          trackId,
          trcId,
          body,
        }: {
          trackId: string;
          trcId: string;
          body: UpdateTrackRightsControllerPayload;
        }) => ({
          url: `/tracks/${trackId}/rights-controllers/${trcId}`,
          method: "PATCH",
          body,
        }),
      }),

      deleteTrackRightsController: builder.mutation({
        query: ({
          trackId,
          trcId,
        }: {
          trackId: string;
          trcId: string;
        }) => ({
          url: `/tracks/${trackId}/rights-controllers/${trcId}`,
          method: "DELETE",
        }),
      }),


      assignReleaseStores: builder.mutation({
        query: ({ id, storeIds }: { id: string; storeIds: string[] }) => ({
          url: `/releases/${id}/stores`,
          method: 'POST',
          body: { storeIds },
        }),
      }),

      updateStore: builder.mutation({
        query: ({
          id,
          body,
        }: {
          id: string;
          body: UpdateStorePayload;
        }) => ({
          url: `/stores/${id}`,
          method: "PATCH",
          body,
        }),
      }),

      deleteReleaseStore: builder.mutation({
        query: ({ id, releaseStoreId }: { id: string; releaseStoreId: string }) => ({
          url: `/releases/${id}/stores/${releaseStoreId}`,
          method: 'DELETE',
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
  useRequestInvitationMutation,
  useCreateBulkInvitationsMutation,
  useApproveInvitationMutation,
  useRevokeInvitationMutation,
  useValidateInvitationTokenMutation,
  useCompleteInvitationMutation,
  useRequestPasswordResetMutation,
  useValidatePasswordResetTokenMutation,
  useConfirmPasswordResetMutation,
  useLazyListLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useCreateGenreMutation,
  useCreateReleaseMutation,
  useDeleteReleaseMutation,
  useUploadReleaseCoverArtMutation,
  useUpdateReleaseOverviewMutation,
  useUpdateReleaseTerritoriesMutation,
  useUpsertReleaseGenreMutation,
  useDeleteReleaseGenreMutation,
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
  useSubmitReleaseMutation,
  useCreateTrackContributorMutation,
  useUpdateTrackContributorMutation,
  useDeleteTrackContributorMutation,
  useCreateReleaseContributorMutation,
  useUpdateReleaseContributorMutation,
  useDeleteReleaseContributorMutation,
  useCreateReleaseDealMutation,
  useUpdateReleaseDealMutation,
  useDeleteReleaseDealMutation,
  useCreateReleaseLabelMutation,
  useUpdateReleaseLabelMutation,
  useDeleteReleaseLabelMutation,
  useCreateRelatedReleaseMutation,
  useUpdateRelatedReleaseMutation,
  useDeleteRelatedReleaseMutation,
  useCreateReleaseTerritoryDetailMutation,
  useUpdateReleaseTerritoryDetailMutation,
  useDeleteReleaseTerritoryDetailMutation,
  useCreateTrackRightsControllerMutation,
  useUpdateTrackRightsControllerMutation,
  useDeleteTrackRightsControllerMutation,
  useAssignReleaseStoresMutation,
  useUpdateStoreMutation,
  useDeleteReleaseStoreMutation,
  useCreateLyricsMutation,
  useUpdateLyricsMutation,
  useDeleteLyricsMutation,
} = apiMutationSlice;
export default apiMutationSlice;
