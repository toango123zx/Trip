import { Segmented } from 'antd';
import React, { JSX, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { HiOutlineArrowNarrowDown, HiOutlineArrowNarrowUp } from 'react-icons/hi';
import { MdExpandMore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { SelectBox } from '@/components';
import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TProductSumary, TPagination } from '@/types';
import { locations, optionSortAttraction } from '@/utils';
import { EArrange } from '@/types';

import { TSearchAttraction } from '../../product.type';
import { productThunk } from '../../productThunk';
import { CardProduct } from '../Card';

type TAttractionListProps = {
	form: UseFormReturn<TSearchAttraction>;
	className?: string;
};

export const AttractionList = ({
	form,
	className,
}: TAttractionListProps): JSX.Element => {
	const { setValue } = form;
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const attractions = useSelector((state: TReduxStoreState) => state.product.products);
	const pagination = useSelector((state: TReduxStoreState) => state.product.pagination) as TPagination;
	const [selectOption, setSelectOption] = useState<keyof TSearchAttraction>('name');
	const [selectSort, setSelectSort] = useState<EArrange>(EArrange.desc);
	const [at, setat] = useState<TProductSumary[]>([]);
	const [page, setPage] = useState<number>(1);
	const LIMIT_PRODUCTS = 20;
	useEffect(() => {
		dispatch(
			productThunk.getProducts({
				page: 1,
				limit: LIMIT_PRODUCTS,
			}),
		);
	}, [dispatch]);

	useEffect(() => {
		setat(attractions);
	}, [attractions]);

	const handleSortChange = (): void => {
		const newSort = selectSort === EArrange.asc ? EArrange.desc : EArrange.asc;
		setSelectSort(newSort);
		if (selectOption) {
			setValue(selectOption, newSort);
		}
	};

	const handleSelectOptionOnChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	): void => {
		const selectedValue = event.target.value as keyof TSearchAttraction;
		setSelectOption(selectedValue);
		setValue(selectedValue, selectSort);
	};

	const handleLoadMore = async (): Promise<void> => {
		const nextPage = page + 1;
		const result = await dispatch(
			productThunk.getProducts({ 
				page: nextPage, 
				limit: LIMIT_PRODUCTS,
			})
		);

		if (productThunk.getProducts.fulfilled.match(result)) {
			const newProducts = result.payload[0];
			if (newProducts.length > 0) {
				setPage(nextPage);
				setat(prevAt => [...prevAt, ...newProducts]);
			}
		}
	};

	const showMoreButton = pagination?.totalItems > 6 && at.length < pagination.totalItems;

	return (
		<section
			className={cn('bg-white py-6 md:py-12', className)}
			aria-labelledby="search-bar-desktop"
		>
			<div className="max-w-[1536px] mx-auto">
				<div className="mb-8 flex flex-col items-start md:flex-row md:justify-between md:items-center px-2">
					<div className="relative font-semibold text-4xl font-[Montserrat] text-left">List Attractions</div>
					{/* <div className="flex items-center gap-5">
						{locations && (
							<label
								htmlFor="sort-select"
								className="font-medium font-[Inter] text-black text-2xl  whitespace-nowrap"
							>
								Sort by:
							</label>
						)}
						<div className="relative flex flex-row justify-center items-center gap-2.5">
							<SelectBox
								selectOption={optionSortAttraction}
								onChange={handleSelectOptionOnChange}
								className="w-48 flex items-center justify-between h-14 px-3 py-2 border border-black rounded-md bg-white focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150"
							/>

							<Segmented
								options={[
									{
										label: (
											<div className="w-full flex justify-center items-center">
												{selectSort === EArrange.desc ? (
													<HiOutlineArrowNarrowUp className="h-4 w-4" />
												) : (
													<HiOutlineArrowNarrowDown className="h-4 w-4" />
												)}
											</div>
										),
										value: selectSort === EArrange.asc ? EArrange.asc : EArrange.desc,
									},
								]}
								className="segmented-custom h-[56px] border-black bg-white border flex justify-center items-center"
								onClick={handleSortChange}
								defaultValue={EArrange.desc}
							/>
						</div>
					</div> */}
				</div>
				<div>
					<div className="w-full relative overflow-hidden pt-9 pb-14">
						{at.length === 0 ? (
							<div className="text-center text-gray-500 py-12 text-lg font-medium">
								We couldn't find anything matching your search.
							</div>
						) : (
							<div className="w-full grid grid-cols-2 md:grid-cols-3 gap-y-9 gap-x-5 transition-transform duration-300 ease-in-out">
								{at.map((attraction) => (
									<CardProduct
										key={attraction.id}
										product={attraction}
										className="w-full"
									/>
								))}
							</div>
						)}
					</div>
				</div>
				{showMoreButton && (
					<div className="flex justify-center">
						<button 
							onClick={handleLoadMore}
							className="block w-36 bg-[#FF7A22] text-white py-3 rounded-3xl hover:bg-orange-600 text-xl text-center font-bold transition-colors duration-200"
						>
							<span className="flex flex-row items-center justify-center gap-2">
								More
								<MdExpandMore />
							</span>
						</button>
					</div>
				)}
			</div>
		</section>
	);
};
