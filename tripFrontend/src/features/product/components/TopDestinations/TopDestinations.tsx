import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JSX, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { cn } from '@/lib/utils';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { productThunk } from '../../productThunk';
import { CardProduct } from '../Card';

type TTopDestinationsProps = {
	className?: string;
};

const TopDestinations = ({ className }: TTopDestinationsProps): JSX.Element => {
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const productSummaries = useSelector(
		(state: TReduxStoreState) => state.product.products,
	);
	const swiperRef = useRef(null);

	useEffect(() => {
		dispatch(productThunk.getProducts());
	}, [dispatch]);

	return (
		<div>
			<section className={cn('px-4 md:px-8 md:pt-0', className)}>
				<div className="max-w-[1536px] mx-auto">
					<div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 relative">
						<div className="mb-4 md:mb-0">
							<span className="text-[#FF7A30] font-semibold mb-4 text-3xl font-[Montserrat] text-left">
								Top Attractions
							</span>
							<h2 className="font-semibold text-4xl font-[Montserrat] text-left">
								Discover your love
							</h2>
						</div>
						<div className="hidden md:flex items-center gap-2 flex gap-1.5 flex-row-reverse md:top-0 md:right-0 z-1">
							<a
								href="/attractions"
								className="text-orange-500 inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors group"
							>
								See more
								<svg
									className="w-4 h-4 group-hover:text-orange-600 transition"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</a>
						</div>
					</div>

					<Swiper
						modules={[Navigation, Pagination, Mousewheel, Autoplay]}
						spaceBetween={24}
						slidesPerView={3}
						mousewheel
						autoplay={{
							delay: 3500,
							disableOnInteraction: false,
						}}
						loop
						ref={swiperRef}
						breakpoints={{
							0: {
								slidesPerView: 1,
								spaceBetween: 10,
							},
							768: {
								slidesPerView: 3,
								spaceBetween: 24,
							},
						}}
					>
						{productSummaries.map((product) => (
							<SwiperSlide key={product.id}>
								<CardProduct product={product} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</section>
		</div>
	);
};

export { TopDestinations };
