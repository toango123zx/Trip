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
			className={cn(
				'relative bg-white py-6 md:py-12 md:pt-0 overflow-hidden',
				className
			)}
			aria-labelledby="hero-attractions-heading"
		>
			<div className="relative w-full h-[500px] md:h-[1080px]">
				{/* Background image as background instead of <img> */}
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: `url(${attractionsImages.backgroundHero})` }}
				/>

				{/* Overlay content */}
				<div className="absolute inset-0 bg-black/30 z-0" />

				{/* Text section */}
				<div className="max-w-[1536px] w-full px-6 md:px-20 mx-auto relative grid justify-center">
					<p className="w-full text-[60px] md:text-[225px] text-white/50 font-bold text-center">
						ATTRACTIONS
					</p>
					<h1 className="text-3xl md:text-7xl text-center font-bold text-black w-full">
						Discover your love
					</h1>
				</div>

				{/* Search bar */}
				<div className="absolute left-0 bottom-0 w-full z-20 flex justify-center px-4">
					<div className="w-full max-w-[1280px]">
						<div className="md:hidden">
							<SearchBarMobile form={form} />
						</div>
						<div className="hidden md:block">
							<SearchBarDesktop form={form} className="rounded-4xl m-5" />
						</div>
					</div>
				</div>
			</div>
		</section>

	);
};
