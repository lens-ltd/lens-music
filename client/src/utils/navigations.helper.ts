import { GroupedStaticReleaseNavigation, StaticReleaseNavigation } from "@/types/models/staticReleaseNavigation.types";

export const getStaticReleaseNavigationStep = (staticSteps: GroupedStaticReleaseNavigation, stepName: string) => {
    return Object.values(staticSteps).flat().find((step: StaticReleaseNavigation) => step?.stepName === stepName);
};
