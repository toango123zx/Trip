import { Segmented } from 'antd';
import React, { JSX, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { HiOutlineArrowNarrowDown, HiOutlineArrowNarrowUp } from 'react-icons/hi';
import { MdExpandMore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { SelectBox } from '@/components';
import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { locations, optionSortAttraction } from '@/utils';

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
	const [selectOption, setSelectOption] = useState<string>('');
	const [selectSort, setSelectSort] = useState<string>('desc');

	useEffect(() => {
		dispatch(productThunk.getProducts());
	}, [dispatch]);

	const handleSortChange = (): void => {
		setSelectSort((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		setValue(selectOption as keyof TSearchAttraction, selectSort);
	};

	const handleSelectOptionOnChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	): void => {
		const selectedValue = event.target.value;
		setSelectOption(selectedValue);
		setValue(selectedValue as keyof TSearchAttraction, selectSort);
	};

	return (
		<section
			className={cn('bg-white py-6 md:py-12', className)}
			aria-labelledby="search-bar-desktop"
		>
			<div className="max-w-[1536px] mx-auto">
				<div className="mb-8 flex flex-row justify-between items-center px-2">
					<div className="relative"></div>
					<div className="flex items-center gap-5">
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
												{selectSort === 'desc' ? (
													<HiOutlineArrowNarrowUp className="h-4 w-4" />
												) : (
													<HiOutlineArrowNarrowDown className="h-4 w-4" />
												)}
											</div>
										),
										value: selectSort === 'asc' ? 'asc' : 'desc',
									},
								]}
								className="segmented-custom h-[56px] border-black bg-white border flex justify-center items-center"
								onClick={handleSortChange}
								defaultValue="desc"
							/>
						</div>
					</div>
				</div>
				<div>
					<div className="w-full relative overflow-hidden pt-9 pb-14">
						<div className="w-full grid grid-cols-2 md:grid-cols-3 gap-y-9 gap-x-5 transition-transform duration-300 ease-in-out">
							{attractions.map((attraction) => (
								<CardProduct
									key={attraction.id}
									product={attraction}
									className="w-full"
								/>
							))}
						</div>
					</div>
				</div>
				<div className="flex justify-center">
					<button className="block w-36 bg-[#FF7A22] text-white py-3 rounded-3xl hover:bg-orange-600 text-xl text-center font-bold transition-colors duration-200">
						<span className="flex flex-row items-center justify-center gap-2">
							More
							<MdExpandMore />
						</span>
					</button>
				</div>
			</div>
		</section>
	);
};
