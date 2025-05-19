'use client';

import { JSX } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IoSearchOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

import { SelectBox } from '@/components';
import { cn } from '@/lib';
import { locations } from '@/utils';
import { TReduxStoreDispatch } from '@/store';
import { Button } from '../Button';

import { TSearchAttraction } from '../../product.type';
import { productThunk } from '../../productThunk';

type TSearchBarDesktopProps = {
	form: UseFormReturn<TSearchAttraction>;
	className?: string;
};

export const SearchBarDesktop = ({
	form,
	className,
}: TSearchBarDesktopProps): JSX.Element => {
	const { register, handleSubmit } = form;
	const dispatch = useDispatch<TReduxStoreDispatch>();

	const handlerSubmitOnClick = async (data: TSearchAttraction): Promise<void> => {
		try {
			const searchParams: TSearchAttraction = {};
			
			// Xử lý name
			if (data.name && data.name !== '') {
				searchParams.name = data.name;
			}
			
			// Xử lý locationName
			if (data.locationName && data.locationName !== '') {
				// Loại bỏ dấu phẩy thừa
				searchParams.locationName = data.locationName.replace(/,+$/, '');
			}
			
			// Xử lý giá
			if (data.minPrice) {
				searchParams.minPrice = Number(data.minPrice);
			}
			
			if (data.maxPrice) {
				searchParams.maxPrice = Number(data.maxPrice);
			}

			// Dispatch action search
			await dispatch(productThunk.getProducts({
				...searchParams,
				page: 1,
				limit: 6
			}));
		} catch (error) {
			console.error('Lỗi khi tìm kiếm:', error);
		}
	};

	return (
		<section
			className={cn('bg-white py-6 md:py-12 shadow-xl', className)}
			aria-labelledby="search-bar-desktop"
		>
			<div className="max-w-7xl mx-auto">
				<div className="rounded-2xl sm:px-8 backdrop-blur-sm">
					<h2
						id="search-heading"
						className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent"
					>
						Find the Adventure of a Lifetime
					</h2>

					<form onSubmit={handleSubmit(handlerSubmitOnClick)} aria-labelledby="search-heading">
						<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
							{/* Keyword */}
							<div className="col-span-1">
								<label htmlFor="name" className="sr-only">Keyword</label>
								<input
									{...register('name')}
									id="name"
									type="text"
									placeholder="Keyword"
									className="w-full h-12 px-5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
								/>
							</div>

							{/* Location */}
							<div className="col-span-1">
								<label htmlFor="locationName" className="sr-only">Location</label>
								<SelectBox
									name="locationName"
									selectOption={locations}
									register={register}
									className="w-full h-12 px-5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 appearance-none"
								/>
							</div>

							{/* Min Price */}
							<div className="col-span-1">
								<label htmlFor="minPrice" className="sr-only">Minimum Price</label>
								<div className="relative h-12">
									<input
										{...register('minPrice')}
										id="minPrice"
										placeholder="Min Price"
										type="number"
										className="w-full h-full px-5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
									/>
									<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">VND</span>
								</div>
							</div>

							{/* Max Price */}
							<div className="col-span-1">
								<label htmlFor="maxPrice" className="sr-only">Maximum Price</label>
								<div className="relative h-12">
									<input
										{...register('maxPrice')}
										id="maxPrice"
										placeholder="Max Price"
										type="number"
										className="w-full h-full px-5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
									/>
									<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">VND</span>
								</div>
							</div>

							{/* Search Button */}
							<div className="col-span-1 flex justify-center lg:justify-end">
								<Button
									type="submit"
									className="w-full h-12 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
								>
									<IoSearchOutline className="h-5 w-5" />
									Search
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};
