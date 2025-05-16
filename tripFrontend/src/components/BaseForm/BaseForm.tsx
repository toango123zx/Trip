import { Form, FormProps } from 'antd';
import { ReactNode } from 'react';
import { cn } from '@/lib';

export type BaseFormProps<T> = Omit<FormProps<T>, 'children'> & {
  children: ReactNode;
  className?: string;
};

export const BaseForm = <T extends object>({
  children,
  className,
  ...props
}: BaseFormProps<T>) => {
  return (
    <Form<T>
      {...props}
      className={cn('w-full', className)}
      layout="vertical"
      validateMessages={{
        required: '${label} là bắt buộc',
        types: {
          email: '${label} không đúng định dạng email',
          number: '${label} phải là số',
        },
        number: {
          min: '${label} phải lớn hơn hoặc bằng ${min}',
          max: '${label} phải nhỏ hơn hoặc bằng ${max}',
        },
      }}
    >
      {children}
    </Form>
  );
}; 