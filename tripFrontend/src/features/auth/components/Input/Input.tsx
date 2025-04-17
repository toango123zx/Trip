import { JSX } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/lib/cn';

type Props = {
	register?: UseFormRegisterReturn;
	label?: string;
	placeholder?: string;
	error?: FieldError;
	className?: string;
	type?: string;
};

export const Input = ({
	register,
	label,
	placeholder,
	error,
	className,
	type = 'text',
}: Props): JSX.Element => {
	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={register?.name}
					className="block mb-1 text-orange-500 text-sm"
				>
					{label}
				</label>
			)}
			<input
				type={type}
				id={register?.name}
				placeholder={placeholder}
				className={cn(
					'w-full px-4 py-3 rounded-md bg-[#F8EFE4] border border-[#F8EFE4] focus:outline-none focus:border-[#FF7A22] transition-colors',
					error && 'border-red-500',
					className,
				)}
				{...register}
			/>
			{error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
		</div>
	);
};
