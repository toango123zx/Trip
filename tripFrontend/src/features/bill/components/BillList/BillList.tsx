'use client';

import {
	Layout,
	Typography,
	Button,
	Select,
	Space,
	Table,
	Tag,
	Input,
	List,
	Card,
	ConfigProvider,
} from 'antd';
import { ChevronRight, Search } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EBillStatus, TBillSumary } from '@/types/bill.type';

import { billThunk } from '../../billThunk';
import { BillDetail } from '../BillDetail/BillDetail';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

type TOrder = {
	id: string;
	status: 'DONE' | 'CANCELED' | 'WAITING' | 'PENDING';
	date: string;
	quantity: string;
};

type TBillInTable = {
	id: string;
	userId: string;
	transactionTargetId: string;
	reductionPrice: number;
	totalPrice: number;
	createAt: Date;
	updateAt: Date;
	deletedAt?: Date | null;
	status: EBillStatus;
};

export const BillList = (): JSX.Element => {
	const [filter, setFilter] = useState('all');
	// const [currentPage, setCurrentPage] = useState(1);
	const [billDetailVisible, setBillDetailVisible] = useState(false);
	const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const bills: TBillSumary[] = useSelector<TReduxStoreState, TBillSumary[]>(
		(state) => state.bill.bills,
	);
	const [tableData, setTableDate] = useState<TBillInTable[]>([]);
	const LIMIT_BILL_HISTORY_CALL_API = 100;

	useEffect(() => {
		dispatch(
			billThunk.getBillByUserId({
				page: 1,
				limit: LIMIT_BILL_HISTORY_CALL_API,
			}),
		);
	}, [dispatch]);

	useEffect(() => {
		setTableDate(
			bills.map((bill) => ({
				id: bill.id,
				userId: bill.userId,
				transactionTargetId: bill.transactionTargetId,
				reductionPrice: bill.reductionPrice,
				totalPrice: bill.totalPrice,
				createAt: new Date(bill.createAt),
				updateAt: new Date(bill.updateAt),
				deletedAt: bill.deletedAt ? new Date(bill.deletedAt) : null,
				status: bill.status as EBillStatus, // Ensure status is of type EBillStatus
			})),
		);
	}, [bills]);

	const handleViewDetail = (billId: string): void => {
		console.log(`🚀 ~ BillList.tsx:76 ~ handleViewDetail ~ billId:`, billId)
		setSelectedBillId(billId);
		setBillDetailVisible(true);
	};

	const handleCloseBillDetail = (): void => {
		// dispatch(
		// 	billThunk.getBillByUserId({
		// 		page: 1,
		// 		limit: LIMIT_BILL_HISTORY_CALL_API,
		// 	}),
		// );
		setBillDetailVisible(false);
		setSelectedBillId(null);
	};

	// Sample data for orders
	// const orders: Order[] = [
	//   { id: "#96459761", status: "DONE", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	//   { id: "#96459761", status: "DONE", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	//   { id: "#96459761", status: "CANCELED", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	//   { id: "#96459761", status: "DONE", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	//   { id: "#96459761", status: "WAITING", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	//   { id: "#96459761", status: "PENDING", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	//   { id: "#96459761", status: "DONE", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	//   { id: "#96459761", status: "CANCELED", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	// ]
	const orders: TOrder[] = [];

	// Sample data for desktop table
	// const tableData = [
	//   { key: "1", id: "#96459761", status: "CANCELED", date: "Dec 30, 2019 07:52", quantity: "2 People" },
	//   { key: "2", id: "#71667167", status: "PENDING", date: "Dec 7, 2019 23:26", quantity: "1 Person" },
	//   { key: "3", id: "#95214362", status: "PENDING", date: "Dec 7, 2019 23:26", quantity: "1 Person" },
	//   { key: "4", id: "#71667167", status: "WAITING", date: "Feb 2, 2019 19:28", quantity: "1 Person" },
	//   { key: "5", id: "#51746385", status: "CANCELED", date: "Dec 30, 2019 07:52", quantity: "5 People" },
	//   { key: "6", id: "#51746385", status: "DONE", date: "Dec 4, 2019 21:42", quantity: "5 People" },
	//   { key: "7", id: "#673971743", status: "PENDING", date: "Feb 2, 2019 19:28", quantity: "5 People" },
	//   { key: "8", id: "#673971743", status: "CANCELED", date: "Mar 20, 2019 23:14", quantity: "5 People" },
	//   { key: "9", id: "#673971743", status: "CANCELED", date: "Dec 4, 2019 21:42", quantity: "5 People" },
	//   { key: "10", id: "#673971743", status: "WAITING", date: "Dec 30, 2019 07:52", quantity: "5 People" },
	//   { key: "11", id: "#673971743", status: "DONE", date: "Dec 30, 2019 05:18", quantity: "5 People" },
	//   { key: "12", id: "#673971743", status: "CANCELED", date: "Dec 30, 2019 07:52", quantity: "5 People" },
	// ]

	const getStatusColor = (status: string): string => {
		switch (status) {
			case 'DONE':
				return 'green';
			case 'CANCELED':
				return 'red';
			case 'WAITING':
				return 'blue';
			case 'PENDING':
				return 'orange';
			default:
				return 'default';
		}
	};

	const getStatusTag = (status: string): JSX.Element => {
		return <Tag color={getStatusColor(status)}>{status}</Tag>;
	};

	const columns = [
		{
			title: 'ORDER ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'STATUS',
			dataIndex: 'status',
			key: 'status',
			render: (status: string): JSX.Element => {
				return (
					<span className={`px-2 py-1 rounded-full text-xs font-medium border-1 shadow-2xl ${status === EBillStatus.paid ? 'bg-green-100 text-green-800' :
						status === EBillStatus.pending ? 'bg-yellow-100 text-yellow-800' :
							status === EBillStatus.refunded ? 'bg-blue-100 text-blue-800' :
								status === EBillStatus.cancel ? 'bg-red-100 text-red-800' :
									'bg-gray-100 text-gray-800'
						}`}>
						{status}
					</span>
				)
			},
		},
		{
			title: 'Order Date',
			dataIndex: 'createAt',
			key: 'createAt',
			render: (value: Date): string => String(value.toLocaleString()),
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			render: (_: any, record: TBillInTable): JSX.Element => (
				<span>{(record.totalPrice - record.reductionPrice).toLocaleString('vi-VN')} VND</span>
			),
		},
		{
			title: 'ACTION',
			key: 'action',
			render: (_: any, record: TBillInTable): JSX.Element => (
				<Button
					type="link"
					className="text-blue-500 flex items-center"
					style={{ padding: 0 }}
					onClick={() => handleViewDetail(record.id)}
				>
					<span>View Details</span>
					<ChevronRight size={16} className="ml-1" />
				</Button>
			),
		},
	];

	// const isMobile = (): void => {
	// 	if (typeof window !== 'undefined') {
	// 		return window.innerWidth < 768;
	// 	}
	// 	return false;
	// };

	const filteredOrders =
		filter === 'all'
			? orders
			: orders.filter(
				(order) => order.status.toLowerCase() === filter.toLowerCase(),
			);

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#f97316',
					borderRadius: 8,
				},
			}}
		>
			<Layout className="min-h-screen">
				<Layout>
					<Content className="bg-gray-50 p-4 md:p-6">
						<div className="max-w-6xl mx-auto">
							{/* Mobile Filter Dropdown - Only visible on mobile */}
							<div className="md:hidden mb-4">
								<Select
									defaultValue="all"
									style={{ width: '100%' }}
									onChange={(value) => setFilter(value)}
									size="large"
									className="rounded-full"
								>
									<Option value="all">All</Option>
									<Option value="done">Done</Option>
									<Option value="waiting">Waiting</Option>
									<Option value="pending">Pending</Option>
									<Option value="canceled">Canceled</Option>
								</Select>
							</div>

							{/* Mobile Order List - Only visible on mobile */}
							<div className="md:hidden">
								<List
									dataSource={filteredOrders}
									renderItem={(order) => (
										<List.Item className="p-0 mb-4">
											<Card
												className="w-full rounded-xl shadow-sm"
												bodyStyle={{
													padding: '16px',
													background: '#f9f9f9',
												}}
											>
												<div className="flex justify-between items-start mb-1">
													<Text strong>{order.id}</Text>
													<Text
														style={{
															color:
																order.status === 'DONE'
																	? '#52c41a'
																	: order.status ===
																		'CANCELED'
																		? '#f5222d'
																		: order.status ===
																			'WAITING'
																			? '#1890ff'
																			: '#fa8c16',
														}}
													>
														{order.status}
													</Text>
												</div>
												<div className="mb-1">
													<Text>{order.quantity}</Text>
												</div>
												<div className="flex justify-between items-center">
													<Text type="secondary">
														{order.date}
													</Text>
													<Button
														type="link"
														className="text-blue-500 flex items-center p-0"
														style={{ padding: 0 }}
														onClick={() => handleViewDetail(order.id)}
													>
														<span>View Details</span>
														<ChevronRight
															size={16}
															className="ml-1"
														/>
													</Button>
												</div>
											</Card>
										</List.Item>
									)}
								/>

								<div className="flex justify-center mt-6">
									<Button
										type="primary"
										size="large"
										className="rounded-full px-8"
										style={{
											background: '#f97316',
											borderColor: '#f97316',
										}}
									>
										<div className="flex items-center">
											<span className="mr-1">More</span>
											<ChevronRight size={16} />
										</div>
									</Button>
								</div>

								<div className="flex justify-center mt-6">
									<div className="w-10 h-1 bg-gray-300 rounded-full"></div>
								</div>
							</div>

							{/* Desktop Order Table - Only visible on desktop */}
							<div className="hidden md:block">
								<Card className="mb-4">
									<div className="flex justify-between items-center mb-4">
										<Title level={5} style={{ margin: 0 }}>
											ORDER HISTORY
										</Title>
										<Space>
											<Input
												placeholder="Search"
												prefix={
													<Search
														size={16}
														className="text-gray-400"
													/>
												}
												style={{ width: 200 }}
											/>
											<Select
												defaultValue="latest"
												style={{ width: 120 }}
											>
												<Option value="latest">Latest</Option>
												<Option value="oldest">Oldest</Option>
											</Select>
										</Space>
									</div>

									<Table
										columns={columns}
										dataSource={tableData}
										pagination={false}
										rowKey={(record) => record.id}
										rowClassName={(record, index) =>
											index % 2 === 0 ? 'bg-orange-50' : ''
										}
										className="order-history-table"
									/>
									{/* 
                  <div className="flex justify-center mt-4">
                    <Pagination
                      current={currentPage}
                      onChange={(page) => setCurrentPage(page)}
                      total={60}
                      pageSize={10}
                      showSizeChanger={false}
                    />
                  </div> */}
								</Card>
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
			<BillDetail
				visible={billDetailVisible}
				onClose={handleCloseBillDetail}
				billId={selectedBillId}
			/>
		</ConfigProvider>
	);
};
