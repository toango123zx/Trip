import { JSX } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { attractionsImages } from '@/assets';
import { cn } from '@/lib';

import { TSearchAttraction } from '../../product.type';
import { SearchBarDesktop, SearchBarMobile } from '../SearchBar';

type THeroAttractionsProps = {
	form: UseFormReturn<TSearchAttraction>;
	className?: string;
};

export const HeroAttractions = ({
	form,
	className,
}: THeroAttractionsProps): JSX.Element => {
	return (
		<section
			className={cn('bg-white py-6 md:py-12 relative md:pt-0', className)}
			aria-labelledby="hero-attractions-heading"
		>
			<div className="relative max-h-[1080px] bg-cover bg-center">
				<img
					src={attractionsImages.backgroundHero}
					alt="Scenic landscape of popular attractions"
					className="hidden md:block w-screen h-[1080px] object-cover"
				/>
				<div className="hidden md:block container mx-auto px-4">
					<div className="absolute w-full inset-0">
						<div className="container h-full mx-auto px-4 relative z-10 flex justify-center items-center">
							<div className="max-w-[1536px] w-full relative">
								<p className="w-full text-[225px] text-center text-white/50  font-bold text-red ">
									ATTRACTIONS
								</p>
								<h1 className="w-full absolute top-0 mt-32 text-7xl text-center font-bold text-black">
									Discover your love
								</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="relative md:absolute left-0 bottom-0 w-full flex justify-center z-10">
					<div className="md:hidden">
						<SearchBarMobile form={form} className="block md:hidden" />
					</div>
					<div className="hidden md:block">
						<SearchBarDesktop
							form={form}
							className="hidden md:block rounded-4xl m-5"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};
