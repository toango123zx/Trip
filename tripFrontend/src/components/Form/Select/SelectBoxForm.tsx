import React, { JSX } from 'react';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

import { FieldErrorCustom } from '@/components/Error';
import { SelectBox } from '@/components/SelectBox';

import { Row } from '../Row';

type TOption = {
	id: string;
	label: string;
	value: string;
};

type TSelectBoxForm<T extends FieldValues> = {
	name: Path<T>;
	label: string;
	selectOption?: TOption[];
	register?: UseFormRegister<T>;
	errors: FieldErrors<T>;
	required?: boolean;
};

export const SelectBoxForm = <T extends FieldValues>({
	name,
	label,
	selectOption = [],
	register,
	errors,
	required,
}: TSelectBoxForm<T>): JSX.Element => {
	return (
		<Row label={label} required={required}>
			<div className="w-full h-full">
				<SelectBox
					name={name}
					label={label}
					selectOption={selectOption}
					register={register}
					className={
						'w-full bg-white border border-gray-300 rounded-md overflow-auto'
					}
					required={true}
				/>
				{<FieldErrorCustom<T> id={name as keyof T} errors={errors} />}
			</div>
		</Row>
	);
};
