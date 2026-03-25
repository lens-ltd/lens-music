import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import { getProductionYearOptions } from "@/utils/releases.helper";
import { Control, Controller } from "react-hook-form";
import { FormField, FormValues } from "./trackForm.helpers";

type TrackCopyrightLinesFormProps = {
  control: Control<FormValues>;
  stateLabel: string | null;
  onPersistField: (field: FormField, value?: string | boolean) => Promise<void>;
};

const yearOptions = getProductionYearOptions().map((year) => ({
  value: String(year.value),
  label: year.label,
}));

/**
 * C-line / P-line and track flags. (Named for copyright lines — not DDEX TrackRightsController.)
 */
const TrackCopyrightLinesForm = ({
  control,
  stateLabel,
  onPersistField,
}: TrackCopyrightLinesFormProps) => (
  <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
    <header className="flex items-center justify-between gap-3">
      <section>
        <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
          Copyright lines and flags
        </h2>
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          C-line and P-line are required before validation. Use “Rights controllers”
          below for DDEX making-available rights.
        </p>
      </section>
      {stateLabel && (
        <p className="text-[11px] text-[color:var(--lens-blue)]">{stateLabel}</p>
      )}
    </header>

    <form className="mt-4 grid gap-4 sm:grid-cols-2">
      <Controller
        name="cLineYear"
        control={control}
        render={({ field }) => (
          <Combobox
            label="C-line year"
            placeholder="Select year"
            options={yearOptions}
            value={String(field.value || "")}
            onChange={(value) => {
              field.onChange(value);
              void onPersistField("cLineYear", value);
            }}
          />
        )}
      />
      <Controller
        name="cLineOwner"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="C-line owner"
            placeholder="Copyright owner"
            onBlur={() => void onPersistField("cLineOwner")}
          />
        )}
      />
      <Controller
        name="pLineYear"
        control={control}
        render={({ field }) => (
          <Combobox
            label="P-line year"
            placeholder="Select year"
            options={yearOptions}
            value={String(field.value || "")}
            onChange={(value) => {
              field.onChange(value);
              void onPersistField("pLineYear", value);
            }}
          />
        )}
      />
      <Controller
        name="pLineOwner"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="P-line owner"
            placeholder="Sound recording owner"
            onBlur={() => void onPersistField("pLineOwner")}
          />
        )}
      />
    </form>

    <fieldset className="mt-4 border-0 p-0">
      <legend className="text-[12px] text-[color:var(--lens-ink)]/70">
        Flags
      </legend>
      <ul className="mt-2 flex list-none flex-wrap gap-4 p-0">
        <li>
          <Controller
            name="isBonusTrack"
            control={control}
            render={({ field }) => (
              <label className="inline-flex items-center gap-2 text-[12px]">
                <input
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    field.onChange(checked);
                    void onPersistField("isBonusTrack", checked);
                  }}
                  className="h-4 w-4 cursor-pointer accent-[color:var(--lens-blue)]"
                />
                Bonus track
              </label>
            )}
          />
        </li>
        <li>
          <Controller
            name="isHiddenTrack"
            control={control}
            render={({ field }) => (
              <label className="inline-flex items-center gap-2 text-[12px]">
                <input
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    field.onChange(checked);
                    void onPersistField("isHiddenTrack", checked);
                  }}
                  className="h-4 w-4 cursor-pointer accent-[color:var(--lens-blue)]"
                />
                Hidden track
              </label>
            )}
          />
        </li>
      </ul>
    </fieldset>
  </section>
);

export default TrackCopyrightLinesForm;
