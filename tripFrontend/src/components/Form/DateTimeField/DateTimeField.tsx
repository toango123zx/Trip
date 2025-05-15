import { DatePicker, Space, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { JSX } from 'react';

import { ErrorText } from '@/components/Error';

type FieldKey<T, K extends keyof T> = keyof Pick<T, K>;

export const DateTimeField = <T, K extends keyof T>({
	label,
	field,
	value,
	disabled = false,
	error,
	onChangeDate,
	onChangeTime,
}: {
	label: string;
	field: FieldKey<T, K>;
	value: Date;
	disabled?: boolean;
	error?: boolean;
	onChangeDate: (d: Dayjs | null, f: FieldKey<T, K>) => void;
	onChangeTime: (t: Dayjs | null, f: FieldKey<T, K>) => void;
}): JSX.Element => {
	return (
		<div>
			<div className="flex items-center gap-5">
				<label className="text-2xl font-medium w-9/12">{label} Date</label>
				<Space direction="vertical" className="w-full">
					<DatePicker
						value={dayjs(value)}
						disabled={disabled}
						onChange={(d) => onChangeDate(d, field)}
						format="DD/MM/YYYY"
						className="w-full text-2xl h-14"
						size="large"
					/>
				</Space>
				<label className="text-2xl font-medium w-9/12">{label} Time</label>
				<Space direction="vertical" className="w-full">
					<TimePicker
						value={dayjs(value)}
						disabled={disabled}
						onChange={(t) => onChangeTime(t, field)}
						format="HH:mm"
						className="w-full text-2xl h-14"
						size="large"
					/>
				</Space>
			</div>
			<div className="pl-54 pt-2.5">
				{!disabled && error ? (
					field === 'startTime' ? (
						<ErrorText
							id="startTime"
							message="Start must be greater than current date"
						/>
					) : field === 'startOrder' ? (
						<ErrorText message="Start must be greater than start Time " />
					) : (
						<ErrorText message="End must be greater than current date and greater than start" />
					)
				) : null}
			</div>
		</div>
	);
};
