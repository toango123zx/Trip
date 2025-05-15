import { Checkbox } from 'antd';
import { JSX, useState } from 'react';
import { FieldErrors, FieldValues, useForm, Path } from 'react-hook-form';

import { FieldErrorCustom } from '@/components/Error';

import { Row } from '../Row';

type TCheckboxProps<T extends FieldValues> = {
	name: Path<T>;
	label: string;
	defaultValue?: boolean;
	register: ReturnType<typeof useForm<T>>['register'];
	errors: FieldErrors<T>;
	required?: boolean;
	disabled?: boolean;
	validate?: (value: string | number | boolean) => string | boolean;
};

export const CheckboxForm = <T extends FieldValues>({
	name,
	label,
	defaultValue,
	register,
	errors,
	required,
	disabled = false,
	validate,
}: TCheckboxProps<T>): JSX.Element => {
	const [checked, setChecked] = useState<boolean>(defaultValue || false);
	const changeSelectBox = (): void => {
		register(name as Path<T>, {
			setValueAs: (value: boolean) => !value,
		});
		setChecked(!checked);
	};
	return (
		<Row label={label} required={required}>
			<div>
				<Checkbox
					id={name as string}
					aria-invalid={errors[name] ? 'true' : undefined}
					aria-describedby={`${String(name)}-error`}
					checked={checked}
					disabled={disabled}
					className={`h-10 w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none ${disabled ? 'bg-gray-100 border-none pl-2.5 hover:cursor-no-drop' : 'bg-white'}`}
					{...register(name as Path<T>, {
						...(required && { required: `${label} is required` }),
						...(validate && { validate: validate }),
						onChange: (e) => changeSelectBox(e),
					})}
				></Checkbox>
				<FieldErrorCustom id={name} errors={errors} />
			</div>
		</Row>
	);
};
