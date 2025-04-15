import { JSX } from 'react';

type Props = {
	label?: string;
	onClick?: () => void;
	type?: 'button' | 'submit';
};

export const SubmitButton = ({ label, onClick, type }: Props): JSX.Element => {
	return (
		<button
			type={type || 'submit'}
			onClick={() => onClick && onClick()}
			className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors"
		>
			{label}
		</button >
	);
};
