import {
	Layout,
	Typography,
	Button,
	Checkbox,
	Divider,
	Space,
	Card,
	List,
	Row,
	Col,
	Avatar,
	ConfigProvider,
	message,
} from 'antd';
import { ChevronLeft, Trash2, MapPin, Minus, Plus, ShoppingCart } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PaymentCheckout } from '@/features/bill/components/BillCheck/BillCheck';
import { cartThunk } from '@/features/cart/cartThunk';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TCartSummary } from '@/types';

const { Content } = Layout;
const { Title, Text } = Typography;

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

export const BookingCart = (): JSX.Element => {
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const carts: TCartSummary[] = useSelector<TReduxStoreState, TCartSummary[]>(
		(state) => state.cart.carts,
	);

	useEffect(() => {
		dispatch(cartThunk.getCarts());
	}, [dispatch]);

	const [bookingItems, setBookingItems] = useState<TBookingItem[]>([]);
	useEffect(() => {
		setBookingItems(
			carts.map((cart) => ({
				id: cart.id,
				scheduleId: cart.scheduleId,
				name: cart.product.name,
				location: cart.product.locationName,
				image: cart.product.posterImageUrl,
				startTime: new Date(cart.startTime).toLocaleString(),
				endTime: new Date(cart.endTime).toLocaleString(),
				price: cart.price,
				selected: false,
			})),
		);
	}, [carts]);

	const [quantity, setQuantity] = useState(1);
	// const [showVoucherInput, setShowVoucherInput] = useState(false);

	const toggleSelection = (id: string): void => {
		setBookingItems((items) =>
			items.map((item) =>
				item.id === id ? { ...item, selected: !item.selected } : item,
			),
		);
	};

	const toggleSelectAll = (): void => {
		const allSelected = bookingItems.every((item) => item.selected);
		setBookingItems((items) =>
			items.map((item) => ({ ...item, selected: !allSelected })),
		);
	};

	const removeItem = (id: string): void => {
		dispatch(cartThunk.deleteCartByCartId(id));
		setBookingItems((items) => items.filter((item) => item.id !== id));
	};

	const increaseQuantity = (): void => setQuantity((q) => q + 1);
	const decreaseQuantity = (): void => setQuantity((q) => Math.max(1, q - 1));

	// --- CHỈ TÍNH TRÊN NHỮNG ITEM ĐÃ SELECT ---
	const selectedItems = bookingItems.filter((item) => item.selected);
	const subtotal = selectedItems.reduce((sum, item) => sum + item.price * quantity, 0);
	const discount = 0;
	const total = selectedItems.length > 0 ? subtotal - discount : 0;
	// ------------------------------------------

	const isMobile = (): boolean =>
		typeof window !== 'undefined' && window.innerWidth < 768;

	// const IconButton = ({ icon, onClick, ...props }: any): JSX.Element => (
	//     <Button type="text" onClick={onClick} icon={icon} {...props} />
	// );

	const [isBillCheck, setBillCheck] = useState(false);

	const handlerCheckout = (): void => {
		if (selectedItems.length === 0) {
			message.error('Please select at least one item to checkout');
			return;
		}
		setBillCheck(true);
	};

	const handleBackToCart = (): void => {
		setBillCheck(false);
	};

	// const removeSelectedItems = (): void => {
	// 	// Xóa tất cả các item đã chọn
	// 	selectedItems.forEach((item) => {
	// 		dispatch(cartThunk.deleteCartByCartId(item.id));
	// 	});
	// 	setBookingItems((prevItems) => prevItems.filter((item) => !item.selected));
	// };

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#f97316',
					borderRadius: 8,
				},
			}}
		>
			{!isBillCheck && (
				<Layout className="min-h-screen">
					{/* Mobile Header */}
					<div className="md:hidden bg-white pt-5 px-4 flex justify-between items-center">
						<a
							href="/"
							className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-500 no-underline"
						>
							<ChevronLeft size={18} />
						</a>
						<Title level={4} style={{ margin: 0, color: '#f97316' }}>
							My Booking Cart
						</Title>
						<div className="w-8" />
					</div>

					<Content className="bg-white md:bg-gray-50 pt-4 md:py-6 px-4 md:px-8">
						<div className="max-w-6xl mx-auto">
							{/* Desktop Cart Header */}
							<div className="hidden md:flex items-center mb-10">
								<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
									<ShoppingCart size={32} />
								</div>
								<Title
									level={2}
									style={{ margin: '0 0 0 24px', color: '#f97316' }}
								>
									My Booking Cart
								</Title>
							</div>

							<Row gutter={24}>
								<Col xs={24} md={16}>
									{/* Desktop Table Header */}
									<div className="hidden md:flex bg-white p-4 rounded-t-lg border-b">
										<div style={{ width: '5%' }}>
											<Checkbox
												onChange={toggleSelectAll}
												checked={
													bookingItems.length > 0 &&
													bookingItems.every(
														(item) => item.selected,
													)
												}
											/>
										</div>
										<div style={{ width: '40%' }}>
											<Text strong>Product</Text>
										</div>
										<div style={{ width: '15%' }}>
											<Text strong>Start</Text>
										</div>
										<div style={{ width: '15%' }}>
											<Text strong>End</Text>
										</div>
										<div style={{ width: '15%' }}>
											<Text strong>Price</Text>
										</div>
										<div
											style={{ width: '10%', textAlign: 'center' }}
										>
											<Text strong>Action</Text>
										</div>
									</div>

									{bookingItems.length === 0 ? (
										<div className="text-center py-10">
											<ShoppingCart
												size={50}
												className="mx-auto mb-4 text-gray-300"
											/>
											<Text className="text-lg text-gray-500">
												Your cart is empty
											</Text>
											<div className="mt-4">
												<Button
													type="primary"
													href="/attractions"
												>
													Browse Attractions
												</Button>
											</div>
										</div>
									) : (
										<List
											dataSource={bookingItems}
											renderItem={(item) => (
												<List.Item
													key={item.id}
													className="p-0 border-b"
													style={{
														padding: isMobile()
															? '12px 0'
															: '16px 0',
													}}
												>
													{/* Mobile Layout */}
													<div className="md:hidden w-full">
														<div className="flex">
															<Checkbox
																checked={item.selected}
																onChange={() =>
																	toggleSelection(
																		item.id,
																	)
																}
																className="mr-3 mt-1"
															/>
															<Avatar
																shape="square"
																size={60}
																src={item.image}
																style={{
																	borderRadius: 6,
																	marginRight: 12,
																}}
															/>
															<div className="flex-grow">
																<div className="flex justify-between items-start">
																	<Text strong>
																		{item.name}
																	</Text>
																	<Button
																		type="text"
																		onClick={() =>
																			removeItem(
																				item.id,
																			)
																		}
																		style={{
																			padding: 0,
																			lineHeight: 1,
																		}}
																	>
																		✕
																	</Button>
																</div>
																<div className="flex items-center text-gray-500 text-xs mt-1">
																	<MapPin
																		size={12}
																		className="mr-1"
																	/>
																	<Text
																		type="secondary"
																		style={{
																			fontSize: 12,
																		}}
																	>
																		{item.location}
																	</Text>
																</div>
																<Text
																	type="danger"
																	strong
																	style={{
																		fontSize: 14,
																		marginTop: 4,
																	}}
																>
																	VND{' '}
																	{item.price.toLocaleString()}
																</Text>
															</div>
														</div>
													</div>

													{/* Desktop Layout */}
													<div className="hidden md:flex w-full items-center">
														<div style={{ width: '5%' }}>
															<Checkbox
																checked={item.selected}
																onChange={() =>
																	toggleSelection(
																		item.id,
																	)
																}
															/>
														</div>
														<div
															style={{ width: '40%' }}
															className="flex items-center"
														>
															<Avatar
																shape="square"
																size={70}
																src={item.image}
																style={{
																	borderRadius: 6,
																	marginRight: 12,
																}}
															/>
															<div>
																<Text strong>
																	{item.name}
																</Text>
																<div className="flex items-center text-gray-500 text-sm">
																	<MapPin
																		size={14}
																		className="mr-1"
																	/>
																	<Text
																		type="secondary"
																		style={{
																			fontSize: 14,
																		}}
																	>
																		{item.location}
																	</Text>
																</div>
															</div>
														</div>
														<div style={{ width: '15%' }}>
															<Text>{item.startTime}</Text>
														</div>
														<div style={{ width: '15%' }}>
															<Text>{item.endTime}</Text>
														</div>
														<div style={{ width: '15%' }}>
															<Text type="danger" strong>
																{item.price.toLocaleString()}{' '}
																VND
															</Text>
														</div>
														<div
															style={{
																width: '10%',
																textAlign: 'center',
															}}
														>
															<Button
																type="text"
																onClick={() =>
																	removeItem(item.id)
																}
																danger
															>
																<Trash2 size={16} />
															</Button>
														</div>
													</div>
												</List.Item>
											)}
										/>
									)}

									{bookingItems.length > 0 && (
										<div className="hidden md:block mt-4">
											<Button
												type="text"
												className="text-gray-500 hover:text-gray-700 p-0"
												onClick={() => {
													if (
														window.confirm(
															'Are you sure you want to delete all items?',
														)
													) {
														bookingItems.forEach((item) => {
															dispatch(
																cartThunk.deleteCartByCartId(
																	item.id,
																),
															);
														});
														setBookingItems([]);
													}
												}}
											>
												Delete all
											</Button>
										</div>
									)}
								</Col>

								<Col xs={24} md={8}>
									{/* Desktop Order Summary */}
									<div className="hidden md:block">
										<Card>
											<Space
												direction="vertical"
												style={{ width: '100%' }}
												size="middle"
											>
												<div className="flex justify-between">
													<Text>Subtotal:</Text>
													<Text strong>
														{subtotal.toLocaleString()} VND
													</Text>
												</div>

												<div className="flex justify-between">
													<Text>Discount:</Text>
													<Text type="danger">
														- {discount.toLocaleString()} VND
													</Text>
												</div>

												<div className="flex justify-between items-center">
													<Text>Quantity:</Text>
													<Space>
														<Button
															onClick={decreaseQuantity}
															size="small"
														>
															<Minus size={14} />
														</Button>
														<Text>{quantity}</Text>
														<Button
															onClick={increaseQuantity}
															size="small"
														>
															<Plus size={14} />
														</Button>
													</Space>
												</div>

												<div className="flex justify-between items-center">
													<Checkbox
														onChange={
															() => {}
															// setShowVoucherInput((v) => !v)
														}
													>
														<Text>Voucher</Text>
													</Checkbox>
													<Button type="link" size="small">
														Select/enter code
													</Button>
												</div>

												<Divider style={{ margin: '12px 0' }} />

												<div className="flex justify-between">
													<Text strong>Total amount:</Text>
													<Text
														type="danger"
														strong
														style={{ fontSize: 18 }}
													>
														{total.toLocaleString()} VND
													</Text>
												</div>

												<Button
													type="primary"
													onClick={handlerCheckout}
													block
													size="large"
													disabled={selectedItems.length === 0}
												>
													Check out
												</Button>

												{selectedItems.length === 0 && (
													<Text
														type="secondary"
														className="text-xs text-center block"
													>
														Please select items to checkout
													</Text>
												)}
											</Space>
										</Card>
									</div>

									{/* Mobile Checkout Button */}
									<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
										<div className="flex justify-between items-center mb-2">
											<Text strong>Total:</Text>
											<Text
												type="danger"
												strong
												style={{ fontSize: 16 }}
											>
												{total.toLocaleString()} VND
											</Text>
										</div>
										<Button
											type="primary"
											block
											onClick={handlerCheckout}
											disabled={selectedItems.length === 0}
										>
											Check out ({selectedItems.length})
										</Button>
									</div>
								</Col>
							</Row>
						</div>
					</Content>
				</Layout>
			)}

			{isBillCheck && (
				<div className="relative">
					<Button
						type="primary"
						onClick={handleBackToCart}
						className="absolute top-4 left-4 z-50"
						icon={<ChevronLeft />}
					>
						Back to Cart
					</Button>
					<PaymentCheckout bookingItems={selectedItems} />
				</div>
			)}
		</ConfigProvider>
	);
};
