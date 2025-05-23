import { Modal, ModalProps } from 'antd';
import { ReactNode } from 'react';
import { cn } from '@/lib';

export type BaseModalProps = ModalProps & {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const BaseModal = ({
  children,
  className,
  contentClassName,
  ...props
}: BaseModalProps): JSX.Element => {
  return (
    <Modal
      {...props}
      className={cn('', className)}
      modalRender={(node) => (
        <div className={cn('', contentClassName)}>
          {node}
        </div>
      )}
      destroyOnClose
      maskClosable={true}
      centered
    >
      {children}
    </Modal>
  );
}; 