import React, { JSX } from 'react';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

import { FieldErrorCustom } from '@/components/Error';
import { SelectBox } from '@/components/SelectBox';

import { Row } from '../Row';

export type TSelectBoxOption = {
	id: string;
	label: string;
	value: string;
};

type TSelectBoxForm<T extends FieldValues> = {
	name: Path<T>;
	label: string;
	selectOption?: TSelectBoxOption[];
	disabled?: boolean;
	register?: UseFormRegister<T>;
	errors: FieldErrors<T>;
	required?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const SelectBoxForm = <T extends FieldValues>({
	name,
	label,
	selectOption = [],
	disabled = false,
	register,
	errors,
	required,
	onChange,
}: TSelectBoxForm<T>): JSX.Element => {
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		if (onChange) {
			onChange(e);
		}
	};

	return (
		<Row label={label} required={required}>
			<div className="w-full h-full">
				<SelectBox
					name={name}
					label={label}
					selectOption={selectOption}
					disabled={disabled}
					onChange={handleChange}
					register={register}
					className={`w-full border border-gray-300 rounded-md overflow-auto ${disabled ? 'bg-gray-100 border-none pl-2.5 hover:cursor-no-drop' : 'bg-white'}`}
					required={required}
				/>
				<FieldErrorCustom<T> id={name as keyof T} errors={errors} />
			</div>
		</Row>
	);
};
