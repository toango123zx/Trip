import { Input, InputProps } from 'antd';
import { Control, FieldValues, Path } from 'react-hook-form';
import { FormField } from './FormField';

export type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: Record<string, unknown>;
  type?: string;
} & Omit<InputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'type'>;

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  type = 'text',
  ...props
}: FormInputProps<T>) => {
  // Tự động thêm valueAsNumber vào rules nếu type là number
  const updatedRules = type === 'number' 
    ? { ...rules, valueAsNumber: true }
    : rules;

  return (
    <FormField
      name={name}
      control={control}
      rules={updatedRules}
    >
      {({ field, fieldState }) => (
        <div className="form-control w-full">
          {label && (
            <label className="label">
              <span className="label-text">{label}</span>
            </label>
          )}
          <Input
            {...props}
            type={type}
            {...field}
            status={fieldState.invalid ? 'error' : undefined}
            value={field.value ? field.value.toLocaleString('vi-VN') : field.value}
          />
          {fieldState.error?.message && (
            <div className="text-red-500 text-sm mt-1">
              {fieldState.error.message}
            </div>
          )}
        </div>
      )}
    </FormField>
  );
}; 