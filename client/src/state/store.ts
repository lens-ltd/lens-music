import { configureStore } from '@reduxjs/toolkit';
import apiMutationSlice from './api/apiMutationSlice';
import authSlice from './features/authSlice';
import userSlice from './features/userSlice';
import labelSlice from './features/labelSlice';
import sidebarSlice from './features/sidebarSlice';
import apiQuerySlice from './api/apiQuerySlice';
import releaseSlice from './features/releaseSlice';
import trackSlice from './features/trackSlice';
import lyricSlice from './features/lyricSlice';
import navigationSlice from './features/navigationSlice';
import contributorSlice from './features/contributorSlice';
import contributorMembershipSlice from './features/contributorMembershipSlice';
import userInvitationSlice from './features/userInvitationSlice';

export const store = configureStore({
  reducer: {
    [apiMutationSlice.reducerPath]: apiMutationSlice.reducer,
    [apiQuerySlice.reducerPath]: apiQuerySlice.reducer,
    auth: authSlice,
    user: userSlice,
    label: labelSlice,
    sidebar: sidebarSlice,
    release: releaseSlice,
    track: trackSlice,
    lyric: lyricSlice,
    navigation: navigationSlice,
    contributor: contributorSlice,
    contributorMembership: contributorMembershipSlice,
    userInvitation: userInvitationSlice,
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
