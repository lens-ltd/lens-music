import store from 'store';
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: store.get('token'),
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      store.set('token', action.payload);
    },
  },
});

export default authSlice.reducer;

export const { setToken } = authSlice.actions;
