import { InputRef, TableColumnsType } from 'antd';
import { JSX, useState, useRef } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { getColumnSearchProps, TableView } from '@/components';
import { cn } from '@/lib';
import { TDiscountDetail } from '@/types';

type TDiscountBoard = {
	data?: TDiscountDetail[];
	pageSize?: number;
	className?: string;
};

export const DiscountBoard = ({
	data = [],
	pageSize,
	className,
}: TDiscountBoard): JSX.Element => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const columnTable: TableColumnsType<TDiscountDetail> = [
		{
			title: 'Discount ID',
			dataIndex: 'id',
			key: 'id',
			width: '20%',
			className: 'hidden',
		},
		{
			title: 'Discount Name',
			dataIndex: 'name',
			key: 'name',
			width: '20%',
			...getColumnSearchProps<TDiscountDetail>(
				'name',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) => a.name.length - b.name.length,
			sortDirections: ['descend', 'ascend'],
		},
		// {
		// 	title: 'Product Name',
		// 	dataIndex: 'productName',
		// 	key: 'productName',
		// 	width: '15%',
		// 	...getColumnSearchProps<TDiscountDetail>(
		// 		'productName',
		// 		searchInput,
		// 		searchText,
		// 		setSearchText,
		// 		searchedColumn,
		// 		setSearchedColumn,
		// 	),
		// 	sorter: (a, b) => a.name.length - b.name.length,
		// 	sortDirections: ['descend', 'ascend'],
		// },
		{
			title: 'Start Time',
			dataIndex: 'startTime',
			key: 'startTime',
			width: '15%',
			...getColumnSearchProps<TDiscountDetail>(
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
			...getColumnSearchProps<TDiscountDetail>(
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
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
			width: '5%',
			...getColumnSearchProps<TDiscountDetail>(
				'quantity',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) => a.quantity - b.quantity,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'value',
			width: '8%',
			...getColumnSearchProps<TDiscountDetail>(
				'value',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) => a.value - b.value,
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
					<span>View detail</span>
					<span className="h-fit">
						<IoIosArrowRoundForward />
					</span>
				</button>
			),
		},
	];
	return (
		<TableView<TDiscountDetail>
			className={cn(className)}
			columnTable={columnTable}
			data={data}
			pageSize={pageSize}
		/>
	);
};
