import { DatePicker, TimePicker } from 'antd';
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
		<div className="form-control">
			<div className="flex flex-col md:flex-row md:items-center gap-4">
				<div className="flex flex-col w-full">
					<label className="label">
						<span className="label-text">{label} Date</span>
					</label>
					<DatePicker
						value={dayjs(value)}
						disabled={disabled}
						onChange={(d) => onChangeDate(d, field)}
						format="DD/MM/YYYY"
						className="w-full"
						size="middle"
						placeholder="Select date"
						status={error ? 'error' : undefined}
					/>
				</div>
				<div className="flex flex-col w-full">
					<label className="label">
						<span className="label-text">{label} Time</span>
					</label>
					<TimePicker
						value={dayjs(value)}
						disabled={disabled}
						onChange={(t) => onChangeTime(t, field)}
						format="HH:mm"
						className="w-full"
						size="middle"
						placeholder="Select time"
						status={error ? 'error' : undefined}
					/>
				</div>
			</div>
			<div className="pt-2">
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
