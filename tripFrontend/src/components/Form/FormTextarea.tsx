import { FieldValues, Control, Controller, RegisterOptions, Path, PathValue } from 'react-hook-form';
import React from 'react';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

// Define props for FormTextarea by combining react-hook-form props and relevant TextAreaProps
type TFormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions<T, Path<T>>;
  disabled?: boolean;
  extra?: React.ReactNode;
  defaultValue?: PathValue<T, Path<T>>;
} & Pick<TextAreaProps, 'rows' | 'autoSize' | 'className' | 'style' | 'maxLength' | 'allowClear' | 'showCount' | 'bordered' | 'size'>;

export const FormTextarea = <T extends FieldValues>(
  {
    name,
    control,
    label,
    placeholder,
    rules,
    disabled = false,
    extra,
    defaultValue,
    // Picked TextAreaProps
    rows,
    autoSize,
    className,
    style,
    maxLength,
    allowClear,
    showCount,
    bordered,
    size,
  }: TFormTextareaProps<T>
) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={name as string} className="block mb-2 text-sm font-medium">
            {label}
            {rules?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {extra && <div className="mb-2">{extra}</div>}
      </div>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => {


          return (
            <div>
              <Input.TextArea
                id={name as string}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                placeholder={placeholder}
                disabled={disabled}
                status={error ? 'error' : undefined}
                // Pass explicit props
                rows={rows}
                autoSize={autoSize}
                className={className}
                style={style}
                maxLength={maxLength}
                allowClear={allowClear}
                showCount={showCount}
                bordered={bordered}
                size={size}
              />
              {error && (
                <p className="mt-1 text-sm text-red-500">
                  {error.message || 'This field is required'}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}; 