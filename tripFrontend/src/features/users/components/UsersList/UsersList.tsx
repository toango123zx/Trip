'use client';

import {
	Button,
	Input,
	InputRef,
	Space,
	TableColumnsType,
	TableColumnType,
	Modal,
	Form,
	Select,
	DatePicker,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { Plus } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { IoIosSearch } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaLock, FaUnlock, FaUserFriends, FaUserTie, FaUserShield } from 'react-icons/fa';
import { BaseTable } from '@/components/BaseTable/BaseTable';
import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EUserRole, TUser } from '@/types/user.type';
import { userThunk } from '../../userThunk';
import { Popover } from 'antd';
import { notificationUtils } from '@/utils/notificationUtils';
import './style.scss';

type TUsersListProps = {
	className?: string;
};

// Các type cho modal
type AddUserModalProps = {
	open: boolean;
	onCancel: () => void;
	onSubmit: (values: {
		username: string;
		password: string;
		email: string;
		name: string;
		roleName: EUserRole;
	}) => void;
};

type EditUserModalProps = {
	open: boolean;
	onCancel: () => void;
	onSubmit: (values: {
		email?: string;
		name?: string;
		phoneNumber?: string | null;
		address?: string | null;
		dateOfBirth?: Date | null;
		gender?: 'male' | 'female' | 'other' | null;
		roleName?: EUserRole;
	}) => void;
	initialValues: {
		email: string;
		name: string;
		phoneNumber?: string | null;
		address?: string | null;
		dateOfBirth?: Date | null;
		gender?: 'male' | 'female' | 'other' | null;
		roleName?: EUserRole;
	};
};

