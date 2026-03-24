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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCopy } from "@fortawesome/free-regular-svg-icons";
import { toast } from "sonner";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
    <article className="overflow-hidden rounded-md bg-white shadow-sm w-full">
      <section
        className={`w-full ${
          hasStepSidebar
            ? "grid gap-0 lg:grid-cols-[300px_minmax(0,1fr)]"
            : "block"
        }`}
      >
        {hasStepSidebar && (
          <aside className="bg-gray-50/80 lg:border-r">
            <header className="px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary/70">
                Current Section
              </p>
              <h2 className="mt-2 text-sm font-normal text-gray-900">
                {capitalizeString(
                  activeReleaseNavigationFlow?.staticReleaseNavigation?.tabName,
                )}
              </h2>
            </header>
            <nav
              className="flex flex-col gap-2 p-3"
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
                    className={`relative flex items-center gap-3 rounded-md border px-3 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? "border-primary/25 bg-primary/8 shadow-[0_6px_14px_-12px_rgba(0,90,150,0.35)]"
                        : "border-transparent bg-white hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-normal ${
                        isCompleted
                          ? "bg-primary text-white"
                          : isActive
                            ? "bg-primary text-white"
                            : isPast
                              ? "bg-primary/10 text-primary"
                              : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isCompleted ? <FontAwesomeIcon icon={faCheck} className="text-white text-[10px]" /> : `${index + 1}`.padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[12px] font-normal ${
                          isActive ? "text-primary" : "text-gray-700"
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

        <main className="min-w-0 w-full">
          <header className="border-b border-gray-200/70 bg-white px-5 py-5 sm:px-6">
            <nav className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <menu className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-normal">
                  {capitalizeString(
                    activeReleaseNavigationFlow?.staticReleaseNavigation
                      ?.stepName,
                  ) || "Release setup"}
                </p>
                <ul className="flex items-center gap-2 mt-1">
                  <p className="text-[12px] text-gray-500">
                    {isLoading ? (
                      <SkeletonLoader type="text" width="16rem" height="1rem" />
                    ) : (
                      release?.title ||
                      "Fill out each section to prepare this release."
                    )}
                  </p>{" "}
                  <span className="text-[12px] text-gray-500">•</span>{" "}
                  {release?.catalogNumber && (
                    <p className="text-[12px] text-gray-500">
                      {release?.catalogNumber}{" "}
                      <FontAwesomeIcon
                        className="text-gray-500 text-[11px] ml-0.5 cursor-pointer"
                        icon={copied ? faCircleCheck : faCopy}
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(
                            release?.catalogNumber || "",
                          );
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                          toast.success("Copied to clipboard");
                        }}
                      />
                    </p>
                  )}
                </ul>
              </menu>
              {activeReleaseNavigationFlow && !isLoading && (
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-normal ${
                    activeReleaseNavigationFlow?.completed
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {activeReleaseNavigationFlow.completed
                    ? "Completed"
                    : "In progress"}
                </span>
              )}
            </nav>
          </header>

          {isLoading ? (
            <section className="min-h-[320px] p-6">
              <FormSkeletonLoader />
            </section>
          ) : (
            <section className="p-5 sm:p-6 w-full">{children}</section>
          )}
        </main>
      </section>
    </article>
  );
};

export default ReleaseNavigationPanel;
