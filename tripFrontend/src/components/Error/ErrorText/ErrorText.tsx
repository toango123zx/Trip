import { JSX } from 'react';

type TError = {
	id?: string;
	message: string;
};

export const ErrorText = ({ id, message }: TError): JSX.Element => (
	<p id={id} className="min-h-[1.25rem] text-sm text-red-600">
		{message}
	</p>
);
