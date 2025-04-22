import { JSX, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IoSearchOutline } from 'react-icons/io5';

import { SelectBox } from '@/components';
import { cn } from '@/lib';
import { locations } from '@/utils';

import { Button } from '..';
import { TSearchAttraction } from '../../product.type';

type TSearchBarMobileProps = {
	form: UseFormReturn<TSearchAttraction>;
	className?: string;
};

export const SearchBarMobile = ({
	form,
	className,
}: TSearchBarMobileProps): JSX.Element => {
	const { register, handleSubmit } = form;
	const [searchQuery, setSearchQuery] = useState('');

	const handlerSubmitOnClick = async (data: TSearchAttraction): Promise<void> => {
		if (data.name) {
			String(data.name).trim();
		}
		// Handle logic for search query
	};

	const inputBaseStyle =
		' bg-white p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent';
	return (
		<section
			className={cn(
				'w-full p-4 bg-white rounded-lg shadow-md space-y-3',
				className,
			)}
			aria-label="Search Attractions"
		>
			<form
				onSubmit={handleSubmit(handlerSubmitOnClick)}
				className="flex flex-col gap-5"
			>
				{/* Row 1: Search Input and Place Selector */}
				<div className="flex flex-row sm:flex-row items-center gap-3">
					{/* Text input for search query */}
					<input
						type="text"
						placeholder="Search Attractions"
						value={searchQuery}
						{...register('name')}
						onChange={(e) => setSearchQuery(e.target.value)}
						// Apply base style, allow growth, set width for responsiveness
						className={`${inputBaseStyle} flex-grow sm:w-auto h-14 `}
					/>
					{/* Dropdown for selecting a place */}
					<div className=" relative">
						<SelectBox
							selectOption={locations}
							register={register('locationName')}
							className="flex items-center justify-between h-14 px-3 py-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150"
						/>
					</div>
				</div>

				{/* Row 2: Price Range and Search Button */}
				<div className="w-full flex flex-row items-center gap-3">
					{/* Min Price Input Group */}
					<div className="flex items-center gap-2 w-full">
						{/* Number input for minimum price */}
						<div className="w-full h-14 flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150">
							<input
								placeholder="Min Price"
								{...register('minPrice')}
								className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full appearance-none focus:ring-0"
							/>
							<span className="text-gray-600 pl-2 flex-shrink-0">VND</span>
						</div>
					</div>
					{/* Max Price Input Group */}
					<div className="w-full flex items-center gap-2">
						<div className="w-full h-14 flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150">
							<input
								placeholder="Max Price"
								{...register('maxPrice')}
								className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full appearance-none focus:ring-0"
							/>
							<span className="text-gray-600 pl-2 flex-shrink-0">VND</span>
						</div>
					</div>
					{/* Search Button */}
					<div>
						<Button
							type="submit"
							size="icon"
							className="w-14 h-14 p-3 rounded-full"
						>
							<IoSearchOutline className="h-6 w-6 " />
						</Button>
					</div>
				</div>
			</form>
		</section>
	);
};
