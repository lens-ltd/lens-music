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
    <article className="w-full overflow-hidden rounded-xl border border-(--line) bg-white shadow-sm">
      <section
        className={`w-full ${
          hasStepSidebar
            ? "grid gap-0 lg:grid-cols-[300px_minmax(0,1fr)]"
            : "block"
        }`}
      >
        {hasStepSidebar && (
          <aside className="border-b border-(--line) bg-(--surface) lg:border-r lg:border-b-0">
            <header className="px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-(--lens-blue)/70">
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
                    className={`relative flex min-w-[190px] items-center gap-3 rounded-md border px-3 py-3 text-left transition-all duration-200 lg:min-w-0 ${
                      isActive
                        ? "border-[color:var(--lens-blue)]/30 bg-(--lens-blue)/8"
                        : "border-transparent bg-white hover:border-(--line) hover:bg-(--surface)"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-normal ${
                        isCompleted
                          ? "bg-(--lens-blue) text-white"
                          : isActive
                            ? "bg-(--lens-blue) text-white"
                            : isPast
                              ? "bg-(--lens-blue-soft) text-(--lens-blue)"
                              : "bg-(--surface) text-(--muted)"
                      }`}
                    >
                      {isCompleted ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-white text-[10px]"
                        />
                      ) : (
                        `${index + 1}`.padStart(2, "0")
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[12px] font-normal ${
                          isActive ? "text-(--lens-blue)" : "text-(--ink)/70"
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
          <header className="border-b border-(--line) bg-white px-5 py-5 sm:px-6">
            <nav className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <menu className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-(--lens-blue) font-normal">
                  {capitalizeString(
                    activeReleaseNavigationFlow?.staticReleaseNavigation
                      ?.stepName,
                  ) || "Release setup"}
                </p>
                <ul className="flex items-center gap-2 mt-1">
                  <p className="text-[12px] text-(--muted)">
                    {isLoading ? (
                      <SkeletonLoader type="text" width="16rem" height="1rem" />
                    ) : (
                      release?.title ||
                      "Fill out each section to prepare this release."
                    )}
                  </p>{" "}
                  <span className="text-[12px] text-(--muted)">•</span>{" "}
                  {release?.catalogNumber && (
                    <p className="text-[12px] text-(--muted)">
                      {release?.catalogNumber}{" "}
                      <FontAwesomeIcon
                        className="ml-0.5 cursor-pointer text-[11px] text-(--lens-blue)"
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
            </nav>
          </header>

          {isLoading ? (
            <section className="min-h-[320px] p-6">
              <FormSkeletonLoader />
            </section>
          ) : (
            <section className="p-5 sm:p-6 w-full">{children}</section>
          )}
        </div>
      </section>
    </article>
  );
};

export default ReleaseNavigationPanel;
