'use client';

import { MapPin } from 'lucide-react';
import { JSX, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

import { cn } from '@/lib';

import { Button } from '../Button';

type TSeachBarDesktopProps = {
	className?: string;
};

export const SearchBarDesktop = ({ className }: TSeachBarDesktopProps): JSX.Element => {
	const [location, setLocation] = useState('Đà Nẵng');
	const [isLocationOpen, setIsLocationOpen] = useState(false);

	const locations = ['Đà Nẵng', 'Hội An', 'Huế', 'Nha Trang', 'Đà Lạt'];

	return (
		<section
			className={cn('py-6 md:py-12', className)}
			aria-labelledby="search-bar-desktop"
		>
			<div className="relative px-2">
				<div className="container mx-auto">
					<div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
						<h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
							Find the Adventure of a lifetime
						</h2>

						<div className="flex flex-col md:flex-row justify-between items-center gap-4">
							{/* Keyword Input */}
							<div className="md:col-span-1">
								<input
									type="text"
									placeholder="Keyword here"
									className="w-full h-14 px-3 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							{/* Location Dropdown */}
							<div className=" relative">
								<button
									type="button"
									className="flex items-center justify-between gap-7 w-fit h-14 px-3 py-2 border border-black-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
									onClick={() => setIsLocationOpen(!isLocationOpen)}
								>
									<div className="flex items-center">
										<MapPin className="w-4 h-4 mr-2 text-gray-500" />
										<span>{location}</span>
									</div>
									<svg
										className={`w-4 h-4 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{isLocationOpen && (
									<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
										<ul className="py-1 overflow-auto max-h-60">
											{locations.map((loc) => (
												<li
													key={loc}
													className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
													onClick={() => {
														setLocation(loc);
														setIsLocationOpen(false);
													}}
												>
													{loc}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>

							{/* Min Price */}
							<div className="md:col-span-1">
								<div className="h-14 flex items-center bg-white border border-black rounded-lg px-4 py-2 w-fit focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-150">
									<input
										placeholder="Min Price"
										className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full appearance-none focus:ring-0"
									/>
									<span className="text-gray-600 pl-2 flex-shrink-0">
										VND
									</span>
								</div>
							</div>

							{/* Max Price and Search Button */}
							<div className="md:col-span-1">
								<div className="h-14 flex items-center bg-white border border-black rounded-lg px-4 py-2 w-fit focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-150">
									<input
										placeholder="Max Price"
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
							>
								<IoSearchOutline className="h-8 w-8 " />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
