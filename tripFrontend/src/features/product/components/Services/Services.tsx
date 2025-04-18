'use client';

import type React from 'react';

import { motion, useInView, useAnimation } from 'framer-motion';
import { MapPin, StampIcon as Passport, Plane } from 'lucide-react';
import { useRef, useEffect, JSX } from 'react';

import { cn } from '@/lib';

type TServiceCardProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
	delay: number;
};

const ServiceCard = ({
	icon,
	title,
	description,
	delay,
}: TServiceCardProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });
	const controls = useAnimation();

	useEffect(() => {
		if (isInView) {
			controls.start('visible');
		}
	}, [isInView, controls]);

	return (
		<motion.div
			ref={ref}
			className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center text-center"
			initial="hidden"
			animate={controls}
			variants={{
				hidden: { opacity: 0, y: 50 },
				visible: {
					opacity: 1,
					y: 0,
					transition: {
						duration: 0.6,
						delay: delay * 0.2,
						ease: 'easeOut',
					},
				},
			}}
		>
			<div className="text-[#FF7A30] mb-4 w-16 h-16 flex items-center justify-center">
				{icon}
			</div>
			<h3 className="text-xl font-bold mb-3">{title}</h3>
			<p className="text-gray-600 text-sm">{description}</p>
		</motion.div>
	);
};

type TServicesProps = {
	className?: string;
};

export const Services = ({ className }: TServicesProps): JSX.Element => {
	const titleRef = useRef<HTMLDivElement>(null);
	const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
	const titleControls = useAnimation();

	useEffect(() => {
		if (isTitleInView) {
			titleControls.start('visible');
		}
	}, [isTitleInView, titleControls]);

	const services = [
		{
			icon: <MapPin size={40} />,
			title: 'Best Tour Guide',
			description: 'Meet the quality standards you expect',
			delay: 0,
		},
		{
			icon: <Passport size={40} />,
			title: 'Easy Booking',
			description:
				'By adopting technology and best practice to ensure ordering becomes easier',
			delay: 1,
		},
		{
			icon: <Plane size={40} />,
			title: 'Famous Destinations',
			description: 'Not to be missed',
			delay: 2,
		},
	];

	return (
		<section className={cn('hidden py-20 px-8 md:block', className)}>
			<div className="max-w-[1536px] mx-auto">
				<div className="flex flex-row items-center justify-between gap-16">
					<motion.div
						ref={titleRef}
						className="text-center mb-12"
						initial="hidden"
						animate={titleControls}
						variants={{
							hidden: { opacity: 0, y: 30 },
							visible: {
								opacity: 1,
								y: 0,
								transition: {
									duration: 0.5,
									ease: 'easeOut',
								},
							},
						}}
					>
						<h2 className="text-[#FF7A30] font-semibold mb-4 text-3xl font-[Montserrat] text-left">
							Services
						</h2>
						<h3 className="font-semibold text-4xl font-[Montserrat] text-left">
							Our top value categories for you
						</h3>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{services.map((service, index) => (
							<ServiceCard
								key={index}
								icon={service.icon}
								title={service.title}
								description={service.description}
								delay={service.delay}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
