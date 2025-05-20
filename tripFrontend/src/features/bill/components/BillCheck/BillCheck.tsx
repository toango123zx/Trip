'use client';

import {
	Layout,
	Typography,
	Button,
	Checkbox,
	Divider,
	Input,
	Card,
	Row,
	Col,
	Radio,
	Form,
	ConfigProvider,
} from 'antd';
import { MapPin, Minus, Plus, CreditCard, Building, ChevronRight } from 'lucide-react';
import { JSX, useState } from 'react';
import { useDispatch } from 'react-redux';

import { TReduxStoreDispatch } from '@/store';

import { billThunk } from '../../billThunk';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Group: RadioGroup } = Radio;

type TBookingItem = {
	id: string;
	scheduleId: string;
	name: string;
	location: string;
	image: string;
	startTime: string;
	endTime: string;
	price: number;
	selected: boolean;
};

type BookingItemProps = {
	bookingItems?: TBookingItem[]; // Thêm dấu ? để cho phép null/undefined
};

// Thay đổi từ export function thành export const và thêm JSX.Element
export const PaymentCheckout = ({ bookingItems = [] }: BookingItemProps): JSX.Element => {
	const [quantity, setQuantity] = useState(2);
	const [paymentMethod, setPaymentMethod] = useState('card');
	const [saveCardDetails, setSaveCardDetails] = useState(false);
	const dispatch = useDispatch<TReduxStoreDispatch>();

	const increaseQuantity = (): void => {
		setQuantity((prev) => prev + 1);
	};
	const decreaseQuantity = (): void => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	// Thêm default value [] để tránh lỗi undefined.reduce
	const subtotal = bookingItems.reduce((sum, item) => sum + item.price, 0) * quantity;
	const discount = 0;
	const total = subtotal - discount;

	const isMobile = (): boolean => {
		if (typeof window !== 'undefined') {
			return window.innerWidth < 768;
		}
		return false;
	};

	const onCreateBill = (): void => {
		dispatch(
			billThunk.createBill({
				scheduleIds: bookingItems.map((item) => item.scheduleId),
				quantity,
				totalPrice: total,
			}),
		);
	};

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
				<Content className="bg-white md:bg-gray-50 pt-4 md:py-6 px-4 md:px-8">
					<div className="max-w-6xl mx-auto">
						<Row gutter={24}>
							{/* Payment Form */}
							<Col xs={24} md={12} className="md:pr-6">
								{/* Mobile Booking Items - Only visible on mobile */}
								<div className="md:hidden mb-6">
									{bookingItems.map((item) => (
										<div key={item.id} className="mb-6">
											<div className="flex">
												<div className="flex-shrink-0 mr-3">
													<img
														src={
															item.image ||
															'/placeholder.svg'
														}
														alt={item.name}
														className="w-16 h-16 object-cover rounded-md"
													/>
												</div>
												<div className="flex-grow">
													<div className="flex justify-between items-start">
														<Title
															level={5}
															style={{ margin: 0 }}
														>
															{item.name}
														</Title>
														<Text type="danger" strong>
															{item.price.toLocaleString()}{' '}
															VND
														</Text>
													</div>
													<div className="flex items-center text-gray-500 text-xs mt-1">
														<MapPin
															size={12}
															className="mr-1"
														/>
														<Text
															type="secondary"
															style={{ fontSize: '12px' }}
														>
															{item.location}
														</Text>
													</div>
												</div>
											</div>
											<div className="mt-2 text-xs text-gray-600 flex">
												<Text
													type="secondary"
													style={{
														fontSize: '12px',
														margin: '0 8px',
													}}
												>
													To
												</Text>
												<Text
													type="secondary"
													style={{ fontSize: '12px' }}
												>
													{item.startTime}, {item.endTime}
												</Text>
											</div>
										</div>
									))}

									<div className="flex items-center mb-4">
										<Text style={{ marginRight: '16px' }}>
											Quantity:
										</Text>
										<div className="flex items-center">
											<Button
												type="default"
												onClick={decreaseQuantity}
												size="small"
												style={{
													width: '28px',
													height: '28px',
													padding: 0,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<Minus size={14} />
											</Button>
											<Text style={{ margin: '0 12px' }}>
												{quantity}
											</Text>
											<Button
												type="default"
												onClick={increaseQuantity}
												size="small"
												style={{
													width: '28px',
													height: '28px',
													padding: 0,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<Plus size={14} />
											</Button>
										</div>
									</div>
								</div>

								{/* Voucher - Mobile Only */}
								<div className="md:hidden mb-4">
									<Divider style={{ margin: '16px 0' }} />
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<div className="w-4 h-4 bg-orange-100 border border-orange-300 mr-2 flex items-center justify-center">
												<div className="w-2 h-2 bg-orange-500"></div>
											</div>
											<Text>Voucher</Text>
										</div>
										<Button
											type="link"
											size="small"
											style={{ padding: '0', fontSize: '12px' }}
										>
											Select/enter code <ChevronRight size={12} />
										</Button>
									</div>
									<Divider style={{ margin: '16px 0' }} />
								</div>

								{/* Payment Method */}
								<div>
									<Title
										level={isMobile() ? 5 : 4}
										style={{ marginTop: 0 }}
									>
										Pay With:
									</Title>
									<RadioGroup
										value={paymentMethod}
										onChange={(e) => setPaymentMethod(e.target.value)}
										className="flex mb-6"
									>
										<Radio value="card" className="flex items-center">
											<div className="flex items-center">
												<CreditCard size={16} className="mr-2" />
												<span>Card</span>
											</div>
										</Radio>
										<Radio
											value="bank"
											className="flex items-center ml-8"
										>
											<div className="flex items-center">
												<Building size={16} className="mr-2" />
												<span>Bank</span>
											</div>
										</Radio>
									</RadioGroup>

									{/* Card Details Form */}
									{paymentMethod === 'card' && (
										<Form layout="vertical">
											<Form.Item
												label="Card Number"
												className="mb-4"
											>
												<Input
													placeholder="1234 5678 9101 1121"
													size={isMobile() ? 'middle' : 'large'}
												/>
											</Form.Item>
											<div className="flex space-x-4">
												<Form.Item
													label="Expiration Date"
													className="flex-1 mb-4"
												>
													<Input
														placeholder="MM/YY"
														size={
															isMobile()
																? 'middle'
																: 'large'
														}
													/>
												</Form.Item>
												<Form.Item
													label="CVV"
													className="flex-1 mb-4"
												>
													<Input
														placeholder="123"
														size={
															isMobile()
																? 'middle'
																: 'large'
														}
													/>
												</Form.Item>
											</div>
											<Form.Item className="mb-6">
												<Checkbox
													checked={saveCardDetails}
													onChange={(e) =>
														setSaveCardDetails(
															e.target.checked,
														)
													}
												>
													<Text type="secondary">
														Save card details
													</Text>
												</Checkbox>
											</Form.Item>
										</Form>
									)}

									{/* Bank Transfer Details - Hidden by default */}
									{paymentMethod === 'bank' && (
										<div className="bg-gray-50 p-4 rounded-md mb-6">
											<Title level={5} style={{ marginTop: 0 }}>
												Bank Transfer Instructions
											</Title>
											<Text>
												Please transfer the amount to the
												following bank account:
											</Text>
											<div className="mt-2">
												<Text strong>Bank: </Text>
												<Text>VietcomBank</Text>
											</div>
											<div>
												<Text strong>Account Number: </Text>
												<Text>1234567890</Text>
											</div>
											<div>
												<Text strong>Account Name: </Text>
												<Text>TRAVALID JSC</Text>
											</div>
											<div className="mt-2">
												<Text type="secondary">
													Please include your booking reference
													in the transfer description.
												</Text>
											</div>
										</div>
									)}

									{/* Desktop Payment Button */}
									<div className="hidden md:block">
										<Button
											onClick={onCreateBill}
											type="primary"
											size="large"
											block
											style={{ height: '48px' }}
										>
											Pay {total.toLocaleString()} VND
										</Button>
										<Text
											type="secondary"
											className="text-xs mt-3 block"
										>
											Your personal data will be used to process
											your order, support your experience throughout
											this website, and for other purposes described
											in our privacy policy.
										</Text>
									</div>
								</div>
							</Col>

							{/* Order Summary - Only visible on desktop */}
							<Col xs={24} md={12} className="hidden md:block">
								<Card title="Order Summary" bordered={false}>
									<div className="space-y-6">
										{bookingItems.map((item) => (
											<div key={item.id} className="flex">
												<div className="flex-shrink-0 mr-4">
													<img
														src={
															item.image ||
															'/placeholder.svg'
														}
														alt={item.name}
														className="w-20 h-20 object-cover rounded-md"
													/>
												</div>
												<div className="flex-grow">
													<div className="flex justify-between items-start">
														<div>
															<Title
																level={5}
																style={{ margin: 0 }}
															>
																{item.name}
															</Title>
															<div className="flex items-center text-gray-500 text-sm mt-1">
																<MapPin
																	size={14}
																	className="mr-1"
																/>
																<Text type="secondary">
																	{item.location}
																</Text>
															</div>
															<div className="mt-2">
																<Text className="mx-2">
																	to
																</Text>
																<Text>
																	{item.startTime},{' '}
																	{item.endTime}
																</Text>
															</div>
														</div>
														<Text type="danger" strong>
															{item.price.toLocaleString()}{' '}
															VND
														</Text>
													</div>
												</div>
											</div>
										))}

										<div className="flex items-center">
											<Text style={{ marginRight: '16px' }}>
												Quantity:
											</Text>
											<div className="flex items-center">
												<Button
													type="default"
													onClick={decreaseQuantity}
													size="small"
													style={{
														width: '28px',
														height: '28px',
														padding: 0,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<Minus size={14} />
												</Button>
												<Text style={{ margin: '0 12px' }}>
													{quantity}
												</Text>
												<Button
													type="default"
													onClick={increaseQuantity}
													size="small"
													style={{
														width: '28px',
														height: '28px',
														padding: 0,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<Plus size={14} />
												</Button>
											</div>
										</div>

										<Divider style={{ margin: '16px 0' }} />

										<div className="flex items-center justify-between">
											<div className="flex items-center">
												<div className="w-4 h-4 bg-orange-100 border border-orange-300 mr-2 flex items-center justify-center">
													<div className="w-2 h-2 bg-orange-500"></div>
												</div>
												<Text>Voucher</Text>
											</div>
											<Button type="link" size="small">
												Select/enter code
											</Button>
										</div>

										<Divider style={{ margin: '16px 0' }} />

										<div className="space-y-2">
											<div className="flex justify-between">
												<Text>Discount</Text>
												<Text>
													-{discount.toLocaleString()} VND
												</Text>
											</div>
											<div className="flex justify-between">
												<Text>Subtotal</Text>
												<Text>
													{subtotal.toLocaleString()} VND
												</Text>
											</div>
										</div>

										<Divider style={{ margin: '16px 0' }} />

										<div className="flex justify-between items-center">
											<Text strong>Total</Text>
											<Text
												type="danger"
												strong
												style={{ fontSize: '24px' }}
											>
												{total.toLocaleString()} VND
											</Text>
										</div>
									</div>
								</Card>
							</Col>
						</Row>

						{/* Mobile Summary and Checkout Button */}
						<div className="md:hidden mt-6">
							<Divider style={{ margin: '16px 0' }} />
							<div className="space-y-2 mb-4">
								<div className="flex justify-between">
									<Text>Discount</Text>
									<Text type="danger">
										-{discount.toLocaleString()} VND
									</Text>
								</div>
								<div className="flex justify-between">
									<Text>Subtotal</Text>
									<Text type="danger">
										{subtotal.toLocaleString()} VND
									</Text>
								</div>
							</div>
							<div className="flex justify-between items-center mb-4">
								<Text strong>Total amount</Text>
								<Text type="danger" strong style={{ fontSize: '18px' }}>
									{total.toLocaleString()} VND
								</Text>
							</div>
							<Button
								type="primary"
								block
								size="large"
								style={{ height: '48px' }}
							>
								Checkout
							</Button>
							<div className="flex justify-center mt-6">
								<div className="w-10 h-1 bg-gray-300 rounded-full"></div>
							</div>
						</div>
					</div>
				</Content>
			</Layout>
		</ConfigProvider>
	);
};
