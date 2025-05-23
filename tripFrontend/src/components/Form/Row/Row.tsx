import { JSX } from 'react';

type TRow = {
	label: string;
	required?: boolean;
	children: React.ReactNode;
	top?: boolean;
};

const Required = (): JSX.Element => (
	<span className="text-red-600" aria-hidden>
		*
	</span>
);

export const Row = ({ label, required, children, top }: TRow): JSX.Element => (
	<div
		className={`w-full flex gap-2 ${top ? 'items-start' : 'items-center'} mb-4`}
	>
		<label className="text-gray-800">
			{label}
			{required && <Required />}
		</label>
		{children}
	</div>
);
