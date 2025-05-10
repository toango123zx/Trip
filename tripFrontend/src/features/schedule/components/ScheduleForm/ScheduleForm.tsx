'use client';

import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { X, Save, Trash2 } from 'lucide-react';
import React, { JSX, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

import { DateTimeField, ErrorText } from '@/components';

import type { TRequestBodyCreateSchedule } from '../../schedule.type';

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

type TScheduleFormProps = {
	productName: string;
	data: TRequestBodyCreateSchedule;
	setData: React.Dispatch<React.SetStateAction<TRequestBodyCreateSchedule>>;
	isCreate?: boolean;
	onSave?: (data: TRequestBodyCreateSchedule) => void;
	onRemove?: () => void;
	onCancel?: () => void;
};

type FieldKey = keyof Pick<
	TRequestBodyCreateSchedule,
	'startTime' | 'endTime' | 'startOrder' | 'endOrder'
>;

const pickerConfigs: {
	key: FieldKey;
	label: string;
}[] = [
	{ key: 'startTime', label: 'Start' },
	{ key: 'endTime', label: 'End' },
	{ key: 'startOrder', label: 'Start Order' },
	{ key: 'endOrder', label: 'End Order' },
];

type TError = {
	name: boolean;
	price: boolean;
	startTime: boolean;
	endTime: boolean;
	startOrder: boolean;
	endOrder: boolean;
	message: string;
};

export const ScheduleForm = ({
	productName,
	data,
	setData,
	isCreate = false,
	onSave = (): void => {},
	onRemove = (): void => {},
	onCancel,
}: TScheduleFormProps): JSX.Element => {
	const updateField = (dateOrTime: Dayjs, field: FieldKey, isDate: boolean): void => {
		setData((prev) => {
			const d = new Date(prev[field]);
			if (isDate) {
				d.setFullYear(dateOrTime.year(), dateOrTime.month(), dateOrTime.date());
			} else {
				d.setHours(dateOrTime.hour(), dateOrTime.minute());
			}
			return { ...prev, [field]: d };
		});
	};

	const [error, setError] = useState<TError>({} as TError);

	const handleSubmit = (e: React.FormEvent): void => {
		setError({} as TError);
		let flag = false;
		if (data.price <= 0) {
			setError((prev) => ({ ...prev, price: true }));
			flag = true;
		}
		if (data.startTime <= new Date()) {
			setError((prev) => ({ ...prev, startTime: true }));
			flag = true;
		}
		if (data.startOrder < data.startTime) {
			setError((prev) => ({ ...prev, startOrder: true }));
			flag = true;
		}
		if (data.endTime <= new Date() || data.endTime <= data.startTime) {
			setError((prev) => ({ ...prev, endTime: true }));
			flag = true;
		}
		if (
			data.endOrder <= new Date() ||
			data.endOrder <= data.startOrder ||
			data.endOrder <= data.startTime
		) {
			setError((prev) => ({ ...prev, endOrder: true }));
			flag = true;
		}
		if (flag) {
			return;
		}
		e.preventDefault();
		onSave?.(data);
	};

	const handleRemoveOnClick = (): void => {
		onRemove();
	};

	return (
		<div
			className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4 sm:px-20"
			onClick={onCancel}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-5xl bg-white rounded-lg overflow-hidden"
			>
				<header className="flex items-center justify-between px-6 py-4 border-b">
					<h1 className="text-2xl font-bold">New Schedule</h1>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={onCancel}
							className="flex items-center gap-1 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100"
						>
							<X className="h-5 w-5" /> Cancel
						</button>
						{!isCreate && (
							<button
								type="button"
								onClick={handleRemoveOnClick}
								className="flex items-center gap-1 rounded-md border border-red-500 bg-red-500 text-white px-4 py-2 hover:bg-red-700"
							>
								<Trash2 className="h-5 w-5" /> Remove
							</button>
						)}
						{isCreate && (
							<button
								type="button"
								onClick={handleSubmit}
								className="flex items-center gap-1 px-4 py-2 border bg-orange-500 text-white rounded-md hover:bg-orange-600"
							>
								<Save className="h-5 w-5" /> Save
							</button>
						)}
					</div>
				</header>

				<div className="p-6 space-y-8 pb-10">
					<div className="grid grid-cols-[185px_1fr] gap-4 items-center">
						<label className="text-2xl font-medium">Product Name</label>
						<input
							type="text"
							value={productName}
							disabled
							className="w-full p-3 bg-gray-200 border rounded-md"
						/>
					</div>

					<div className="grid grid-cols-[185px_1fr] gap-x-4 items-center">
						<label className="text-2xl font-medium">Price (VND)</label>
						<CurrencyInput
							value={String(data.price)}
							groupSeparator="."
							decimalsLimit={0}
							allowNegativeValue={false}
							onValueChange={(val) =>
								setData((prev) => ({ ...prev, price: Number(val || 0) }))
							}
							className="w-full p-3 border rounded-md"
						/>
						<div className="pl-50 pt-2.5 col-span-2">
							{error.price && (
								<ErrorText
									id={'price'}
									message="Price must be greater than 0"
								/>
							)}
						</div>
					</div>

					<div className="space-y-8">
						{pickerConfigs.map((cfg) => (
							<DateTimeField<TRequestBodyCreateSchedule, FieldKey>
								key={cfg.key}
								label={cfg.label}
								field={cfg.key}
								value={data[cfg.key]}
								onChangeDate={(d, f) => d && updateField(d, f, true)}
								onChangeTime={(t, f) => t && updateField(t, f, false)}
								error={error[cfg.key]}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
