import {
  ChangeEvent,
  forwardRef,
  MouseEventHandler,
  ReactNode,
  useId,
  useRef,
} from "react";
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

import { LuSearch, LuUpload } from 'react-icons/lu';
import { buttonVariants } from '@/components/ui/button';
import type { IconType } from 'react-icons';
import { Icon } from '@/components/ui/icon';

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
  suffixIcon?: IconType;
  prefixIcon?: IconType;
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
              className="cursor-pointer"
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
                "h-4 w-4 cursor-pointer accent-(--signal) border-(--line)",
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
            className={cn(buttonVariants({ variant: "secondary" }), className)}
          >
            <LuUpload />
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
        className="field-chrome flex items-stretch overflow-hidden px-0"
        aria-invalid={errorMessage ? true : undefined}
        data-disabled={readOnly || undefined}
      >
        <input
          {...sharedInputProps}
          className={cn(
            "h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-0 text-sm text-(--ink) shadow-none outline-none placeholder:text-(--placeholder)",
            readOnly && "cursor-not-allowed text-(--muted)",
            prefixPaddingClasses,
            className,
          )}
        />
        <button
          type="button"
          onClick={suffixIconHandler}
          className={cn(
            "flex shrink-0 items-center justify-center px-3 transition-colors",
            suffixIconPrimary
              ? "bg-(--signal) text-white hover:bg-(--signal-hover)"
              : "text-(--muted) hover:text-(--ink)",
          )}
          aria-label={`${label || "Input"} action`}
        >
          <Icon className="size-4" icon={suffixIcon || LuSearch} />
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
              {prefixIcon && <Icon className="size-4" icon={prefixIcon} />}
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
