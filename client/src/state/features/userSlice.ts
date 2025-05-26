import store from 'store';
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: store.get('user'),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      store.set('user', action.payload);
    },
  },
});

export default userSlice.reducer;

export const { setUser } = userSlice.actions;
