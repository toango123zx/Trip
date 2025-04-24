import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { BsBookmarkCheck } from 'react-icons/bs';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { RiCalendarScheduleLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Pagination, Navigation, Autoplay, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TSchedule } from '@/types';
import { schedule1 } from '@/utils';

import { productThunk } from '../../productThunk';

type TStarIconProps = {
	filled: boolean;
};

const StarIcon = ({ filled }: TStarIconProps): JSX.Element =>
	filled ? (
		<FaStar className="w-4 h-4 text-yellow-400" />
	) : (
		<FaRegStar className="w-4 h-4 text-gray-300" />
	);

type TImageFallbackProps = {
	src: string;
	alt: string;
	className?: string;
};

const ImageFallback = ({ src, alt, className }: TImageFallbackProps): JSX.Element => (
	<img
		src={src}
		alt={alt}
		className={className}
		loading="lazy"
		onError={(e) => {
			e.currentTarget.src =
				'https://placehold.co/600x480/eeeeee/cccccc?text=Image+Not+Available';
		}}
	/>
);

type TSheduleCardProps = {
	schedule: TSchedule;
	className?: string;
};

const ScheduleCard = ({ schedule, className }: TSheduleCardProps): JSX.Element => {
	const statusColor = schedule.status === 'Active' ? 'text-green-500' : 'text-gray-500';

	const renderInfoSection = (
		icon: 'calendar' | 'document' | 'check',
		label: string,
		value: string,
	): JSX.Element => (
		<div className="flex items-center gap-1.5 md:gap-5">
			<RiCalendarScheduleLine
				type={icon}
				className="w-6 md:w-14 h-full text-gray-700"
			/>
			<div className="flex flex-col gap-1 md:gap-2.5">
				<p className="tex-xs md:text-2xl text-gray-500">{label}</p>
				<p className="text-sm md:text-3xl font-bold text-black">{value}</p>
			</div>
		</div>
	);
	return (
		<section
			className={cn('bg-gray-100 relative md:pt-	0', className)}
			aria-labelledby="hero-attractions-heading"
		>
			<div className="h-fit bg-gray-100 font-Montserrat text-lg md:text-xl">
				<div className="container mx-auto bg-white rounded-lg shadow-lg">
					<div className="bg-white rounded-xl shadow-md p-4 md:py-9 md:px-24 w-full mx-auto">
						{/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"> */}
						<div className="w-full md:flex md:flex-row md:justify-between md:gap-8">
							<div className="w-full md:max-w-8/12 grid grid-cols-2 grid-row-3 md:grid-rows-2 gap-x-8 gap-y-5 md:gap-y-11 ">
								{/* Left Column: Start Date & Booked */}
								{renderInfoSection(
									'calendar',
									'Start Date',
									`${schedule.startTime} | ${schedule.startDate}`,
								)}
								{renderInfoSection(
									'calendar',
									'End Date',
									`${schedule.endTime} | ${schedule.endDate}`,
								)}
								<div className="flex items-center gap-1.5 md:gap-5">
									<BsBookmarkCheck className="w-6 md:w-14 h-full text-gray-700" />
									<div className="flex flex-col gap-1 md:gap-2.5">
										<p className="text-xs md:text-2xl text-gray-500">
											Booked
										</p>
										<p className="text-sm md:text-3xl font-bold text-black">
											{schedule.booked.toString()}
										</p>
									</div>
								</div>
								<div className="w-full md:hidden row-span-2 flex-col space-y-3 sm:w-auto pt-2 sm:pt-0 justify-center items-center gap-10">
									<div className="text-[32px] font-bold text-orange-400">
										<span className="text-center mr-2.5">
											{schedule.price}
										</span>
										<span className="w-full text-base text-center">
											VND
										</span>
									</div>
									<button
										className="bg-orange-400 hover:bg-orange-600 text-white font-semibold rounded-full transition duration-150 ease-in-out w-full sm:w-auto text-2xl px-11 py-1.5"
										aria-label="Add item"
									>
										Add
									</button>
								</div>
								<div className="flex items-center gap-2.5 md:gap-5">
									<IoCheckmarkCircleOutline
										type="check"
										className={`w-6 md:w-14 h-full ${statusColor}`}
									/>
									<p
										className={`text-sm font-bold md:text-4xl md:font-medium ${statusColor}`}
									>
										{schedule.status}
									</p>
								</div>

								{/* Right Column: Price & Add Button */}
							</div>
							<div className="w-full hidden md:flex flex-col space-y-3 sm:w-auto pt-2 sm:pt-0 justify-center items-center gap-10 text-center">
								<div className="text-6xl font-bold text-orange-400">
									{schedule.price} <span>VND</span>
								</div>
								<button
									className="bg-orange-400 hover:bg-orange-600 text-white font-semibold rounded-full transition duration-150 ease-in-out w-full sm:w-auto text-4xl px-20 py-3.5"
									aria-label="Add item"
								>
									Add
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

type TAttractionsInformationProps = {
	className?: string;
};

export const AttractionsInformation: React.FC = ({
	className,
}: TAttractionsInformationProps) => {
	const { attractionId } = useParams();
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const { productDetail: data } = useSelector(
		(state: TReduxStoreState) => state.product,
	);

	const [showAllImages, setShowAllImages] = useState(false);
	const [showFullDesc, setShowFullDesc] = useState(false);
	const swiperRef = useRef<import('swiper').Swiper | null>(null);
	// ...existing code...

	useEffect(() => {
		if (attractionId) dispatch(productThunk.getProductDetail(attractionId));
	}, [attractionId, dispatch]);

	const truncatedDesc = useMemo(() => {
		return data.description?.length > 530
			? data.description.slice(0, 530) + '...'
			: data.description || '';
	}, [data.description]);

	const stars = useMemo(
		() => [...Array(5)].map((_, i) => <StarIcon key={i} filled={i < data.avgRate} />),
		[data.avgRate],
	);

	const visibleImages = useMemo(
		() => (showAllImages ? data.productImage : data.productImage?.slice(0, 3)),
		[showAllImages, data.productImage],
	);

	const info = [
		{ label: 'Destination', value: data.city },
		{ label: 'Time', value: `${data.time} hours` },
		{ label: 'Quantity', value: data.quantityAvailable },
		{ label: 'Count complete', value: data.quantityCompleted },
	];

	const schedule = [schedule1, schedule1, schedule1, schedule1, schedule1, schedule1];

	return (
		<section
			className={cn('bg-white relative md:pt-0', className)}
			aria-labelledby="hero-attractions-heading"
		>
			<div className="h-fit md:pb-28 bg-gray-100 md:p-8 font-Montserrat text-lg md:text-xl">
				<div className="container mx-auto bg-white rounded-lg shadow-lg p-6 md:px-14 md:py-16">
					{/* Header */}
					<div className="mb-6 border-b border-gray-200 pb-6">
						<div className="flex justify-between items-center">
							<h1 className="text-4xl md:text-6xl font-bold text-gray-900">
								{data.name}
							</h1>
							<div className="flex items-center gap-2.5 text-gray-500 text-sm md:text-4xl">
								<IoLocationOutline />
								<span>{data.city}</span>
							</div>
						</div>
						<div className="flex items-center gap-2 text-sm md:text-2xl text-gray-500">
							<div className="hidden md:flex gap-1">{stars}</div>
							<div className="md:hidden flex gap-1.5 items-center">
								<StarIcon filled={data.avgRate > 0} />
								<span>{data.avgRate}</span>
							</div>
							<span>({data.quantityRate} review)</span>
						</div>
					</div>

					{/* Mobile Swiper */}
					<div className="md:hidden py-4">
						<Swiper
							modules={[Pagination, Navigation, Autoplay, Mousewheel]}
							onSwiper={(swiper) => {
								swiperRef.current = swiper;
							}}
							slidesPerView={(window.innerWidth - 40) / 230}
							loop={false}
							speed={600}
							autoplay={{ delay: 3500, disableOnInteraction: false }}
							pagination={{ clickable: true, dynamicBullets: true }}
							mousewheel
							a11y={{
								prevSlideMessage: 'Previous slide',
								nextSlideMessage: 'Next slide',
							}}
						>
							{data.productImage?.map((img, i) => (
								<SwiperSlide key={img.id || i}>
									<div className="w-[200px] aspect-[4/3] bg-gray-200 rounded-md overflow-hidden">
										<ImageFallback
											src={img.url}
											alt={`Image ${i + 1}`}
											className="w-full h-full object-cover"
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>

					{/* Description */}
					<div className="md:my-8 text-gray-700 leading-relaxed md:text-3xl">
						<p>{showFullDesc ? data.description : truncatedDesc}</p>
						{data.description && data.description.length > 530 && (
							<button
								className="mt-2 text-orange-600 hover:underline md:text-2xl font-medium"
								onClick={() => setShowFullDesc(!showFullDesc)}
							>
								{showFullDesc ? 'See less' : 'See more'}
							</button>
						)}
					</div>

					{/* Detail Info */}
					<div className="max-w-xl mb-8 grid grid-cols-2 gap-x-1 gap-y-5 text-xl md:text-[28px]">
						{info.map(({ label, value }) => (
							<React.Fragment key={label}>
								<div className="font-semibold text-orange-600">
									{label}
								</div>
								<div className="text-gray-800">{value}</div>
							</React.Fragment>
						))}
					</div>

					{/* Gallery */}
					<div className="hidden md:block pt-8 border-t border-gray-200">
						<h2 className="text-5xl font-semibold text-gray-900 mb-11">
							From our gallery
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
							{visibleImages?.map((img, i) => (
								<ImageFallback
									key={img.id || i}
									src={img.url}
									alt={`Gallery image ${i + 1}`}
									className="w-full h-48 object-cover rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
								/>
							))}
						</div>
						{data.productImage?.length > 3 && (
							<div className="mt-12 text-center text-3xl font-extrabold">
								<button
									onClick={() => setShowAllImages(!showAllImages)}
									className="text-orange-600 hover:underline focus:outline-none"
								>
									{showAllImages ? 'See less' : 'See more'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="bg-gray-100 flex flex-col gap-8 md:gap-16 md:pb-24 py-10 md:p-8">
				{schedule.map((schedule, index) => (
					<ScheduleCard key={index} schedule={schedule} />
				))}
			</div>
		</section>
	);
};
