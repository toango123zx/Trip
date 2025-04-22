'use client';

import { JSX } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IoSearchOutline } from 'react-icons/io5';

import { SelectBox } from '@/components';
import { cn } from '@/lib';
import { locations } from '@/utils';

import { TSearchAttraction } from '../../product.type';
import { Button } from '../Button';

type TSeachBarDesktopProps = {
	form: UseFormReturn<TSearchAttraction>;
	className?: string;
};

export const SearchBarDesktop = ({
	form,
	className,
}: TSeachBarDesktopProps): JSX.Element => {
	const { register, handleSubmit } = form;

	const handlerSubmitOnClick = async (data: TSearchAttraction): Promise<void> => {
		if (data.name) {
			String(data.name).trim();
		}
		// Handle logic for search query
	};

	return (
		<section
			className={cn('py-6 md:py-12', className)}
			aria-label="Search for attractions"
		>
			<form onSubmit={handleSubmit(handlerSubmitOnClick)}>
				{/* Background Image */}
				<div className="relative px-2">
					<div className="container mx-auto">
						<div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
							<h2
								id="search-heading"
								className="text-xl md:text-2xl font-semibold text-center mb-6"
							>
								Find the Adventure of a lifetime
							</h2>

							<div className="flex flex-col md:flex-row justify-between items-center gap-4">
								{/* Keyword Input */}
								<div className="">
									<input
										type="text"
										{...register('name')}
										placeholder="Keyword here"
										className="h-14 flex items-center bg-white border border-black rounded-lg px-4 py-2 w-fit focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150"
									/>
								</div>

								{/* Location Dropdown */}
								<div className=" relative">
									<SelectBox
										selectOption={locations}
										register={register('locationName')}
										className="flex items-center justify-between h-14 px-3 py-2 rounded-md bg-white border border-black focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150"
									/>
								</div>

								{/* Min Price */}
								<div className="md:col-span-1">
									<div className="h-14 flex items-center bg-white border border-black rounded-lg px-4 py-2 w-fit focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150">
										<input
											placeholder="Min Price"
											{...register('minPrice')}
											className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full appearance-none focus:ring-0"
										/>
										<span className="text-gray-600 pl-2 flex-shrink-0">
											VND
										</span>
									</div>
								</div>

								{/* Max Price and Search Button */}
								<div className="md:col-span-1">
									<div className="h-14 flex items-center bg-white border border-black rounded-lg px-4 py-2 w-fit focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150">
										<input
											placeholder="Max Price"
											{...register('maxPrice')}
											className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full appearance-none focus:ring-0"
										/>
										<span className="text-gray-600 pl-2 flex-shrink-0">
											VND
										</span>
									</div>
								</div>
								<Button
									size="icon"
									className="w-32 h-20 px-12 py-7 p-4 rounded-3xl"
									type="submit"
								>
									<IoSearchOutline className="h-8 w-8 " />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</section>
	);
};
