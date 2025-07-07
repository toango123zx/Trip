import React, { Dispatch, JSX, SetStateAction } from 'react';
import { BiSolidMessageDetail } from 'react-icons/bi';
import { FaHouseUser } from 'react-icons/fa6';
import { IoMdInformationCircle } from 'react-icons/io';

import { attractionsImages } from '@/assets';
import { cn } from '@/lib';

type THeroAttractionsProps = {
	value: string;
	tabOnChange: Dispatch<SetStateAction<string>>;
	className?: string;
};

export const HeroAttractionsDetail = ({
	value,
	tabOnChange,
	className,
}: THeroAttractionsProps): JSX.Element => {
	const handleTabChange = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const targetValue = (e.currentTarget as HTMLButtonElement).value;
		tabOnChange((prev: string) => {
			return prev === targetValue ? prev : targetValue;
		});
	};

	return (
		<section
			className={cn(
				'relative bg-white md:pt-0 overflow-hidden',
				className
			)}
			aria-labelledby="hero-attractions-detail-heading"
		>
			<div className="relative w-full h-[500px] md:h-[1080px]">
				{/* Background image */}
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: `url(${attractionsImages.backgroundAttractionDetailHero})` }}
				/>

				{/* Overlay content */}
				<div className="absolute inset-0 bg-black/30 z-0" />

				{/* Text section */}
				<div className="max-w-[1536px] w-full px-6 md:px-20 mx-auto relative grid justify-center">
					<p className="w-full text-[60px] md:text-[225px] text-white/50 font-bold text-center">
						DETAILS
					</p>
					<h1 className="text-3xl md:text-7xl text-center font-bold text-white w-full">
						Attraction Information
					</h1>
				</div>

				{/* Tab Navigation */}
				<div className="absolute left-0 bottom-0 w-full flex justify-center px-4">
					<div className="w-full max-w-[1280px]">
						<div className="w-full bg-white/90 p-1 rounded-xl shadow-lg">
							<div className="grid grid-cols-3 gap-1">
								{/* Information Tab */}
								<button
									onClick={handleTabChange}
									value="information"
									className={cn(
										'flex items-center justify-center py-4 md:py-5 rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-gray-50 active:scale-[0.98]',
										value === 'information'
											? 'bg-white shadow-md text-orange-600 font-bold'
											: 'text-gray-600 font-medium'
									)}
								>
									<IoMdInformationCircle className="w-5 h-5 md:w-6 md:h-6 mr-2" />
									<span className="hidden md:inline">Information</span>
									<span className="md:hidden">Info</span>
								</button>

								{/* Ratings Tab */}
								<button
									onClick={handleTabChange}
									value="rate"
									className={cn(
										'flex items-center justify-center py-4 md:py-5 rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-gray-50 active:scale-[0.98]',
										value === 'rate'
											? 'bg-white shadow-md text-orange-600 font-bold'
											: 'text-gray-600 font-medium'
									)}
								>
									<BiSolidMessageDetail className="w-5 h-5 md:w-6 md:h-6 mr-2" />
									<span className="hidden md:inline">Ratings</span>
									<span className="md:hidden">Rate</span>
								</button>

								{/* Supplier Tab */}
								<button
									onClick={handleTabChange}
									value="supplier"
									className={cn(
										'flex items-center justify-center py-4 md:py-5 rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-gray-50 active:scale-[0.98]',
										value === 'supplier'
											? 'bg-white shadow-md text-orange-600 font-bold'
											: 'text-gray-600 font-medium'
									)}
								>
									<FaHouseUser className="w-5 h-5 md:w-6 md:h-6 mr-2" />
									<span>Supplier</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
