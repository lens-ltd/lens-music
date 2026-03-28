import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import store from "store";
import Button from "@/components/inputs/Button";
import { useCompleteReleaseNavigationFlow, useCreateReleaseNavigationFlow } from "@/hooks/releases/navigation.hooks";
import { useValidateRelease } from "@/hooks/releases/release.hooks";
import { useFetchReleaseContributors } from "@/hooks/releases/release-contributor.hooks";
import { useFetchReleaseStores } from "@/hooks/releases/release-store.hooks";
import {
  setSelectedRelease,
  setSubmitReleaseModal,
} from "@/state/features/releaseSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { ReleaseStatus } from "@/types/models/release.types";
import { ReleaseStore } from "@/types/models/releaseStore.types";
import { API_URL } from "@/constants/environments.constants";
import { ReleaseWizardStepProps } from "../ReleaseWizardPage";
import SubmitRelease from "../SubmitRelease";
import PreviewValidationBanner from "./preview/PreviewValidationBanner";
import PreviewOverviewSection from "./preview/PreviewOverviewSection";
import PreviewContributorsSection from "./preview/PreviewContributorsSection";
import PreviewTracksSection from "./preview/PreviewTracksSection";
import PreviewTerritoriesSection from "./preview/PreviewTerritoriesSection";
import PreviewLabelsSection from "./preview/PreviewLabelsSection";
import PreviewRelatedReleasesSection from "./preview/PreviewRelatedReleasesSection";
import PreviewStoresSection from "./preview/PreviewStoresSection";
import PreviewTerritoryDetailsSection from "./preview/PreviewTerritoryDetailsSection";

type ValidationResult = { valid: boolean; errors: string[] };

const ReleaseWizardPreview = ({
  previousStepName,
  releaseIsFetching,
  currentStepName,
}: ReleaseWizardStepProps) => {
  const dispatch = useAppDispatch();
  const { release } = useAppSelector((state) => state.release);
  const { createReleaseNavigationFlow, isLoading: isNavigating } =
    useCreateReleaseNavigationFlow();
  const { validateRelease, isLoading: isValidating } = useValidateRelease();
  const { fetchReleaseContributors, data: releaseContributorsData, isFetching: areContributorsFetching } =
    useFetchReleaseContributors();
  const { fetchReleaseStores, data: releaseStoresData } =
    useFetchReleaseStores();
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [validationSuccessMessage, setValidationSuccessMessage] =
    useState<string | undefined>(undefined);
  const [isDdexLoading, setIsDdexLoading] = useState(false);

    // COMPLETE NAVIGATION FLOW
    const { completeReleaseNavigationFlow, isLoading: completeNavigationFlowIsLoading } = useCompleteReleaseNavigationFlow();

  const handleValidateRelease = useCallback(async () => {
    if (!release?.id) return;
    setValidationResult(null);
    setValidationSuccessMessage(undefined);
    try {
      const response = await validateRelease({ id: release.id }).unwrap();
      setValidationResult(response.data);
      if (response.data?.valid) {
        toast.success("Release validated successfully.");
        setValidationSuccessMessage(
          "Release validated successfully. It is now ready to submit for review.",
        );
        dispatch(setSelectedRelease(response.data.release));
        dispatch(setSubmitReleaseModal(true));
        if (currentStepName) {
          await completeReleaseNavigationFlow({
            staticReleaseNavigationStepName: currentStepName,
            isCompleted: true,
          });
        }
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Release validation failed.";
      toast.error(errorMessage);
    }
  }, [release?.id, validateRelease, dispatch, currentStepName, completeReleaseNavigationFlow]);

  const handleOpenSubmitRelease = useCallback(() => {
    if (!release) return;
    setValidationResult(null);
    setValidationSuccessMessage(undefined);
    dispatch(setSelectedRelease(release));
    dispatch(setSubmitReleaseModal(true));
  }, [dispatch, release]);

  useEffect(() => {
    if (release?.id) {
      fetchReleaseContributors({ releaseId: release.id });
      fetchReleaseStores({ releaseId: release.id });
    }
  }, [fetchReleaseContributors, fetchReleaseStores, release?.id]);

  const handleDownloadDdex = useCallback(async () => {
    if (!release?.id) return;
    const releaseStores: ReleaseStore[] = releaseStoresData?.data ?? [];
    const firstStore = releaseStores.find(
      (rs) => rs.store?.ddexPartyId?.trim()
    );
    if (!firstStore) {
      toast.error("No DDEX-ready store found for this release.");
      return;
    }
    setIsDdexLoading(true);
    try {
      const token = store.get("token");
      const res = await fetch(
        `${API_URL}/releases/${release.id}/ddex/ern?storeId=${firstStore.storeId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Request failed (${res.status})`);
      }
      const json = await res.json();
      const xml: string = json.data?.xml ?? "";
      const blob = new Blob([xml], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ddex-ern-${release.title.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("DDEX ERN payload downloaded.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate DDEX payload.";
      toast.error(message);
    } finally {
      setIsDdexLoading(false);
    }
  }, [release?.id, release?.title, releaseStoresData]);

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
        <PreviewLabelsSection releaseId={release.id} />
        <PreviewRelatedReleasesSection releaseId={release.id} />
        <PreviewTerritoryDetailsSection releaseId={release.id} />
        <PreviewStoresSection releaseId={release.id} />
      </section>
      <PreviewValidationBanner
        validationResult={validationResult}
        successMessage={validationSuccessMessage}
      />


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
        <div className="flex items-center gap-2">
          {release.status === ReleaseStatus.VALIDATED && (
            <Button
              submit
              isLoading={isDdexLoading}
              onClick={handleDownloadDdex}
            >
              Download DDEX
            </Button>
          )}
          <Button
            primary
            submit
            isLoading={isValidating || completeNavigationFlowIsLoading}
            onClick={
              release.status === ReleaseStatus.VALIDATED
                ? handleOpenSubmitRelease
                : handleValidateRelease
            }
          >
            {release.status === ReleaseStatus.VALIDATED
              ? "Submit for Review"
              : "Validate Release"}
          </Button>
        </div>
      </footer>
      <SubmitRelease />
    </section>
  );
};

export default ReleaseWizardPreview;
