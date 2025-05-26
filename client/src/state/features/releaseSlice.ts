import { createSlice } from '@reduxjs/toolkit';
import { Release } from '@/types/models/release.types';

const initialState: {
  releasesList: Release[];
  release?: Release;
  addReleaseModal: boolean;
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  createReleaseModal: boolean;
} = {
  releasesList: [],
  release: undefined,
  addReleaseModal: false,
  page: 0,
  size: 10,
  totalCount: 0,
  totalPages: 0,
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
    setAddReleaseModal: (state, action) => {
      state.addReleaseModal = action.payload;
    },
    setReleasePage: (state, action) => {
      state.page = action.payload;
    },
    setReleaseSize: (state, action) => {
      state.size = action.payload;
    },
    setReleaseTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setReleaseTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setCreateReleaseModal: (state, action) => {
      state.createReleaseModal = action.payload;
    },
  },
});

export const {
  setReleasesList,
  setRelease,
  setAddReleaseModal,
  setReleasePage,
  setReleaseSize,
  setReleaseTotalCount,
  setReleaseTotalPages,
  setCreateReleaseModal,
} = releaseSlice.actions;

export default releaseSlice.reducer;
