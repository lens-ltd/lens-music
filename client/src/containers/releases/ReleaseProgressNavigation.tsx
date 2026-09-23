import { SkeletonLoader } from '@/components/inputs/Loader';
import { ReleaseNavigationFlow } from '@/types/models/releaseNavigationFlow.types';
import {
  GroupedStaticReleaseNavigation,
  StaticReleaseNavigation,
} from '@/types/models/staticReleaseNavigation.types';
import { capitalizeString } from '@/utils/strings.helper';

import { LuCheck } from 'react-icons/lu';

type ReleaseProgressNavigationProps = {
  staticSteps: GroupedStaticReleaseNavigation;
  releaseNavigationFlows: ReleaseNavigationFlow[];
  activeReleaseNavigationFlow?: ReleaseNavigationFlow;
  isLoading?: boolean;
  onActivateStep: (stepName: string) => void;
};

type ReleaseNavigationTab = {
  tabName: string;
  completed: boolean;
  active: boolean;
  navigationSteps: StaticReleaseNavigation[];
};

const ReleaseProgressNavigation = ({
  staticSteps,
  releaseNavigationFlows,
  activeReleaseNavigationFlow,
  isLoading,
  onActivateStep,
}: ReleaseProgressNavigationProps) => {
  const navigationTabs: ReleaseNavigationTab[] = Object.values(staticSteps)
    .filter((steps) => steps.length > 0)
    .map((steps) => {
      const tabName = steps[0].tabName;
      const relatedFlows = releaseNavigationFlows
        .filter((flow) =>
          steps.some((step) => step.id === flow.staticReleaseNavigationId),
        )
        .sort((a, b) => {
          const aOrder =
            steps.find((step) => step.id === a.staticReleaseNavigationId)?.stepOrder || 0;
          const bOrder =
            steps.find((step) => step.id === b.staticReleaseNavigationId)?.stepOrder || 0;
          return aOrder - bOrder;
        });

      return {
        tabName,
        completed: relatedFlows.length > 0 && relatedFlows.every((flow) => flow.completed),
        active: steps.some(
          (step) =>
            step.id === activeReleaseNavigationFlow?.staticReleaseNavigationId,
        ),
        navigationSteps: [...steps].sort((a, b) => a.stepOrder - b.stepOrder),
      };
    });

  if (!navigationTabs.length && !isLoading) {
    return null;
  }

  return (
    <section className="py-3">
      <nav
        className="flex gap-2 overflow-x-auto"
        aria-label="Release wizard tabs"
      >
        {navigationTabs.map((navigationTab, index) => {
          const existingFlows = releaseNavigationFlows
            .filter((flow) =>
              navigationTab.navigationSteps.some(
                (step) => step.id === flow.staticReleaseNavigationId,
              ),
            )
            .sort((a, b) => {
              const aOrder =
                navigationTab.navigationSteps.find(
                  (step) => step.id === a.staticReleaseNavigationId,
                )?.stepOrder || 0;
              const bOrder =
                navigationTab.navigationSteps.find(
                  (step) => step.id === b.staticReleaseNavigationId,
                )?.stepOrder || 0;
              return aOrder - bOrder;
            });

          const nextFlow =
            existingFlows.find((flow) => !flow.completed) ||
            existingFlows[existingFlows.length - 1];
          const fallbackStep = navigationTab.navigationSteps[0];
          const targetStep =
            navigationTab.navigationSteps.find(
              (step) => step.id === nextFlow?.staticReleaseNavigationId,
            ) || fallbackStep;

          if (isLoading) {
            return <SkeletonLoader type="text" width="100%" height="2rem" />
          }

          return (
            <button
              type="button"
              key={`${navigationTab.tabName}-${index}`}
              onClick={() => {
                targetStep && onActivateStep(targetStep?.stepName);
              }}
              aria-current={navigationTab.active ? 'step' : undefined}
              className={`group min-w-[150px] flex-1 cursor-pointer rounded-(--radius-control) px-3 py-2 text-left transition-colors duration-(--dur-state) ${navigationTab.active
                  ? 'bg-(--signal) text-white'
                  : navigationTab.completed
                    ? 'bg-(--signal-soft) text-(--signal) hover:bg-(--signal-soft)/70'
                    : 'bg-(--surface) text-(--ink) hover:bg-(--surface-hover)'
                }`}
            >
              <span className="flex w-full items-center gap-3">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-normal ${navigationTab?.active
                      ? 'bg-white/20 text-white'
                      : navigationTab?.completed
                        ? 'bg-(--signal) text-white'
                        : 'bg-(--paper) text-(--muted)'
                    }`}
                >
                  {navigationTab?.completed ? (
                    <LuCheck className='size-4' aria-hidden='true' />
                  ) : <p className="text-xs font-normal">{index + 1}</p>}
                </span>
                <p className="truncate text-sm font-normal">
                  {capitalizeString(navigationTab.tabName)}
                </p>
              </span>
            </button>
          );
        })}
      </nav>
    </section>
  );
};

export default ReleaseProgressNavigation;
