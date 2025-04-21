import { JSX } from 'react';

import { homeImages, logos } from '@/assets';
import { cn } from '@/lib/utils';

type THeroHomeProps = {
	className?: string;
};

export const HeroHome = ({ className }: THeroHomeProps): JSX.Element => {
	return (
		<section
			className={cn('bg-white py-6 md:py-12', className)}
			aria-labelledby="hero-home-heading"
		>
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-5">
					{/* Left side with circular images and plane */}
					<div className="relative mb-8 pt-7 md:mb-0 md:pt-40">
						{/* Decorative plane and path */}
						<div className="absolute -top-10 -left-4 hidden md:block md:pt-40 md:pl-8">
							<svg
								width="130"
								height="80"
								viewBox="0 0 130 80"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10,40 Q65,10 120,40"
									stroke="#CCCCCC"
									strokeWidth="1"
									strokeDasharray="4 4"
									fill="none"
								/>
								<path
									d="M120,40 L90,40"
									stroke="#CCCCCC"
									strokeWidth="1"
									strokeDasharray="4 4"
								/>
								<g transform="translate(120, 40) rotate(45)">
									<path d="M-8,-3 L8,0 L-8,3 L-4,0 Z" fill="#000000" />
								</g>
							</svg>
						</div>

						{/* Stonehenge circular image */}
						<div className="md:hidden px-5 relative overflow-hidden mx-auto ">
							<img
								src={homeImages.homeMobile}
								alt="homeMobile"
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>
						<div className="hidden md:block relative w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden mx-0">
							<img
								src={homeImages.homeImage1}
								alt="homeImage1"
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>

						{/* Stats */}
						<div
							className="hidden md:block mt-8"
							aria-label="Travel statistics"
						>
							<div className="mb-4">
								<div className="font-[Mogra] text-4xl font-extrabold">
									70K+
								</div>
								<div className="text-sm text-gray-600 font-[Montserrat]">
									Satisfied Customers
								</div>
							</div>
							<div>
								<div className="font-[Mogra] text-4xl font-extrabold">
									100K+
								</div>
								<div className="text-sm text-gray-600 font-[Montserrat]">
									Available products
								</div>
							</div>
						</div>
					</div>

					{/* Center content */}
					<div className="hidden md:flex h-full mt-auto flex-col justify-end text-center md:text-left md:flex-1 md:max-w-[700px]">
						<div className="mb-24 flex items-start justify-center gap-7">
							<img
								src={logos.mainTravalidLogo}
								alt="Travalid Logo"
								className="w-24 h-24 rounded-full mt-4"
								loading="lazy"
							/>
							<div>
								<h1 className="tracking-tight font-[Mogra] text-6xl font-black mb-4">
									TRAVEL AND <br className="hidden md:block" />
									VALID
								</h1>
								<p className="text-gray-600 text-xl mb-6">
									https://travalid.com
								</p>
							</div>
						</div>

						{/* Small destination previews */}
						<div className="flex flex-row justify-around ">
							<div className="rounded-2xl overflow-hidden relative flex flex-row gap-2.5 max-w-64">
								<img
									src={homeImages.homeImage2}
									alt="homeImage2"
									className="w-full h-40 object-cover rounded-3xl"
									loading="lazy"
								/>
								<div className=" bg-white p-2 text-xs">
									<p className="text-gray-700">
										"Lorem ipsum is simply dummy text of the printing
										and typesetting industry"
									</p>
									<p className="font-medium mt-1">Ton Ngo Vlogger</p>
								</div>
							</div>
							<div className="rounded-2xl overflow-hidden relative flex flex-row gap-2.5 max-w-64">
								<img
									src={homeImages.homeImage3}
									alt="homeImage3"
									className="w-full h-40 object-cover rounded-3xl"
									loading="lazy"
								/>
								<div className=" bg-white p-2 text-xs">
									<p className="text-gray-700">
										"Lorem ipsum is simply dummy text of the printing
										and typesetting industry"
									</p>
									<p className="font-medium mt-1">Ton Ngo Vlogger</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right side circular image */}
					<div className="hidden md:block">
						<div className="w-80 h-80 rounded-full overflow-hidden">
							<img
								src={homeImages.homeImage4}
								alt="homeImage4"
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
