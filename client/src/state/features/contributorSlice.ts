import { createSlice } from '@reduxjs/toolkit';
import {
  Contributor,
  ContributorManager,
} from '@/types/models/contributor.types';

const initialState: {
  contributorsList: Contributor[];
  contributor?: Contributor;
  createContributorModal: boolean;
  deleteContributorModal: boolean;
  selectedContributor?: Contributor;
  verifyContributorModal: boolean;
  rejectContributorModal: boolean;
  assignManagerModal: boolean;
  unassignManagerModal: boolean;
  selectedManager?: ContributorManager;
  managersList: ContributorManager[];
} = {
  contributorsList: [],
  contributor: undefined,
  createContributorModal: false,
  deleteContributorModal: false,
  selectedContributor: undefined,
  verifyContributorModal: false,
  rejectContributorModal: false,
  assignManagerModal: false,
  unassignManagerModal: false,
  selectedManager: undefined,
  managersList: [],
};

const contributorSlice = createSlice({
  name: 'contributor',
  initialState,
  reducers: {
    setContributorsList: (state, action) => {
      state.contributorsList = action.payload;
    },
    setContributor: (state, action) => {
      state.contributor = action.payload;
    },
    setCreateContributorModal: (state, action) => {
      state.createContributorModal = action.payload;
    },
    setDeleteContributorModal: (state, action) => {
      state.deleteContributorModal = action.payload;
    },
    setSelectedContributor: (state, action) => {
      state.selectedContributor = action.payload;
    },
    setVerifyContributorModal: (state, action) => {
      state.verifyContributorModal = action.payload;
    },
    setRejectContributorModal: (state, action) => {
      state.rejectContributorModal = action.payload;
    },
    setAssignManagerModal: (state, action) => {
      state.assignManagerModal = action.payload;
    },
    setUnassignManagerModal: (state, action) => {
      state.unassignManagerModal = action.payload;
    },
    setSelectedManager: (state, action) => {
      state.selectedManager = action.payload;
    },
    setManagersList: (state, action) => {
      state.managersList = action.payload;
    },
  },
});

export const {
  setContributorsList,
  setContributor,
  setCreateContributorModal,
  setDeleteContributorModal,
  setSelectedContributor,
  setVerifyContributorModal,
  setRejectContributorModal,
  setAssignManagerModal,
  setUnassignManagerModal,
  setSelectedManager,
  setManagersList,
} = contributorSlice.actions;

export default contributorSlice.reducer;
