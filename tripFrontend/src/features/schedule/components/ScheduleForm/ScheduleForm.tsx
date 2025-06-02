'use client';

import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { JSX, useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { BaseForm } from '@/components/Form/BaseForm';
import { FormInput } from '@/components/Form/FormInput';
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
	disabled?: boolean;
	onSave?: (data: TRequestBodyCreateSchedule) => void;
	onRemove?: () => void;
	onCancel?: () => void;
	onDeleteSuccess?: () => void;
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
	price: boolean;
	startTime: boolean;
	endTime: boolean;
	startOrder: boolean;
	endOrder: boolean;
};

export const ScheduleForm = ({
	productName,
	data,
	setData,
	isCreate = false,
	disabled = false,
	onSave = (): void => {},
	onRemove = (): void => {},
	onCancel = (): void => {},
	onDeleteSuccess = (): void => {},
}: TScheduleFormProps): JSX.Element => {
	const form = useForm<TRequestBodyCreateSchedule>({
		defaultValues: data,
	});
	
	const { control, setValue, watch, getValues } = form;
	const isInitialMount = useRef(true);
	const prevDataRef = useRef(data);
	
	// Synchronize form data with component state only on initial mount or when data prop changes
	useEffect(() => {
		if (data && JSON.stringify(data) !== JSON.stringify(prevDataRef.current)) {
			Object.keys(data).forEach((key) => {
				setValue(key as keyof TRequestBodyCreateSchedule, data[key as keyof TRequestBodyCreateSchedule]);
			});
			prevDataRef.current = data;
		}
	}, [data, setValue]);

	// Watch price changes and update component state, but prevent unnecessary updates
	const price = watch("price");
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		
		const numPrice = Number(price);
		if (!isNaN(numPrice) && numPrice > 0 && numPrice !== data.price) {
			setData((prev) => ({ ...prev, price: numPrice }));
		}
	}, [price, setData, data.price]);
	
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

	const handleSaveOnClick = (): void => {
		setError({} as TError);
		let flag = false;
		
		const formValues = getValues();
		
		if (formValues.price <= 0) {
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
		
		onSave?.(data);
	};
	
	const validateGreaterThanZero = (value: string | number | boolean): string | boolean => {
		const numValue = Number(value);
		return isNaN(numValue) || numValue <= 0 ? 'Price must be greater than 0' : true;
	};

	return (
		<BaseForm
			title={isCreate ? 'New Schedule' : 'Schedule Detail'}
			form={form}
			isCreate={isCreate}
			disabled={!isCreate || disabled}
			open={true}
			onSave={isCreate ? handleSaveOnClick : undefined}
			onRemove={isCreate ? onRemove : undefined}
			onCancel={onCancel}
		>
			<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-6">
				<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
					</svg>
					<span className="text-sm sm:text-base font-medium text-gray-800">Product Name</span>
				</div>
				<input
					type="text"
					value={productName}
					disabled={true}
					className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-md hover:cursor-not-allowed shadow-sm"
				/>
			</div>

			<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-6">
				<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span className="text-sm sm:text-base font-medium text-gray-800">Price (VND)</span>
				</div>
				<FormInput
					control={control}
					name="price"
					type="number"
					disabled={!isCreate || disabled}
					placeholder="Enter price value"
					status={error.price ? 'error' : undefined}
					rules={{
						required: 'Price is required',
						validate: validateGreaterThanZero,
						min: { value: 0.01, message: 'Price must be greater than 0' }
					}}
				/>
				{error.price && (
					<ErrorText id="price" message="Price must be greater than 0" />
				)}
			</div>

			<div className="space-y-3 sm:space-y-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
				<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<h3 className="text-sm sm:text-base font-medium text-gray-800">Schedule Times</h3>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{pickerConfigs.map((cfg) => (
						<div key={cfg.key} className="p-2 sm:p-3 bg-white border border-gray-200 rounded-md shadow-sm">
							<DateTimeField<TRequestBodyCreateSchedule, FieldKey>
								key={cfg.key}
								label={cfg.label}
								field={cfg.key}
								value={data[cfg.key]}
								disabled={!isCreate || disabled}
								onChangeDate={(d, f) => d && updateField(d, f, true)}
								onChangeTime={(t, f) => t && updateField(t, f, false)}
								error={error[cfg.key]}
							/>
						</div>
					))}
				</div>
			</div>
		</BaseForm>
	);
};
