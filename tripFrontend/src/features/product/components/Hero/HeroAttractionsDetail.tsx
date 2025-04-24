import React, { Dispatch, FormEvent, JSX, SetStateAction } from 'react';
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
	const handleTabChange = (e: FormEvent<HTMLDivElement>): void => {
		tabOnChange((prev: string) => {
			if (prev === (e.target as HTMLButtonElement).value) {
				return prev;
			}
			return (e.target as HTMLButtonElement).value;
		});
	};

	const classSelected = `outline-none ring-2 ring-offset-1 ring-orange-500 bg-white text-orange-600 shadow-lg`;

	return (
		<section
			className={cn('bg-white relative md:pt-0', className)}
			aria-labelledby="hero-attractions-heading"
		>
			<div className="relative max-h-[1080px] bg-cover bg-center">
				<img
					src={attractionsImages.backgroundAttractionDetailHero}
					alt="Scenic landscape of popular attractions"
					className="hidden md:block w-screen h-[1080px] object-cover"
				/>
				<div className="hidden md:block container mx-auto px-4">
					<div className="absolute w-full inset-0">
						<div className="container h-full mx-auto px-4 relative z-10 flex justify-center items-center">
							<div className="max-w-[1536px] w-full relative">
								<p className="w-full text-[225px] text-center text-white/50  font-bold text-red ">
									LANDSCAPES
								</p>
								<h1 className="w-full absolute top-0 mt-32 text-7xl text-center font-bold text-orange-500">
									Discover
								</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="w-full md:mt-[-168px]">
					<div className="w-full flex justify-center pt-5 md:p-1 font-Montserrat text-center text-lg md:text-2xl font-bold">
						<div className="container z-10">
							<div
								onClick={(e) => handleTabChange(e)}
								className="w-full p-0.5 bg-gray-200 md:bg-white grid grid-cols-3 gap-x-1 md:gap-x-3 rounded-lg shadow-md font-semibold"
							>
								<button
									className={`hidden py-6 md:py-16 md:flex items-center justify-center rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 focus:bg-white focus:text-orange-600 hover:bg-gray-200 hover:text-gray-700 focus:shadow-lg ${value == 'information' && classSelected}`}
									value={'information'}
								>
									<IoMdInformationCircle className="w-6 h-full mr-2.5" />
									Information
								</button>
								<button
									className={`md:hidden py-6 md:py-16 md:bg-gray-300 flex items-center justify-center rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 focus:bg-white focus:text-orange-600 hover:bg-gray-200 hover:text-gray-700 focus:shadow-lg ${value == 'information' && classSelected}`}
									value={'information'}
								>
									<IoMdInformationCircle className="w-6 h-full mr-2.5" />
									Infor
								</button>

								<button
									className={`py-6 md:py-16  flex items-center justify-center rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 hover:bg-gray-200 hover:text-gray-700 focus:text-orange-600 focus:bg-white focus:shadow-sm ${value == 'rate' && classSelected}`}
									value={'rate'}
								>
									<BiSolidMessageDetail className="w-6 h-full mr-2.5" />
									Ratings
								</button>

								<button
									className={`py-6 md:py-16 flex items-center justify-center rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 hover:bg-gray-200 hover:text-gray-700 focus:text-orange-600 focus:bg-white focus:shadow-sm ${value == 'supplier' && classSelected}`}
									value={'supplier'}
								>
									<FaHouseUser className="w-6 h-full mr-2.5" />
									Supplier
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
