import Button from "@/components/inputs/Button";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { useCreateReleaseNavigationFlow } from "@/hooks/releases/navigation.hooks";
import { useAppSelector } from "@/state/hooks";

const ReleaseWizardStores = ({
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  // STATE VARIABLES
  const { release } = useAppSelector((state) => state.release);

  // CREATE RELEASE NAVIGATION FLOW
  const { createReleaseNavigationFlow, isLoading } =
    useCreateReleaseNavigationFlow();

  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-900">Stores</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
        Your release will be delivered to all 150+ partner stores.
        Select-by-store targeting is coming soon.
      </p>
      <footer className="w-full flex items-center justify-between gap-3">
        <Button
          isLoading={isLoading}
          onClick={(event) => {
            event.preventDefault();
            if (previousStepName && release?.id) {
              createReleaseNavigationFlow({
                releaseId: release?.id,
                staticReleaseNavigationStepName: previousStepName,
              });
            }
          }}
        >
          Back
        </Button>
        <Button
          isLoading={isLoading}
          primary
          onClick={(event) => {
            event.preventDefault();
            if (nextStepName && release?.id) {
              createReleaseNavigationFlow({
                releaseId: release?.id,
                staticReleaseNavigationStepName: nextStepName,
              });
            }
          }}
        >
          Save and continue
        </Button>
      </footer>
    </section>
  );
};

export default ReleaseWizardStores;
