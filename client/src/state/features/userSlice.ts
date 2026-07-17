import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/models/user.types";

export interface UserState {
  usersList: User[];
  user?: User;
  selectedUser?: User;
  assignUserRoleModal: boolean;
}

const initialState: UserState = {
  usersList: [],
  user: undefined,
  selectedUser: undefined,
  assignUserRoleModal: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAssignUserRoleModal: (state, action) => {
      state.assignUserRoleModal = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setSelectedUser, setUsersList, setUser, setAssignUserRoleModal } =
  userSlice.actions;
