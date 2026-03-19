import { createSlice } from '@reduxjs/toolkit';
import { Contributor } from '@/types/models/contributor.types';

const initialState: {
  contributorsList: Contributor[];
  contributor?: Contributor;
  createContributorModal: boolean;
} = {
  contributorsList: [],
  contributor: undefined,
  createContributorModal: false,
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
  },
});

export const {
  setContributorsList,
  setContributor,
  setCreateContributorModal,
} = contributorSlice.actions;

export default contributorSlice.reducer;
