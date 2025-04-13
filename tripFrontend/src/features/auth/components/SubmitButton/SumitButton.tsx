import { JSX } from 'react';

type Props = {
	label?: string;
	onClick?: () => void;
};

export const SubmitButton = ({ label, onClick }: Props): JSX.Element => {
	return (
		<button
			type="submit"
			onClick={() => onClick?.()}
			className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors"
		>
			{label}
		</button>
	);
};
