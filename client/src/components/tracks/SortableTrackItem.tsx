import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Track } from "@/types/models/track.types";
import ReleaseTrackCard from "./ReleaseTrackCard";

export interface SortableTrackItemProps {
  track: Track;
  isLoading?: boolean;
  disabled?: boolean;
  canDelete?: boolean;
  onManage?: () => void;
  onDelete?: () => void;
}

const SortableTrackItem = ({
  track,
  isLoading,
  disabled,
  canDelete,
  onManage,
  onDelete,
}: SortableTrackItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-stretch gap-2"
    >
      <button
        type="button"
        aria-label="Drag to reorder track"
        className={`flex shrink-0 items-center rounded-md px-1.5 text-[color:var(--lens-ink)]/40 transition-colors hover:text-[color:var(--lens-ink)]/70 ${
          disabled ? "cursor-not-allowed opacity-40" : "cursor-grab touch-none"
        }`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <FontAwesomeIcon icon={faGripVertical} className="text-[13px]" />
      </button>
      <div className="min-w-0 flex-1">
        <ReleaseTrackCard
          isLoading={isLoading}
          track={track}
          onManage={onManage}
          canDelete={canDelete}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default SortableTrackItem;
