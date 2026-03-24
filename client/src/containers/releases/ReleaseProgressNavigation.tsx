import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SkeletonLoader } from '@/components/inputs/Loader';
import { ReleaseNavigationFlow } from '@/types/models/releaseNavigationFlow.types';
import {
  GroupedStaticReleaseNavigation,
  StaticReleaseNavigation,
} from '@/types/models/staticReleaseNavigation.types';
import { capitalizeString } from '@/utils/strings.helper';
import { Link } from 'react-router-dom';

type ReleaseProgressNavigationProps = {
  releaseId?: string;
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
    <section className="rounded-md bg-white py-2 px-3 shadow-sm">
      <nav
        className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200"
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
            <Link
              key={`${navigationTab.tabName}-${index}`}
              to="#"
              onClick={(e) => {
                e.preventDefault();
                targetStep && onActivateStep(targetStep?.stepName);
              }}
              className={`group w-full min-w-fit rounded-md border px-4 py-1 text-left transition-all duration-200 ${navigationTab.active
                  ? 'border-primary bg-primary text-white shadow-[0_6px_14px_-12px_rgba(0,90,150,0.35)]'
                  : navigationTab.completed
                    ? 'border-primary/25 bg-primary/5 text-primary hover:bg-primary/10'
                    : 'border-gray-100 bg-white text-gray-700 hover:border-primary/30 hover:bg-gray-50'
                }`}
            >
              <span className="flex w-full items-center gap-3">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-normal ${navigationTab?.active
                      ? 'bg-white/20 text-white'
                      : navigationTab?.completed
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'
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
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default ReleaseProgressNavigation;
