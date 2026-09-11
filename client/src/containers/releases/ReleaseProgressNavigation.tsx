import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SkeletonLoader } from '@/components/inputs/Loader';
import { ReleaseNavigationFlow } from '@/types/models/releaseNavigationFlow.types';
import {
  GroupedStaticReleaseNavigation,
  StaticReleaseNavigation,
} from '@/types/models/staticReleaseNavigation.types';
import { capitalizeString } from '@/utils/strings.helper';

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
    <section className="border-y border-(--line) bg-white py-3">
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
              className={`group min-w-[150px] flex-1 rounded-md border px-4 py-2 text-left transition-all duration-200 ${navigationTab.active
                  ? 'border-[color:var(--lens-blue)] bg-(--lens-blue) text-white'
                  : navigationTab.completed
                    ? 'border-[color:var(--lens-blue)]/25 bg-(--lens-blue)/5 text-(--lens-blue) hover:bg-(--lens-blue-soft)'
                    : 'border-(--line) bg-white text-(--muted) hover:border-[color:var(--lens-blue)]/35'
                }`}
            >
              <span className="flex w-full items-center gap-3">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-normal ${navigationTab?.active
                      ? 'bg-white/20 text-white'
                      : navigationTab?.completed
                        ? 'bg-(--lens-blue) text-white'
                        : 'bg-(--surface) text-(--muted) group-hover:bg-(--lens-blue-soft) group-hover:text-(--lens-blue)'
                    }`}
                >
                  {navigationTab?.completed ? (
                    <FontAwesomeIcon icon={faCheck} className='text-white text-[10px]' />
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
