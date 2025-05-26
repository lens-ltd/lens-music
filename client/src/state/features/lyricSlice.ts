import { createSlice } from '@reduxjs/toolkit'

const initialState: {
    lyricsGuideLinesModal: boolean;
} = {
    lyricsGuideLinesModal: false,
}

const lyricSlice = createSlice({
  name: 'lyric',
  initialState,
  reducers: {
    setLyricsGuideLinesModal: (state, action) => {
        state.lyricsGuideLinesModal = action.payload;
    }
  }
});

export const {
    setLyricsGuideLinesModal
} = lyricSlice.actions

export default lyricSlice.reducer