import { Table, TableProps, Badge, Tooltip } from 'antd';
import { LucideIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib';
import { JSX } from 'react';

export type StatusConfig = {
  color: string;
  label: string;
};

export type ActionConfig = {
  icon: LucideIcon;
  tooltip: string;
  onClick: () => void;
  className?: string;
};

export type BaseTableProps<T> = TableProps<T> & {
  className?: string;
  dataSource?: T[];
};

export const renderStatusBadge = (
  text: string,
  statusMap: Record<string, StatusConfig>
): JSX.Element => {
  const status = statusMap[text] || { color: 'gray', label: text };
  return (
    <Badge className="flex !min-w-[80px]"
      color={status.color}
      text={<span className="font-medium">{status.label}</span>}
    />
  );
};

export const renderActionIcon = ({
  icon: Icon,
  tooltip,
  onClick,
  className,
}: ActionConfig): JSX.Element => {
  return (
    <Tooltip title={tooltip}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "text-gray-600 hover:text-red-600 transition-colors mx-auto block",
          className
        )}
      >
        <Icon className="w-5 h-5" />
      </button>
    </Tooltip>
  );
};

export const formatDateTime = (value: Date | string | null | undefined, format: string = 'DD/MM/YYYY, HH:mm'): string => {
  if (!value) return '-';
  return dayjs(value).format(format);
};

export const  BaseTable = <T extends object>({
  className,
  pagination: paginationProps,
  dataSource,
  ...props
}: BaseTableProps<T>) => {
  const defaultPagination = {
    pageSize: 10,
    showSizeChanger: false,
    showTotal: (total: number) => `Tổng ${total} mục`,
    position: ['bottomCenter'] as const,
    itemRender: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', originalElement: React.ReactNode) => {
    //   if (type === 'prev') {
    //     return <span>Trước</span>;
    //   }
    //   if (type === 'next') {
    //     return <span>Sau</span>;
    //   }
      return originalElement;
    },
  };

  // Ẩn pagination nếu tổng số items nhỏ hơn hoặc bằng pageSize
  const shouldShowPagination = 
    typeof paginationProps === 'object' && 
    paginationProps?.total !== undefined && 
    paginationProps.total > (paginationProps.pageSize || 10);

  return (
    <Table<T>
      {...props}
      dataSource={dataSource}
      className={cn('w-full', className)}
      pagination={
        shouldShowPagination
          ? {
              ...defaultPagination,
              ...paginationProps,
            }
          : false
      }
    />
  );
}; 