'use client';

import React, { JSX, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { SelectBox } from '@/components';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { locations } from '@/utils';
import { EArrange, EProductStatus } from '@/types';
import { TSearchAttraction, TRequestQueryGetProducts } from '../../product.type';
import { productThunk } from '../../productThunk';
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';
import { locationThunk } from '@/features/location';

const { RangePicker } = DatePicker;
const { Option } = Select;

type TSearchBarDesktopProps = {
	form: UseFormReturn<TSearchAttraction>;
	keyword?: string;
	setKeyword?: React.Dispatch<React.SetStateAction<string>>;
	className?: string;
};

export const SearchBarDesktop = ({
	form,
	className,
}: TSearchBarDesktopProps): JSX.Element => {
	const { register, handleSubmit, setValue, watch } = form;
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
	const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);

	// Advanced search states
	const [sortBy, setSortBy] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [locationFilter, setLocationFilter] = useState<string>('');
	const [starRating, setStarRating] = useState<number | null>(null);
	const locations = useSelector((s: TReduxStoreState) => s.location.locations);

	useEffect(() => {
		dispatch(locationThunk.getLocations());
	}, [dispatch]);
	const options = useMemo(
		() =>
			locations.map((l: any) => ({
				id: l.id,
				value: l.id,
				label: l.displayName,
				city: l.city,
			})),
		[locations],
	);


	const handlerSubmitOnClick = async (data: TSearchAttraction): Promise<void> => {
		try {
			const searchParams: TRequestQueryGetProducts = {
				page: 1,
				limit: 6
			};

			// Basic search
			if (data.locationName) {
				const cityName = String(data.locationName).replace(/,\s*$/, '');
				searchParams.citySearch = cityName;
			}
			if (data.name) {
				searchParams.keyword = String(data.name).trim();
			}
			if (data.minPrice) {
				searchParams.priceFromSearch = Number(data.minPrice);
			}
			if (data.maxPrice) {
				searchParams.priceToSearch = Number(data.maxPrice);
			}
			if (dateRange[0] && dateRange[1]) {
				searchParams.startTimeSearch = dateRange[0].format('YYYY-MM-DD');
				searchParams.endTimeSearch = dateRange[1].format('YYYY-MM-DD');
			}

			// Advanced search
			if (sortBy) {
				// searchParams.sortBy = sortBy;
				// searchParams.sortOrder = sortOrder;
				switch (sortBy) {
					case 'name':
						searchParams.name = (sortOrder === 'asc') ? EArrange.asc : EArrange.desc;
						break;
					case 'rating':
						searchParams.avgRate = (sortOrder === 'asc') ? EArrange.asc : EArrange.desc;
						break;
					default:
						break;
				}
				if (locationFilter) {
					searchParams.locationNameSearch = locationFilter;
				}
				const cleanParams = Object.fromEntries(
					Object.entries(searchParams).filter(([_, value]) => value !== undefined)
				);
				await dispatch(productThunk.getProducts(cleanParams));
			}
		} catch (error) {
			console.error('Lỗi khi tìm kiếm:', error);
		}
	};

	const toggleAdvanceSearch = () => {
		setShowAdvanceSearch(!showAdvanceSearch);
	};

	const resetAdvancedFilters = () => {
		setSortBy('');
		setSortOrder('asc');
		setLocationFilter('');
		setStarRating(null);
	};

	return (
		<section
			className="bg-white py-6 rounded-2xl border-2 border-[#FF7A22]"
			aria-labelledby="search-bar-desktop"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					id="search-heading"
					className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent"
				>
					Find the Adventure of a Lifetime
				</h2>

				<form onSubmit={handleSubmit(handlerSubmitOnClick)}>
					<div className='flex flex-col bg-[#FF7A22] rounded-2xl shadow-lg overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/50'>
						<div className="flex flex-col md:flex-row ">
							{/* Điểm đến */}
							<div className="flex items-center px-4 py-3 flex-1">
								<div className="w-full">
									<label htmlFor="locationName" className="block text-xs font-medium text-white mb-1">
										Destination
									</label>
									<input
										{...register('name')}
										id="name"
										type="text"
										placeholder="Enter name"
										className="w-full h-8 border border-[#d9d9d9] rounded-[6px] focus:ring-0 text-gray-800 bg-white px-2"
									/>
								</div>
							</div>

							{/* Thời gian */}
							<div className="flex items-center px-4 py-3 flex-1">
								<div className="w-full">
									<label className="block text-xs font-medium text-white mb-1">
										Time
									</label>
									<RangePicker
										className="w-full h-8 focus:ring-0 bg-white text-gray-800"
										onChange={(dates) => {
											setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
											setValue('time', dates ? EArrange.asc : undefined);
										}}
										format="DD/MM/YYYY"
										placeholder={['Departure date', 'Return date']}
									/>
								</div>
							</div>

							{/* Giá tiền */}
							<div className="flex items-center px-4 py-3 flex-1">
								<div className="w-full grid grid-cols-2 gap-2">
									<div>
										<label htmlFor="minPrice" className="block text-xs font-medium text-white mb-1">
											Price from
										</label>
										<input
											{...register('minPrice')}
											id="minPrice"
											type="number"
											placeholder="0"
											className="w-full h-8 bg-white border border-[#d9d9d9] rounded-[6px] focus:ring-0 text-gray-800 px-2"
										/>
									</div>
									<div>
										<label htmlFor="maxPrice" className="block text-xs font-medium text-white mb-1">
											Price to
										</label>
										<input
											{...register('maxPrice')}
											id="maxPrice"
											type="number"
											placeholder="0"
											className="w-full h-8 bg-white border border-[#d9d9d9] rounded-[6px] focus:ring-0 text-gray-800 px-2"
										/>
									</div>
								</div>
							</div>

							{/* Nút tìm kiếm */}
							<div className="flex justify-center items-center">
								<button
									type="submit"
									className="h-full px-6 bg-[#FF7A22] hover:bg-orange-600 text-white font-semibold transition-all py-2 sm:py-0 rounded-lg"
								>
									Search
								</button>
							</div>
						</div>

						{/* Advance Search Toggle */}
						<div
							className="flex justify-center items-center px-4 py-3 text-white font-bold "

						>
							{/* Advanced Search Panel */}
							{showAdvanceSearch && (
								<div className="w-full p-4 rounded-b-2xl border-t-2">
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{/* Sort By */}
										<div>
											<label className="block text-sm font-medium mb-2">
												Sort By
											</label>
											<Select
												placeholder="Select sort option"
												value={sortBy}
												onChange={setSortBy}
												className="w-full"
												allowClear
											>
												<Option value="name">Name</Option>
												<Option value="rating">Star Rating</Option>
												<Option value="price">Price</Option>
											</Select>
										</div>

										{/* Sort Order */}
										<div>
											<label className="block text-sm font-medium mb-2">
												Sort Order
											</label>
											<Select
												value={sortOrder}
												onChange={setSortOrder}
												className="w-full bg-white"
												disabled={!sortBy}
											>
												<Option value="asc">Ascending (A-Z, 1-5)</Option>
												<Option value="desc">Descending (Z-A, 5-1)</Option>
											</Select>
										</div>

										{/* Location Filter */}
										<div>
											<label className="block text-sm font-medium mb-2">
												Location
											</label>
											<Select
												placeholder="Select location"
												value={locationFilter}
												onChange={setLocationFilter}
												className="w-full font-normal"
												allowClear
												showSearch
												filterOption={(input, option) =>
													(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
												}
											>
												{options.map((location) => (
													<Option key={location.value} value={location.value}>
														{location.label}
													</Option>
												))}
											</Select>
										</div>

										{/* Star Rating Filter */}
										{/* <div>
											<label className="block text-sm font-medium mb-2">
												Minimum Star Rating
											</label>
											<Select
												placeholder="Select rating"
												value={starRating}
												onChange={setStarRating}
												className="w-full"
												allowClear
											>
												{[1, 2, 3, 4, 5].map((rating) => (
													<Option key={rating} value={rating}>
														<div className="flex items-center">
															{Array.from({ length: rating }, (_, i) => (
																<FaStar key={i} className="text-yellow-400 mr-1" />
															))}
															<span className="ml-1">{rating} star{rating > 1 ? 's' : ''} & up</span>
														</div>
													</Option>
												))}
											</Select>
										</div> */}
									</div>

									{/* Advanced Search Actions */}
									{/* <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={resetAdvancedFilters}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={toggleAdvanceSearch}
                                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-[#FF7A22] hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div> */}
								</div>
							)}

						</div>
						<div
							onClick={toggleAdvanceSearch}
							className={`flex justify-center items-center px-4 py-3 text-white font-bold cursor-pointer ${!showAdvanceSearch && 'rounded-b-2xl border-t-2'}`}
						>
							<span className="mr-2">Advance Search</span>
							{showAdvanceSearch ? <FaChevronUp /> : <FaChevronDown />}
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};