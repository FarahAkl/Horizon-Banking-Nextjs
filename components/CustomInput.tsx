import React from "react";
import { Input } from "./ui/input";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Controller, Control, FieldValues, FieldPath } from "react-hook-form";

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
};

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: CustomInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className="form-item"
        >
          <FieldLabel className="form-label">{label}</FieldLabel>

          <Input
            {...field}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            className="input-class"
            type={type}
          />

          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
              className="form-message mt-2"
            />
          )}
        </Field>
      )}
    />
  );
};

export default CustomInput;
