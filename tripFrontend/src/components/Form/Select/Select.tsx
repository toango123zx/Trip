import { JSX, useEffect, useState } from 'react';
import {
	FieldErrors,
	FieldValues,
	Path,
	PathValue,
	UseFormSetValue,
} from 'react-hook-form';

import { ComboBox } from '@/components/ComboBox';
import { FieldErrorCustom } from '@/components/Error';

import { Row } from '../Row';

type TSelect<T extends FieldValues> = {
	id: keyof T;
	label: string;
	setValue: UseFormSetValue<T>;
	errors: FieldErrors<T>;
	options: { id: string; value: string; label: string; city?: string }[];
	required?: boolean;
	placeholder?: string;
	disabled?: boolean;
	defaultValue?: string;
	name?: keyof T;
};

export const Select = <T extends FieldValues>({
	id,
	label,
	setValue,
	errors,
	options,
	required,
	placeholder,
	disabled = false,
	defaultValue,
	name,
}: TSelect<T>): JSX.Element => {
	const [selectedOption, setSelectedOption] = useState<{
		id: string;
		value: string;
		label: string;
		city?: string;
	} | null>(null);

	useEffect(() => {
		const option = options.find((o) => o.label === defaultValue);
		if (option) {
			setSelectedOption(option);
		}
		const fieldName = name || id;
		setValue(
			fieldName as Path<T>,
			(selectedOption?.value || '') as PathValue<T, Path<T>>,
		);
	}, [options, defaultValue, selectedOption, setValue, name, id]);

	return (
		<Row label={label} required={required}>
			<ComboBox
				options={options}
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				placeholder={placeholder}
				disabled={disabled}
			/>
			<FieldErrorCustom id={id} errors={errors} />
		</Row>
	);
};
