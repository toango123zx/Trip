import React, { JSX, useMemo, useState, useEffect } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { IoLocationOutline } from 'react-icons/io5';
import { notification, Select } from 'antd';
import { useSelector } from 'react-redux';
import { cn } from '@/lib';
import { TProductDetail, TProductRate } from '@/types';
import { TReduxStoreState } from '@/store';
import { rateApi } from '@/features/product/rateApi';

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toISOString().split('T')[0];
};

type TRatingCardProps = {
	rate: TProductRate;
	className?: string;
};

const RatingCard = ({ rate, className }: TRatingCardProps): JSX.Element => (
	<div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-in-out shadow-sm hover:shadow-md border border-gray-100">
		<div className="bg-gradient-to-r from-blue-50 to-orange-50 p-5 border-b border-gray-100">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-800">{rate.userName}</span>
				</div>
				<div className="flex items-center gap-1">
					{Array.from({ length: 5 }).map((_, index) => (
						<Star
							key={index}
							className={`w-4 h-4 ${index < rate.star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
						/>
					))}
				</div>
			</div>
		</div>
		<div className="p-5">
			<p className="text-gray-600 italic mb-4">"{rate.comment}"</p>
			<div className="text-xs text-gray-400 flex justify-between items-center">
				<span>Posted on {formatDate(rate.createAt)}</span>
			</div>
		</div>
	</div>
);

type SortType = 'latest' | 'highest' | 'oldest';

type TAttractionRateProps = {
	className?: string;
};

export const AttractionRate = ({ className }: TAttractionRateProps): JSX.Element => {
	const attraction = useSelector<TReduxStoreState, TProductDetail>(
		(state) => state.product.productDetail
	);
	const REVIEWS_PER_PAGE = 8;

	const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);
	const [selectedStars, setSelectedStars] = useState(0);
	const [comment, setComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [rates, setRates] = useState<TProductRate[]>([]);
	const [sortBy, setSortBy] = useState<SortType>('latest');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (attraction?.id) {
			fetchRates();
		}
	}, [attraction?.id, sortBy]);

	const fetchRates = async () => {
		if (!attraction?.id) return;
		
		try {
			setIsLoading(true);
			const [ratesData, pagination] = await rateApi.getRates(attraction.id);
			setRates(ratesData);
		} catch (error) {
			console.error('Error fetching rates:', error);
			notification.error({
				message: 'Error',
				description: 'Unable to load reviews. Please try again later.',
				placement: 'topRight',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleLoadMore = async () => {
		const newCount = visibleCount + REVIEWS_PER_PAGE;
		setVisibleCount(newCount);
		await fetchRates();
	};

	const handleSortChange = (value: string) => {
		setSortBy(value as SortType);
		// Refresh rates when sort changes
		fetchRates();
	};

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

	const handleStarClick = (starCount: number): void => {
		setSelectedStars(starCount);
	};

	const handleSubmitReview = async (): Promise<void> => {
		if (selectedStars > 0 && comment.trim()) {
			try {
				setIsSubmitting(true);
				const response = await rateApi.submitRate(attraction.id, {
					star: selectedStars,
					comment: comment.trim()
				});

				if (response.success) {
					notification.success({
						message: 'Success',
						description: 'Your review has been submitted successfully!',
						placement: 'topRight',
					});
					// Reset form after submission
					setSelectedStars(0);
					setComment('');
					// TODO: Refresh the reviews list
				} else {
					notification.error({
						message: 'Error',
						description: 'An error occurred while submitting your review. Please try again later.',
						placement: 'topRight',
					});
				}
			} catch (error) {
				console.error('Error submitting review:', error);
				notification.error({
					message: 'Error',
					description: 'An error occurred while submitting your review. Please try again later.',
					placement: 'topRight',
				});
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	return (
		<section className={cn('relative', className)}>
			<div className="container mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
				{/* Header */}
				<div className="mb-6 pb-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-2xl md:text-4xl font-bold text-gray-900">
								Ratings & Reviews
							</h1>
							<div className="flex items-center gap-2 text-gray-500 mt-2">
								<IoLocationOutline className="text-orange-500" />
								<span className="text-sm md:text-base">{attraction.city}</span>
							</div>
						</div>
						<div className="flex items-center gap-2 text-gray-500">
							<div className="flex gap-1 items-center">
								{stars}
								<span className="ml-1 text-sm md:text-base">
									{attraction.avgRate}
								</span>
							</div>
							<span className="text-sm md:text-base">
								({attraction.quantityRate} reviews)
							</span>
						</div>
					</div>
				</div>

				{/* Review Submission Section */}
				<div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-inner">
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-xl font-semibold text-gray-800 mb-4">
								Write a Review
							</h3>
							<div className="flex items-center space-x-2 mb-4">
								{Array.from({ length: 5 }).map((_, index) => (
									<Star
										key={index}
										onClick={() => handleStarClick(index + 1)}
										className={`w-6 md:w-8 cursor-pointer transition-colors duration-200 ${
											index < selectedStars 
											? 'text-yellow-400 fill-yellow-400' 
											: 'text-gray-300 hover:text-yellow-300'
										}`}
									/>
								))}
							</div>
							<p className="text-sm text-gray-500 mb-2">
								{selectedStars > 0 
									? `You selected ${selectedStars} star${selectedStars > 1 ? 's' : ''}` 
									: 'Select your rating'}
							</p>
						</div>
						<div className="space-y-4">
							<textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="Share your experience..."
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 transition-all duration-150 min-h-[150px]"
							/>
							<button 
								onClick={handleSubmitReview}
								disabled={selectedStars === 0 || !comment.trim() || isSubmitting}
								className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
							>
								<Send className="w-5 h-5 mr-2" />
								{isSubmitting ? 'Submitting...' : 'Submit Review'}
							</button>
						</div>
					</div>
				</div>

				{/* Reviews Grid */}
				<div className="bg-gray-50 rounded-lg p-6">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-semibold text-gray-900">
							Customer Reviews
						</h2>
						<Select
							value={sortBy}
							onChange={handleSortChange}
							options={[
								{ value: 'latest', label: 'Latest' },
								{ value: 'highest', label: 'Highest Rated' },
								{ value: 'oldest', label: 'Oldest' },
							]}
							className="w-48"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						{isLoading ? (
							<div className="col-span-2 text-center py-8">Loading...</div>
						) : rates.length > 0 ? (
							rates.map((rate) => (
								<RatingCard key={rate.id} rate={rate} />
							))
						) : (
							<div className="col-span-2 text-center py-8 text-gray-500">
								No reviews yet
							</div>
						)}
					</div>

					{rates.length >= visibleCount && (
						<div className="text-center">
							<button
								onClick={handleLoadMore}
								disabled={isLoading}
								className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-6 rounded-full shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? 'Loading...' : 'Load More Reviews'}
							</button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
