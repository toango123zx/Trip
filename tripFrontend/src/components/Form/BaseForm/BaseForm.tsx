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
  const { handleSubmit } = form;

  const modalFooter = footer !== undefined ? footer : [
    <Button key="cancel" onClick={onCancel} className='hover:!bg-gray-300 hover:!border-gray-400 hover:!text-black'>
      Close
    </Button>,
    isRemove === true && (
      <Button key="remove" danger onClick={onRemove} className='hover:!bg-red-500 hover:!text-white'>
        Cancel
      </Button>
    ),
    (isUpdate || isCreate)  && (
      <Button key="save" type="primary" onClick={handleSubmit(onSave)}>
        Save
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