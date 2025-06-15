import { Button } from 'antd';
import { ReactNode } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

import { BaseModal } from '@/components/BaseModal/BaseModal';

type BaseFormProps<T extends FieldValues> = {
  title: string;
  form: UseFormReturn<T>;
  isCreate?: boolean;
  isUpdate?: boolean;
  isRemove?: boolean;
  disabled?: boolean;
  open?: boolean;
  children: ReactNode;
  onSave?: (data: T) => void;
  onRemove?: () => void;
  onCancel?: () => void;
  footer?: ReactNode | ReactNode[];
};

export const  BaseForm = <T extends Record<string, any>>({
  title,
  form,
  isCreate = false,
  isUpdate = false,
  isRemove = false,
  open = false,
  children,
  onSave = () => {},
  onRemove = () => {},
  onCancel = () => {},
  footer,
}: BaseFormProps<T>) => {
  console.log(`🚀 ~ BaseForm.tsx:52 ~ isUpdate:`, isUpdate)
  console.log(`🚀 ~ BaseForm.tsx:52 ~ isCreate:`, isCreate)
  console.log(`🚀 ~ BaseForm.tsx:35 ~ isRemove:`, isRemove)
  const { handleSubmit } = form;

  const modalFooter = footer !== undefined ? footer : [
    <Button key="cancel" onClick={onCancel}>
      Hủy
    </Button>,
    isRemove === true && (
      <Button key="remove" danger onClick={onRemove}>
        Xóa
      </Button>
    ),
    (isUpdate || isCreate)  && (
      <Button key="save" type="primary" onClick={handleSubmit(onSave)}>
        Lưu
      </Button>
    ),
  ];

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={title}
      width={1000}
      footer={modalFooter}
    >
      <form onSubmit={handleSubmit(onSave)} className="grid gap-3 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {children}
      </form>
    </BaseModal>
  );
}; 