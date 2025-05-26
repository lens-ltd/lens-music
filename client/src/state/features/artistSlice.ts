import { Artist } from '@/types/models/artist.types';
import { createSlice } from '@reduxjs/toolkit';

export const initialState: {
  artistsList: Artist[];
  artist?: Artist;
  addArtistModal: boolean;
  page: number;
  size: number;
  totalCount?: number;
  totalPages?: number;
} = {
  artistsList: [],
  artist: undefined,
  addArtistModal: false,
  page: 0,
  size: 10,
  totalCount: 0,
  totalPages: 0,
};

export const artistSlice = createSlice({
  name: 'artist',
  initialState,
  reducers: {
    setArtistsList: (state, action) => {
      state.artistsList = action.payload;
    },
    setArtist: (state, action) => {
      state.artist = action.payload;
    },
    setAddArtistModal: (state, action) => {
      state.addArtistModal = action.payload;
    },
    setAddArtist: (state, action) => {
      if (state.artistsList?.length > 0)
        state.artistsList = [action.payload, ...state.artistsList];
      else state.artistsList = [action.payload];
    },
    setArtistPage: (state, action) => {
      state.page = action.payload;
    },
    setArtistSize: (state, action) => {
      state.size = action.payload;
    },
    setArtistTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setArtistTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
  },
});

export default artistSlice.reducer;

export const {
  setArtistsList,
  setArtist,
  setAddArtistModal,
  setAddArtist,
  setArtistPage,
  setArtistSize,
  setArtistTotalCount,
  setArtistTotalPages,
} = artistSlice.actions;
