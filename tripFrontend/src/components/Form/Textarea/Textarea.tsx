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
};

export const Textarea = <T extends FieldValues>({
	id,
	label,
	required,
	register,
	errors,
}: TTextareaProps<T>): JSX.Element => (
	<Row label={label} top>
		<div>
			<textarea
				id={id as string}
				className="h-[100px] w-full rounded-md bg-white-100 p-4 border border-gray-300 focus:outline-none"
				{...register(id as Path<T>, {
					...(required && { required: `${label} is required` }),
					setValueAs: (value) => value.trim(),
				})}
			/>
			<FieldErrorCustom id={id} errors={errors} />
		</div>
	</Row>
);
