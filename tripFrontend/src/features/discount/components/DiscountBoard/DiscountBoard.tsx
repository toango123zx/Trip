import { InputRef, TableColumnsType } from 'antd';
import { JSX, useState, useRef } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { getColumnSearchProps, TableView } from '@/components';
import { cn } from '@/lib';
import { TDiscount } from '@/types';

type TDiscountBoard = {
	data?: TDiscount[];
	className?: string;
};

export const DiscountBoard = ({ data, className }: TDiscountBoard): JSX.Element => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const columnTable: TableColumnsType<TDiscount> = [
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
			...getColumnSearchProps<TDiscount>(
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
		{
			title: 'Product Name',
			dataIndex: 'productName',
			key: 'productName',
			width: '15%',
			...getColumnSearchProps<TDiscount>(
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
			...getColumnSearchProps<TDiscount>(
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
			dataIndex: 'endDate',
			key: 'endDate',
			width: '5%',
			...getColumnSearchProps<TDiscount>(
				'endDate',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) =>
				new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
			width: '5%',
			...getColumnSearchProps<TDiscount>(
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
			...getColumnSearchProps<TDiscount>(
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
		<TableView<TDiscount>
			className={cn(className)}
			columnTable={columnTable}
			data={data}
		/>
	);
};
