import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { BsBookmarkCheck, BsClock } from 'react-icons/bs';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { RiCalendarScheduleLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination, Navigation, Autoplay, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import { scheduleThunk } from '@/features/schedule';
import { cartThunk } from '@/features/cart';
import { cn } from '@/lib';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { EProductScheduleStatus, TProductSchedule } from '@/types';

import { productThunk } from '../../productThunk';
import { boxChatThunk } from '@/features/boxChat';

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

type TScheduleCardProps = {
	schedule: TProductSchedule;
	className?: string;
	isInCart?: boolean;
	disabled?: boolean;
	inCart?: boolean;
	onDetailsClick?: () => void;
};

const ScheduleCard = ({
	schedule,
	className,
	isInCart = false,
	disabled = false,
	inCart = false,
	onDetailsClick,
}: TScheduleCardProps): JSX.Element => {
	const statusColor =
		schedule.status === EProductScheduleStatus.active
			? 'text-green-500'
			: 'text-gray-500';
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [isAddedToCart, setIsAddedToCart] = useState(isInCart);

	const addScheduleInCart = (): void => {
		dispatch(scheduleThunk.addScheduleToCart(schedule.id));
		setIsAddedToCart(true);
	};

	const formatDateTime = (
		date: string,
	): {
		date: string;
		time: string;
		dayOfWeek: string;
	} => {
		const dateObj = new Date(date);
		return {
			date: dateObj.toLocaleDateString('vi-VN', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			}),
			time: dateObj.toLocaleTimeString('vi-VN', {
				hour: '2-digit',
				minute: '2-digit',
			}),
			dayOfWeek: dateObj.toLocaleDateString('vi-VN', { weekday: 'long' }),
		};
	};

	const startDateTime = formatDateTime(schedule.startTime.toLocaleString());
	const endDateTime = formatDateTime(schedule.endTime.toLocaleString());
	const startOrderDateTime = formatDateTime(schedule.startOrder.toLocaleString());
	const endOrderDateTime = formatDateTime(schedule.endOrder.toLocaleString());

	return (
		<section
			className={cn(
				'relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-in-out',
				'shadow-sm hover:shadow-md border border-gray-100',
				className,
			)}
		>
			{/* Header with date range */}
			<div className="bg-gradient-to-r from-blue-50 to-orange-50 p-5 border-b border-gray-100">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
							Tour Dates
						</p>
						<h3 className="text-xl font-bold text-gray-800 mt-1">
							{startDateTime.date} - {endDateTime.date}
						</h3>
					</div>
					{(inCart || isAddedToCart) && (
						<div className='bg-[#ff7921] py-4 px-8 rounded-2xl '>
							<p className='text-xs font-medium text-white uppercase tracking-wider'>In Cart</p>
						</div>
					)}
				</div>
			</div>

			<div className="p-5">
				{/* Time cards */}
				<div className="grid grid-cols-2 gap-3 mb-6">
					<div className="bg-gray-50 p-3 rounded-lg">
						<div className="flex items-center gap-2 text-gray-500 mb-1">
							<BsClock className="w-4 h-4" />
							<span className="text-xs font-medium">Start Time</span>
						</div>
						<p className="text-sm font-semibold text-gray-800">
							{startDateTime.date} {startDateTime.time}
						</p>
					</div>

					<div className="bg-gray-50 p-3 rounded-lg">
						<div className="flex items-center gap-2 text-gray-500 mb-1">
							<BsClock className="w-4 h-4" />
							<span className="text-xs font-medium">End Time</span>
						</div>
						<p className="text-sm font-semibold text-gray-800">
							{endDateTime.date} {endDateTime.time}
						</p>
					</div>

					<div className="bg-blue-50 p-3 rounded-lg">
						<div className="flex items-center gap-2 text-blue-500 mb-1">
							<IoCheckmarkCircleOutline className="w-4 h-4" />
							<span className="text-xs font-medium">Booking Opens</span>
						</div>
						<p className="text-sm font-semibold text-gray-800">
							{startOrderDateTime.date} {startOrderDateTime.time}
						</p>
					</div>

					<div className="bg-red-50 p-3 rounded-lg">
						<div className="flex items-center gap-2 text-red-500 mb-1">
							<IoCheckmarkCircleOutline className="w-4 h-4" />
							<span className="text-xs font-medium">Booking Closes</span>
						</div>
						<p className="text-sm font-semibold text-gray-800">
							{endOrderDateTime.date} {endOrderDateTime.time}
						</p>
					</div>
				</div>

				{/* Booking status - Updated to show number of people */}
				<div className="mb-6 bg-gray-50 p-4 rounded-lg">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-orange-100 p-2 rounded-full">
								<BsBookmarkCheck className="w-4 h-4 text-orange-600" />
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500">
									Booked Participants
								</p>
								<p className="text-lg font-bold text-gray-800">
									{schedule.booked}{' '}
									<span className="text-sm font-normal text-gray-500">
										people
									</span>
								</p>
							</div>
						</div>
						{/* <div className="text-sm text-gray-500">
							{schedule.capacity && (
								<span>of {schedule.capacity} total</span>
							)}
						</div> */}
					</div>
				</div>

				{/* Price and actions */}
				<div className="flex items-center justify-between border-t border-gray-100 pt-5">
					<div>
						<p className="text-2xl font-bold text-orange-600">
							{new Intl.NumberFormat('vi-VN').format(schedule.price)} ₫
						</p>
					</div>

					<div className="flex gap-3">
						{onDetailsClick && (
							<button
								onClick={onDetailsClick}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
							>
								<RiCalendarScheduleLine className="w-4 h-4" />
								Details
							</button>
						)}

						<button
							onClick={addScheduleInCart}
							disabled={isAddedToCart || disabled || inCart}
							className={cn(
								'px-6 py-2 rounded-lg text-sm font-semibold transition-colors bg-orange-500 text-white hover:bg-orange-600',
								'flex items-center gap-2',
							)}
						>
							Book Now
						</button>
					</div>
				</div>
			</div>
			{(disabled || isAddedToCart ||  inCart) &&
				<div className="absolute inset-0 bg-gray-100 opacity-50 z-20 cursor-not-allowed rounded-lg" />
			}
		</section>
	);
};

