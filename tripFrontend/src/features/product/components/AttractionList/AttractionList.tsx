import { ChevronDownIcon } from 'lucide-react';
import React, { JSX, useEffect, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { productThunk } from '../../productThunk';
import { CardProduct } from '../Card';

type TAttractionListProps = {
	className?: string;
};

export const AttractionList = ({ className }: TAttractionListProps): JSX.Element => {
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const attractions = useSelector((state: TReduxStoreState) => state.product.products);
	const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
	const [queryLocation, setQueryLocation] = useState<string>('');
	const [selectOption, setSelectOption] = useState<string>('');
	const options = ['Place', 'Attraction', 'Hotel', 'Restaurant'];

	useEffect(() => {
		dispatch(productThunk.getProducts());
	}, [dispatch]);

	return (
		<section
			className={cn('bg-white py-6 md:py-12', className)}
			aria-labelledby="search-bar-desktop"
		>
			<div className="max-w-[1536px] mx-auto">
				<div className="mb-8 flex flex-row justify-between items-center px-2">
					<div className="relative">
						<select
							value={selectOption}
							className="rounded-4xl border py-1 px-3.5 text-2xl font-[Inter] font-bold border-black focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="">Place</option>
							{options.map((option) => (
								<option key={option} value={option} className="h-14">
									{option}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center gap-5">
						{locations && (
							<label
								htmlFor="sort-select"
								className="font-medium font-[Inter] text-black text-2xl  whitespace-nowrap"
							>
								Sort by:
							</label>
						)}
						<div className="relative">
							<select
								id="sort-select"
								value={queryLocation}
								className="appearance-none bg-white border-none rounded-md py-1.5 px-3 pr-8 font-[Inter] text-black text-2xl font-bold focus:outline-none focus:ring-1 focus:ring-black focus:border-black cursor-pointer"
							>
								{locations.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
								<ChevronDownIcon className="h-4 w-4" />
							</div>
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
