import { JSX } from 'react';
import { FieldErrors, FieldValues, useForm, Path } from 'react-hook-form';

import { FieldErrorCustom } from '@/components/Error';

import { Row } from '../Row';

type TTextareaProps<T extends FieldValues> = {
	id: keyof T;
	label: string;
	register: ReturnType<typeof useForm<T>>['register'];
	required?: boolean;
	errors: FieldErrors<T>;
	disabled?: boolean;
};

export const Textarea = <T extends FieldValues>({
	id,
	label,
	required,
	register,
	disabled = false,
	errors,
}: TTextareaProps<T>): JSX.Element => (
	<Row label={label} top>
		<div>
			<textarea
				id={id as string}
				disabled={disabled}
				className={`h-[100px] w-full rounded-md p-4 border border-gray-300 focus:outline-none ${disabled ? 'bg-gray-100 border-none pl-2.5 hover:cursor-no-drop' : 'bg-white-100'}`}
				{...register(id as Path<T>, {
					...(required && { required: `${label} is required` }),
					setValueAs: (value) => value.trim(),
				})}
			/>
			<FieldErrorCustom id={id} errors={errors} />
		</div>
	</Row>
);
