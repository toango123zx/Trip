import { Dispatch, FormEvent, JSX, SetStateAction } from 'react';
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
							<div className="w-full bg-gray-100 p-1 rounded-xl shadow-inner">
								<div className="grid grid-cols-3 gap-1">
									{/* Information Tab */}
									<button
										onClick={(e) => handleTabChange(e)}
										value="information"
										className={`
        flex items-center justify-center py-4 md:py-5 rounded-lg transition-all
        duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400
        hover:bg-gray-50 active:scale-[0.98]
        ${
			value === 'information'
				? 'bg-white shadow-md text-orange-600 font-bold'
				: 'text-gray-600 font-medium'
		}
      `}
									>
										<IoMdInformationCircle className="w-5 h-5 md:w-6 md:h-6 mr-2" />
										<span className="hidden md:inline">
											Information
										</span>
										<span className="md:hidden">Info</span>
									</button>

									{/* Ratings Tab */}
									<button
										onClick={(e) => handleTabChange(e)}
										value="rate"
										className={`
        flex items-center justify-center py-4 md:py-5 rounded-lg transition-all
        duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400
        hover:bg-gray-50 active:scale-[0.98]
        ${
			value === 'rate'
				? 'bg-white shadow-md text-orange-600 font-bold'
				: 'text-gray-600 font-medium'
		}
      `}
									>
										<BiSolidMessageDetail className="w-5 h-5 md:w-6 md:h-6 mr-2" />
										<span className="hidden md:inline">Ratings</span>
										<span className="md:hidden">Rate</span>
									</button>

									{/* Supplier Tab */}
									<button
										onClick={(e) => handleTabChange(e)}
										value="supplier"
										className={`
        flex items-center justify-center py-4 md:py-5 rounded-lg transition-all
        duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400
        hover:bg-gray-50 active:scale-[0.98]
        ${
			value === 'supplier'
				? 'bg-white shadow-md text-orange-600 font-bold'
				: 'text-gray-600 font-medium'
		}
      `}
									>
										<FaHouseUser className="w-5 h-5 md:w-6 md:h-6 mr-2" />
										<span>Supplier</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
