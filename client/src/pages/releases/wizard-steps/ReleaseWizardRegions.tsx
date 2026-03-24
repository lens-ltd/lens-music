import { capitalizeString } from "@/utils/strings.helper";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";

const ReleaseWizardRegions = ({
  nextStepName,
  previousStepName,
}: ReleaseWizardStepProps) => {
  return (
    <section className="rounded-2xl border border-dashed border-primary/20 bg-gradient-to-br from-primary/[0.03] to-white p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.18em] text-primary/70">
        Coming Next
      </p>
      <h2 className="mt-3 text-xl font-semibold text-gray-900">{capitalizeString(nextStepName)}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
        {capitalizeString(previousStepName)}
      </p>
    </section>
  );
};

export default ReleaseWizardRegions;
