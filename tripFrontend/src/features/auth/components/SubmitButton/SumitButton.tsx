import { JSX } from 'react';

type Props = {
	label?: string;
	onClick?: () => void;
	type?: 'button' | 'submit';
	disabled?: boolean;
};

export const SubmitButton = ({ label, onClick, type, disabled }: Props): JSX.Element => {
	return (
		<button
			type={type || 'submit'}
			onClick={() => onClick && onClick()}
			disabled={disabled}
			className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{label}
		</button>
	);
};