export const UsersList = ({ className }: TUsersListProps): JSX.Element => {
	const [activeTab, setActiveTab] = useState<EUserRole>(EUserRole.tourist);
	const searchInput = useRef<InputRef>(null);
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);
	const users: TUser[] = useSelector<TReduxStoreState, TUser[]>(
		(state: TReduxStoreState) => state.user.users,
	);
	const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false);
	const [isOpenEditUserModal, setIsOpenEditUserModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
	const [page, setPage] = useState<number>(1);
	const PAGE_SIZE = 10;
	const [totalUsers, setTotalUsers] = useState<number>(0);

	useEffect(() => {
		dispatch(userThunk.getUsers({
			page,
			limit: PAGE_SIZE
		}));
	}, [dispatch, page]);

	useEffect(() => {
		// Filter users based on active tab after receiving users from API
		const filtered = users.filter((user) => user.roleName === activeTab);
		setFilteredUsers(filtered);
		setTotalUsers(filtered.length);
	}, [users, activeTab]);

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
					searchInput.current?.select();
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

	const handleChangeTab = (tab: EUserRole): void => {
		setActiveTab(tab);
		setPage(1);
	};

	const handleAddUser = async (values: {
		username: string;
		password: string;
		email: string;
		name: string;
		roleName: EUserRole;
	}) => {
		try {
			await dispatch(userThunk.createUser(values));
			setIsOpenAddUserModal(false);
			dispatch(userThunk.getUsers({
				page,
				limit: PAGE_SIZE
			}));
		} catch (error :any) {
			notificationUtils.error({message: error.response.data.message});
		}
	};

	const handleEditUser = async (values: {
		email?: string;
		name?: string;
		phoneNumber?: string | null;
		address?: string | null;
		dateOfBirth?: Date | null;
		gender?: 'male' | 'female' | 'other' | null;
		roleName?: EUserRole;
	}) => {
		if (!selectedUser) return;

		try {
			await dispatch(userThunk.updateUser({
				userId: selectedUser.id,
				...values
			}));
			setIsOpenEditUserModal(false);
			dispatch(userThunk.getUsers({
				page,
				limit: PAGE_SIZE
			}));
		} catch (error: any) {
			notificationUtils.error({message: error.response.data.message});
		}
	};

	const handleLockUser = async (userId: string) => {
		try {
			await dispatch(userThunk.lockUser(userId));
			dispatch(userThunk.getUsers({
				page,
				limit: PAGE_SIZE
			}));
		} catch (error: any) {
			notificationUtils.error({message: error.response.data.message});
		}
	};

	const handleUnlockUser = async (userId: string) => {
		try {
			await dispatch(userThunk.unlockUser(userId));
			dispatch(userThunk.getUsers({
				page,
				limit: PAGE_SIZE
			}));
		} catch (error: any) {
			notificationUtils.error({message: error.response.data.message});
		}
	};

	const columnTable: TableColumnsType<TUser> = [
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
			width: '25%',
			...getColumnSearchProps('email'),
			sorter: (a, b) => a.email.length - b.email.length,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '25%',
			...getColumnSearchProps('name'),
			sorter: (a, b) => a.name.length - b.name.length,
			sortDirections: ['descend', 'ascend'],
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (text: string) => (
				<span
					className={`
						font-semibold 
						${text === 'active' ? 'text-green-500' : 'text-red-500'}
					`}
				>
					{text}
				</span>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<div className="flex gap-2">
					<Popover content="Edit user" trigger="hover">
						<button
							type="button"
							className="text-blue-500 flex gap-2.5 items-center"
							onClick={() => {
								const userToEdit = users.find(user => user.id === record.id);
								if (userToEdit) {
									setSelectedUser(userToEdit);
									setIsOpenEditUserModal(true);
								} else {
									notificationUtils.error();
								}
							}}
						>
							<FaEdit className="h-5 w-5" />
						</button>
					</Popover>
					{record.status === 'active' && (
						<Popover content="Lock user" trigger="hover">
							<button
								type="button"
								className="text-red-500 flex gap-2.5 items-center"
								onClick={() => handleLockUser(record.id)}
							>
								<FaLock className="h-5 w-5" />
							</button>
						</Popover>
					)}
					{record.status === 'locked' && (
						<Popover content="Unlock user" trigger="hover">
							<button
								type="button"
								className="text-green-500 flex gap-2.5 items-center"
								onClick={() => handleUnlockUser(record.id)}
							>
								<FaUnlock className="h-5 w-5" />
							</button>
						</Popover>
					)}
				</div>
			),
		},
	];

	return (
		<section
			className={cn('relative w-full h-screen', className)}
			aria-label="User Management"
		>
			<div className="container mx-auto bg-white rounded-lg shadow-lg p-3 sm:p-6 md:px-8 md:py-10 lg:px-10 lg:py-12 font-sans flex flex-col transition-all duration-300 ">
				{/* Main Content */}
				<main className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6 lg:gap-8 ">
					{/* Sidebar - Fixed */}
					<div className="flex flex-row md:flex-col flex-wrap justify-center md:justify-start gap-2 md:gap-4 md:w-1/4 lg:w-1/5 font-Montserrat md:sticky md:top-0 md:h-screen">
						<button
							className={`rounded-xl px-3 py-2 md:py-3.5 md:px-4 lg:px-6 text-center md:text-left font-medium transition-all duration-300 flex-1 md:flex-none md:w-full flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 ${activeTab === EUserRole.tourist
									? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white md:transform md:translate-x-2'
									: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500'
								}`}
							onClick={() => handleChangeTab(EUserRole.tourist)}
						>
							<FaUserFriends className="text-lg md:text-xl" />
							<span className="text-xs sm:text-sm md:text-base">Tourists</span>
						</button>
						<button
							className={`rounded-xl px-3 py-2 md:py-3.5 md:px-4 lg:px-6 text-center md:text-left font-medium transition-all duration-300 flex-1 md:flex-none md:w-full flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 ${activeTab === EUserRole.supplier
									? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white md:transform md:translate-x-2'
									: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500'
								}`}
							onClick={() => handleChangeTab(EUserRole.supplier)}
						>
							<FaUserTie className="text-lg md:text-xl" />
							<span className="text-xs sm:text-sm md:text-base">Suppliers</span>
						</button>
						<button
							className={`rounded-xl px-3 py-2 md:py-3.5 md:px-4 lg:px-6 text-center md:text-left font-medium transition-all duration-300 flex-1 md:flex-none md:w-full flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 ${activeTab === EUserRole.admin
									? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white md:transform md:translate-x-2'
									: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500'
								}`}
							onClick={() => handleChangeTab(EUserRole.admin)}
						>
							<FaUserShield className="text-lg md:text-xl" />
							<span className="text-xs sm:text-sm md:text-base">Admins</span>
						</button>
					</div>

					{/* Content Area */}
					<div className="flex-1 rounded-xl bg-white p-3 sm:p-4 md:p-6 shadow-md border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col">
						<div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
								{activeTab === EUserRole.tourist && (
									<>
										<FaUserFriends className="text-orange-500" />
										<span>Tourists</span>
									</>
								)}
								{activeTab === EUserRole.supplier && (
									<>
										<FaUserTie className="text-orange-500" />
										<span>Suppliers</span>
									</>
								)}
								{activeTab === EUserRole.admin && (
									<>
										<FaUserShield className="text-orange-500" />
										<span>Admins</span>
									</>
								)}
							</h2>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => setIsOpenAddUserModal(true)}
									className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium py-2 px-3 sm:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:from-orange-600 hover:to-orange-500 transform hover:-translate-y-0.5 w-full sm:w-auto"
								>
									<Plus className="w-5 h-5" />
									<span className="font-Montserrat text-sm">
										Add User
									</span>
								</button>
							</div>
						</div>

						<div className="bg-gray-50 rounded-lg p-2 sm:p-4 transition-all duration-300 overflow-x-auto flex-1">
							<BaseTable<TUser>
								rowKey="id"
								columns={columnTable}
								dataSource={filteredUsers}
								className="w-full"
								pagination={{
									current: page,
									pageSize: PAGE_SIZE,
									total: totalUsers,
									onChange: (newPage) => setPage(newPage)
								}}
							/>
						</div>
					</div>
				</main>

				{/* Modals */}
				<AddUserModal
					open={isOpenAddUserModal}
					onCancel={() => setIsOpenAddUserModal(false)}
					onSubmit={handleAddUser}
				/>
				{selectedUser && (
					<EditUserModal
						open={isOpenEditUserModal}
						onCancel={() => setIsOpenEditUserModal(false)}
						onSubmit={handleEditUser}
						initialValues={{
							email: selectedUser.email,
							name: selectedUser.name,
							phoneNumber: selectedUser.phoneNumber,
							address: selectedUser.address,
							dateOfBirth: selectedUser.dateOfBirth,
							gender: selectedUser.gender,
							roleName: selectedUser.roleName
						}}
					/>
				)}
			</div>
		</section>
	);
};

