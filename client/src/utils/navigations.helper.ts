import { ReleaseNavigationFlow } from "@/types/models/releaseNavigationFlow.types";
import { GroupedStaticReleaseNavigation, StaticReleaseNavigation } from "@/types/models/staticReleaseNavigation.types";

// GET STATIC RELEASE NAVIGATION STEP
export const getStaticReleaseNavigationStep = (staticSteps: GroupedStaticReleaseNavigation, stepName: string) => {
    return Object.values(staticSteps).flat().find((step: StaticReleaseNavigation) => step?.stepName === stepName);
};

// GET RELEASE NAVIGATION FLOW
export const getReleaseNavigationFlow = (releaseNavigationFlows: ReleaseNavigationFlow[], stepName: string) => {
    return releaseNavigationFlows.find((flow: ReleaseNavigationFlow) => flow?.staticReleaseNavigation?.stepName === stepName);
};

export const getOrderedWizardSteps = (
    staticSteps: GroupedStaticReleaseNavigation,
): StaticReleaseNavigation[] =>
    Object.values(staticSteps)
        .flat()
        .sort(
            (a, b) =>
                a.tabOrder - b.tabOrder || a.stepOrder - b.stepOrder,
        );

export const getAdjacentWizardStepNames = (
    staticSteps: GroupedStaticReleaseNavigation,
    currentStepName: string,
) => {
    const orderedSteps = getOrderedWizardSteps(staticSteps);
    const currentIndex = orderedSteps.findIndex(
        (step) => step.stepName === currentStepName,
    );

    return {
        previousStepName:
            currentIndex > 0 ? orderedSteps[currentIndex - 1]?.stepName : undefined,
        nextStepName:
            currentIndex >= 0
                ? orderedSteps[currentIndex + 1]?.stepName
                : undefined,
    };
};
