import { useCallback, useEffect, useMemo, useRef } from "react";
import UserLayout from "@/containers/UserLayout";
import ReleaseNavigationPanel from "@/containers/releases/ReleaseNavigationPanel";
import ReleaseProgressNavigation from "@/containers/releases/ReleaseProgressNavigation";
import {
  useCreateReleaseNavigationFlow,
  useFetchReleaseNavigationFlows,
  useFetchStaticReleaseNavigation,
} from "@/hooks/releases/navigation.hooks";
import { useGetRelease } from "@/hooks/releases/release.hooks";
import { useAppSelector } from "@/state/hooks";
import { UUID } from "@/types/common.types";
import { capitalizeString } from "@/utils/strings.helper";
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

const ReleaseWizardPage = () => {
  const { releaseNavigationFlows, activeReleaseNavigationFlow, staticSteps } =
    useAppSelector((state) => state.navigation);
    const { release } = useAppSelector((state) => state.release);
  const { id } = useParams<{ id: UUID }>();

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

  const wizardIsLoading =
    releaseIsFetching ||
    releaseNavigationFlowsIsFetching ||
    staticReleaseNavigationIsFetching ||
    createReleaseNavigationFlowIsLoading;

  // Controls whether the panel replaces the active step with a skeleton. This
  // must only fire for the initial wizard load (nothing to render yet) and step
  // switches — NOT for a background release refetch. A step like PREVIEW
  // refreshes the release on mount (shared `getRelease` cache key), which pulses
  // `releaseIsFetching`; gating the skeleton on that would unmount the step,
  // abort its in-flight section fetches, then remount it and refetch again —
  // an infinite loader loop.
  const stepContentIsLoading =
    (!activeReleaseNavigationFlow &&
      (releaseIsFetching ||
        releaseNavigationFlowsIsFetching ||
        staticReleaseNavigationIsFetching)) ||
    createReleaseNavigationFlowIsLoading;

  // Guards the one-time bootstrap of the initial OVERVIEW navigation flow so a
  // slow/duplicate render can't create it twice.
  const hasBootstrappedFirstFlow = useRef(false);

  useEffect(() => {
    hasBootstrappedFirstFlow.current = false;
    if (id) {
      getRelease({ id });
    }
  }, [id, getRelease]);

  useEffect(() => {
    if (release?.id) {
      fetchReleaseNavigationFlows({ releaseId: release?.id });
      fetchStaticReleaseNavigation({});
    }
  }, [release?.id, fetchReleaseNavigationFlows, fetchStaticReleaseNavigation]);

  useEffect(() => {
    if (
      id &&
      !hasBootstrappedFirstFlow.current &&
      !createReleaseNavigationFlowIsLoading &&
      releaseNavigationFlowsIsSuccess &&
      staticReleaseNavigationIsSuccess &&
      Object.keys(staticSteps).length > 0 &&
      releaseNavigationFlows.length === 0
    ) {
      hasBootstrappedFirstFlow.current = true;
      createReleaseNavigationFlow({
        releaseId: id,
        staticReleaseNavigationStepName: "OVERVIEW",
      });
    }
  }, [
    id,
    releaseNavigationFlowsIsSuccess,
    staticReleaseNavigationIsSuccess,
    staticSteps,
    releaseNavigationFlows.length,
    createReleaseNavigationFlow,
    createReleaseNavigationFlowIsLoading,
  ]);

  const activateStep = useCallback(
    (stepName: string) => {
      if (!id) return;
      createReleaseNavigationFlow({
        releaseId: id,
        staticReleaseNavigationStepName: stepName,
      });
    },
    [id, createReleaseNavigationFlow],
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
      <article className="rounded-xl border border-dashed border-(--line) bg-(--surface) p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-(--lens-blue)/70">
          Step unavailable
        </p>
        <h2 className="mt-3 text-xl font-semibold text-(--ink)">
          {capitalizeString(stepName)}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--muted)">
          This release step is not supported by this version of the workspace.
          Return to the previous step to continue editing safely.
        </p>
        {previousStepName ? (
          <button
            type="button"
            className="mt-5 text-[12px] text-(--lens-blue) underline-offset-4 hover:underline"
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
      <div className="flex w-full flex-col gap-5 rounded-xl bg-white">
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
          {stepContent}
        </ReleaseNavigationPanel>
      </div>
    </UserLayout>
  );
};

export default ReleaseWizardPage;
