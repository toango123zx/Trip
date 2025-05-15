import { InputRef, TableColumnsType } from 'antd';
import { Trash2 } from 'lucide-react';
import { JSX, useState, useRef } from 'react';

import { getColumnSearchProps, TableView } from '@/components';
import { TAddScheduleInDiscount } from '@/features/discount/discount.type';
import { cn } from '@/lib';

type TSchedulesBoardInDiscountProps = {
	schedules?: TAddScheduleInDiscount[];
	pageSize?: number;
	onRemove?: (scheduleId: string) => void;
	className?: string;
};

export const SchedulesBoardInDicount = ({
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
			width: '20%',
			className: 'hidden',
			render: (value: string | undefined) => value ?? '-',
		},
		{
			title: 'Product name',
			dataIndex: 'productName',
			key: 'id',
			width: '7%',
			// className: 'hidden',
			render: (value: string | undefined) => value ?? '-',
		},
		{
			title: 'Start Time',
			dataIndex: 'startTime',
			key: 'startTime',
			width: '7%',
			className: 'text-center',
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
			render: (value: Date) => new Date(value).toLocaleString(),
		},
		{
			title: 'End Time',
			dataIndex: 'endTime',
			key: 'endTime',
			width: '4%',
			className: 'text-center',

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
			render: (value: Date) => new Date(value).toLocaleString(),
		},
		{
			title: 'Booked',
			dataIndex: 'booked',
			key: 'booked',
			width: '15%',
			className: 'text-center',
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
			width: '10%',
			className: 'text-center',
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
			width: '8%',
			className: 'text-center',
			sorter: (a, b) => a.status.length - b.status.length,
			sortDirections: ['descend', 'ascend'],
			render: (text: string) => (
				<span
					className={`${
						text == 'pending add'
							? 'text-green-200'
							: text === 'active'
								? 'text-green-500'
								: 'text-red-300'
					} font-semibold`}
				>
					{text}
				</span>
			),
		},
		{
			title: 'Action',
			// className:'flex justify-center',
			render: (schedule: TAddScheduleInDiscount) => (
				<button
					type="button"
					onClick={() => onRemove(schedule.schedulesId)}
					className="flex gap-2.5 items-center mx-auto hover:text-red-500"
				>
					<span className="h-fit">
						<Trash2 className="h-7 w-7" />
					</span>
				</button>
			),
		},
	];

	return (
		<TableView<TAddScheduleInDiscount>
			className={cn(className)}
			columnTable={columnTable}
			data={schedules as TAddScheduleInDiscount[]}
			pageSize={pageSize}
			pagination={(schedules?.length ?? 0) <= (pageSize ?? 0) ? false : true}
		/>
	);
};
