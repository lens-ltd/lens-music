import { createSlice } from "@reduxjs/toolkit";
import { Role } from "@/types/models/role.types";

export interface RoleState {
  rolesList: Role[];
  role?: Role;
  selectedRole?: Role;
  deleteRoleModal: boolean;
}

const initialState: RoleState = {
  rolesList: [],
  role: undefined,
  selectedRole: undefined,
  deleteRoleModal: false,
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    setRolesList: (state, action) => {
      state.rolesList = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setDeleteRoleModal: (state, action) => {
      state.deleteRoleModal = action.payload;
    },
  },
});

export default roleSlice.reducer;

export const { setSelectedRole, setRolesList, setRole, setDeleteRoleModal } =
  roleSlice.actions;
