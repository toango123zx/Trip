import { JSX } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

export type TError<T extends FieldValues> = {
	id: keyof T;
	errors: FieldErrors<T>;
};

export const FieldErrorCustom = <T extends FieldValues>({
	id,
	errors,
}: TError<T>): JSX.Element => (
	<p id={`${String(id)}-error`} className="min-h-[1.25rem] text-sm text-red-600">
		{errors[id]?.message as string}
	</p>
);
