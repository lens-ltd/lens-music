import Input from "@/components/inputs/Input";
import { Control, Controller } from "react-hook-form";
import {
  FormField,
  FormValues,
  parentalAdvisoryOptions,
  toTitleCase,
} from "./trackForm.helpers";
import Combobox from "@/components/inputs/Combobox";
import { LANGUAGES_LIST } from "@/constants/languages.constants";
import { SoundRecordingType } from "@/types/models/track.types";

const soundRecordingTypeOptions = Object.values(SoundRecordingType).map(
  (v) => ({
    value: v,
    label: toTitleCase(v.replace(/_/g, " ").toLowerCase()),
  }),
);

type TrackDetailsFormProps = {
  control: Control<FormValues>;
  stateLabel: string | null;
  onPersistField: (field: FormField, value?: string | boolean) => Promise<void>;
};

const TrackDetailsForm = ({
  control,
  stateLabel,
  onPersistField,
}: TrackDetailsFormProps) => (
  <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
    <header className="flex items-center justify-between gap-3">
      <section>
        <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
          Track details
        </h2>
        <p className="text-[12px] text-[color:var(--lens-ink)]/55">
          Saved field by field when you leave an input.
        </p>
      </section>
      {stateLabel && (
        <p className="text-[11px] text-[color:var(--lens-blue)]">{stateLabel}</p>
      )}
    </header>

    <form className="mt-4 grid gap-4 sm:grid-cols-2">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Title"
            required
            placeholder="Track title"
            onBlur={() => void onPersistField("title")}
          />
        )}
      />
      <Controller
        name="titleVersion"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Title version"
            placeholder="Remix, live, acoustic"
            onBlur={() => void onPersistField("titleVersion")}
          />
        )}
      />
      <Controller
        name="isrc"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="ISRC"
            required
            placeholder="USRC17607839"
            onBlur={() => void onPersistField("isrc")}
          />
        )}
      />
      <Controller
        name="iswc"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="ISWC"
            placeholder="T-345246800-1"
            onBlur={() => void onPersistField("iswc")}
          />
        )}
      />
      <Controller
        name="discNumber"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Disc number"
            type="number"
            min={1}
            onBlur={() => void onPersistField("discNumber")}
          />
        )}
      />
      <Controller
        name="trackNumber"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Track number"
            type="number"
            min={1}
            onBlur={() => void onPersistField("trackNumber")}
          />
        )}
      />
      <Controller
        name="bpm"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="BPM"
            placeholder="120"
            onBlur={() => void onPersistField("bpm")}
          />
        )}
      />
      <Controller
        name="musicalKey"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Musical key"
            placeholder="C Major"
            onBlur={() => void onPersistField("musicalKey")}
          />
        )}
      />
      <Controller
        name="parentalAdvisory"
        control={control}
        render={({ field }) => (
          <label className="flex w-full flex-col gap-2">
            <span className="pl-0.5 text-[12px] leading-none text-[color:var(--lens-ink)]">
              Parental advisory
            </span>
            <Combobox
              options={parentalAdvisoryOptions.map((option) => ({
                label: toTitleCase(option),
                value: option,
              }))}
              value={String(field.value)}
              onChange={(value) => {
                field.onChange(value);
                void onPersistField("parentalAdvisory", value);
              }}
            />
          </label>
        )}
      />
      <Controller
        name="primaryLanguage"
        control={control}
        render={({ field }) => (
          <Combobox
            options={LANGUAGES_LIST.map((language) => ({
              label: language.name,
              value: language.code,
            }))}
            placeholder="Select the primary language"
            value={String(field.value)}
            label="Primary language"
            required
            onChange={(value) => {
              field.onChange(value);
              void onPersistField("primaryLanguage", value);
            }}
          />
        )}
      />
      <Controller
        name="previewStartMs"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Preview start (ms)"
            type="number"
            min={0}
            placeholder="Optional"
            onBlur={() => void onPersistField("previewStartMs")}
          />
        )}
      />
      <Controller
        name="previewDurationMs"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Preview duration (ms)"
            type="number"
            min={0}
            placeholder="Optional (default 30000 if start set)"
            onBlur={() => void onPersistField("previewDurationMs")}
          />
        )}
      />
      <Controller
        name="soundRecordingType"
        control={control}
        render={({ field }) => (
          <Combobox
            label="Sound recording type (DDEX)"
            options={soundRecordingTypeOptions}
            value={String(field.value)}
            onChange={(value) => {
              field.onChange(value);
              void onPersistField("soundRecordingType", value);
            }}
          />
        )}
      />
    </form>
  </section>
);

export default TrackDetailsForm;
