import { FieldValues, Control, Controller, RegisterOptions } from 'react-hook-form';

type TFormTextareaProps<T extends FieldValues> = {
  name: keyof T & string;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  rows?: number;
};

export const FormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rules,
  disabled = false,
  rows = 4,
}: TFormTextareaProps<T>) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block mb-2 text-sm font-medium">
          {label}
          {rules?.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <div>
            <textarea
              id={name}
              {...field}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md ${
                error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-gray-500'
              } ${
                disabled 
                  ? 'bg-gray-100 cursor-not-allowed' 
                  : 'bg-white'
              } focus:outline-none transition-colors`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">
                {error.message || 'This field is required'}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}; 