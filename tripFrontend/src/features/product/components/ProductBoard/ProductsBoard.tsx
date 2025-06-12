import { InputRef, TableColumnsType } from 'antd';
import React, { JSX, useState, useRef, useEffect } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

import { BaseTable, renderStatusBadge, formatDateTime } from '@/components/BaseTable/BaseTable';
import { getColumnSearchProps } from '@/components';
import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EProductStatus, TPagination, TProductSumary } from '@/types';

import { productThunk } from '../../productThunk';

type TProductsBoard = {
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	pageSize?: number;
	openProductUpdateOnClick?: (productId: string, status: EProductStatus) => void;
	className?: string;
};

const STATUS_MAP = {
	active: { color: 'green', label: 'Active' },
	inactive: { color: 'red', label: 'Inactive' },
} as const;

export const ProductsBoard = ({
	page,
	setPage,
	pageSize = 10,
	openProductUpdateOnClick = (): void => {},
	className,
}: TProductsBoard): JSX.Element => {
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const products: TProductSumary[] = useSelector<TReduxStoreState, TProductSumary[]>(
		(state: TReduxStoreState) => state.product.products,
	);
	const pagination: TPagination = useSelector<TReduxStoreState, TPagination>(
		(state: TReduxStoreState) => state.product.pagination,
	);

	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	// Thêm debounce để tránh gọi API quá nhiều
	const [debouncedSearchText, setDebouncedSearchText] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchText(searchText);
		}, 500); // Đợi 500ms sau khi người dùng ngừng gõ

		return () => clearTimeout(timer);
	}, [searchText]);

	useEffect(() => {
		dispatch(
			productThunk.getProductsManagement({
				page: page,
				limit: pageSize,
				keyword: debouncedSearchText || undefined, // Thêm keyword vào params
			}),
		);
	}, [dispatch, page, pageSize, debouncedSearchText]);

	const columnTable: TableColumnsType<TProductSumary> = [
		{
			title: 'Mã sản phẩm',
			dataIndex: 'id',
			key: 'id',
			className: 'hidden',
		},
		{
			title: 'Tên',
			dataIndex: 'name',
			key: 'name',
			...getColumnSearchProps<TProductSumary>(
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
			title: 'Thành phố',
			dataIndex: 'city',
			key: 'city',
			sorter: (a, b) => a.city.length - b.city.length,
			sortDirections: ['descend', 'ascend'],
		},
		// {
		// 	title: 'Time',
		// 	dataIndex: 'createAt',
		// 	key: 'createAt',
		// 	sorter: (a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
		// 	sortDirections: ['descend', 'ascend'],
		// 	render: (value: string) => formatDateTime(value),
		// },
		{
			title: 'Số lượng',
			dataIndex: 'quantityAvailable',
			sorter: (a, b) => a.quantityAvailable - b.quantityAvailable,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Hoàn thành',
			dataIndex: 'quantityCompleted',
			sorter: (a, b) => a.quantityCompleted - b.quantityCompleted,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => a.status.length - b.status.length,
			sortDirections: ['descend', 'ascend'],
			render: (text: string) => renderStatusBadge(text, STATUS_MAP),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_, record: TProductSumary) => (
				<button
					type="button"
					onClick={() =>
						openProductUpdateOnClick(
							record.id,
							EProductStatus[record.status as keyof typeof EProductStatus],
						)
					}
					className="text-blue-500 flex gap-1 items-center"
				>
					<span>Xem chi tiết</span>
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
			<BaseTable<TProductSumary>
				rowKey="id"
				columns={columnTable}
				dataSource={products}
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
