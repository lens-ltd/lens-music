import { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import UserLayout from "@/containers/UserLayout";
import ReleaseNavigationPanel from "@/containers/releases/ReleaseNavigationPanel";
import ReleaseProgressNavigation from "@/containers/releases/ReleaseProgressNavigation";
import {
  useCreateReleaseNavigationFlow,
  useFetchReleaseNavigationFlows,
  useFetchStaticReleaseNavigation,
} from "@/hooks/releases/navigation.hooks";
import { useWizardStepNavigation } from "@/hooks/releases/wizardStepNavigation.hooks";
import { useGetRelease } from "@/hooks/releases/release.hooks";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { resetNavigationState } from "@/state/features/navigationSlice";
import { resetRelease } from "@/state/features/releaseSlice";
import { setTracksList } from "@/state/features/trackSlice";
import { UUID } from "@/types/common.types";
import { capitalizeString } from "@/utils/strings.helper";
import { getApiErrorMessage } from "@/utils/errors.helper";
import { getAdjacentWizardStepNames } from "@/utils/navigations.helper";
import { useParams } from "react-router-dom";
import ReleaseWizardOverview from "./wizard-steps/ReleaseWizardOverview";
import ReleaseWizardUploadTracks from "./wizard-steps/ReleaseWizardUploadTracks";
import ReleaseWizardManageContributions from "./wizard-steps/ReleaseWizardManageContributions";
import ReleaseWizardRegions from "./wizard-steps/ReleaseWizardRegions";
import ReleaseWizardStores from "./wizard-steps/ReleaseWizardStores";
import ReleaseWizardPreview from "./wizard-steps/ReleaseWizardPreview";

export interface ReleaseWizardStepProps {
  currentStepName?: string;
  nextStepName?: string;
  previousStepName?: string;
  releaseIsFetching?: boolean;
}

const ReleaseWizard = ({ id }: { id: UUID }) => {
  const dispatch = useAppDispatch();
  const { releaseNavigationFlows, activeReleaseNavigationFlow, staticSteps } =
    useAppSelector((state) => state.navigation);
  const { release } = useAppSelector((state) => state.release);

  const { getRelease, isFetching: releaseIsFetching } = useGetRelease();
  const {
    fetchReleaseNavigationFlows,
    isFetching: releaseNavigationFlowsIsFetching,
    isSuccess: releaseNavigationFlowsIsSuccess,
  } = useFetchReleaseNavigationFlows();
  const {
    fetchStaticReleaseNavigation,
    isFetching: staticReleaseNavigationIsFetching,
    isSuccess: staticReleaseNavigationIsSuccess,
  } = useFetchStaticReleaseNavigation();
  const {
    createReleaseNavigationFlow,
    isLoading: createReleaseNavigationFlowIsLoading,
  } = useCreateReleaseNavigationFlow();
  const { goTo, isNavigating: stepIsSwitching } = useWizardStepNavigation();

  // Global release/navigation/track state outlives this page. Until the store
  // holds this release, it may still hold the previous one, so nothing that
  // reads it (the steps, their saves) may render yet.
  const isCurrentRelease = release?.id === id;

  const wizardIsLoading =
    releaseIsFetching ||
    releaseNavigationFlowsIsFetching ||
    staticReleaseNavigationIsFetching ||
    createReleaseNavigationFlowIsLoading ||
    stepIsSwitching;

  // Controls whether the panel replaces the active step with a skeleton. This
  // must only fire for the initial wizard load (nothing to render yet) and step
  // switches — NOT for a background release refetch. A step like PREVIEW
  // refreshes the release on mount (shared `getRelease` cache key), which pulses
  // `releaseIsFetching`; gating the skeleton on that would unmount the step,
  // abort its in-flight section fetches, then remount it and refetch again —
  // an infinite loader loop.
  const stepContentIsLoading =
    !isCurrentRelease ||
    !activeReleaseNavigationFlow ||
    createReleaseNavigationFlowIsLoading ||
    stepIsSwitching;

  // Guards the one-time bootstrap of the initial OVERVIEW navigation flow so a
  // slow/duplicate render can't create it twice.
  const hasBootstrappedFirstFlow = useRef(false);

  useEffect(() => {
    dispatch(resetNavigationState());
    dispatch(resetRelease());
    dispatch(setTracksList([]));
    getRelease({ id });
  }, [id, dispatch, getRelease]);

  useEffect(() => {
    if (isCurrentRelease) {
      fetchReleaseNavigationFlows({ releaseId: id });
      fetchStaticReleaseNavigation({});
    }
  }, [
    id,
    isCurrentRelease,
    fetchReleaseNavigationFlows,
    fetchStaticReleaseNavigation,
  ]);

  useEffect(() => {
    if (
      isCurrentRelease &&
      !hasBootstrappedFirstFlow.current &&
      !createReleaseNavigationFlowIsLoading &&
      // A cached empty list can arrive while the real flows are still loading.
      !releaseNavigationFlowsIsFetching &&
      releaseNavigationFlowsIsSuccess &&
      staticReleaseNavigationIsSuccess &&
      Object.keys(staticSteps).length > 0 &&
      releaseNavigationFlows.length === 0
    ) {
      hasBootstrappedFirstFlow.current = true;
      createReleaseNavigationFlow({
        releaseId: id,
        staticReleaseNavigationStepName: "OVERVIEW",
      }).catch((error) => {
        toast.error(
          getApiErrorMessage(
            error,
            "We couldn't start this release. Reload the page and try again.",
          ),
        );
      });
    }
  }, [
    id,
    isCurrentRelease,
    releaseNavigationFlowsIsFetching,
    releaseNavigationFlowsIsSuccess,
    staticReleaseNavigationIsSuccess,
    staticSteps,
    releaseNavigationFlows.length,
    createReleaseNavigationFlow,
    createReleaseNavigationFlowIsLoading,
  ]);

  const activateStep = useCallback(
    (stepName: string) => {
      void goTo(stepName);
    },
    [goTo],
  );

  const stepContent = useMemo(() => {
    const stepName =
      activeReleaseNavigationFlow?.staticReleaseNavigation?.stepName || "";
    const { previousStepName, nextStepName } =
      getAdjacentWizardStepNames(staticSteps, stepName);

    if (stepName === "OVERVIEW") {
      return (
        <ReleaseWizardOverview
          nextStepName={nextStepName}
          previousStepName={previousStepName}
          currentStepName="OVERVIEW"
        />
      );
    }
    if (stepName === "MANAGE_CONTRIBUTIONS") {
      return (
        <ReleaseWizardManageContributions
          nextStepName={nextStepName}
          previousStepName={previousStepName}
          currentStepName="MANAGE_CONTRIBUTIONS"
        />
      );
    }
    if (stepName === "UPLOAD_TRACKS") {
      return (
        <ReleaseWizardUploadTracks
          nextStepName={nextStepName}
          previousStepName={previousStepName}
          currentStepName="UPLOAD_TRACKS"
        />
      );
    }
    if (stepName === "REGIONS") {
      return (
        <ReleaseWizardRegions
          nextStepName={nextStepName}
          previousStepName={previousStepName}
          currentStepName="REGIONS"
        />
      );
    }
    if (stepName === "STORES") {
      return (
        <ReleaseWizardStores
          nextStepName={nextStepName}
          previousStepName={previousStepName}
          currentStepName="STORES"
        />
      );
    }
    if (stepName === "PREVIEW") {
      return (
        <ReleaseWizardPreview
          previousStepName={previousStepName}
          releaseIsFetching={releaseIsFetching}
          currentStepName="PREVIEW"
        />
      );
    }

    return (
      <article className="card-framed p-6 sm:p-8">
        <p className="text-xs text-(--muted)">
          Step unavailable
        </p>
        <h2 className="mt-3 text-xl text-(--ink)">
          {capitalizeString(stepName)}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--muted)">
          This release step is not supported by this version of the workspace.
          Return to the previous step to continue editing safely.
        </p>
        {previousStepName ? (
          <button
            type="button"
            className="mt-5 text-[13px] text-(--signal) underline-offset-4 hover:underline"
            onClick={() => activateStep(previousStepName)}
          >
            Return to previous step
          </button>
        ) : null}
      </article>
    );
  }, [
    activeReleaseNavigationFlow?.staticReleaseNavigation?.stepName,
    activateStep,
    releaseIsFetching,
    staticSteps,
  ]);

  return (
    <UserLayout variant="canvas">
      <div className="flex w-full flex-col gap-5 rounded-(--radius-card) bg-(--paper) p-6">
        <ReleaseProgressNavigation
          staticSteps={staticSteps}
          releaseNavigationFlows={releaseNavigationFlows}
          activeReleaseNavigationFlow={activeReleaseNavigationFlow}
          isLoading={wizardIsLoading}
          onActivateStep={activateStep}
        />

        <ReleaseNavigationPanel
          staticSteps={staticSteps}
          releaseNavigationFlows={releaseNavigationFlows}
          activeReleaseNavigationFlow={activeReleaseNavigationFlow}
          isLoading={stepContentIsLoading}
          onActivateStep={activateStep}
        >
          {isCurrentRelease ? stepContent : null}
        </ReleaseNavigationPanel>
      </div>
    </UserLayout>
  );
};

// Keyed by id so every release gets a fresh wizard: hook-local query results
// and refs from the previous release can't leak into this one.
const ReleaseWizardPage = () => {
  const { id } = useParams<{ id: UUID }>();
  if (!id) return null;
  return <ReleaseWizard key={id} id={id} />;
};

export default ReleaseWizardPage;
