import type React from 'react';

import { JSX } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	className?: string;
	value?: React.RefObject<HTMLInputElement | null>;
	label?: string;
	error?: string;
	type?: string;
	[key: string]: string | object | undefined | void;
};

export const Input = ({
	className,
	value,
	label,
	error,
	type,
	...props
}: Props): JSX.Element => {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm text-[#9A8F7D] mb-1">{label}</label>
			)}
			<input
				type={type}
				className={cn(
					'w-full px-4 py-3 rounded-md bg-[#F8EFE4] border border-[#F8EFE4] focus:outline-none focus:border-[#FF7A22] transition-colors',
					error && 'border-red-500',
					className,
				)}
				ref={value}
				{...props}
			/>
			{error && <p className="mt-1 text-xs text-red-500">{error}</p>}
		</div>
	);
};
