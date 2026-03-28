import { createSlice } from '@reduxjs/toolkit';
import { Contributor } from '@/types/models/contributor.types';

const initialState: {
  contributorsList: Contributor[];
  contributor?: Contributor;
  createContributorModal: boolean;
  deleteContributorModal: boolean;
  selectedContributor?: Contributor;
  verifyContributorModal: boolean;
} = {
  contributorsList: [],
  contributor: undefined,
  createContributorModal: false,
  deleteContributorModal: false,
  selectedContributor: undefined,
  verifyContributorModal: false,
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
  },
});

export const {
  setContributorsList,
  setContributor,
  setCreateContributorModal,
  setDeleteContributorModal,
  setSelectedContributor,
  setVerifyContributorModal,
} = contributorSlice.actions;

export default contributorSlice.reducer;
