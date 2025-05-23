import { InputRef, TableColumnsType } from 'antd';
import { JSX, useState, useRef } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { getColumnSearchProps } from '@/components';
import { BaseTable, renderStatusBadge, formatDateTime } from '@/components/BaseTable/BaseTable';
import { cn } from '@/lib';
import { TReduxStoreState } from '@/store';
import { TDiscountDetail, TPagination } from '@/types';

type TDiscountBoard = {
	data?: TDiscountDetail[];
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	pageSize?: number;
	onViewDetailDiscount?: (discount: TDiscountDetail) => void;
	className?: string;
};

const STATUS_MAP = {
	active: { color: 'green', label: 'Active' },
	inactive: { color: 'red', label: 'Inactive' },
} as const;

export const DiscountBoard = ({
	data = [],
	page,
	setPage,
	pageSize = 10,
	onViewDetailDiscount = (): void => {},
	className,
}: TDiscountBoard): JSX.Element => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);
	const pagination: TPagination = useSelector<TReduxStoreState, TPagination>(
		(state: TReduxStoreState) => state.discount.pagination,
	);

	const columnTable: TableColumnsType<TDiscountDetail> = [
		{
			title: 'Discount ID',
			dataIndex: 'id',
			key: 'id',
			className: 'hidden',
		},
		{
			title: 'Discount Name',
			dataIndex: 'name',
			key: 'name',
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
			title: 'Quantity',
			dataIndex: 'quantity',
			sorter: (a, b) => a.quantity - b.quantity,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Value',
			dataIndex: 'value',
			sorter: (a, b) => a.value - b.value,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (text: string) => renderStatusBadge(text, STATUS_MAP),
		},
		{
			title: 'Action',
			render: (discount: TDiscountDetail) => (
				<button
					type="button"
					onClick={() => onViewDetailDiscount(discount)}
					className="text-blue-500 flex gap-1 items-center"
				>
					<span>View detail</span>
					<span className="h-fit">
						<IoIosArrowRoundForward />
					</span>
				</button>
			),
		},
	];

	const handleChangePage = (nextPage: number): void => {
		setPage(nextPage);
	};

	return (
		<div>
			<BaseTable<TDiscountDetail>
				rowKey="id"
				columns={columnTable}
				dataSource={data}
				className={cn('w-full', className)}
				pagination={
					pagination?.totalItems > pageSize
					? {
						current: page,
						pageSize: pageSize,
						total: pagination.totalItems,
						onChange: handleChangePage,
					}
					: false
				}
				size="middle"
			/>
		</div>
	);
};
