import { ReactNode } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: Record<string, any>;
  children: (props: {
    field: {
      value: any;
      onChange: (...event: any[]) => void;
      onBlur: () => void;
      name: string;
    };
    fieldState: {
      invalid: boolean;
      error?: {
        message?: string;
      };
    };
  }) => ReactNode;
};

export const FormField = <T extends FieldValues>({
  name,
  control,
  rules,
  children,
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => children({ field, fieldState })}
    />
  );
}; 