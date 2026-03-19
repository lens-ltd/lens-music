import { createSlice } from '@reduxjs/toolkit';
import { Release } from '@/types/models/release.types';

const initialState: {
  releasesList: Release[];
  release?: Release;
  createReleaseModal: boolean;
} = {
  releasesList: [],
  release: undefined,
  createReleaseModal: false,
};

const releaseSlice = createSlice({
  name: 'release',
  initialState,
  reducers: {
    setReleasesList: (state, action) => {
      state.releasesList = action.payload;
    },
    setRelease: (state, action) => {
      state.release = action.payload;
    },
    setCreateReleaseModal: (state, action) => {
      state.createReleaseModal = action.payload;
    },
  },
});

export const {
  setReleasesList,
  setRelease,
  setCreateReleaseModal,
} = releaseSlice.actions;

export default releaseSlice.reducer;
