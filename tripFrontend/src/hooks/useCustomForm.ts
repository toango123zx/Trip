import { useForm, UseFormProps, FieldValues } from 'react-hook-form';

export type UseCustomFormProps<T extends FieldValues> = {
  defaultValues?: Partial<T>;
  schema?: z.ZodType<T>;
} & Omit<UseFormProps<T>, 'resolver'>;

export const useCustomForm = <T extends FieldValues>({
  defaultValues,
  schema,
  ...props
}: UseCustomFormProps<T>) => {
  const form = useForm<T>({
    defaultValues,
    ...props,
  });

  return {
    ...form,
    isLoading: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
}; 