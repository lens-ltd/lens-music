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
      <legend className="pl-0.5 text-[12px] leading-none text-[color:var(--lens-ink)]">
        Roles
      </legend>
      <div className="mt-2 grid max-h-52 grid-cols-1 gap-2 overflow-y-auto rounded-md border border-[color:var(--lens-sand)] p-2 sm:grid-cols-2">
        {roles.map((role) => {
          const isUnavailable = unavailable.has(role);
          const isSelected = selected.has(role);

          return (
            <label
              key={role}
              className={`flex items-center gap-2 rounded-sm border px-3 py-2 text-[11px] transition-colors ${
                isUnavailable
                  ? "cursor-not-allowed border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/25 text-[color:var(--lens-ink)]/40"
                  : isSelected
                    ? "cursor-pointer border-[color:var(--lens-blue)] bg-[color:var(--lens-blue)]/10 text-[color:var(--lens-blue)]"
                    : "cursor-pointer border-transparent text-[color:var(--lens-ink)]/70 hover:border-[color:var(--lens-sand)]"
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
                <span className="text-[9px] uppercase tracking-[0.08em]">
                  Added
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] text-[color:var(--lens-ink)]/50">
        {value.length
          ? `${value.length} role${value.length === 1 ? "" : "s"} selected`
          : "Select at least one role"}
      </p>
    </fieldset>
  );
};

export default ContributorRoleMultiSelect;
