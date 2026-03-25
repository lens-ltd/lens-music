import Input from "@/components/inputs/Input";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { Track } from "@/types/models/track.types";
import { capitalizeString } from "@/utils/strings.helper";
import { toTitleCase } from "./trackForm.helpers";

interface TrackDetailsSummaryProps {
  track?: Track;
}

const TrackDetailsSummary = ({ track }: TrackDetailsSummaryProps) => {
  if (!track) return null;

  return (
    <DashboardSection title="Track Details" label="Metadata">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Title" value={track.title || "—"} readOnly />
        <Input label="Title Version" value={track.titleVersion || "—"} readOnly />
        <Input label="ISRC" value={track.isrc || "—"} readOnly />
        <Input label="ISWC" value={track.iswc || "—"} readOnly />
        <Input label="Disc Number" value={track.discNumber ?? "—"} readOnly />
        <Input label="Track Number" value={track.trackNumber ?? "—"} readOnly />
        <Input label="BPM" value={track.bpm || "—"} readOnly />
        <Input label="Musical Key" value={track.musicalKey || "—"} readOnly />
        <Input
          label="Parental Advisory"
          value={toTitleCase(track.parentalAdvisory || "—")}
          readOnly
        />
        <Input
          label="Primary Language"
          value={track.primaryLanguage?.toUpperCase() || "—"}
          readOnly
        />
        <Input
          label="Preview Start (ms)"
          value={track.previewStartMs ?? "—"}
          readOnly
        />
        <Input
          label="Preview Duration (ms)"
          value={track.previewDurationMs ?? "—"}
          readOnly
        />
        <Input
          label="Sound Recording Type"
          value={
            track.soundRecordingType
              ? toTitleCase(track.soundRecordingType.replace(/_/g, " ").toLowerCase())
              : "—"
          }
          readOnly
        />
        <Input
          label="Status"
          value={capitalizeString(track.status)}
          readOnly
        />
      </section>
    </DashboardSection>
  );
};

export default TrackDetailsSummary;
