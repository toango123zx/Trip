import { JSX } from 'react';
import { FieldErrors, FieldValues, useForm, Path } from 'react-hook-form';

import { FieldErrorCustom } from '@/components/Error';

import { Row } from '../Row';

type TInputProps<T extends FieldValues> = {
	id: keyof T;
	label: string;
	defaultValue?: string;
	register: ReturnType<typeof useForm<T>>['register'];
	errors: FieldErrors<T>;
	required?: boolean;
	disabled?: boolean;
	type?: string;
	validate?: (value: string | number | boolean) => string | boolean;
};

export const Input = <T extends FieldValues>({
	id,
	label,
	defaultValue,
	register,
	errors,
	required,
	disabled = false,
	type = 'text',
	validate,
}: TInputProps<T>): JSX.Element => (
	<Row label={label} required={required}>
		<div>
			<input
				id={id as string}
				type={type}
				aria-invalid={errors[id] ? 'true' : undefined}
				aria-describedby={`${String(id)}-error`}
				defaultValue={defaultValue}
				disabled={disabled}
				className={`h-10 w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none ${disabled ? 'bg-gray-100 border-none pl-2.5 hover:cursor-no-drop' : 'bg-white'}`}
				{...register(id as Path<T>, {
					...(required && { required: `${label} is required` }),
					...(type === 'number' && { valueAsNumber: true }),
					...(validate && { validate: validate }),
					setValueAs: (value) => value.trim(),
				})}
			/>
			<FieldErrorCustom id={id} errors={errors} />
		</div>
	</Row>
);
