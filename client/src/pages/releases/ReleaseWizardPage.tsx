import { useCallback, useEffect, useMemo } from "react";
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

  useEffect(() => {
    if (id) {
      getRelease({ id });
    }
  }, [
    id,
    getRelease,
    fetchReleaseNavigationFlows,
    fetchStaticReleaseNavigation,
  ]);

  useEffect(() => {
    if (release?.id) {
      fetchReleaseNavigationFlows({ releaseId: release?.id });
      fetchStaticReleaseNavigation({});
    }
  }, [release?.id, fetchReleaseNavigationFlows, fetchStaticReleaseNavigation]);

  useEffect(() => {
    if (
      id &&
      releaseNavigationFlowsIsSuccess &&
      staticReleaseNavigationIsSuccess &&
      Object.keys(staticSteps).length > 0 &&
      releaseNavigationFlows.length === 0
    ) {
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

    if (stepName === "OVERVIEW") {
      return (
        <ReleaseWizardOverview
          nextStepName={"MANAGE_CONTRIBUTIONS"}
          previousStepName={undefined}
        />
      );
    }
    if (stepName === "MANAGE_CONTRIBUTIONS") {
      return (
        <ReleaseWizardManageContributions
          nextStepName={"UPLOAD_TRACKS"}
          previousStepName={"OVERVIEW"}
        />
      );
    }
    if (stepName === "UPLOAD_TRACKS") {
      return (
        <ReleaseWizardUploadTracks
          nextStepName={"REGIONS"}
          previousStepName={"MANAGE_CONTRIBUTIONS"}
        />
      );
    }
    if (stepName === "REGIONS") {
      return (
        <ReleaseWizardRegions
          nextStepName={"STORES"}
          previousStepName={"UPLOAD_TRACKS"}
        />
      );
    }
    if (stepName === "STORES") {
      return (
        <ReleaseWizardStores
          nextStepName={"PREVIEW"}
          previousStepName={"REGIONS"}
        />
      );
    }
    if (stepName === "PREVIEW") {
      return (
        <ReleaseWizardPreview
          previousStepName={"STORES"}
          releaseIsFetching={releaseIsFetching}
        />
      );
    }

    return (
      <article className="rounded-2xl border border-dashed border-primary/20 bg-gradient-to-br from-primary/[0.03] to-white p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary/70">
          Coming Next
        </p>
        <h2 className="mt-3 text-xl font-semibold text-gray-900">
          {capitalizeString(stepName)}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          This step is wired into the release wizard navigation and ready for
          its dedicated form. The section shell, activation flow, and progress
          state are in place so the content can drop in without changing the
          wizard layout.
        </p>
      </article>
    );
  }, [activeReleaseNavigationFlow?.staticReleaseNavigation?.stepName, releaseIsFetching]);

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-4">
        <ReleaseProgressNavigation
          releaseId={id}
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
          isLoading={wizardIsLoading}
          onActivateStep={activateStep}
        >
          {stepContent}
        </ReleaseNavigationPanel>
      </main>
    </UserLayout>
  );
};

export default ReleaseWizardPage;
