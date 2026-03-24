import { useCallback, useEffect } from "react";
import {
  useCompleteReleaseNavigationFlowMutation,
  useCreateReleaseNavigationFlowMutation,
} from "@/state/api/apiMutationSlice";
import {
  useLazyFetchReleaseNavigationFlowsQuery,
  useLazyFetchStaticReleaseNavigationQuery,
} from "@/state/api/apiQuerySlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { store } from "@/state/store";
import {
  setActiveReleaseNavigationFlow,
  setReleaseNavigationFlows,
  setStaticSteps,
} from "@/state/features/navigationSlice";
import { ReleaseNavigationFlow } from "@/types/models/releaseNavigationFlow.types";
import {
  getReleaseNavigationFlow,
  getStaticReleaseNavigationStep,
} from "@/utils/navigations.helper";
import { UUID } from "@/types/common.types";

// FETCH STATIC RELEASE NAVIGATION
export const useFetchStaticReleaseNavigation = () => {
  const dispatch = useAppDispatch();
  const [fetchStaticReleaseNavigation, { isFetching, data, isSuccess }] =
    useLazyFetchStaticReleaseNavigationQuery();

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setStaticSteps(data.data));
    }
  }, [isSuccess, data, dispatch]);

  return { fetchStaticReleaseNavigation, isFetching, data, isSuccess };
};

// FETCH RELEASE NAVIGATION FLOWS
export const useFetchReleaseNavigationFlows = () => {
  const dispatch = useAppDispatch();
  const [fetchReleaseNavigationFlows, { isFetching, data, isSuccess }] =
    useLazyFetchReleaseNavigationFlowsQuery();

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setReleaseNavigationFlows(data?.data?.flows || []));
      dispatch(
        setActiveReleaseNavigationFlow(
          data?.data?.flows?.find(
            (flow: ReleaseNavigationFlow) => flow?.active,
          ) || undefined,
        ),
      );
    }
  }, [isSuccess, data, dispatch]);

  return { fetchReleaseNavigationFlows, isFetching, data, isSuccess };
};

// CREATE RELEASE NAVIGATION FLOW
export const useCreateReleaseNavigationFlow = () => {
  // STATE
  const dispatch = useAppDispatch();
  const { staticSteps } = useAppSelector((state) => state.navigation);

  // MUTATION
  const [
    createReleaseNavigationFlowMutation,
    { isLoading, reset, data, isSuccess },
  ] = useCreateReleaseNavigationFlowMutation();

  const createReleaseNavigationFlow = useCallback(
    async ({
      releaseId,
      staticReleaseNavigationStepName,
    }: {
      releaseId?: UUID;
      staticReleaseNavigationStepName: string;
    }) => {
      const staticReleaseNavigationStep = getStaticReleaseNavigationStep(
        staticSteps,
        staticReleaseNavigationStepName,
      );
      if (!releaseId || !staticReleaseNavigationStep?.id) return;
      return createReleaseNavigationFlowMutation({
        releaseId,
        staticReleaseNavigationId: staticReleaseNavigationStep.id,
      }).unwrap();
    },
    [createReleaseNavigationFlowMutation, staticSteps],
  );

  useEffect(() => {
    if (!isSuccess || !data?.data) return;
    dispatch(setStaticSteps(data.data.steps || []));
    dispatch(setReleaseNavigationFlows(data.data.flows || []));
    reset();
  }, [isSuccess, data, dispatch, reset]);

  return { createReleaseNavigationFlow, isLoading, reset, data, isSuccess };
};

// COMPLETE RELEASE NAVIGATION FLOW
export const useCompleteReleaseNavigationFlow = () => {
  const dispatch = useAppDispatch();
  const releaseNavigationFlows = useAppSelector(
    (state) => state.navigation.releaseNavigationFlows,
  );
  const [
    completeReleaseNavigationFlowMutation,
    { isLoading, reset, data, isSuccess },
  ] = useCompleteReleaseNavigationFlowMutation();

  const completeReleaseNavigationFlow = useCallback(
    async ({
      isCompleted,
      staticReleaseNavigationStepName,
    }: {
      isCompleted: boolean;
      staticReleaseNavigationStepName: string;
    }) => {
      const releaseNavigationFlow = getReleaseNavigationFlow(
        releaseNavigationFlows,
        staticReleaseNavigationStepName,
      );
      if (!releaseNavigationFlow?.id) return;
      return completeReleaseNavigationFlowMutation({
        id: releaseNavigationFlow.id,
        isCompleted,
      }).unwrap();
    },
    [completeReleaseNavigationFlowMutation, releaseNavigationFlows],
  );

  useEffect(() => {
    if (!isSuccess || !data?.data) return;
    const flows = store.getState().navigation.releaseNavigationFlows;
    const updatedFlows = flows.map((flow) =>
      flow.id === data.data.id ? { ...flow, ...data.data } : flow,
    );
    dispatch(setReleaseNavigationFlows(updatedFlows));
    reset();
  }, [isSuccess, data, dispatch, reset]);

  return { completeReleaseNavigationFlow, isLoading, reset, data, isSuccess };
};
