import { InputRef, TableColumnsType } from 'antd';
import { Trash2 } from 'lucide-react';
import { JSX, useState, useRef } from 'react';

import { getColumnSearchProps } from '@/components';
import { BaseTable, renderStatusBadge, renderActionIcon, formatDateTime } from '@/components/BaseTable/BaseTable';
import { TAddScheduleInDiscount } from '@/features/discount/discount.type';
import { cn } from '@/lib';

type TSchedulesBoardInDiscountProps = {
  schedules?: TAddScheduleInDiscount[];
  pageSize?: number;
  onRemove?: (scheduleId: string) => void;
  className?: string;
};

const STATUS_MAP = {
  pending: { color: 'orange', label: 'Pending' },
  active: { color: 'green', label: 'Active' },
  cancelled: { color: 'red', label: 'Cancelled' },
} as const;

export const SchedulesBoardInDiscount = ({
  schedules,
  pageSize,
  onRemove = (): void => {},
  className,
}: TSchedulesBoardInDiscountProps): JSX.Element => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const columnTable: TableColumnsType<TAddScheduleInDiscount> = [
    {
      title: 'Schedule ID',
      dataIndex: 'id',
      key: 'id',
      className: 'hidden',
      render: (value: string | undefined) => value ?? '-',
    },
    {
      title: 'Product name',
      dataIndex: 'productName',
      key: 'id',
      render: (value: string | undefined) => value ?? '-',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      ...getColumnSearchProps<TAddScheduleInDiscount>(
        'startTime',
        searchInput,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
      ),
      sorter: (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      sortDirections: ['descend', 'ascend'],
      render: (value: Date) => formatDateTime(value),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      ...getColumnSearchProps<TAddScheduleInDiscount>(
        'endTime',
        searchInput,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
      ),
      sorter: (a, b) =>
        new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
      sortDirections: ['descend', 'ascend'],
      render: (value: Date) => formatDateTime(value),
    },
    {
      title: 'Booked',
      dataIndex: 'booked',
      key: 'booked',
      ...getColumnSearchProps<TAddScheduleInDiscount>(
        'booked',
        searchInput,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
      ),
      sorter: (a, b) => a.booked - b.booked,
      sortDirections: ['descend', 'ascend'],
      render: (value: number | undefined) => value ?? 0,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      ...getColumnSearchProps<TAddScheduleInDiscount>(
        'price',
        searchInput,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
      ),
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ['descend', 'ascend'],
      render: (text: string) => renderStatusBadge(text, STATUS_MAP),
    },
    {
      title: 'Action',
      render: (schedule: TAddScheduleInDiscount) =>
        renderActionIcon({
          icon: Trash2,
          tooltip: 'Remove schedule',
          onClick: () => onRemove(schedule.schedulesId),
          className: 'text-gray-600 hover:text-red-600',
        }),
    },
  ];

  return (
    <BaseTable<TAddScheduleInDiscount>
      rowKey="id"
      columns={columnTable}
      dataSource={schedules}
      className={cn(className)}
      pagination={
        (schedules?.length ?? 0) > (pageSize ?? 0)
          ? { pageSize }
          : false
      }
      size="middle"
    />
  );
};
