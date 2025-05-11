import React, { JSX } from 'react';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { GoChevronDown } from 'react-icons/go';

import { cn } from '@/lib';

type TOption = {
	id: string;
	label: string;
	value: string;
};

type TSelectBox<T extends FieldValues> = {
	name?: Path<T>;
	label?: string;
	selectOption?: TOption[];
	register?: UseFormRegister<T>;
	errors?: FieldErrors<T>;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	className?: string;
	required?: boolean;
};

export const SelectBox = <T extends FieldValues>({
	name,
	label,
	selectOption = [],
	register,
	errors,
	onChange = (): void => {},
	className,
	required = false,
}: TSelectBox<T>): JSX.Element => {
	return (
		<div className="relative">
			<select
				aria-invalid={errors && name && errors[name] ? 'true' : undefined}
				{...(register && name
					? register(name, {
							...(required && {
								required: `${label ? label : name} is required`,
							}),
							setValueAs: (value) => value.trim(),
						})
					: {})}
				onChange={(e) => onChange && onChange(e)}
				className={cn(
					'rounded-4xl py-1 px-3.5 w-full focus:outline-none appearance-none',
					className,
				)}
			>
				{selectOption?.map((option) => (
					<option key={option.id} value={option.value} className="w-full">
						{option.label}
					</option>
				))}
			</select>
			<GoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black h-full" />
		</div>
	);
};
