import Button from "@/components/inputs/Button";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/state/hooks";
import { useCreateReleaseNavigationFlow } from "@/hooks/releases/navigation.hooks";

const ReleaseWizardOverview = ({ nextStepName, previousStepName }: ReleaseWizardStepProps) => {

    // STATE
    const { release } = useAppSelector((state) => state.release);

    // NAVIGATION
    const navigate = useNavigate();

    // CREATE NAVIGATION FLOW
    const { createReleaseNavigationFlow } = useCreateReleaseNavigationFlow();

    return (
        <section className="flex flex-col gap-4 w-full">
            <h1>Release Wizard Overview</h1>
            <footer className="w-full flex items-center gap-3 justify-between">
                <Button onClick={(e) => {
                    e.preventDefault();
                    if (previousStepName) {
                        createReleaseNavigationFlow({ releaseId: release?.id, staticReleaseNavigationStepName: previousStepName });
                    } else {
                        navigate('/releases');
                    }
                }}>
                    Back
                </Button>
                <Button primary onClick={(e) => {
                    e.preventDefault();
                    if (nextStepName) {
                        createReleaseNavigationFlow({ releaseId: release?.id, staticReleaseNavigationStepName: nextStepName });
                    }
                }}>
                    Save and continue
                </Button>
            </footer>
        </section>
    );
};

export default ReleaseWizardOverview;
