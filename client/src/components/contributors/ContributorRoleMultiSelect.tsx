import { ContributorRole } from "@/types/models/releaseContributor.types";
import { capitalizeString } from "@/utils/strings.helper";

type ContributorRoleMultiSelectProps = {
  value: ContributorRole[];
  unavailableRoles?: ContributorRole[];
  onChange: (roles: ContributorRole[]) => void;
  disabled?: boolean;
};

const roles = Object.values(ContributorRole);

const ContributorRoleMultiSelect = ({
  value,
  unavailableRoles = [],
  onChange,
  disabled = false,
}: ContributorRoleMultiSelectProps) => {
  const selected = new Set(value);
  const unavailable = new Set(unavailableRoles);

  const toggleRole = (role: ContributorRole) => {
    if (disabled || unavailable.has(role)) return;
    onChange(
      selected.has(role)
        ? value.filter((selectedRole) => selectedRole !== role)
        : [...value, role],
    );
  };

  return (
    <fieldset className="min-w-0" disabled={disabled}>
      <legend className="field-label">
        Roles
      </legend>
      <div className="mt-1.5 grid max-h-52 grid-cols-1 gap-2 overflow-y-auto rounded-(--radius-control) border border-(--line) p-2 sm:grid-cols-2">
        {roles.map((role) => {
          const isUnavailable = unavailable.has(role);
          const isSelected = selected.has(role);

          return (
            <label
              key={role}
              className={`flex items-center gap-2 rounded-(--radius-control) border px-3 py-2 type-body-sm transition-colors ${
                isUnavailable
                  ? "cursor-not-allowed border-(--line) bg-(--surface) text-(--muted)"
                  : isSelected
                    ? "cursor-pointer border-[color:var(--lens-blue)] bg-(--lens-blue-soft) text-(--lens-blue)"
                    : "cursor-pointer border-transparent text-(--ink)/70 hover:border-(--line)"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={disabled || isUnavailable}
                onChange={() => toggleRole(role)}
                className="accent-[color:var(--lens-blue)]"
              />
              <span className="min-w-0 flex-1">
                {capitalizeString(role)}
              </span>
              {isUnavailable ? (
                <span className="type-meta">
                  Added
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] text-(--muted)">
        {value.length
          ? `${value.length} role${value.length === 1 ? "" : "s"} selected`
          : "Select at least one role"}
      </p>
    </fieldset>
  );
};

export default ContributorRoleMultiSelect;
