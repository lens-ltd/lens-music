import { UserInvitation } from "@/types/models/invitation.types";
import { createSlice } from "@reduxjs/toolkit";

type UserInvitationState = {
  userInvitationsList: UserInvitation[];
  userInvitation?: UserInvitation;
  selectedUserInvitation?: UserInvitation;
};

const initialState: UserInvitationState = {
  userInvitationsList: [],
  userInvitation: undefined,
  selectedUserInvitation: undefined,
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
  },
});

export const {
  setUserInvitationsList,
  setUserInvitation,
  setSelectedUserInvitation,
} = userInvitationSlice.actions;

export default userInvitationSlice.reducer;
