'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, JSX } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/lib/cn';

type Props = {
	register?: UseFormRegisterReturn;
	label?: string;
	placeholder?: string;
	error?: FieldError;
	className?: string;
};

export const PasswordInput = ({
	register,
	label,
	placeholder,
	error,
	className,
}: Props): JSX.Element => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="w-full">
			{label && (
				<label htmlFor={register?.name} className="block mb-1 text-orange-500 text-sm">
					{label}
				</label>
			)}
			<div className="relative">
				<input
					type={showPassword ? 'text' : 'password'}
					id={register?.name}
					placeholder={placeholder}
					autoComplete="current-password"
					className={cn(
						'w-full px-4 py-3 rounded-md bg-[#F8EFE4] border border-[#F8EFE4] focus:outline-none focus:border-[#FF7A22] transition-colors pr-10',
						error && 'border-red-500',
						className,
					)}
					{...register}
				/>
				<button
					type="button"
					className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500"
					onClick={() => setShowPassword(!showPassword)}
				>
					{showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
				</button>
			</div>
			{error && <p className="mt-1 text-xs text-red-700">{error.message}</p>}
		</div>
	);
};