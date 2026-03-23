import { Lyrics } from '@/types/models/lyrics.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: {
    lyricsGuideLinesModal: boolean;
    deleteLyricsModal: boolean;
    lyricsList: Lyrics[];
    lyrics?: Lyrics;
    selectedLyrics?: Lyrics;
} = {
    lyricsGuideLinesModal: false,
    deleteLyricsModal: false,
    lyricsList: [],
}

const lyricSlice = createSlice({
  name: 'lyric',
  initialState,
  reducers: {
    setLyricsGuideLinesModal: (state, action) => {
        state.lyricsGuideLinesModal = action.payload;
    },
    setDeleteLyricsModal: (state, action) => {
        state.deleteLyricsModal = action.payload;
    },
    setLyricsList: (state, action) => {
        state.lyricsList = action.payload;
    }, 
    setLyrics: (state, action) => {
        state.lyrics = action.payload;
    },
    setSelectedLyrics: (state, action) => {
        state.selectedLyrics = action.payload;
    },
    removeLyricsFromList: (state, action: PayloadAction<string>) => {
      state.lyricsList = state.lyricsList.filter(
        (item) => item.id !== action.payload,
      );
    },
  }
});

export const {
    setLyricsGuideLinesModal,
    setDeleteLyricsModal,
    setLyricsList,
    setLyrics,
    setSelectedLyrics,
    removeLyricsFromList,
} = lyricSlice.actions;

export default lyricSlice.reducer