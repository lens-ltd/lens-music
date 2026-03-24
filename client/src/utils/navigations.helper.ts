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
