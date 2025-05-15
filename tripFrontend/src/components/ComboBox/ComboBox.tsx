import { useState, useEffect, useMemo, JSX } from 'react';

export type TComboBoxOption = { id: string; label: string; value: string };

export type TComboBoxProps<T extends TComboBoxOption> = {
	options?: T[];
	valueDefault?: string;
	selectedOption?: T | null;
	setSelectedOption?: React.Dispatch<React.SetStateAction<T | null>>;
	placeholder?: string;
	disabled?: boolean;
};

export const ComboBox = <T extends TComboBoxOption>({
	options = [],
	valueDefault,
	selectedOption,
	setSelectedOption = (): void => {},
	placeholder = 'Select or type...',
	disabled = false,
}: TComboBoxProps<T>): JSX.Element => {
	const [inputValue, setInputValue] = useState(
		selectedOption?.label || valueDefault || '',
	);
	const [isOpen, setIsOpen] = useState(false);

	const filteredOptions = useMemo(
		() =>
			inputValue
				? options.filter((o) =>
						o.label.toLowerCase().includes(inputValue.toLowerCase()),
					)
				: options,
		[inputValue, options],
	);

	const isInvalid = !!inputValue && filteredOptions.length === 0;

	useEffect(() => {
		setInputValue(selectedOption?.label || '');
	}, [selectedOption]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const text = e.target.value;
		setInputValue(text);
		setIsOpen(true);
		const match = options.find((o) => o.label.toLowerCase() === text.toLowerCase());
		setSelectedOption(match || null);
	};

	const onOptionClick = (option: T): void => {
		setInputValue(option.label);
		setSelectedOption(option);
		setIsOpen(false);
	};

	return (
		<div
			className="relative w-full"
			onBlur={() => setTimeout(() => setIsOpen(false), 150)}
		>
			<input
				type="text"
				value={inputValue}
				onChange={onChange}
				onFocus={() => setIsOpen(true)}
				placeholder={placeholder}
				disabled={disabled}
				className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
					 ${isInvalid ? 'border-red-500' : 'border-gray-300'}
					 ${disabled ? 'bg-gray-100 border-none pl-2.5' : 'bg-white'}`}
			/>
			{isInvalid && (
				<p className="text-red-600 text-sm mt-1">
					Value does not exist in the list.
				</p>
			)}
			{isOpen && (
				<ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
					{filteredOptions.length > 0 ? (
						filteredOptions.map((o) => (
							<li
								key={o.id}
								onClick={() => onOptionClick(o)}
								className="px-3 py-2 cursor-pointer hover:bg-blue-100"
							>
								{o.label}
							</li>
						))
					) : (
						<li className="px-3 py-2 text-gray-500">Không có kết quả.</li>
					)}
				</ul>
			)}
		</div>
	);
};
