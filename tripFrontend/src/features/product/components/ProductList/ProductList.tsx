import { notification } from 'antd';
import { JSX, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { useDispatch } from 'react-redux';

import {
	AddProduct,
	DiscountBoard,
	ProductsBoard,
	ProductUpdate,
	SchedulesBoard,
} from '@/features';
import { cn } from '@/lib';
import { TReduxStoreDispatch } from '@/store';
import { EProductStatus } from '@/types';

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
	const [isOpenPopupProductUpdate, setIsOpenPopupProductUpdate] = useState(false);
	const [productId, setProductId] = useState<string>('');
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [pageProduct, setPageProduct] = useState<number>(1);
	const PAGE_SIZE = 10;

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
				duration: 2,
			});
		}
	};

	const handleClosePopup = (): void => {
		dispatch(productThunk.getProducts({ page: pageProduct, limit: PAGE_SIZE }));
		setIsOpenPopupAddProduct(false);
		setIsOpenPopupProductUpdate(false);
	};

	return (
		<section
			className={cn('relative md:pt-0', className)}
			ria-label="Product Management"
		>
			<div className="container mx-auto bg-white rounded-lg p-6 md:px-14 md:py-16 font-sans flex  flex-col">
				{/* Main Content */}
				<main className="flex flex-1 gap-14 text-2xl">
					{/* Sidebar */}
					<div className="space-y-5 w-3/15 font-Montserrat">
						<button
							className={`w-full rounded-2xl py-3 px-9 text-left font-medium shadow-md ${
								activeTab === 'product'
									? 'bg-[#ff6b0a] text-white'
									: 'bg-white text-gray-500 hover:bg-gray-100'
							}`}
							onClick={() => handleChangeTab(EactiveTab.product)}
						>
							Products
						</button>
						<button
							className={`w-full rounded-2xl py-3 px-9 text-left font-medium shadow-md ${
								activeTab === 'schedule'
									? 'bg-[#ff6b0a] text-white'
									: 'bg-white text-gray-500 hover:bg-gray-100 '
							}`}
							onClick={() => handleChangeTab(EactiveTab.schedule)}
						>
							Schedules
						</button>
						<button
							className={`w-full rounded-2xl py-3 px-9 text-left font-medium shadow-md ${
								activeTab === 'discount'
									? 'bg-[#ff6b0a] text-white'
									: 'bg-white text-gray-500 hover:bg-gray-100 '
							}`}
							onClick={() => handleChangeTab(EactiveTab.discount)}
						>
							Discounts
						</button>
					</div>

					{/* Content Area */}
					<div className="flex-1 rounded-lg bg-white p-6 shadow-md">
						<div className="mb-3 flex items-center justify-end">
							<div className="flex items-center gap-2">
								{activeTab === 'product' && (
									<button
										type="button"
										onClick={handleAddProductOnClick}
										className={`
                                        flex items-center justify-center
                                        bg-orange-400 hover:bg-orange-500
                                        text-white font-bold
                                        py-1.5 px-2.5
                                        rounded-full
                                        transition duration-150 ease-in-out
                                      `}
									>
										<IoIosAdd className="w-5 h-full" />
										<span className="font-Montserrat text-sm font-bold">
											New Product
										</span>
									</button>
								)}
							</div>
						</div>

						{activeTab === EactiveTab.product && (
							<ProductsBoard
								page={pageProduct}
								setPage={setPageProduct}
								pageSize={PAGE_SIZE}
								openProductUpdateOnClick={handleProductUpdateOnClick}
							/>
						)}
						{activeTab === EactiveTab.schedule && <SchedulesBoard />}
						{activeTab === EactiveTab.discount && <DiscountBoard />}
					</div>
					<div onClick={() => handleClosePopup()}>
						{isOpenPopupAddProduct && (
							<AddProduct onCancel={handleClosePopup} />
						)}
					</div>
					<div>
						{isOpenPopupProductUpdate && (
							<ProductUpdate
								productId={productId}
								onCancel={handleClosePopup}
							/>
						)}
					</div>
				</main>
			</div>
		</section>
	);
};
