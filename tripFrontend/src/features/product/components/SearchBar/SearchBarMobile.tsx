import React, { JSX, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

import { cn } from '@/lib';

import { Button } from '..';

type TSearchBarMobileProps = {
	className?: string;
};

export const SearchBarMobile = ({ className }: TSearchBarMobileProps): JSX.Element => {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedPlace, setSelectedPlace] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const places = ['Da Nang', 'Hoi An', 'Hue', 'Quang Nam'];

	const inputBaseStyle =
		' bg-white p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent';
	return (
		<section
			className={cn(
				'w-full p-4 bg-white rounded-lg shadow-md space-y-3',
				className,
			)}
			aria-labelledby="hero-search-bar-mobile"
		>
			{/* Row 1: Search Input and Place Selector */}
			<div className="flex flex-row sm:flex-row items-center gap-3">
				{/* Text input for search query */}
				<input
					type="text"
					placeholder="Search Attractions"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					// Apply base style, allow growth, set width for responsiveness
					className={`${inputBaseStyle} flex-grow sm:w-auto h-14 `}
				/>
				{/* Dropdown for selecting a place */}
				<select
					value={selectedPlace}
					onChange={(e) => setSelectedPlace(e.target.value)}
					className={`${inputBaseStyle} sm:w-auto h-14`}
				>
					<option value="">Place</option>
					{places.map((place) => (
						<option key={place} value={place} className="h-14">
							{place}
						</option>
					))}
				</select>
			</div>

			{/* Row 2: Price Range and Search Button */}
			<div className="w-full flex flex-row items-center gap-3">
				{/* Min Price Input Group */}
				<div className="flex items-center gap-2 w-full">
					{/* Number input for minimum price */}
					<div className="w-full h-14 flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150">
						<input
							placeholder="Min Price"
							className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full appearance-none focus:ring-0"
						/>
						<span className="text-gray-600 pl-2 flex-shrink-0">VND</span>
					</div>
				</div>
				{/* Max Price Input Group */}
				<div className="w-full flex items-center gap-2">
					<div className="w-full h-14 flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150">
						<input
							placeholder="Min Price"
							className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full appearance-none focus:ring-0"
						/>
						<span className="text-gray-600 pl-2 flex-shrink-0">VND</span>
					</div>
				</div>
				{/* Search Button */}
				<div>
					<Button size="icon" className="w-14 h-14 p-3 rounded-full">
						<IoSearchOutline className="h-6 w-6 " />
					</Button>
				</div>
			</div>
		</section>
	);
};
