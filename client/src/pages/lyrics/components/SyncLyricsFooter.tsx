import Button from "@/components/inputs/Button";
import { faSave } from "@fortawesome/free-solid-svg-icons";

type SyncLyricsFooterProps = {
  isBusy: boolean;
  onBack: () => void;
  onSave: () => void;
};

const SyncLyricsFooter = ({
  isBusy,
  onBack,
  onSave,
}: SyncLyricsFooterProps) => {
  return (
    <footer className="flex w-full items-center justify-between gap-3">
      <Button
        onClick={(event) => {
          event.preventDefault();
          onBack();
        }}
      >
        Back
      </Button>
      <Button
        primary
        icon={faSave}
        onClick={(event) => {
          event.preventDefault();
          onSave();
        }}
        isLoading={isBusy}
      >
        Save sync
      </Button>
    </footer>
  );
};

export default SyncLyricsFooter;
