import { LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';

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
      <aside className="flex items-center gap-3 rounded-(--radius-card) bg-(--success-soft) p-4">
        <LuCircleCheck className="text-(--success)" />
        <p className="text-[13px] font-normal text-(--success)">
          {successMessage || "Release validated successfully."}
        </p>
      </aside>
    );
  }

  return (
    <aside className="card-framed p-4">
      <header className="flex items-center gap-2">
        <LuTriangleAlert
         
          className="text-[13px] text-(--ink)" />
        <h3 className="text-[13px] text-(--ink)">
          Validation failed
          {validationResult?.errors?.length > 0
            ? ` (${validationResult.errors.length} issue${validationResult.errors.length !== 1 ? "s" : ""})`
            : ""}
        </h3>
      </header>
      <ul className="mt-2 flex flex-col gap-1 pl-5">
        {validationResult?.errors?.map((error) => (
          <li key={error} className="list-disc text-xs text-(--muted)">
            {error}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default PreviewValidationBanner;
