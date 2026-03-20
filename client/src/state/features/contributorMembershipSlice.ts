import { createSlice } from '@reduxjs/toolkit';
import { ContributorMembership } from '@/types/models/contributor.types';

const initialState: {
  contributorMembershipsList: ContributorMembership[];
  selectedContributorMembership?: ContributorMembership;
  deleteContributorMembershipModal: boolean;
} = {
  contributorMembershipsList: [],
  selectedContributorMembership: undefined,
  deleteContributorMembershipModal: false,
};

const contributorMembershipSlice = createSlice({
  name: 'contributorMembership',
  initialState,
  reducers: {
    setContributorMembershipsList: (state, action) => {
      state.contributorMembershipsList = action.payload;
    },
    setSelectedContributorMembership: (state, action) => {
      state.selectedContributorMembership = action.payload;
    },
    setDeleteContributorMembershipModal: (state, action) => {
      state.deleteContributorMembershipModal = action.payload;
    },
  },
});

export const {
  setContributorMembershipsList,
  setSelectedContributorMembership,
  setDeleteContributorMembershipModal,
} = contributorMembershipSlice.actions;

export default contributorMembershipSlice.reducer;
