import { createSlice } from '@reduxjs/toolkit';
import { Track } from '@/types/models/track.types';

const initialState: {
  tracksList: Track[];
  track?: Track;
  selectedTrack?: Track;
  createReleaseTrackModal: boolean;
} = {
  tracksList: [],
  track: undefined,
  selectedTrack: undefined,
  createReleaseTrackModal: false,
};

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setTracksList: (state, action) => {
      state.tracksList = action.payload;
    },
    setTrack: (state, action) => {
      state.track = action.payload;
    },
    setSelectedTrack: (state, action) => {
      state.selectedTrack = action.payload;
    },
    setCreateReleaseTrackModal: (state, action) => {
      state.createReleaseTrackModal = action.payload;
    },
  },
});

export const {
  setTracksList,
  setTrack,
  setSelectedTrack,
  setCreateReleaseTrackModal,
} = trackSlice.actions;

export default trackSlice.reducer;
