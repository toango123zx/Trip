import type React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { TProductSumary } from '@/types';

import { Button } from '../Button';
import { CardProduct } from '../Card';

type TopDestinationsProps = {
	productSummaries: TProductSumary[];
	className?: string;
};

const TopDestinations: React.FC<TopDestinationsProps> = ({
	productSummaries,
	className,
}) => {
	const fakeData: TProductSumary[] = [];

	for (let i = 1; i <= 10; i++) {
		fakeData.push({
			id: String(new Date().getTime() + i),
			name: `Tour số ${i}`,
			time: 60 + i * 5,
			quantityAvailable: 50 + i * 10,
			age: 10 + i,
			quantityCompleted: i * 100,
			description: `Mô tả tour du lịch số ${i}`,
			quantityRate: 1000 + i * 50,
			avgRate: parseFloat((4 + Math.random()).toFixed(1)),
			productCategoryName: 'Du lịch',
			locationName: `Địa điểm ${i}`,
			city: 'Đà Nẵng',
			price: 150000 + i * 10000,
			status: 'active',
			supplier: {
				id: String(new Date().getTime()),
				userId: String(new Date().getTime()),
				name: `Supplier ${i}`,
				image: '11234',
				status: 'active',
			},
			createAt: new Date().toISOString(),
			updateAt: new Date().toISOString(),
			deletedAt: null,
		});
	}
	productSummaries = [...fakeData];

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
							{productSummaries.map((attraction) => (
								<CardProduct product={attraction} />
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default TopDestinations;
export { TopDestinations };
