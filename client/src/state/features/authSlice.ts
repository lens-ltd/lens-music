import store from 'store';
import { createSlice } from '@reduxjs/toolkit';

const persistedToken = store.get('token');
const persistedUser = store.get('user');
const hasCompleteSession = Boolean(persistedToken && persistedUser?.id);

if (!hasCompleteSession) {
  store.remove('token');
  store.remove('user');
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: hasCompleteSession ? persistedToken : undefined,
    user: hasCompleteSession ? persistedUser : undefined,
  },
  reducers: {
    setSession: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      store.set('token', action.payload.accessToken);
      store.set('user', action.payload.user);
    },
    clearSession: (state) => {
      state.token = undefined;
      state.user = undefined;
      store.remove('token');
      store.remove('user');
    },
  },
});

export default authSlice.reducer;

export const { setSession, clearSession } = authSlice.actions;
