import React, { JSX } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { GoChevronDown } from 'react-icons/go';

import { cn } from '@/lib';
type TOption = {
	id: string;
	display: string;
	value: string;
};

type TSelectBox = {
	selectOption: TOption[];
	register?: UseFormRegisterReturn;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	className?: string;
};

export const SelectBox = ({
	selectOption,
	register,
	onChange,
	className,
}: TSelectBox): JSX.Element => {
	return (
		<div className="relative">
			<select
				{...register}
				onChange={(e) => onChange && onChange(e)}
				className={cn(
					'rounded-4xl py-1 px-3.5 w-full focus:outline-none appearance-none',
					className,
				)}
			>
				{selectOption.map((option) => (
					<option key={option.id} value={option.value} className="w-full">
						{option.display}
					</option>
				))}
			</select>
			<GoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
		</div>
	);
};
