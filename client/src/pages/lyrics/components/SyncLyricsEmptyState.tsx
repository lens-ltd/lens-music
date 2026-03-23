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
    <section className="rounded-md border border-dashed border-[color:var(--lens-sand)]/70 bg-white p-8 text-center">
      <Heading className="!text-[color:var(--lens-ink)]">{title}</Heading>
      <p className="mt-3 text-[12px] text-[color:var(--lens-ink)]/55">
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
