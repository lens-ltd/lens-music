import { configureStore } from '@reduxjs/toolkit';
import apiMutationSlice from './api/apiMutationSlice';
import authSlice from './features/authSlice';
import userSlice from './features/userSlice';
import artistSlice from './features/artistSlice';
import labelSlice from './features/labelSlice';
import sidebarSlice from './features/sidebarSlice';
import apiQuerySlice from './api/apiQuerySlice';
import releaseSlice from './features/releaseSlice';
import lyricSlice from './features/lyricSlice';

export const store = configureStore({
  reducer: {
    [apiMutationSlice.reducerPath]: apiMutationSlice.reducer,
    [apiQuerySlice.reducerPath]: apiQuerySlice.reducer,
    auth: authSlice,
    user: userSlice,
    artist: artistSlice,
    label: labelSlice,
    sidebar: sidebarSlice,
    release: releaseSlice,
    lyric: lyricSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      apiMutationSlice.middleware,
      apiQuerySlice.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
