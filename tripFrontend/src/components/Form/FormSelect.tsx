import { Select, SelectProps } from 'antd';
import { Control, FieldValues, Path } from 'react-hook-form';
import { FormField } from './FormField';
import { TSelectBoxOption } from '@/types';

export type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: Record<string, unknown>;
  options: TSelectBoxOption[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
} & Omit<SelectProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'options'>;

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  options,
  onChange,
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
            {...field}
            {...props}
            className="w-full"
            style={{ width: '100%' }}
            options={options}
            status={fieldState.error ? 'error' : undefined}
            onChange={(value) => {
              field.onChange(value);
              onChange?.({ target: { value } } as React.ChangeEvent<HTMLSelectElement>);
            }}
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