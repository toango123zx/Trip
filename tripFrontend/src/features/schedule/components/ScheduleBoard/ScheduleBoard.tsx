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
import { ScheduleForm } from '../ScheduleForm';
import { scheduleThunk } from '../../scheduleThunk';
import { isCuid } from 'cuid';
import { useDispatch } from 'react-redux';
import { TReduxStoreDispatch } from '@/store';

type TSchedulesBoard = {
	productId?: string;
	data?: TProductSchedule[] | TRequestBodyCreateSchedule[];
	pageSize?: number;
	page?: number;
	disabled?: boolean;
	onViewDetailSchedule?: (
		schedule: TRequestBodyCreateSchedule | TProductSchedule,
	) => void;
	handleClosePopup?: () => void;
	className?: string;
	setPage?: (page: number) => void;
	onDeleteSuccess?: () => void;
	onScheduleDelete?: () => void;
	pagination?: {
		totalItems: number;
	};
};

const STATUS_MAP = {
	waiting: { color: 'orange', label: 'Waiting' },
	active: { color: 'green', label: 'Active' },
	waitingAdd: { color: 'yellow', label: 'Waiting Add' },
	inactive: { color: 'red', label: 'Inactive' },
} as const;

export const SchedulesBoard = ({
	data,
	pageSize,
	page,
	disabled = false,
	className,
	setPage,
	handleClosePopup,
	onViewDetailSchedule,
	onDeleteSuccess,
	onScheduleDelete,
	pagination,
}: TSchedulesBoard): JSX.Element => {
	const [localData, setLocalData] = useState<TProductSchedule[] | TRequestBodyCreateSchedule[]>(data || []);
	const [selectedSchedule, setSelectedSchedule] = useState<TProductSchedule | null | TRequestBodyCreateSchedule>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const dispatch = useDispatch<TReduxStoreDispatch>();
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
	}, [selectedSchedule])

	useEffect(() => {
		setLocalData(data || []);
	}, [data]);

	const handleRemoveSchedule = (): void => {
		if (selectedSchedule) {
			setLocalData((prev) =>
				prev.filter((schedule) => selectedSchedule.id !== schedule.id),
			);
		}
		if (!selectedSchedule?.id || !isCuid(selectedSchedule.id)) {
			setIsDetailOpen(false);
			return;
		}
		dispatch(scheduleThunk.deleteSchedule(String(selectedSchedule.id)));
		setIsDetailOpen(false);
		onScheduleDelete?.();
	};

	const handleViewDetail = async (schedule: TProductSchedule) => {
		try {
			if (schedule.status !== EProductScheduleStatus.waitingAdd) {
				const response = await scheduleApi.getScheduleByScheduleId(schedule.id);
				setSelectedSchedule(response);
				onViewDetailSchedule?.(response);
			} else {
				setSelectedSchedule(schedule);
				onViewDetailSchedule?.(schedule);
			}
			console.log(`🚀 ~ ScheduleBoard.tsx:110 ~ handleViewDetail ~ onViewDetailSchedule:`, onViewDetailSchedule)
			if (!onViewDetailSchedule) {
				setIsDetailOpen(true);
			}
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
			render: (value: number) => `${value.toLocaleString()} VND`,
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
						onClick={() => {
							!disabled ? handleViewDetail(schedule as TProductSchedule) : (): void => { }
						}}
						className={`text-blue-500 flex gap-2.5 items-center`}
					>
						<span>View</span>
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
			{(isDetailOpen && selectedSchedule && selectedSchedule.status !== EProductScheduleStatus.waitingAdd) && (
				<ScheduleDetail
					schedule={selectedSchedule as TProductSchedule}
					open={isDetailOpen}
					isComplete={new Date(selectedSchedule.endTime) < new Date() ? true : false}
					isRemove={true}
					onCancel={() => setIsDetailOpen(false)}
					onDeleteSuccess={() => {
						handleScheduleDeleted();
						fetchData();
					}}
				/>
			)}

			{/* {
				(isDetailOpen && selectedSchedule && selectedSchedule.status === EProductScheduleStatus.waitingAdd) && (
					<ScheduleForm
						productName={'a'}
						data={data?.filter((item) => item.id === selectedSchedule.id)[0] as TRequestBodyCreateSchedule}
						setData={(newData) => setSelectedSchedule(newData as TProductSchedule | TRequestBodyCreateSchedule | null)}
						isCreate={false}
						isRemove={true}
						onCancel={() => setIsDetailOpen(false)}
					/>
				)
			} */}
		</>
	);
};
