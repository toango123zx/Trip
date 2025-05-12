import { InputRef, TableColumnsType } from 'antd';
import { JSX, useState, useRef } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { getColumnSearchProps, TableView } from '@/components';
import { cn } from '@/lib';
import { TProductSchedule } from '@/types';

import { TRequestBodyCreateSchedule } from '../../schedule.type';

type TSchedulesBoard = {
	productId?: string;
	data?: TProductSchedule[] | TRequestBodyCreateSchedule[];
	pageSize?: number;
	className?: string;
};

export const SchedulesBoard = ({
	data,
	pageSize,
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
			width: '15%',
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
			key: 'startTime',
			width: '15%',
			...getColumnSearchProps<TProductSchedule>(
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
			width: '5%',
			...getColumnSearchProps<TProductSchedule>(
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
			width: '8%',
			...getColumnSearchProps<TProductSchedule>(
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
			width: '8%',
			...getColumnSearchProps<TProductSchedule>(
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
			width: '12%',
			sorter: (a, b) => a.status.length - b.status.length,
			sortDirections: ['descend', 'ascend'],
			render: (text: string) => (
				<span
					className={`${text === 'waiting'
							? 'text-amber-500'
							: text === 'active'
								? 'text-green-500'
								: 'text-red-300'
						} font-semibold`}
				>
					{text === undefined ? 'waiting' : text}
				</span>
			),
		},
		{
			title: 'Action',
			render: () => (
				<button type="button" className="text-blue-500 flex gap-2.5 items-center">
					<span>View detail </span>
					<span className="h-fit">
						<IoIosArrowRoundForward />
					</span>
				</button>
			),
		},
	];

	return (
		<TableView<TProductSchedule>
			className={cn(className)}
			columnTable={columnTable}
			data={data as TProductSchedule[]}
			pageSize={pageSize}
			pagination={(data?.length ?? 0) <= (pageSize ?? 0) ? false : true}
		/>
	);
};
