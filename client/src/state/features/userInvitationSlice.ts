import { UserInvitation } from "@/types/models/invitation.types";
import { createSlice } from "@reduxjs/toolkit";

type UserInvitationState = {
  userInvitationsList: UserInvitation[];
  userInvitation?: UserInvitation;
  selectedUserInvitation?: UserInvitation;
  revokeInvitationModal: boolean;
  declineInvitationModal: boolean;
};

const initialState: UserInvitationState = {
  userInvitationsList: [],
  userInvitation: undefined,
  selectedUserInvitation: undefined,
  revokeInvitationModal: false,
  declineInvitationModal: false,
};

const userInvitationSlice = createSlice({
  name: "userInvitation",
  initialState,
  reducers: {
    setUserInvitationsList: (state, action) => {
      state.userInvitationsList = action.payload;
    },
    setUserInvitation: (state, action) => {
      state.userInvitation = action.payload;
    },
    setSelectedUserInvitation: (state, action) => {
      state.selectedUserInvitation = action.payload;
    },
    setRevokeInvitationModal: (state, action) => {
      state.revokeInvitationModal = action.payload;
    },
    setDeclineInvitationModal: (state, action) => {
      state.declineInvitationModal = action.payload;
    },
  },
});

export const {
  setUserInvitationsList,
  setUserInvitation,
  setSelectedUserInvitation,
  setRevokeInvitationModal,
  setDeclineInvitationModal,
} = userInvitationSlice.actions;

export default userInvitationSlice.reducer;