// Modal components
const AddUserModal: React.FC<AddUserModalProps> = ({ open, onCancel, onSubmit }) => {
	const [form] = Form.useForm();

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			onSubmit(values);
			form.resetFields(); // Reset form sau khi submit thành công
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<Modal
			title="Add User"
			open={open}
			onOk={handleSubmit}
			onCancel={() => {
				onCancel();
				form.resetFields(); // Reset form khi đóng modal
			}}
		>
			<Form form={form} layout="vertical">
				<Form.Item
					name="username"
					label="Username"
					rules={[
						{ required: true, message: 'Please enter username' },
						{ min: 4, message: 'Username must be at least 4 characters' }
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="password"
					label="Password"
					rules={[
						{ required: true, message: 'Please enter password' },
						{ min: 6, message: 'Password must be at least 6 characters' }
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					name="email"
					label="Email"
					rules={[
						{ required: true, message: 'Please enter email' },
						{ type: 'email', message: 'Invalid email' }
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="name"
					label="Name"
					rules={[
						{ required: true, message: 'Please enter name' },
						{ min: 2, message: 'Name must be at least 2 characters' }
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="roleName"
					label="Role"
					rules={[{ required: true, message: 'Please select role' }]}
				>
					<Select>
						<Select.Option value={EUserRole.tourist}>Tourist</Select.Option>
						<Select.Option value={EUserRole.supplier}>Supplier</Select.Option>
						<Select.Option value={EUserRole.admin}>Admin</Select.Option>
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

const EditUserModal: React.FC<EditUserModalProps> = ({
	open,
	onCancel,
	onSubmit,
	initialValues
}) => {
	const [form] = Form.useForm();

	// Reset form khi mở modal hoặc thay đổi initialValues
	useEffect(() => {
		if (open) {
			form.resetFields();
			form.setFieldsValue(initialValues);
		}
	}, [open, initialValues, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			onSubmit(values);
			form.resetFields(); // Reset form sau khi submit thành công
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<Modal
			title="Edit User"
			open={open}
			onOk={handleSubmit}
			onCancel={() => {
				onCancel();
				form.resetFields(); // Reset form khi đóng modal
			}}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={initialValues}
			>
				<Form.Item
					name="email"
					label="Email"
					rules={[
						{ required: true, message: 'Please enter email' },
						{ type: 'email', message: 'Invalid email' }
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="name"
					label="Full Name"
					rules={[
						{ required: true, message: 'Please enter full name' },
						{ min: 2, message: 'Name must be at least 2 characters' }
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="phoneNumber"
					label="Phone Number"
					rules={[
						{
							pattern: /^(0[1-9][0-9]{8})$/,
							message: 'Invalid phone number'
						}
					]}
				>
					<Input placeholder="Enter phone number (optional)" />
				</Form.Item>
				<Form.Item
					name="address"
					label="Address"
				>
					<Input placeholder="Enter address (optional)" />
				</Form.Item>
				<Form.Item
					name="dateOfBirth"
					label="Date of Birth"
				>
					<DatePicker
						style={{ width: '100%' }}
						placeholder="Select date of birth (optional)"
					/>
				</Form.Item>
				<Form.Item
					name="gender"
					label="Gender"
				>
					<Select placeholder="Select gender (optional)">
						<Select.Option value="male">Male</Select.Option>
						<Select.Option value="female">Female</Select.Option>
						<Select.Option value="other">Other</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item
					name="roleName"
					label="Vai Trò"
				>
					<Select placeholder="Select role (optional)">
						<Select.Option value={EUserRole.tourist}>Tourist</Select.Option>
						<Select.Option value={EUserRole.supplier}>Supplier</Select.Option>
						<Select.Option value={EUserRole.admin}>Admin</Select.Option>
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};
