import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/lib/utils';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { productThunk } from '../../productThunk';
import { Button } from '../Button';
import { CardProduct } from '../Card';

type TTopDestinationsProps = {
	className?: string;
};

const TopDestinations = ({ className }: TTopDestinationsProps): JSX.Element => {
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const productSummaries = useSelector(
		(state: TReduxStoreState) => state.product.products,
	);

	useEffect(() => {
		dispatch(productThunk.getProducts());
	}, [dispatch]);

	const [currentIndex, setCurrentIndex] = useState(0);
	const maxIndex = productSummaries.length - (window.innerWidth >= 768 ? 3 : 1);

	const handlePrev = (): void => {
		setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
	};

	const handleNext = (): void => {
		setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
	};

	return (
		<div>
			<section className={cn('py-16 px-4 md:px-8 md:pt-0 md:pb-20', className)}>
				<div className="max-w-[1536px] mx-auto">
					<div className="flex justify-between items-end mb-10">
						<div>
							<span className="text-orange-500 font-medium">
								Top productSummaries
							</span>
							<h2 className="text-3xl font-bold mt-1">
								Discover your love
							</h2>
						</div>
						<div className="md:hidden">
							<a
								href="/products"
								className="font-normal text-lg text-blue-400"
							>
								View All
							</a>
						</div>
						<div className="hidden md:flex">
							<div className="flex space-x-2">
								<Button
									variant="outline"
									size="icon"
									className="rounded-full"
									onClick={handlePrev}
									disabled={currentIndex === 0}
								>
									<ChevronLeft className="h-5 w-5" />
								</Button>
								<Button
									variant="default"
									size="icon"
									className="rounded-full bg-orange-500 hover:bg-orange-600"
									onClick={handleNext}
									disabled={currentIndex >= maxIndex}
								>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</div>
						</div>
					</div>

					<div className="relative overflow-hidden ">
						<div
							className="grid grid-cols-2 gap-y-6 md:flex transition-transform duration-300 ease-in-out"
							style={{
								transform: `translateX(-${currentIndex * (100 / (window.innerWidth >= 768 ? 3 : 1))}%)`,
							}}
						>
							{productSummaries.map((product) => (
								<CardProduct key={product.id} product={product} />
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export { TopDestinations };
