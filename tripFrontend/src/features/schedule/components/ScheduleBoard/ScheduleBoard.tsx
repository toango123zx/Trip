import { InputRef, TableColumnsType, notification } from 'antd';
import { JSX, useState, useRef } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { useDispatch } from 'react-redux';

import {
	BaseTable,
	renderStatusBadge,
	formatDateTime,
} from '@/components/BaseTable/BaseTable';
import { cn } from '@/lib';
import { TProductSchedule, EProductScheduleStatus } from '@/types';
import { scheduleThunk } from '../..';
import { TReduxStoreDispatch } from '@/store';

import { TRequestBodyCreateSchedule } from '../../schedule.type';

type TSchedulesBoard = {
	productId?: string;
	data?: TProductSchedule[] | TRequestBodyCreateSchedule[];
	pageSize?: number;
	page?: number;
	disabled?: boolean;
	onViewDetailSchedule?: (
		schedule: TRequestBodyCreateSchedule | TProductSchedule,
	) => void;
	className?: string;
	setPage?: (page: number) => void;
	onDeleteSuccess?: () => void;
};

const STATUS_MAP = {
	waiting: { color: 'orange', label: 'Waiting' },
	active: { color: 'green', label: 'Active' },
	inactive: { color: 'red', label: 'Inactive' },
} as const;

export const SchedulesBoard = ({
	data,
	pageSize,
	page,
	disabled = false,
	onViewDetailSchedule = (): void => {},
	className,
	setPage,
	onDeleteSuccess,
}: TSchedulesBoard): JSX.Element => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);
	const dispatch = useDispatch<TReduxStoreDispatch>();

	const handleDelete = async (scheduleId: string): Promise<void> => {
		try {
			await dispatch(scheduleThunk.deleteSchedule(scheduleId)).unwrap();
			notification.success({
				message: 'Success',
				description: 'Schedule deleted successfully',
				duration: 3,
			});
			if (onDeleteSuccess) {
				onDeleteSuccess();
			}
		} catch (error) {
			notification.error({
				message: 'Error',
				description: 'Failed to delete schedule',
				duration: 3,
			});
		}
	};

	const columnTable: TableColumnsType<TProductSchedule> = [
		{
			title: 'Schedule ID',
			dataIndex: 'id',
			key: 'id',
			className: 'hidden',
			render: (value: string | undefined) => value ?? '-',
		},
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
			render: (text: string) =>
				renderStatusBadge(text || EProductScheduleStatus.active, STATUS_MAP),
		},
		{
			title: 'Action',
			className: `${disabled ?? 'hover:cursor-no-drop'}`,
			render: (schedule: TRequestBodyCreateSchedule | TProductSchedule) => (
				<div className="flex gap-2 items-center">
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
					{!disabled && (
						<button
							type="button"
							className="text-red-500 ml-2"
							onClick={() => handleDelete(schedule.id)}
						>
							Delete
						</button>
					)}
				</div>
			),
		},
	];

	return (
		<BaseTable<TProductSchedule>
			rowKey="id"
			columns={columnTable}
			dataSource={data as TProductSchedule[]}
			className={cn(className)}
			pagination={(data?.length ?? 0) > (pageSize ?? 10) ? { pageSize } : false}
			size="middle"
		/>
	);
};
