import store from 'store';
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: store.get('token'),
    user: store.get('user'),
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      store.set('token', action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      store.set('user', action.payload);
    },
  },
});

export default authSlice.reducer;

export const { setToken, setUser } = authSlice.actions;
