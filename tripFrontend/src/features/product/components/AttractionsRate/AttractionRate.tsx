import { Star } from 'lucide-react';
import { JSX, useMemo, useState } from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';

import { SelectBox } from '@/components';
import { cn } from '@/lib';
import { TProductDetail, TProductRate } from '@/types';
import { BaNa } from '@/utils';

type TRatingCardProps = {
	rate: TProductRate;
	className?: string;
};

const RatingCard = ({ rate, className }: TRatingCardProps): JSX.Element => (
	<section
		className={cn('relative md:pt-0', className)}
		aria-labelledby="attractions-rating"
	>
		<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col text-sm md:text-2xl">
			<div className="flex justify-between items-start mb-1 md:mb-3">
				<div>
					<div className="flex items-center mb-1.5 md:mb-3.5 gap-0.5">
						{Array.from({ length: 5 }).map((_, index) => (
							<Star
								key={index}
								className={`w-3 md:w-5 ${index < rate.star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
							/>
						))}
					</div>
					<div className="flex items-center">
						<span className="font-medium text-gray-800 mr-1">
							{rate.userName}
						</span>
						<IoMdCheckmarkCircle className="w-3.5 md:w-5 text-green-500" />
					</div>
				</div>
			</div>
			<p className="text-gray-600 mb-2.5 md:mb-6 italic flex-grow">
				"{rate.comment}"
			</p>
			<p className="text-xs md:text-xl text-gray-400 mt-auto">
				Posted on {rate.createAt}
			</p>
		</div>
	</section>
);

type TAttractionRateProps = {
	className?: string;
};

export const AttractionRate = ({ className }: TAttractionRateProps): JSX.Element => {
	const attraction: TProductDetail = BaNa;
	const REVIEWS_PER_PAGE = 8;

	const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

	const stars = useMemo(
		() =>
			Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					fill={
						i + 0.5 < attraction.avgRate
							? 'currentColor'
							: i < attraction.avgRate
								? 'url(#half-gradient)'
								: 'none'
					}
					className="text-yellow-300 w-4 md:w-7"
				/>
			)),
		[attraction.avgRate],
	);

	const handleLoadMore = (): void =>
		setVisibleCount((prev) =>
			Math.min(prev + REVIEWS_PER_PAGE, attraction.productRate.length),
		);

	return (
		<section
			className={cn('relative md:pt-0', className)}
			aria-labelledby="attractions-rate"
		>
			<div className="container mx-auto bg-white rounded-lg shadow-lg p-6 md:px-20 md:py-16 font-sans">
				<div className="flex justify-between items-center mb-5 md:mb-8">
					<div className="space-y-2 md:space-y-5 w-full">
						<h2 className="text-xl md:text-4xl font-semibold text-gray-800">
							Ratings
						</h2>
						<div className="flex justify-between items-end w-full">
							<div className="flex items-center gap-2 text-sm md:text-2xl text-gray-500">
								<div className="flex flex-col-reverse gap-0 md:gap-1.5 text-base md:text-3xl">
									<div className="flex gap-1.5 items-center">
										{stars}
									</div>
									<div className="space-x-1 md:space-x-2.5">
										<span className="text-orange-400">
											{attraction.avgRate}
										</span>
										<span className="md:text-xl">
											({attraction.quantityRate})
										</span>
									</div>
								</div>
							</div>
							<SelectBox
								selectOption={[
									{ id: '1', label: 'latest', value: 'latest' },
									{ id: '2', label: 'oldest', value: 'oldest' },
								]}
								className="w-28 md:w-52 h-8 md:h-10 flex items-center justify-between px-4 md:px-6 text-sm md:text-2xl border border-black rounded-4xl bg-white focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-transparent transition-all duration-150"
							/>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6 md:mb-12">
					{attraction.productRate.slice(0, visibleCount).map((rate) => (
						<RatingCard key={rate.id} rate={rate} />
					))}
				</div>

				<div className="text-center">
					{visibleCount < attraction.productRate.length ? (
						<button
							onClick={handleLoadMore}
							className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-5 rounded-full shadow-md transition duration-150 ease-in-out"
						>
							Load More Reviews (
							{attraction.productRate.length - visibleCount} remaining)
						</button>
					) : (
						<p className="text-sm text-gray-500">All reviews loaded.</p>
					)}
				</div>
			</div>
		</section>
	);
};
