import { notification } from 'antd';
import { JSX, useEffect, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { BiPackage, BiCalendar } from 'react-icons/bi';
import { MdDiscount } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import {
	AddDiscount,
	AddProduct,
	DiscountBoard,
	discountThunk,
	ProductsBoard,
	ProductUpdate,
	SchedulesBoard,
	UpdateDiscount,
	scheduleThunk,
} from '@/features';
import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EDiscountStatus, EProductStatus, TDiscountDetail } from '@/types';

import { productThunk } from '../../productThunk';

enum EactiveTab {
	product = 'product',
	schedule = 'schedule',
	discount = 'discount',
}

type ProductListProps = {
	className?: string;
};

export const ProductList = ({ className }: ProductListProps): JSX.Element => {
	const [activeTab, setActiveTab] = useState<EactiveTab>(EactiveTab.product);
	const [isOpenPopupAddProduct, setIsOpenPopupAddProduct] = useState(false);
	const [isOpenPopupAddDiscount, setIsOpenPopupAddDiscount] = useState(false);
	const [isOpenPopupViewDiscount, setIsOpenPopupViewDiscount] = useState(false);
	const [isOpenPopupProductUpdate, setIsOpenPopupProductUpdate] = useState(false);
	const [productId, setProductId] = useState<string>('');
	const [discountId, setDiscountId] = useState<string>('');
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [pageProduct, setPageProduct] = useState<number>(1);
	const [pageDiscount, setPageDiscount] = useState<number>(1);
	const [pageSchedule, setPageSchedule] = useState<number>(1);
	const PAGE_SIZE = 10;

	const discounts = useSelector((state: TReduxStoreState) => state.discount.discounts);
	const schedules = useSelector((state: TReduxStoreState) => state.schedule.schedules);
	const schedulePagination = useSelector((state: TReduxStoreState) => state.schedule.pagination);

	useEffect(() => {
		if (activeTab === EactiveTab.discount) {
			dispatch(
				discountThunk.getDiscountByUserId({
					query: {
						page: pageDiscount,
						statusSearch: EDiscountStatus.active,
					},
				}),
			);
		}
	}, [dispatch, activeTab, pageDiscount]);

	useEffect(() => {
		if (activeTab === EactiveTab.schedule) {
			dispatch(
				scheduleThunk.getSchedules({
					page: pageSchedule,
					limit: PAGE_SIZE,
				}),
			);
		}
	}, [dispatch, activeTab, pageSchedule]);

	const handleChangeTab = (tab: EactiveTab): void => {
		setActiveTab(tab);
	};

	const handleAddProductOnClick = (): void => {
		setIsOpenPopupAddProduct(true);
	};

	const handleProductUpdateOnClick = (
		productId: string,
		status: EProductStatus,
	): void => {
		setProductId(productId);
		if (status !== EProductStatus.inactive) {
			setIsOpenPopupProductUpdate(true);
		} else {
			notification.error({
				message: 'Error',
				description: 'Product is inactive, cannot be updated.',
				duration: 3,
			});
		}
	};

	const handleAddDiscountOnClick = (): void => {
		setIsOpenPopupAddDiscount(true);
	};

	const handleViewDiscountOnClick = (discount: TDiscountDetail): void => {
		setDiscountId(discount.id);
		setIsOpenPopupViewDiscount(true);
	};

	const handleClosePopup = (): void => {
		switch (activeTab) {
			case EactiveTab.product:
				dispatch(
					productThunk.getProducts({ page: pageProduct, limit: PAGE_SIZE }),
				);
				setIsOpenPopupAddProduct(false);
				setIsOpenPopupProductUpdate(false);
				break;
			case EactiveTab.discount:
				dispatch(
					discountThunk.getDiscountByUserId({
						query: {
							page: pageDiscount,
							statusSearch: EDiscountStatus.active,
						},
					}),
				);
				setIsOpenPopupAddDiscount(false);
				setIsOpenPopupViewDiscount(false);
				break;
		}
	};

	return (
		<section
			className={cn('relative w-full h-screen', className)}
			aria-label="Product Management"
		>
			<div className="container mx-auto bg-white rounded-lg p-3 sm:p-6 md:px-8 md:py-10 lg:px-10 lg:py-12 font-sans flex flex-col transition-all duration-300 h-full">
				{/* Main Content */}
				<main className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6 lg:gap-8 h-full">
					{/* Sidebar - Fixed */}
					<div className="flex flex-row md:flex-col flex-wrap justify-center md:justify-start gap-2 md:gap-4 md:w-1/4 lg:w-1/5 font-Montserrat md:sticky md:top-0 md:h-screen md:overflow-y-auto">
						<button
							className={`rounded-xl px-3 py-2 md:py-3.5 md:px-4 lg:px-6 text-center md:text-left font-medium transition-all duration-300 flex-1 md:flex-none md:w-full flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 ${
								activeTab === 'product'
									? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white md:transform md:translate-x-2'
									: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500'
							}`}
							onClick={() => handleChangeTab(EactiveTab.product)}
						>
							<BiPackage className="text-lg md:text-xl" />
							<span className="text-xs sm:text-sm md:text-base">Products</span>
						</button>
						<button
							className={`rounded-xl px-3 py-2 md:py-3.5 md:px-4 lg:px-6 text-center md:text-left font-medium transition-all duration-300 flex-1 md:flex-none md:w-full flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 ${
								activeTab === 'schedule'
									? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white md:transform md:translate-x-2'
									: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500'
							}`}
							onClick={() => handleChangeTab(EactiveTab.schedule)}
						>
							<BiCalendar className="text-lg md:text-xl" />
							<span className="text-xs sm:text-sm md:text-base">Schedules</span>
						</button>
						<button
							className={`rounded-xl px-3 py-2 md:py-3.5 md:px-4 lg:px-6 text-center md:text-left font-medium transition-all duration-300 flex-1 md:flex-none md:w-full flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 ${
								activeTab === 'discount'
									? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white md:transform md:translate-x-2'
									: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500'
							}`}
							onClick={() => handleChangeTab(EactiveTab.discount)}
						>
							<MdDiscount className="text-lg md:text-xl" />
							<span className="text-xs sm:text-sm md:text-base">Discounts</span>
						</button>
					</div>

					{/* Content Area */}
					<div className="flex-1 rounded-xl bg-white p-3 sm:p-4 md:p-6 shadow-md border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col">
						<div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
								{activeTab === 'product' && (
									<>
										<BiPackage className="text-orange-500" />
										<span>Products</span>
									</>
								)}
								{activeTab === 'schedule' && (
									<>
										<BiCalendar className="text-orange-500" />
										<span>Schedules</span>
									</>
								)}
								{activeTab === 'discount' && (
									<>
										<MdDiscount className="text-orange-500" />
										<span>Discounts</span>
									</>
								)}
							</h2>
							<div className="flex items-center gap-2">
								{activeTab === 'product' && (
									<button
										type="button"
										onClick={handleAddProductOnClick}
										className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium py-2 px-3 sm:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:from-orange-600 hover:to-orange-500 transform hover:-translate-y-0.5 w-full sm:w-auto"
									>
										<IoIosAdd className="w-5 h-5" />
										<span className="font-Montserrat text-sm">
                                            Add Product
                                        </span>
									</button>
								)}
								{activeTab === 'discount' && (
									<button
										type="button"
										onClick={handleAddDiscountOnClick}
										className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium py-2 px-3 sm:px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:from-orange-600 hover:to-orange-500 transform hover:-translate-y-0.5 w-full sm:w-auto"
									>
										<IoIosAdd className="w-5 h-5" />
										<span className="font-Montserrat text-sm">
                                            Add Discount
                                        </span>
									</button>
								)}
							</div>
						</div>

						<div className="bg-gray-50 rounded-lg p-2 sm:p-4 transition-all duration-300 overflow-x-auto flex-1">
							{activeTab === EactiveTab.product && (
								<ProductsBoard
									page={pageProduct}
									setPage={setPageProduct}
									pageSize={PAGE_SIZE}
									openProductUpdateOnClick={handleProductUpdateOnClick}
								/>
							)}
							{activeTab === EactiveTab.schedule && (
								<SchedulesBoard
									data={schedules}
									pageSize={PAGE_SIZE}
									page={pageSchedule}
									setPage={setPageSchedule}
								/>
							)}
							{activeTab === EactiveTab.discount && (
								<DiscountBoard
									onViewDetailDiscount={handleViewDiscountOnClick}
									data={discounts}
									page={pageDiscount}
									setPage={setPageDiscount}
								/>
							)}
						</div>
					</div>
				</main>

				{/* Modals */}
				{isOpenPopupAddProduct && <AddProduct onCancel={handleClosePopup} />}
				{isOpenPopupProductUpdate && (
					<ProductUpdate productId={productId} onCancel={handleClosePopup} />
				)}
				{isOpenPopupAddDiscount && (
					<AddDiscount 
						onCancel={handleClosePopup} 
						open={isOpenPopupAddDiscount} 
					/>
				)}
				{isOpenPopupViewDiscount && (
					<UpdateDiscount
						discountId={discountId}
						onCancel={handleClosePopup}
						open={isOpenPopupViewDiscount}
					/>
				)}
			</div>
		</section>
	);
};
