import Input from "@/components/inputs/Input";
import DashboardSection from "@/pages/dashboard/components/DashboardSection";
import { Track } from "@/types/models/track.types";

interface TrackRightsSummaryProps {
  track?: Track;
}

const TrackRightsSummary = ({ track }: TrackRightsSummaryProps) => {
  if (!track) return null;

  return (
    <DashboardSection title="Rights Metadata" label="Rights">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="C-Line Year" value={track.cLineYear ?? "—"} readOnly />
        <Input label="C-Line Owner" value={track.cLineOwner || "—"} readOnly />
        <Input label="P-Line Year" value={track.pLineYear ?? "—"} readOnly />
        <Input label="P-Line Owner" value={track.pLineOwner || "—"} readOnly />
      </section>
      <ul className="mt-4 flex list-none flex-wrap gap-4 p-0">
        <li>
          <Input
            type="checkbox"
            label="Bonus track"
            checked={track.isBonusTrack}
            readOnly
          />
        </li>
        <li>
          <Input
            type="checkbox"
            label="Hidden track"
            checked={track.isHiddenTrack}
            readOnly
          />
        </li>
      </ul>
    </DashboardSection>
  );
};

export default TrackRightsSummary;
