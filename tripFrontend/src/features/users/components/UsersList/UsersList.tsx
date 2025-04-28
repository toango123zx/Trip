'use client';

import {
	Button,
	Input,
	InputRef,
	Space,
	Table,
	TableColumnsType,
	TableColumnType,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { Plus } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { IoIosSearch } from 'react-icons/io';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TUser } from '@/types';

import style from './style.module.scss';
import { userThunk } from '../../userThunk';

type TTable<T> = {
	columnTable: TableColumnsType<T>;
	data?: T[];
	pageSize?: number;
	className?: string;
};

const TableView = <T,>({
	className,
	columnTable,
	pageSize = 10,
	data,
}: TTable<T>): JSX.Element => {
	return (
		<Table<T>
			rowKey="id"
			columns={columnTable}
			dataSource={data}
			pagination={{ pageSize: pageSize }}
			className={cn(`relative md:pt-0 ${style.table} ${style.List}`, className)}
		/>
	);
};

type TUsersListProps = {
	className?: string;
};

export const UsersList = ({ className }: TUsersListProps): JSX.Element => {
	const [activeTab, setActiveTab] = useState<'admin' | 'supplier' | 'tourist'>(
		'tourist',
	);
	const searchInput = useRef<InputRef>(null);
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const users: TUser[] = useSelector<TReduxStoreState, TUser[]>(
		(state: TReduxStoreState) => state.user.users,
	);

	useEffect(() => {
		dispatch(userThunk.getUsers({}));
	}, [dispatch]);

	type DataIndex = keyof TUser;

	const handleSearch = (
		selectedKeys: string[],
		confirm: FilterDropdownProps['confirm'],
		user: DataIndex,
	): void => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(user);
	};

	const handleReset = (clearFilters: () => void): void => {
		clearFilters();
		setSearchText('');
	};

	const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<TUser> => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys as string[], confirm, dataIndex)
					}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(selectedKeys as string[], confirm, dataIndex)
						}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>

					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<IoIosSearch style={{ color: filtered ? '#1677ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex] !== null && record[dataIndex] !== undefined
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes((value as string).toLowerCase())
				: false,
		filterDropdownProps: {
			onOpenChange(open): void {
				if (open) {
					setTimeout(() => searchInput.current?.select(), 100);
				}
			},
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	let columnTable: TableColumnsType<TUser> = [
		{
			title: 'User ID',
			dataIndex: 'id',
			key: 'id',
			width: '15%',
			className: 'hidden',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: '20%',
			...getColumnSearchProps('email'),
			sorter: (a, b) => a.email.length - b.email.length,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '20%',
			...getColumnSearchProps('name'),
			sorter: (a, b) => a.name.length - b.name.length,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Date of birth',
			dataIndex: 'dateOfBirth',
			key: 'dateOfBirth',
			...getColumnSearchProps('dateOfBirth'),
			sorter: (a, b) =>
				new Date(a.dateOfBirth ?? 0).getTime() -
				new Date(b.dateOfBirth ?? 0).getTime(),
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Fee',
			dataIndex: ['supplier', 'fee'],
			key: 'fee',
			sorter: (a, b): number => {
				const feeA = a.supplier?.fee || 0;
				const feeB = b.supplier?.fee || 0;
				return feeA - feeB;
			},
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			...getColumnSearchProps('status'),
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

	if (activeTab == 'tourist' || activeTab == 'admin') {
		columnTable = columnTable.filter((item) => item.title !== 'Fee');
	}

	const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);

	const handleChangeTab = (tab: 'admin' | 'supplier' | 'tourist'): void => {
		setActiveTab(tab);
		setFilteredUsers(users.filter((user) => user.roleName === tab));
	};

	return (
		<section
			className={cn('relative md:pt-0', className)}
			aria-labelledby="attractions-rate"
		>
			<div className="container mx-auto bg-white rounded-lg p-6 md:px-14 md:py-16 font-sans flex  flex-col">
				{/* Main Content */}
				<main className="flex flex-1 gap-14 text-2xl">
					{/* Sidebar */}
					<div className="space-y-5 w-3/15 font-Montserrat">
						<button
							className={`w-full rounded-2xl py-3 px-9 text-left font-medium shadow-md ${
								activeTab === 'tourist'
									? 'bg-[#ff6b0a] text-white'
									: 'bg-white text-gray-500 hover:bg-gray-100'
							}`}
							onClick={() => handleChangeTab('tourist')}
						>
							Tourist
						</button>
						<button
							className={`w-full rounded-2xl py-3 px-9 text-left font-medium shadow-md ${
								activeTab === 'supplier'
									? 'bg-[#ff6b0a] text-white'
									: 'bg-white text-gray-500 hover:bg-gray-100 '
							}`}
							onClick={() => handleChangeTab('supplier')}
						>
							Suppliers
						</button>
						<button
							className={`w-full rounded-2xl py-3 px-9 text-left font-medium shadow-md ${
								activeTab === 'admin'
									? 'bg-[#ff6b0a] text-white'
									: 'bg-white text-gray-500 hover:bg-gray-100 '
							}`}
							onClick={() => handleChangeTab('admin')}
						>
							Admins
						</button>
					</div>

					{/* Content Area */}
					<div className="flex-1 rounded-lg bg-white p-6 shadow-md">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-500">
								{activeTab === 'tourist' ? 'tourist' : 'supplier'}
							</h2>
							<div className="flex items-center gap-2">
								<button className="rounded-md border border-gray-300 p-1 shadow-sm">
									<Plus className="h-4 w-4 text-gray-600" />
								</button>
							</div>
						</div>

						{/* Table */}
						<TableView<TUser>
							columnTable={columnTable}
							data={filteredUsers}
						/>
					</div>
				</main>
			</div>
		</section>
	);
};
