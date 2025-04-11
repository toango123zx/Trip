import { JSX } from 'react';

type Props = {
	onClick?: () => void;
};

export const SubmitButton = ({ onClick }: Props): JSX.Element => {
	return (
		<button
			type="button"
			onClick={() => onClick && onClick()}
			className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors"
		>
			Sign In
		</button>
	);
};
