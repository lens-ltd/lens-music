import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/inputs/Button";
import { useCreateReleaseNavigationFlow } from "@/hooks/releases/navigation.hooks";
import { useValidateRelease } from "@/hooks/releases/release.hooks";
import { useFetchReleaseContributors } from "@/hooks/releases/release-contributor.hooks";
import { useAppSelector } from "@/state/hooks";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import PreviewValidationBanner from "./preview/PreviewValidationBanner";
import PreviewOverviewSection from "./preview/PreviewOverviewSection";
import PreviewContributorsSection from "./preview/PreviewContributorsSection";
import PreviewTracksSection from "./preview/PreviewTracksSection";
import PreviewTerritoriesSection from "./preview/PreviewTerritoriesSection";

type ValidationResult = { valid: boolean; errors: string[] };

const ReleaseWizardPreview = ({
  previousStepName,
  releaseIsFetching,
}: ReleaseWizardStepProps) => {
  const navigate = useNavigate();
  const { release } = useAppSelector((state) => state.release);
  const { createReleaseNavigationFlow, isLoading: isNavigating } =
    useCreateReleaseNavigationFlow();
  const { validateRelease, isLoading: isValidating } = useValidateRelease();
  const { fetchReleaseContributors, data: releaseContributorsData, isFetching: areContributorsFetching } =
    useFetchReleaseContributors();
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const handleValidateRelease = useCallback(async () => {
    if (!release?.id) return;
    setValidationResult(null);
    try {
      const response = await validateRelease({ id: release.id }).unwrap();
      setValidationResult(response.data);
      if (response.data?.valid) {
        toast.success("Release validated successfully.");
        navigate("/releases");
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Release validation failed.";
      toast.error(errorMessage);
    }
  }, [release?.id, validateRelease, navigate]);

  useEffect(() => {
    if (release?.id) {
      fetchReleaseContributors({ releaseId: release.id });
    }
  }, [fetchReleaseContributors, release?.id]);

  if (!release) {
    return (
      <section className="flex items-center justify-center p-8">
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          Loading release data...
        </p>
      </section>
    );
  }

  const releaseContributors = releaseContributorsData?.data ?? [];

  return (
    <section className="flex w-full flex-col gap-5">
      <header>
        <h2
          className="text-[18px] leading-tight text-[color:var(--lens-ink)]"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
        >
          Review &amp; Submit
        </h2>
        <p className="mt-1 text-[12px] font-normal text-[color:var(--lens-ink)]/50">
          Review all release information before submitting for distribution.
        </p>
      </header>

      <PreviewValidationBanner validationResult={validationResult} />

      <section className="flex flex-col gap-4">
        <PreviewOverviewSection release={release} contributors={releaseContributors} />
        <PreviewContributorsSection
          releaseId={release.id}
          contributors={releaseContributors}
          isLoading={areContributorsFetching}
        />
        <PreviewTracksSection
          tracks={release.tracks ?? []}
          releaseId={release.id}
          isLoading={releaseIsFetching ?? false}
        />
        <PreviewTerritoriesSection territories={release.territories ?? []} />
      </section>

      <footer className="flex w-full items-center justify-between gap-3">
        <Button
          isLoading={isNavigating}
          onClick={(event) => {
            event.preventDefault();
            if (previousStepName && release.id) {
              createReleaseNavigationFlow({
                releaseId: release.id,
                staticReleaseNavigationStepName: previousStepName,
              });
            }
          }}
        >
          Back
        </Button>
        <Button
          primary
          submit
          isLoading={isValidating}
          onClick={handleValidateRelease}
        >
          Validate &amp; Submit
        </Button>
      </footer>
    </section>
  );
};

export default ReleaseWizardPreview;
