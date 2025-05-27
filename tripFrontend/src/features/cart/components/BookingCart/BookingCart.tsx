import React, { useMemo, useCallback } from 'react';
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
	Tooltip,
	Empty
} from 'antd';
import { ChevronLeft, Trash2, MapPin, Minus, Plus, ShoppingCart, X } from 'lucide-react';
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

	const renderEmptyCart = () => (
		<Empty 
			image={<ShoppingCart size={100} className="text-gray-300" />}
			description={
				<Text className="text-lg text-gray-500">
					Giỏ hàng của bạn đang trống
				</Text>
			}
		>
			<Button 
				type="primary" 
				href="/attractions" 
				className="bg-orange-500 hover:bg-orange-600 transition-colors"
			>
				Khám phá các điểm tham quan
			</Button>
		</Empty>
	);

	const renderCartItem = (item: TBookingItem) => (
		<List.Item 
			key={item.id} 
			className="p-4 border-b hover:bg-gray-50 transition-colors group"
		>
			<Row gutter={16} align="middle" className="w-full">
				<Col xs={2} md={1}>
					<Checkbox
						checked={item.selected}
						onChange={() => toggleSelection(item.id)}
					/>
				</Col>
				<Col xs={6} md={3}>
					<Avatar
						shape="square"
						size={{ xs: 60, md: 80 }}
						src={item.image}
						className="rounded-lg shadow-sm transform group-hover:scale-105 transition-transform"
					/>
				</Col>
				<Col xs={16} md={8}>
					<div>
						<Text strong className="text-base block mb-1">
							{item.name}
						</Text>
						<div className="flex items-center text-gray-500">
							<MapPin size={14} className="mr-2 text-orange-500" />
							<Text type="secondary" ellipsis>
								{item.location}
							</Text>
						</div>
					</div>
				</Col>
				<Col xs={8} md={4}>
					<Text className="text-gray-600">{item.startTime}</Text>
				</Col>
				<Col xs={8} md={4}>
					<Text type="danger" strong>
						{item.price.toLocaleString()} VND
					</Text>
				</Col>
				<Col xs={8} md={4} className="text-right">
					<Tooltip title="Xóa mục">
						<Button 
							type="text" 
							danger 
							icon={<Trash2 size={16} />} 
							onClick={() => removeItem(item.id)}
							className="opacity-0 group-hover:opacity-100 transition-opacity"
						/>
					</Tooltip>
				</Col>
			</Row>
		</List.Item>
	);

	const CartSummary = () => (
		<Card 
			className="shadow-lg rounded-xl" 
			bordered={false}
		>
			<Space direction="vertical" size="middle" className="w-full">
				<div className="flex justify-between items-center">
					<Text strong>Tổng phụ:</Text>
					<Text strong className="text-gray-700">
						{subtotal.toLocaleString()} VND
					</Text>
				</div>

				<div className="flex justify-between items-center">
					<Text>Số lượng:</Text>
					<Space>
						<Button 
							onClick={decreaseQuantity} 
							size="small" 
							icon={<Minus size={14} />} 
							className="rounded-full"
						/>
						<Text strong>{quantity}</Text>
						<Button 
							onClick={increaseQuantity} 
							size="small" 
							icon={<Plus size={14} />} 
							className="rounded-full"
						/>
					</Space>
				</div>

				<Divider className="my-3" />

				<div className="flex justify-between items-center">
					<Text strong className="text-lg">Tổng cộng:</Text>
					<Text 
						type="danger" 
						strong 
						className="text-xl"
					>
						{total.toLocaleString()} VND
					</Text>
				</div>

				<Button
					type="primary"
					block
					size="large"
					disabled={selectedItems.length === 0}
					onClick={handlerCheckout}
					className="bg-orange-500 hover:bg-orange-600 transition-colors"
				>
					Thanh Toán ({selectedItems.length})
				</Button>

				{selectedItems.length === 0 && (
					<Text 
						type="secondary" 
						className="text-center block text-xs"
					>
						Vui lòng chọn sản phẩm để thanh toán
					</Text>
				)}
			</Space>
		</Card>
	);

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#f97316',
					borderRadius: 12,
				},
			}}
		>
			{!isBillCheck && (
				<Layout className="min-h-screen bg-gray-50">
					<Content className="p-4 md:p-8">
						<div className="max-w-6xl mx-auto">
							<Title 
								level={2} 
								className="mb-6 text-orange-500 flex items-center"
							>
								<ShoppingCart size={36} className="mr-3 text-orange-500" />
								Giỏ Hàng Của Tôi
							</Title>

							<Row gutter={[24, 16]}>
								<Col xs={24} md={16}>
									<Card 
										bordered={false} 
										className="shadow-md rounded-xl"
									>
										{bookingItems.length === 0 ? (
											renderEmptyCart()
										) : (
											<>
												<div className="flex justify-between items-center mb-4">
													<Checkbox
														checked={bookingItems.every((item) => item.selected)}
														onChange={toggleSelectAll}
													>
														Chọn tất cả
													</Checkbox>
													<Button 
														type="text" 
														danger 
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
														className="hover:bg-red-50"
													>
														Xóa tất cả
													</Button>
												</div>
												<List
													dataSource={bookingItems}
													renderItem={renderCartItem}
												/>
											</>
										)}
									</Card>
								</Col>

								<Col xs={24} md={8}>
									<CartSummary />
								</Col>
							</Row>
						</div>
					</Content>
				</Layout>
			)}

			{isBillCheck && (
				<div className="relative">
					<Button
						type="text"
						onClick={handleBackToCart}
						className="absolute top-4 left-4 z-50 flex items-center"
						icon={<ChevronLeft />}
					>
						Quay lại giỏ hàng
					</Button>
					<PaymentCheckout bookingItems={selectedItems} />
				</div>
			)}
		</ConfigProvider>
	);
};
