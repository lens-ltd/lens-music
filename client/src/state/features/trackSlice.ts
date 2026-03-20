import { createSlice } from '@reduxjs/toolkit';
import { Track } from '@/types/models/track.types';

const initialState: {
  tracksList: Track[];
  track?: Track;
  selectedTrack?: Track;
} = {
  tracksList: [],
  track: undefined,
  selectedTrack: undefined,
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
  },
});

export const {
  setTracksList,
  setTrack,
  setSelectedTrack,
} = trackSlice.actions;

export default trackSlice.reducer;
