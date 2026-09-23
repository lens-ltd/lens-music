import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { UUID } from "@/types/common.types";
import { getApiErrorMessage } from "@/utils/errors.helper";
import {
  useCompleteReleaseNavigationFlow,
  useCreateReleaseNavigationFlow,
} from "./navigation.hooks";

// A step's save returns `false` to stop navigation without a toast, for
// example when it has already shown an inline error.
export type WizardStepSave = () => Promise<boolean | void>;

// WIZARD STEP NAVIGATION
// Every wizard move goes through here, so it is awaited, reports failures,
// and can't run twice at once.
export const useWizardStepNavigation = ({
  currentStepName,
  nextStepName,
  previousStepName,
}: {
  currentStepName?: string;
  nextStepName?: string;
  previousStepName?: string;
} = {}) => {
  const { id: releaseId } = useParams<{ id: UUID }>();
  const { createReleaseNavigationFlow } = useCreateReleaseNavigationFlow();
  const { completeReleaseNavigationFlow } = useCompleteReleaseNavigationFlow();

  const [isNavigating, setIsNavigating] = useState(false);
  const inFlight = useRef(false);

  const run = useCallback(
    async (task: () => Promise<boolean>, fallbackMessage: string) => {
      if (inFlight.current) return false;
      inFlight.current = true;
      setIsNavigating(true);
      try {
        return await task();
      } catch (error) {
        toast.error(getApiErrorMessage(error, fallbackMessage));
        return false;
      } finally {
        inFlight.current = false;
        setIsNavigating(false);
      }
    },
    [],
  );

  const goTo = useCallback(
    (stepName: string) =>
      run(async () => {
        await createReleaseNavigationFlow({
          releaseId,
          staticReleaseNavigationStepName: stepName,
        });
        return true;
      }, "We couldn't open that step. Please try again."),
    [run, createReleaseNavigationFlow, releaseId],
  );

  const goBack = useCallback(
    () => (previousStepName ? goTo(previousStepName) : Promise.resolve(false)),
    [goTo, previousStepName],
  );

  const goNext = useCallback(
    (save?: WizardStepSave) =>
      run(async () => {
        if (save && (await save()) === false) return false;
        if (currentStepName) {
          await completeReleaseNavigationFlow({
            isCompleted: true,
            staticReleaseNavigationStepName: currentStepName,
          });
        }
        if (nextStepName) {
          await createReleaseNavigationFlow({
            releaseId,
            staticReleaseNavigationStepName: nextStepName,
          });
        }
        return true;
      }, "We couldn't save this step. Please try again."),
    [
      run,
      currentStepName,
      nextStepName,
      releaseId,
      completeReleaseNavigationFlow,
      createReleaseNavigationFlow,
    ],
  );

  return { goTo, goBack, goNext, isNavigating };
};
