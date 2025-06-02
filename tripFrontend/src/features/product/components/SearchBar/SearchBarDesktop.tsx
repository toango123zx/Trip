'use client';

import React, { JSX, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IoSearchOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import { SelectBox } from '@/components';
import { cn } from '@/lib';
import { TReduxStoreDispatch } from '@/store';
import { locations } from '@/utils';
import { Button } from '../Button';
import { EArrange } from '@/types';

import { TSearchAttraction } from '../../product.type';
import { productThunk } from '../../productThunk';

const { RangePicker } = DatePicker;

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
	const { register, handleSubmit, setValue } = form;
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

	const handlerSubmitOnClick = async (data: TSearchAttraction): Promise<void> => {
		try {
			const searchParams: TSearchAttraction = {};

			// Xử lý name
			if (data.name && data.name !== '') {
				searchParams.name = data.name;
			}

			// Xử lý locationName
			if (data.locationName) {
				searchParams.locationName = EArrange.asc;
			}

			// Xử lý giá
			if (data.minPrice) {
				searchParams.minPrice = Number(data.minPrice);
			}

			if (data.maxPrice) {
				searchParams.maxPrice = Number(data.maxPrice);
			}

			// Xử lý thời gian
			if (dateRange[0] && dateRange[1]) {
				searchParams.time = EArrange.asc;
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
			className="bg-white py-6 shadow-xl rounded-2xl"
			aria-labelledby="search-bar-desktop"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					id="search-heading"
					className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent"
				>
					Find the Adventure of a Lifetime
				</h2>

				<form onSubmit={handleSubmit(handlerSubmitOnClick)}>
					<div className="flex flex-col md:flex-row items-stretch bg-white border-2 border-yellow-400 rounded-2xl shadow-lg overflow-hidden divide-y md:divide-y-0 md:divide-x">

						{/* Điểm đến */}
						<div className="flex items-center px-4 py-3 flex-1">
							<div className="w-full">
								<label htmlFor="locationName" className="block text-xs font-medium text-gray-500 mb-1">
									Điểm đến
								</label>
								<SelectBox
									name="locationName"
									selectOption={locations}
									register={register}
									className="w-full h-8 border border-[#d9d9d9] rounded-[6px] focus:ring-0 text-gray-800 bg-transparent"
								/>
							</div>
						</div>

						{/* Thời gian */}
						<div className="flex items-center px-4 py-3 flex-1">
							<div className="w-full">
								<label className="block text-xs font-medium text-gray-500 mb-1">
									Thời gian
								</label>
								<RangePicker
									className="w-full h-8 focus:ring-0 bg-transparent text-gray-800"
									onChange={(dates) => {
										setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
										setValue('time', dates ? EArrange.asc : undefined);
									}}
									format="DD/MM/YYYY"
									placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
								/>
							</div>
						</div>

						{/* Giá tiền */}
						<div className="flex items-center px-4 py-3 flex-1">
							<div className="w-full grid grid-cols-2 gap-2">
								<div>
									<label htmlFor="minPrice" className="block text-xs font-medium text-gray-500 mb-1">
										Giá từ
									</label>
									<input
										{...register('minPrice')}
										id="minPrice"
										type="number"
										placeholder="0"
										className="w-full h-8 bg-transparent focus:ring-0 text-gray-800"
									/>
								</div>
								<div>
									<label htmlFor="maxPrice" className="block text-xs font-medium text-gray-500 mb-1">
										Giá đến
									</label>
									<input
										{...register('maxPrice')}
										id="maxPrice"
										type="number"
										placeholder="..."
										className="w-full h-8 bg-transparent  focus:ring-0 text-gray-800"
									/>
								</div>
							</div>
						</div>

						{/* Nút tìm kiếm */}
						<div className="flex justify-center items-center">
							<button
								type="submit"
								className="h-full px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md transition-all"
							>
								Tìm
							</button>
						</div>
					</div>
				</form>
			</div>
		</section>

	);
};
