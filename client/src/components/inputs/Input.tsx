import {
  ChangeEvent,
  forwardRef,
  MouseEventHandler,
  ReactNode,
  useId,
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import DatePicker from "./DatePicker";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputErrorMessage } from "../feedbacks/ErrorLabels";
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
} from "react-hook-form";

interface InputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange?: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
  defaultValue?: string | number | Date;
  submit?: boolean;
  type?: string;
  value?: string | number | Date | boolean;
  suffixIcon?: IconProp;
  prefixIcon?: IconProp;
  suffixIconHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
  name?: string;
  suffixIconPrimary?: boolean;
  prefixIconHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
  prefixIconPrimary?: boolean;
  prefixText?: string | ReactNode;
  defaultChecked?: boolean | undefined;
  accept?: string;
  min?: string | number;
  readOnly?: boolean;
  multiple?: boolean;
  labelClassName?: string;
  range?: boolean;
  fromDate?: Date;
  toDate?: Date;
  /** For `type="checkbox"`, Radix `indeterminate` = partial selection. */
  checked?: CheckedState;
  selectionType?: "date" | "month" | "year" | "recurringDate";
  onBlur?: ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  errorMessage?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<FieldValues>>
    | undefined;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      placeholder,
      className,
      required = false,
      value = "",
      onChange,
      defaultValue,
      suffixIcon,
      suffixIconHandler,
      suffixIconPrimary = false,
      prefixIcon,
      prefixIconHandler,
      prefixText,
      defaultChecked,
      name,
      accept = "application/pdf",
      min,
      readOnly = false,
      labelClassName = "",
      multiple = false,
      fromDate,
      toDate,
      checked,
      selectionType,
      onBlur,
      onKeyPress,
      errorMessage,
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = name || generatedId;
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const normalizedDefaultValue =
      defaultValue instanceof Date ? defaultValue.toISOString() : defaultValue;
    const normalizedValue = value instanceof Date ? value.toISOString() : value;
    const describedBy = errorMessage ? `${inputId}-error` : undefined;

    const labelNode = label ? (
      <span className="field-label">
        {label}{" "}
        {required && (
          <span className="field-required" aria-hidden="true">
            *
          </span>
        )}
      </span>
    ) : null;

    const errorNode = errorMessage ? (
      <InputErrorMessage
        id={describedBy}
        message={errorMessage}
        className="mt-0.5"
      />
    ) : null;

    if (type === "checkbox") {
      return (
        <div className={cn("field-stack", labelClassName)}>
          <label className="inline-flex w-fit items-center gap-2 type-body-sm">
            <Checkbox
              className="border-(--line) cursor-pointer"
              onCheckedChange={
                onChange as unknown as
                  | ((checked: CheckedState) => void)
                  | undefined
              }
              name={name}
              checked={checked}
              defaultChecked={defaultChecked}
              aria-required={required || undefined}
              aria-invalid={errorMessage ? true : undefined}
            />
            {label && <span className="type-body-sm">{label}</span>}
          </label>
          {errorNode}
        </div>
      );
    }

    if (type === "radio") {
      return (
        <div className={cn("field-stack", labelClassName)}>
          <label className="inline-flex items-center gap-2 type-body-sm">
            <input
              id={inputId}
              type="radio"
              name={name}
              value={value as string | number | readonly string[] | undefined}
              defaultChecked={defaultChecked}
              checked={checked as boolean}
              onChange={onChange}
              required={required}
              aria-invalid={errorMessage ? true : undefined}
              className={cn(
                "h-4 w-4 cursor-pointer accent-(--lens-blue) border-(--line)",
                className,
              )}
            />
            {label && <span className="type-body-sm">{label}</span>}
          </label>
          {errorNode}
        </div>
      );
    }

    if (type === "file") {
      return (
        <div className={cn("w-fit", labelClassName)}>
          {label && <p className="mb-1.5">{labelNode}</p>}
          <button
            type="button"
            onClick={() => hiddenFileInput.current?.click()}
            className={cn(
              "inline-flex h-(--control-sm) cursor-pointer items-center justify-center rounded-(--radius-control) border border-(--ink) bg-(--paper) px-3.5 type-label text-(--ink) hover:bg-(--surface)",
              className,
            )}
          >
            Choose file{multiple ? "s" : ""}
          </button>
          <input
            ref={hiddenFileInput}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={onChange}
            className="hidden"
            name={name}
            required={required}
          />
          {errorMessage && (
            <InputErrorMessage message={errorMessage} className="mt-1.5" />
          )}
        </div>
      );
    }

    if (type === "date") {
      return (
        <label className={cn("field-stack", labelClassName)}>
          {labelNode}
          <DatePicker
            placeholder={placeholder}
            fromDate={fromDate}
            toDate={toDate}
            selectionType={selectionType}
            onChange={
              onChange as
                | ((e: Date | ChangeEvent<HTMLInputElement>) => void)
                | undefined
            }
            value={(value || defaultValue) as Date | undefined}
          />
          {errorNode}
        </label>
      );
    }

    const sharedInputProps = {
      id: inputId,
      defaultValue: normalizedDefaultValue as
        | string
        | number
        | readonly string[]
        | undefined,
      min,
      value: normalizedValue as string | number | readonly string[] | undefined,
      type: type || "text",
      readOnly,
      name,
      ref,
      onChange,
      onBlur,
      onKeyPress,
      placeholder: readOnly ? "" : placeholder,
      required,
      "aria-invalid": errorMessage ? true : undefined,
      "aria-describedby": describedBy,
    };

    const prefixPaddingClasses = cn(
      prefixIcon && "pl-10",
      prefixText && "pl-14",
    );

    const textInputPlain = (
      <ShadcnInput
        {...sharedInputProps}
        className={cn(prefixPaddingClasses, className)}
      />
    );

    const textInputWithSuffix = (
      <div
        className={cn(
          "flex w-full overflow-hidden rounded-(--radius-control) border border-(--line) bg-(--paper) transition-[border-color,box-shadow] duration-200 focus-within:border-(--lens-blue) focus-within:shadow-[0_0_0_3px_var(--lens-blue-soft)]",
          readOnly && "border-(--line) bg-(--surface)",
          errorMessage &&
            "border-(--danger) focus-within:border-(--danger) focus-within:shadow-[0_0_0_3px_var(--danger-line)]",
        )}
      >
        <input
          {...sharedInputProps}
          className={cn(
            "h-(--control-sm) min-h-(--control-sm) min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-0 type-body-sm text-(--ink) shadow-none outline-none placeholder:text-(--muted) focus-visible:ring-0 focus-visible:shadow-none",
            readOnly && "cursor-default text-(--muted)",
            prefixPaddingClasses,
            className,
          )}
        />
        <button
          type="button"
          onClick={suffixIconHandler}
          className={cn(
            "flex shrink-0 items-center justify-center self-stretch border-l px-3 type-body-sm",
            suffixIconPrimary
              ? "border-l-(--lens-blue) bg-(--lens-blue) text-(--lens-blue-ink)"
              : "border-l-(--line) bg-(--paper) text-(--ink)",
          )}
          aria-label={`${label || "Input"} action`}
        >
          <FontAwesomeIcon className="text-[12px] cursor-pointer" icon={suffixIcon || faSearch} />
        </button>
      </div>
    );

    const textInput = suffixIcon ? textInputWithSuffix : textInputPlain;

    return (
      <label className={cn("field-stack", labelClassName)}>
        {labelNode}
        <div className="relative w-full">
          {(prefixIcon || prefixText) && (
            <button
              type="button"
              onClick={prefixIconHandler}
              className={cn(
                "absolute inset-y-0 left-0 flex items-center px-3 text-(--muted)",
                !prefixIconHandler && "pointer-events-none",
              )}
              aria-label={
                typeof prefixText === "string"
                  ? prefixText
                  : label || "Prefix action"
              }
            >
              {prefixIcon && <FontAwesomeIcon className="text-[12px]" icon={prefixIcon} />}
              {prefixText && (
                <span className="type-body-sm">{prefixText}</span>
              )}
            </button>
          )}

          {textInput}
        </div>
        {errorNode}
      </label>
    );
  },
);

Input.displayName = "Input";

export default Input;
