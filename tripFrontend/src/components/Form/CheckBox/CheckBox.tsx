import { Checkbox } from 'antd';
import { JSX, useEffect, useState } from 'react';
import { FieldErrors, FieldValues, Path, useForm } from 'react-hook-form';

import { FieldErrorCustom } from '@/components/Error';

import { Row } from '../Row';
import './style.scss';

type TCheckboxProps<T extends FieldValues> = {
	name: Path<T>;
	label: string;
	defaultValue?: boolean;
	register: ReturnType<typeof useForm<T>>['register'];
	errors: FieldErrors<T>;
	required?: boolean;
	disabled?: boolean;
	validate?: (value: boolean) => string | boolean;
};

export const CheckboxForm = <T extends FieldValues>({
	name,
	label,
	defaultValue = false,
	register,
	errors,
	required,
	disabled = false,
	validate,
}: TCheckboxProps<T>): JSX.Element => {
	const [checked, setChecked] = useState(defaultValue);

	useEffect(() => {
		setChecked(defaultValue);
	}, [defaultValue]);

	const handleChange = (): void => {
		setChecked((prev) => !prev);
	};

	return (
		<Row label={label} required={required}>
			<div>
				<Checkbox
					id={name}
					aria-invalid={!!errors[name]}
					aria-describedby={`${name}-error`}
					checked={checked}
					disabled={disabled}
					className={`w-7 h-full border-gray-300 focus:outline-none ${
						disabled
							? 'bg-gray-100 border-none pl-2.5 cursor-not-allowed'
							: 'bg-white'
					}`}
					{...register(name, {
						required: required ? `${label} is required` : false,
						validate,
						setValueAs: () => checked,
						onChange: handleChange,
					})}
				/>
				<FieldErrorCustom id={name} errors={errors} />
			</div>
		</Row>
	);
};
