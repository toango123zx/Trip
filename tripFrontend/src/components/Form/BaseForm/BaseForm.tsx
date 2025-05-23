import { Button } from 'antd';
import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { BaseModal } from '@/components/BaseModal/BaseModal';

type BaseFormProps<T> = {
  title: string;
  form: UseFormReturn<T>;
  isCreate?: boolean;
  disabled?: boolean;
  open?: boolean;
  children: ReactNode;
  onSave?: (data: T) => void;
  onRemove?: () => void;
  onCancel?: () => void;
};

export const BaseForm = <T extends Record<string, any>>({
  title,
  form,
  isCreate = false,
  disabled = false,
  open = false,
  children,
  onSave = () => {},
  onRemove = () => {},
  onCancel = () => {},
}: BaseFormProps<T>) => {
  const { handleSubmit } = form;

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={title}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        !disabled && !isCreate && (
          <Button key="remove" danger onClick={onRemove}>
            Xóa
          </Button>
        ),
        !disabled && (
          <Button key="save" type="primary" onClick={handleSubmit(onSave)}>
            Lưu
          </Button>
        ),
      ]}
    >
      <form onSubmit={handleSubmit(onSave)} className="grid gap-3 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {children}
      </form>
    </BaseModal>
  );
}; 