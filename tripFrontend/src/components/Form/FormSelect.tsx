import { Select, SelectProps } from 'antd';
import { Control, FieldValues, Path } from 'react-hook-form';
import { FormField } from './FormField';
import { JSX } from 'react';
import { TSelectBoxOption } from './Select';

export type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: Record<string, unknown>;
  options: TSelectBoxOption[];
  search?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
} & Omit<SelectProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'options'>;

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  options,
  onChange,
  search = false,
  ...props
}: FormSelectProps<T>): JSX.Element => {
  return (
    <FormField
      name={name}
      control={control}
      rules={rules}
    >
      {({ field, fieldState }) => (
        <div className="form-control w-full">
          {label && (
            <label className="label">
              <span className="label-text">{label}</span>
            </label>
          )}
          <Select
            showSearch={search}
            {...field}
            {...props}
            className="w-full"
            style={{ width: '100%' }}
            options={options}
            status={fieldState.error ? 'error' : undefined}
            onChange={(value) => {
              console.log(`🚀 ~ FormSelect.tsx:48 ~ value:`, value)
              field.onChange(value);
              onChange?.({ target: { value } } as React.ChangeEvent<HTMLSelectElement>);
            }}
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLocaleLowerCase().includes(input.toLowerCase())
            }
          />
          {fieldState.error?.message && (
            <label className="label">
              <span className="label-text-alt text-error">
                {fieldState.error.message}
              </span>
            </label>
          )}
        </div>
      )}
    </FormField>
  );
}; 