import {
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PreviewValidationBannerProps {
  validationResult: { valid: boolean; errors: string[] } | null;
  successMessage?: string;
}

const PreviewValidationBanner = ({
  validationResult,
  successMessage,
}: PreviewValidationBannerProps) => {
  if (!validationResult) return null;

  if (validationResult.valid) {
    return (
      <aside className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-700" />
        <p className="text-[12px] font-normal text-green-800">
          {successMessage || "Release validated successfully."}
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-md border border-[color:var(--lens-ink)]/20 bg-(--surface) p-4 shadow-xs">
      <header className="flex items-center gap-2">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-[12px] text-(--ink)"
        />
        <h3 className="text-[12px] font-medium text-(--ink)">
          Validation failed
          {validationResult?.errors?.length > 0
            ? ` (${validationResult.errors.length} issue${validationResult.errors.length !== 1 ? "s" : ""})`
            : ""}
        </h3>
      </header>
      <ul className="mt-2 flex flex-col gap-1 pl-5">
        {validationResult?.errors?.map((error) => (
          <li key={error} className="list-disc text-[11px] text-(--slate)">
            {error}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default PreviewValidationBanner;
