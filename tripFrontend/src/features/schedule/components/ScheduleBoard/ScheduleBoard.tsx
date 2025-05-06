import { InputRef, TableColumnsType } from 'antd';
import { JSX, useState, useRef } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { getColumnSearchProps, TableView } from '@/components';
import { cn } from '@/lib';
import { TSchedule } from '@/types';

type TSchedulesBoard = {
	data?: TSchedule[];
	className?: string;
};

export const SchedulesBoard = ({
	data = [],
	className,
}: TSchedulesBoard): JSX.Element => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const columnTable: TableColumnsType<TSchedule> = [
		{
			title: 'Schedule ID',
			dataIndex: 'id',
			key: 'id',
			width: '15%',
			className: 'hidden',
		},
		{
			title: 'Name',
			dataIndex: 'productName',
			key: 'name',
			width: '15%',
			...getColumnSearchProps<TSchedule>(
				'productName',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) => a.productName.length - b.productName.length,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Start Time',
			dataIndex: 'startDate',
			key: 'startDate',
			width: '15%',
			...getColumnSearchProps<TSchedule>(
				'startDate',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'End Time',
			dataIndex: 'startDate',
			key: 'startDate',
			width: '5%',
			...getColumnSearchProps<TSchedule>(
				'startDate',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Booked',
			dataIndex: 'booked',
			key: 'booked',
			width: '8%',
			...getColumnSearchProps<TSchedule>(
				'booked',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) => a.booked - b.booked,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			width: '8%',
			...getColumnSearchProps<TSchedule>(
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
					className={`${text === 'active' ? 'text-green-500' : 'text-red-300'} font-semibold`}
				>
					{text}
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
		<TableView<TSchedule>
			className={cn(className)}
			columnTable={columnTable}
			data={data}
		/>
	);
};
