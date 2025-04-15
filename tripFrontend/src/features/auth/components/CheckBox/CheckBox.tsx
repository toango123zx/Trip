import type React from 'react';

import { JSX } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	className?: string;
	value?: React.RefObject<HTMLInputElement | null>;
	label?: string;
	[key: string]: string | object | void | undefined;
};

export const Checkbox = ({ className, value, label, ...props }: Props): JSX.Element => {
	return (
		<div className="flex items-center">
			<input
				type="checkbox"
				className={cn(
					'h-4 w-4 rounded border-gray-300 text-[#FF7A22] focus:ring-[#FF7A22]',
					className,
				)}
				ref={value}
				{...props}
			/>
			{label && <label className="ml-2 block text-sm text-gray-700">{label}</label>}
		</div>
	);
};
