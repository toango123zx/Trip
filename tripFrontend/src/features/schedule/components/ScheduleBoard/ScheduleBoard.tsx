import { InputRef, TableColumnsType } from 'antd';
import { JSX, useState, useRef } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { getColumnSearchProps } from '@/components';
import { BaseTable, renderStatusBadge, formatDateTime } from '@/components/BaseTable/BaseTable';
import { cn } from '@/lib';
import { TProductSchedule, EProductScheduleStatus } from '@/types';

import { TRequestBodyCreateSchedule } from '../../schedule.type';

type TSchedulesBoard = {
	productId?: string;
	data?: TProductSchedule[] | TRequestBodyCreateSchedule[];
	pageSize?: number;
	disabled?: boolean;
	onViewDetailSchedule?: (
		schedule: TRequestBodyCreateSchedule | TProductSchedule,
	) => void;
	className?: string;
};

const STATUS_MAP = {
	waiting: { color: 'orange', label: 'Waiting' },
	active: { color: 'green', label: 'Active' },
	inactive: { color: 'red', label: 'Inactive' },
} as const;

export const SchedulesBoard = ({
	data,
	pageSize,
	disabled = false,
	onViewDetailSchedule = (): void => {},
	className,
}: TSchedulesBoard): JSX.Element => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const columnTable: TableColumnsType<TProductSchedule> = [
		{
			title: 'Schedule ID',
			dataIndex: 'id',
			key: 'id',
			className: 'hidden',
			render: (value: string | undefined) => value ?? '-',
		},
		// {
		// 	title: 'Name',
		// 	dataIndex: 'productName',
		// 	key: 'name',
		// 	width: '15%',
		// 	...getColumnSearchProps<TProductSchedule>(
		// 		'productName',
		// 		searchInput,
		// 		searchText,
		// 		setSearchText,
		// 		searchedColumn,
		// 		setSearchedColumn,
		// 	),
		// 	sorter: (a, b) => a.productName.length - b.productName.length,
		// 	sortDirections: ['descend', 'ascend'],
		// },
		{
			title: 'Start Time',
			dataIndex: 'startTime',
			sorter: (a, b) =>
				new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
			sortDirections: ['descend', 'ascend'],
			render: (value: Date) => formatDateTime(value),
		},
		{
			title: 'End Time',
			dataIndex: 'endTime',
			sorter: (a, b) =>
				new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
			sortDirections: ['descend', 'ascend'],
			render: (value: Date) => formatDateTime(value),
		},
		{
			title: 'Booked',
			dataIndex: 'booked',
			sorter: (a, b) => a.booked - b.booked,
			sortDirections: ['descend', 'ascend'],
			render: (value: number | undefined) => value ?? 0,
		},
		{
			title: 'Price',
			dataIndex: 'price',
			sorter: (a, b) => a.price - b.price,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => (a.status?.length || 0) - (b.status?.length || 0),
			sortDirections: ['descend', 'ascend'],
			render: (text: string) => renderStatusBadge(text || EProductScheduleStatus.active, STATUS_MAP),
		},
		{
			title: 'Action',
			className: `${disabled ?? 'hover:cursor-no-drop'}`,
			render: (schedule: TRequestBodyCreateSchedule | TProductSchedule) => (
				<button
					type="button"
					onClick={() =>
						!disabled ? onViewDetailSchedule(schedule) : (): void => {}
					}
					className={`text-blue-500 flex gap-2.5 items-center`}
				>
					<span>View detail </span>
					<span className="h-fit">
						<IoIosArrowRoundForward />
					</span>
				</button>
			),
		},
	];

	return (
		<BaseTable<TProductSchedule>
			rowKey="id"
			columns={columnTable}
			dataSource={data as TProductSchedule[]}
			className={cn(className)}
			pagination={
				(data?.length ?? 0) > (pageSize ?? 10) 
				? { pageSize } 
				: false
			}
			size="middle"
		/>
	);
};
