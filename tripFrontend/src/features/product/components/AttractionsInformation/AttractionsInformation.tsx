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

import { scheduleThunk } from '@/features/schedule';
import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EProductScheduleStatus, TProductSchedule } from '@/types';

import { productThunk } from '../../productThunk';

type TStarIconProps = { filled: boolean };
const StarIcon = ({ filled }: TStarIconProps): JSX.Element =>
	filled ? (
		<FaStar className="w-4 h-4 text-yellow-400" />
	) : (
		<FaRegStar className="w-4 h-4 text-gray-300" />
	);

type TImageFallbackProps = { src: string; alt: string; className?: string };
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

type TScheduleCardProps = { schedule: TProductSchedule; className?: string };
const ScheduleCard = ({ schedule, className }: TScheduleCardProps): JSX.Element => {
	const statusColor =
		schedule.status === EProductScheduleStatus.active
			? 'text-green-500'
			: 'text-gray-500';
	const dispatch = useDispatch<TReduxStoreDispatch>();

	const addScheduleInCart = (): void => {
		dispatch(scheduleThunk.addScheduleToCart(schedule.id));
	};

	const renderInfoSection = (
		icon: 'calendar' | 'document' | 'check',
		label: string,
		value: string,
	): JSX.Element => (
		<div className="flex items-center gap-1.5 md:gap-5">
			<RiCalendarScheduleLine className="w-6 md:w-14 h-full text-gray-700" />
			<div className="flex flex-col gap-1 md:gap-2.5">
				<p className="text-xs md:text-2xl text-gray-500">{label}</p>
				<p className="text-sm md:text-3xl font-bold text-black">{value}</p>
			</div>
		</div>
	);

	return (
		<section className={cn('bg-gray-100 relative md:pt-0', className)}>
			<div className="container mx-auto bg-white rounded-lg shadow-lg p-4 md:py-9 md:px-24">
				<div className="w-full md:flex md:justify-between md:gap-8">
					<div className="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-11 w-full md:max-w-8/12">
						{renderInfoSection(
							'calendar',
							'Start Date',
							new Date(schedule.startTime).toLocaleString(),
						)}
						{renderInfoSection(
							'calendar',
							'End Date',
							new Date(schedule.endTime).toLocaleString(),
						)}
						<div className="flex items-center gap-1.5 md:gap-5">
							<BsBookmarkCheck className="w-6 md:w-14 h-full text-gray-700" />
							<div className="flex flex-col gap-1 md:gap-2.5">
								<p className="text-xs md:text-2xl text-gray-500">
									Booked
								</p>
								<p className="text-sm md:text-3xl font-bold text-black">
									{schedule.booked}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2.5 md:gap-5">
							<IoCheckmarkCircleOutline
								className={`w-6 md:w-14 h-full ${statusColor}`}
							/>
							<p className={`text-sm md:text-4xl font-bold ${statusColor}`}>
								{schedule.status}
							</p>
						</div>

						{/* Mobile Add */}
						<div className="md:hidden row-span-2 flex flex-col items-center gap-4 pt-2">
							<div className="text-2xl font-bold text-orange-400">
								{schedule.price} VND
							</div>
							<button
								onClick={addScheduleInCart}
								className="bg-orange-400 hover:bg-orange-600 text-white font-semibold rounded-full transition px-8 py-2 text-xl"
							>
								Add
							</button>
						</div>
					</div>

					{/* Desktop Add */}
					<div className="hidden md:flex flex-col items-center gap-4 pt-2">
						<div className="text-6xl font-bold text-orange-400">
							{new Intl.NumberFormat('vi-VN').format(schedule.price)} ₫
						</div>
						<button
							onClick={addScheduleInCart}
							className="bg-orange-400 hover:bg-orange-600 text-white font-semibold rounded-full transition px-20 py-3.5 text-4xl"
						>
							Add
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export const AttractionsInformation: React.FC = () => {
	const { attractionId } = useParams();
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const { productDetail: data } = useSelector(
		(state: TReduxStoreState) => state.product,
	);

	const [showAllImages, setShowAllImages] = useState(false);
	const [showFullDesc, setShowFullDesc] = useState(false);
	const swiperRef = useRef<unknown>(null);

	useEffect(() => {
		if (attractionId) dispatch(productThunk.getProductDetail(attractionId));
	}, [attractionId, dispatch]);

	const truncatedDesc = useMemo(() => {
		if (!data.description) return '';
		return data.description.length > 530
			? data.description.slice(0, 530) + '...'
			: data.description;
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
		{ label: 'Completed', value: data.quantityCompleted },
	];

	return (
		<section className={cn('relative md:pt-0')}>
			<div className="container mx-auto bg-white rounded-lg shadow-lg p-6 md:px-14 md:py-16">
				{/* Header */}
				<div className="mb-6 border-b border-gray-200 pb-6">
					<div className="flex justify-between items-center">
						<h1 className="text-4xl md:text-6xl font-bold text-gray-900">
							{data.name}
						</h1>
						<div className="flex items-center gap-2 text-gray-500 text-sm md:text-4xl">
							<IoLocationOutline /> <span>{data.city}</span>
						</div>
					</div>
					<div className="flex items-center gap-2 text-sm md:text-2xl text-gray-500">
						<div className="hidden md:flex gap-1">{stars}</div>
						<div className="md:hidden flex gap-1.5 items-center">
							<StarIcon filled={data.avgRate > 0} />{' '}
							<span>{data.avgRate}</span>
						</div>
						<span>({data.quantityRate} review)</span>
					</div>
				</div>

				{/* Mobile Swiper */}
				<div className="md:hidden py-4">
					<Swiper
						modules={[Pagination, Navigation, Autoplay, Mousewheel]}
						onSwiper={(swiper) => (swiperRef.current = swiper)}
						slidesPerView={(window.innerWidth - 40) / 230}
						loop={false}
						speed={600}
						autoplay={{ delay: 3500, disableOnInteraction: false }}
						pagination={{ clickable: true, dynamicBullets: true }}
						mousewheel
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
					{data.description?.length > 530 && (
						<button
							className="mt-2 text-orange-600 hover:underline md:text-2xl font-medium"
							onClick={(): void => setShowFullDesc((v) => !v)}
						>
							{showFullDesc ? 'See less' : 'See more'}
						</button>
					)}
				</div>

				{/* Detail Info */}
				<div className="max-w-xl mb-8 grid grid-cols-2 gap-x-1 gap-y-5 text-xl md:text-[28px]">
					{info.map(({ label, value }) => (
						<React.Fragment key={label}>
							<div className="font-semibold text-orange-600">{label}</div>
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
								className="w-full h-80 object-cover rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
							/>
						))}
					</div>
					{data.productImage?.length > 3 && (
						<div className="mt-12 text-center text-3xl font-extrabold">
							<button
								onClick={() => setShowAllImages((v) => !v)}
								className="text-orange-600 hover:underline focus:outline-none"
							>
								{showAllImages ? 'See less' : 'See more'}
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Schedules */}
			<div className="bg-gray-100 flex flex-col gap-8 md:gap-16 md:pb-24 py-10 md:p-8">
				{data.productSchedule?.map((sched) => (
					<ScheduleCard key={sched.id} schedule={sched} />
				))}
			</div>
		</section>
	);
};
