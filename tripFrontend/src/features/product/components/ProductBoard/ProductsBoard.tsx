import { InputRef, TableColumnsType } from 'antd';
import { JSX, useState, useRef, useEffect } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

import { getColumnSearchProps, TableView, PaginationTable } from '@/components';
import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EProductStatus, TPagination, TProductSumary } from '@/types';

import { productThunk } from '../../productThunk';

type TProductsBoard = {
	openProductUpdateOnClick?: (productId: string, status: EProductStatus) => void;
	className?: string;
};

export const ProductsBoard = ({
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
	const [page, setPage] = useState<number>(1);

	const PAGE_SIZE = 10;

	useEffect(() => {
		dispatch(
			productThunk.getProducts({
				page: page,
				limit: PAGE_SIZE,
			}),
		);
	}, [dispatch, page]);

	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const columnTable: TableColumnsType<TProductSumary> = [
		{
			title: 'Product ID',
			dataIndex: 'id',
			key: 'id',
			width: '20%',
			className: 'hidden',
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '12%',
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
			title: 'City',
			dataIndex: 'city',
			key: 'city',
			width: '8%',
			...getColumnSearchProps(
				'city',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) => a.city.length - b.city.length,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Time',
			dataIndex: 'time',
			key: 'time',
			width: '8%',
			sorter: (a, b) => a.time - b.time,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Quantity',
			dataIndex: 'quantityAvailable',
			key: 'quantityAvailable',
			width: '8%',
			...getColumnSearchProps(
				'quantityAvailable',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) => a.quantityAvailable - b.quantityAvailable,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Complete',
			dataIndex: 'quantityCompleted',
			key: 'quantityCompleted',
			...getColumnSearchProps(
				'quantityCompleted',
				searchInput,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
			),
			sorter: (a, b) => a.quantityCompleted - b.quantityCompleted,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
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
			render: (_, record: TProductSumary) => (
				<button
					type="button"
					onClick={() =>
						openProductUpdateOnClick(
							record.id,
							EProductStatus[record.status as keyof typeof EProductStatus],
						)
					}
					className="text-blue-500 flex gap-2.5 items-center"
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
			<TableView<TProductSumary>
				className={cn(className)}
				columnTable={columnTable}
				data={products}
				pagination={false}
			/>
			<div className="flex items-center justify-center">
				{pagination.totalPages > 1 && (
					<PaginationTable
						pagination={{ ...pagination, currentPage: page }}
						onPageChange={handleChangePage}
					/>
				)}
			</div>
		</div>
	);
};
