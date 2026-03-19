import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useParams } from "react-router-dom";

const ReleaseWizardPage = () => {

    // NAVIGATION
    const { id } = useParams();

    return (
        <UserLayout>
            <main className="w-full flex flex-col gap-4">
                <nav className="w-full flex items-center gap-3 justify-between">
                    <Heading type="h3">{`${id} Release Wizard`}</Heading>
                </nav>
            </main>
        </UserLayout>
    );
};

export default ReleaseWizardPage;
