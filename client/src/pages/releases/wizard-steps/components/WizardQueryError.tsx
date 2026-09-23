import Button from "@/components/inputs/Button";
import { getApiErrorMessage } from "@/utils/errors.helper";
import { cn } from "@/lib/utils";
import { LuCircleAlert, LuRotateCw } from "react-icons/lu";

// Shown in place of a list whose request failed, so a failure never reads as
// "nothing here yet".
const WizardQueryError = ({
  title,
  error,
  onRetry,
  isRetrying = false,
  className,
}: {
  title: string;
  error?: unknown;
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-(--radius-control) border border-(--danger) p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <LuCircleAlert
          className="mt-0.5 size-4 shrink-0 text-(--danger)"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5">
          <p className="type-body-sm text-(--danger)">{title}</p>
          <p className="type-meta">
            {getApiErrorMessage(error, "Something went wrong. Please try again.")}
          </p>
        </div>
      </div>
      <Button
        size="sm"
        icon={LuRotateCw}
        isLoading={isRetrying}
        onClick={(event) => {
          event.preventDefault();
          onRetry();
        }}
      >
        Retry
      </Button>
    </div>
  );
};

export default WizardQueryError;
