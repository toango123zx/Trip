import { TableColumnsType, notification } from 'antd';
import { JSX, useState, useEffect } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import {
	BaseTable,
	renderStatusBadge,
	formatDateTime,
} from '@/components/BaseTable/BaseTable';
import { cn } from '@/lib';
import { TProductSchedule, EProductScheduleStatus } from '@/types';
import { ScheduleDetail } from '../ScheduleDetail/ScheduleDetail';
import { scheduleApi } from '../../scheduleApi';

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
	pagination?: {
		totalItems: number;
	};
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
	className,
	setPage,
	onDeleteSuccess,
	pagination,
}: TSchedulesBoard): JSX.Element => {
	const [localData, setLocalData] = useState<TProductSchedule[] | TRequestBodyCreateSchedule[]>(data || []);
	const [selectedSchedule, setSelectedSchedule] = useState<TProductSchedule | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	const fetchData = async () => {
		try {
			const response = await scheduleApi.getSchedules();
			setLocalData(response.data);
		} catch (error) {
			notification.error({
				message: 'Lỗi',
				description: 'Không thể làm mới danh sách lịch trình',
				duration: 3,
			});
		}
	};

	useEffect(() => {
		setLocalData(data || []);
	}, [data]);

	const handleViewDetail = async (schedule: TProductSchedule) => {
		try {
			const response = await scheduleApi.getScheduleByScheduleId(schedule.id, EProductScheduleStatus.active);
			setSelectedSchedule(response);
			setIsDetailOpen(true);
		} catch (error) {
			notification.error({
				message: 'Lỗi',
				description: 'Không thể lấy thông tin chi tiết lịch trình',
				duration: 3,
			});
		}
	};

	const handleScheduleDeleted = () => {
		if (onDeleteSuccess) {
			onDeleteSuccess();
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
							!disabled ? handleViewDetail(schedule as TProductSchedule) : (): void => {}
						}
						className={`text-blue-500 flex gap-2.5 items-center`}
					>
						<span>Xem chi tiết </span>
						<span className="h-fit">
							<IoIosArrowRoundForward />
						</span>
					</button>
					{/* {!disabled && (
						<button
							type="button"
							className="text-red-500 ml-2"
							onClick={() => handleDelete(schedule.id)}
						>
							Xóa
						</button>
					)} */}
				</div>
			),
		},
	];

	return (
		<>
			<BaseTable<TProductSchedule>
				rowKey="id"
				columns={columnTable}
				dataSource={localData as TProductSchedule[]}
				className={cn(className)}
				pagination={{
					current: page,
					pageSize: pageSize,
					total: pagination?.totalItems,
					onChange: (newPage) => setPage?.(newPage),
					showSizeChanger: false
				}}
				size="middle"
			/>
			{selectedSchedule && (
				<ScheduleDetail
					schedule={selectedSchedule}
					open={isDetailOpen}
					onCancel={() => setIsDetailOpen(false)}
					onDeleteSuccess={() => {
						handleScheduleDeleted();
						fetchData();
					}}
				/>
			)}
		</>
	);
};
