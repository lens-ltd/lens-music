import { createSlice } from '@reduxjs/toolkit';
import { Release } from '@/types/models/release.types';

const initialState: {
  releasesList: Release[];
  release?: Release;
  selectedRelease?: Release;
  createReleaseModal: boolean;
  deleteReleaseModal: boolean;
} = {
  releasesList: [],
  release: undefined,
  selectedRelease: undefined,
  createReleaseModal: false,
  deleteReleaseModal: false,
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
    setSelectedRelease: (state, action) => {
      state.selectedRelease = action.payload;
    },
    setCreateReleaseModal: (state, action) => {
      state.createReleaseModal = action.payload;
    },
    setDeleteReleaseModal: (state, action) => {
      state.deleteReleaseModal = action.payload;
    },
  },
});

export const {
  setReleasesList,
  setRelease,
  setSelectedRelease,
  setCreateReleaseModal,
  setDeleteReleaseModal,
} = releaseSlice.actions;

export default releaseSlice.reducer;
