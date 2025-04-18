import { JSX } from 'react';
import CountUp from 'react-countup';

import { cn } from '@/lib/utils';
import { TStat } from '@/types';

type TStatCardProps = {
	stats: TStat[];
	className?: string;
};

export const Stats = ({ stats, className }: TStatCardProps): JSX.Element => {
	return (
		<div className={cn('hidden md:block py-16 px-4 md:px-8 lg:px-16', className)}>
			<div className="w-full max-w-[1536px] mx-auto bg-gray-100 flex justify-around items-center rounded-3xl px-12 py-14 shadow-md">
				{stats.map((stat, index) => (
					<div key={index} className={cn('flex flex-col items-center')}>
						<CountUp
							start={0}
							end={Number(stat.value)}
							duration={1.5}
							enableScrollSpy
							scrollSpyOnce
						>
							{({ countUpRef }) => (
								<span
									ref={countUpRef}
									className="mb-2.5 text-xl md:text-5xl font-semibold"
								/>
							)}
						</CountUp>
						<span className="text-xs md:text-lg text-gray-600 font-normal">
							{stat.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