export const AttractionsInformation: React.FC = () => {
	const { attractionId } = useParams();
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const { productDetail: data } = useSelector(
		(state: TReduxStoreState) => state.product,
	);
	const { carts } = useSelector((state: TReduxStoreState) => state.cart);

	const [showAllImages, setShowAllImages] = useState(false);
	const [showFullDesc, setShowFullDesc] = useState(false);
	const swiperRef = useRef<unknown>(null);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [scheduledIdsDisabled, setScheduledIdsDisabled] = useState<Set<string>>(new Set());

	const nav = useNavigate();

	useEffect(() => {
		if (attractionId) {
			dispatch(productThunk.getProductDetail(attractionId));
			dispatch(cartThunk.getCarts());
		}
	}, [attractionId, dispatch]);

	// Filter schedules based on booking time and cart status
	const filteredSchedules = useMemo(() => {
		if (!data.productSchedule) return [];

		const now = new Date();
		setScheduledIdsDisabled(new Set(carts.map(cart => cart.scheduleId)));

		return data.productSchedule.filter(schedule => {
			const startOrder = new Date(schedule.startOrder);
			const endOrder = new Date(schedule.endOrder);

			const isBookingOpen = now >= startOrder;
			const isBookingNotEnded = now < endOrder;
			// const isNotBooked = !bookedScheduleIds.has(schedule.id);

			// return isBookingOpen && isBookingNotEnded && isNotBooked;
			return isBookingOpen && isBookingNotEnded;
		});
	}, [data.productSchedule, carts]);

	const truncatedDesc = useMemo(() => {
		if (!data.description) return '';
		return data.description.length > 300
			? data.description.slice(0, 300) + '...'
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
		{ label: 'Duration', value: `${data.time} hours` },
		{ label: 'Available', value: data.quantityAvailable },
		{ label: 'Completed', value: data.quantityCompleted },
	];

	// Chuyển đổi dữ liệu ảnh sang định dạng của ImageGallery
	const images = data.productImage?.map(img => ({
		original: img.url,
		thumbnail: img.url,
		originalAlt: 'Gallery image',
		thumbnailAlt: 'Gallery thumbnail'
	}));

	const handleImageClick = (index: number) => {
		setCurrentImageIndex(index);
		setIsGalleryOpen(true);
	};

	const handleContactClick = () => {
		dispatch(boxChatThunk.createBoxChat({
			name: `${data.supplier.name} - ${localStorage.getItem('username')}`,
			boxChatMember: [
				data.supplier.userId,
			]
		}))
		nav('/chats')
	}

	return (
		<section className="relative">
			{/* Main Content */}
			<div className="container mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
				{/* Header */}
				<div className="mb-6 pb-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-2xl md:text-4xl font-bold text-gray-900">
								{data.name}
							</h1>
							<div className="flex items-center gap-2 text-gray-500 mt-2">
								<IoLocationOutline className="text-orange-500" />
								<span className="text-sm md:text-base">{data.city}</span>
							</div>
						</div>
						<div className="flex items-center gap-2 text-gray-500">
							<div className="flex gap-1 items-center">
								{stars}
								<span className="ml-1 text-sm md:text-base">
									{data.avgRate}
								</span>
							</div>
							<span className="text-sm md:text-base">
								({data.quantityRate} reviews)
							</span>
						</div>
					</div>
				</div>

				{/* Mobile Swiper */}
				<div className="md:hidden mb-6">
					<Swiper
						modules={[Pagination, Navigation, Autoplay, Mousewheel]}
						onSwiper={(swiper) => (swiperRef.current = swiper)}
						slidesPerView={1}
						spaceBetween={20}
						loop={false}
						speed={600}
						autoplay={{ delay: 3500, disableOnInteraction: false }}
						pagination={{ clickable: true, dynamicBullets: true }}
						mousewheel
					>
						{data.productImage?.map((img, i) => (
							<SwiperSlide key={img.id || i}>
								<div className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
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
				<div className="mb-8 text-gray-700 leading-relaxed text-sm md:text-base">
					<p>{showFullDesc ? data.description : truncatedDesc}</p>
					{data.description?.length > 300 && (
						<button
							className="mt-3 text-orange-600 hover:underline font-medium text-sm md:text-base"
							onClick={(): void => setShowFullDesc((v) => !v)}
						>
							{showFullDesc ? 'Show less' : 'Read more'}
						</button>
					)}
				</div>
					
				{/* Detail Info */}
				<div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					{info.map(({ label, value }) => (
						<div key={label} className="bg-gray-50 p-4 rounded-lg">
							<div className="text-xs text-gray-500 uppercase tracking-wider">
								{label}
							</div>
							<div className="text-base font-semibold text-gray-800 mt-1">
								{value}
							</div>
						</div>
					))}
				</div>
				

				{/* Gallery */}
				<div className="pt-8 border-t border-gray-200">
					<h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
						Gallery
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{data.productImage?.map((img, i) => (
							<div
								key={img.id || i}
								className="group relative overflow-hidden rounded-lg cursor-pointer"
								onClick={() => handleImageClick(i)}
							>
								<ImageFallback
									src={img.url}
									alt={`Gallery image ${i + 1}`}
									className="w-full h-48 md:h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
						))}
					</div>
					{data.productImage?.length > 6 && (
						<div className="mt-6 text-center">
							<button
								onClick={() => setShowAllImages((v) => !v)}
								className="text-orange-600 hover:underline focus:outline-none font-medium"
							>
								{showAllImages ? 'Show less' : 'View more photos'}
							</button>
						</div>
					)}
				</div>

				{/* Google Map Section */}
				{data.mapAddress?.url && (
					<div className="my-8">
						<h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
							Map Address
						</h2>
						<div className="w-full h-96 rounded-lg overflow-hidden">
							<iframe
								src={data.mapAddress.url}
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Google Map"
							></iframe>
						</div>
					</div>
				)}
			</div>

			{/* Schedules */}
			<div className="container mx-auto px-4 md:px-0">
				<div className="bg-gray-50 rounded-lg p-6 md:p-8 my-8">
					<h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
						Available Schedules
					</h2>
					<div className="space-y-4">
						{filteredSchedules.map((sched) => (
							<ScheduleCard key={sched.id} schedule={sched} disabled={scheduledIdsDisabled.has(sched.id)} inCart={scheduledIdsDisabled.has(sched.id)} />
						))}
						{filteredSchedules.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								No available schedules at the moment
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Image Gallery Modal */}
			{isGalleryOpen && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
					<div className="w-full max-w-[1536px] mx-auto p-4">
						<button
							onClick={() => setIsGalleryOpen(false)}
							className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						<ImageGallery
							items={images}
							startIndex={currentImageIndex}
							showPlayButton={false}
							showFullscreenButton={true}
							showNav={true}
							showThumbnails={true}
							thumbnailPosition="bottom"
							slideInterval={3000}
							onClose={() => setIsGalleryOpen(false)}
							additionalClass="custom-gallery"
						/>
					</div>
				</div>
			)}

			{/* Thêm CSS tùy chỉnh */}
			<style>{`
				.custom-gallery .image-gallery-slide {
					background: transparent;
				}
				.custom-gallery .image-gallery-thumbnail {
					width: 100px;
					height: 70px;
					overflow: hidden;
					border-radius: 4px;
					margin: 0 4px;
				}
				.custom-gallery .image-gallery-thumbnail.active {
					border: 2px solid #3b82f6;
				}
				.custom-gallery .image-gallery-thumbnail:hover {
					border: 2px solid #60a5fa;
				}
				.custom-gallery .image-gallery-thumbnails-container {
					background: transparent;
				}
				.custom-gallery .image-gallery-thumbnails {
					padding: 10px 0;
				}
				.custom-gallery .image-gallery-thumbnail-image {
					object-fit: cover;
					height: 100%;
				}
				.custom-gallery .image-gallery-icon {
					filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1));
				}
				.custom-gallery .image-gallery-icon:hover {
					color: #60a5fa;
				}
			`}</style>
		</section>
	);
};
