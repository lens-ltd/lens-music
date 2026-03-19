import Button from "@/components/inputs/Button";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { useCreateReleaseNavigationFlow } from "@/hooks/releases/navigation.hooks";
import { useAppSelector } from "@/state/hooks";

const ReleaseWizardUploadTracks = ({ nextStepName, previousStepName }: ReleaseWizardStepProps) => {

    // STATE
    const { release } = useAppSelector((state) => state.release);

    // CREATE NAVIGATION FLOW
    const { createReleaseNavigationFlow } = useCreateReleaseNavigationFlow();

    return (
        <section className="flex flex-col gap-4 w-full">
            <h1>Release Wizard Upload Tracks</h1>
            <footer className="w-full flex items-center gap-3 justify-between">
                <Button route="/releases" onClick={(e) => {
                    e.preventDefault();
                    previousStepName && release?.id && createReleaseNavigationFlow({ releaseId: release?.id, staticReleaseNavigationStepName: previousStepName });
                }}>
                    Back
                </Button>
                <Button primary onClick={(e) => {
                    e.preventDefault();
                    nextStepName && release?.id && createReleaseNavigationFlow({ releaseId: release?.id, staticReleaseNavigationStepName: nextStepName });
                }}>
                    Save and continue
                </Button>
            </footer>
        </section>
    );
};

export default ReleaseWizardUploadTracks;
