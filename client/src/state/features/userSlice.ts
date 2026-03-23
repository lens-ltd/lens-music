import store from "store";
import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/models/user.types";

export interface UserState {
  usersList: User[];
  user?: User;
  selectedUser?: User;
}

const initialState: UserState = {
  usersList: [],
  user: store.get("user"),
  selectedUser: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      store.set("user", action.payload);
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUser, setSelectedUser, setUsersList } = userSlice.actions;
