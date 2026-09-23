import Button from "@/components/inputs/Button";
import { BackButton } from "@/components/layout/PageFooter";

import { LuSave } from 'react-icons/lu';

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
      <BackButton
        onClick={(event) => {
          event.preventDefault();
          onBack();
        }}
      >
        Back
      </BackButton>
      <Button
        primary
        icon={LuSave}
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
