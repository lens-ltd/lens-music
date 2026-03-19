import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  ReleaseNavigationFlow,
} from '@/types/models/releaseNavigationFlow.types';
import { GroupedStaticReleaseNavigation } from '@/types/models/staticReleaseNavigation.types';

type NavigationState = {
  staticSteps: GroupedStaticReleaseNavigation;
  releaseNavigationFlows: ReleaseNavigationFlow[];
  activeReleaseNavigationFlow?: ReleaseNavigationFlow;
};

const initialState: NavigationState = {
  staticSteps: {},
  releaseNavigationFlows: [],
  activeReleaseNavigationFlow: undefined,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setStaticSteps: (state, action: PayloadAction<GroupedStaticReleaseNavigation>) => {
      state.staticSteps = action.payload;
    },
    setReleaseNavigationFlows: (state, action: PayloadAction<ReleaseNavigationFlow[]>) => {
      state.releaseNavigationFlows = action.payload;
      state.activeReleaseNavigationFlow =
        action.payload.find((flow) => flow.active) || undefined;
    },
    setActiveReleaseNavigationFlow: (
      state,
      action: PayloadAction<ReleaseNavigationFlow | undefined>,
    ) => {
      state.activeReleaseNavigationFlow = action.payload;
    },
    resetNavigationState: (state) => {
      state.staticSteps = {};
      state.releaseNavigationFlows = [];
      state.activeReleaseNavigationFlow = undefined;
    },
  },
});

export const {
  setStaticSteps,
  setReleaseNavigationFlows,
  setActiveReleaseNavigationFlow,
  resetNavigationState,
} = navigationSlice.actions;

export default navigationSlice.reducer;
