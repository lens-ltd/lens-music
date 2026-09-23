import Button from "@/components/inputs/Button";
import { Heading } from "@/components/text/Headings";

type SyncLyricsEmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  actionRoute?: string;
};

const SyncLyricsEmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  actionRoute,
}: SyncLyricsEmptyStateProps) => {
  return (
    <section className="rounded-(--radius-card) bg-(--surface) p-8 text-center">
      <Heading className="!text-(--ink)">{title}</Heading>
      <p className="mt-3 text-[12px] text-(--muted)">
        {description}
      </p>
      <div className="mt-4 flex justify-center">
        <Button
          route={actionRoute}
          onClick={
            onAction
              ? (event) => {
                  event.preventDefault();
                  onAction();
                }
              : undefined
          }
        >
          {actionLabel}
        </Button>
      </div>
    </section>
  );
};

export default SyncLyricsEmptyState;
