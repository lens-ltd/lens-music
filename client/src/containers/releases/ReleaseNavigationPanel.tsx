import { ReactNode, useMemo, useState } from "react";
import { FormSkeletonLoader, SkeletonLoader } from "@/components/inputs/Loader";
import { UUID } from "@/types/common.types";
import { ReleaseNavigationFlow } from "@/types/models/releaseNavigationFlow.types";
import {
  GroupedStaticReleaseNavigation,
  StaticReleaseNavigation,
} from "@/types/models/staticReleaseNavigation.types";
import { capitalizeString } from "@/utils/strings.helper";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "@/state/hooks";
import { toast } from "sonner";

import { LuCheck, LuCircleCheck, LuCopy } from 'react-icons/lu';
import { Icon } from '@/components/ui/icon';

type ReleaseNavigationPanelProps = {
  children: ReactNode;
  staticSteps: GroupedStaticReleaseNavigation;
  releaseNavigationFlows: ReleaseNavigationFlow[];
  activeReleaseNavigationFlow?: ReleaseNavigationFlow;
  isLoading?: boolean;
  onActivateStep: (stepName: string) => void;
};

const ReleaseNavigationPanel = ({
  children,
  staticSteps,
  releaseNavigationFlows,
  activeReleaseNavigationFlow,
  isLoading,
  onActivateStep,
}: ReleaseNavigationPanelProps) => {
  // STATE
  const { release } = useAppSelector((state) => state.release);
  const [copied, setCopied] = useState(false);

  const { id } = useParams<{ id: UUID }>();

  const navigationSteps = useMemo(() => {
    const activeTabName =
      activeReleaseNavigationFlow?.staticReleaseNavigation?.tabName;
    if (!activeTabName) return [] as StaticReleaseNavigation[];
    return [...(staticSteps[activeTabName] || [])].sort(
      (a, b) => a.stepOrder - b.stepOrder,
    );
  }, [
    activeReleaseNavigationFlow?.staticReleaseNavigation?.tabName,
    staticSteps,
  ]);

  const activeStepIndex = navigationSteps.findIndex(
    (step) =>
      step.id === activeReleaseNavigationFlow?.staticReleaseNavigationId,
  );
  const hasStepSidebar = navigationSteps.length > 1;

  return (
    <article className="w-full">
      <section
        className={`w-full ${
          hasStepSidebar
            ? "grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]"
            : "block"
        }`}
      >
        {hasStepSidebar && (
          <aside className="self-start card-framed lg:sticky lg:top-20">
            <header className="px-5 py-4">
              <p className="text-xs text-(--muted)">
                Current Section
              </p>
              <h2 className="mt-2 text-sm font-normal text-(--ink)">
                {capitalizeString(
                  activeReleaseNavigationFlow?.staticReleaseNavigation?.tabName,
                )}
              </h2>
            </header>
            <nav
              className="flex gap-2 overflow-x-auto p-3 lg:flex-col"
              aria-label="Release wizard steps"
            >
              {navigationSteps.map((step, index) => {
                const relatedFlow = releaseNavigationFlows.find(
                  (flow) => flow.staticReleaseNavigationId === step.id,
                );
                const isActive = relatedFlow?.active;
                const isCompleted = relatedFlow?.completed;
                const isPast = activeStepIndex >= 0 && index < activeStepIndex;
                const wizardRoute = id ? `/releases/${id}/wizard` : "#";

                return (
                  <Link
                    key={step?.id}
                    to={wizardRoute}
                    onClick={() => onActivateStep(step.stepName)}
                    aria-current={isActive ? "step" : undefined}
                    className={`relative flex min-w-[190px] items-center gap-3 rounded-(--radius-control) px-3 py-2.5 text-left transition-colors duration-(--dur-state) lg:min-w-0 ${
                      isActive
                        ? "bg-(--paper)"
                        : "hover:bg-(--surface-hover)"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-normal ${
                        isCompleted
                          ? "bg-(--signal) text-white"
                          : isActive
                            ? "bg-(--signal) text-white"
                            : isPast
                              ? "bg-(--signal-soft) text-(--signal)"
                              : "bg-(--surface) text-(--muted)"
                      }`}
                    >
                      {isCompleted ? (
                        <LuCheck className="size-4" aria-hidden="true" />
                      ) : (
                        `${index + 1}`.padStart(2, "0")
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm ${
                          isActive ? "font-normal text-(--signal)" : "text-(--ink)"
                        }`}
                      >
                        {capitalizeString(step?.stepName)}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <div className="min-w-0 w-full">
          <header className="pb-6">
            <nav className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <menu className="min-w-0">
                <p className="text-xs text-(--muted) font-normal">
                  {capitalizeString(
                    activeReleaseNavigationFlow?.staticReleaseNavigation
                      ?.stepName,
                  ) || "Release setup"}
                </p>
                <ul className="flex items-center gap-2 mt-1">
                  <p className="text-[13px] text-(--muted)">
                    {isLoading ? (
                      <SkeletonLoader type="text" width="16rem" height="1rem" />
                    ) : (
                      release?.title ||
                      "Fill out each section to prepare this release."
                    )}
                  </p>{" "}
                  <span className="text-[13px] text-(--muted)">•</span>{" "}
                  {release?.catalogNumber && (
                    <p className="text-[13px] text-(--muted)">
                      {release?.catalogNumber}{" "}
                      <button
                        type="button"
                        className="ml-1 inline-grid size-6 cursor-pointer place-items-center rounded-(--radius-control) align-middle text-(--signal) hover:bg-(--surface)"
                        aria-label="Copy catalog number"
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(
                            release?.catalogNumber || "",
                          );
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                          toast.success("Catalog number copied");
                        }}
                      >
                        <Icon icon={copied ? LuCircleCheck : LuCopy} className="size-3.5" />
                      </button>
                    </p>
                  )}
                </ul>
              </menu>
            </nav>
          </header>

          {isLoading ? (
            <section className="min-h-[320px]">
              <FormSkeletonLoader />
            </section>
          ) : (
            <section className="w-full">{children}</section>
          )}
        </div>
      </section>
    </article>
  );
};

export default ReleaseNavigationPanel;
