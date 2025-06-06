import React, { JSX } from 'react';
import { useForm, FieldValues, Control, Controller, RegisterOptions, Path, PathValue } from 'react-hook-form';
import { FormInput } from '@/components/Form/FormInput';
import { BaseForm } from '@/components/Form/BaseForm/BaseForm';
import { TProductSchedule } from '@/types';
import { FormTextarea } from '@/components/Form/FormTextarea';
import { formatDateTime } from '@/components/BaseTable/BaseTable';
import { scheduleApi } from '../../scheduleApi';
import { notification, Button } from 'antd';

type ScheduleDetailProps = {
	schedule: TProductSchedule;
	open: boolean;
	onCancel: () => void;
	onDeleteSuccess?: () => void;
};

type ScheduleFormValues = {
	id: string;
	startTime: string;
	endTime: string;
	price: number;
	booked: number;
	status: string;
	productName?: string;
	productDescription?: string;
	quantityAvailable?: number;
	avgRate?: number;
	productTime?: number;
	location?: string;
};

export const ScheduleDetail = ({ schedule, open, onCancel, onDeleteSuccess }: ScheduleDetailProps) => {
	const form = useForm<ScheduleFormValues>({
		defaultValues: {
			id: schedule.id,
			startTime: formatDateTime(schedule.startTime),
			endTime: formatDateTime(schedule.endTime),
			price: schedule.price,
			booked: schedule.booked,
			status: schedule.status,
			productName: schedule.product?.name,
			productDescription: schedule.product?.description,
			quantityAvailable: schedule.product?.quantityAvailable,
			avgRate: schedule.product?.avgRate,
			productTime: schedule.product?.time,
			location: schedule.product?.locationId,
		}
	});
	const { control } = form;

	const handleDelete = async () => {
		try {
			await scheduleApi.deleteSchedule(schedule.id);
			notification.success({
				message: 'Success',
				description: 'Schedule deleted successfully',
				duration: 3,
			});
			onCancel();
			onDeleteSuccess?.();
		} catch (error) {
			notification.error({
				message: 'Error',
				description: 'Failed to delete schedule',
				duration: 3,
			});
		}
	};

	return (
		<BaseForm
			title="Schedule Details"
			form={form}
			open={open}
			onCancel={onCancel}
			onRemove={handleDelete}
			isCreate={false}
			footer={[
				<Button key="cancel" onClick={onCancel}>
					Hủy
				</Button>,
				<Button key="remove" danger onClick={handleDelete}>
					Xóa
				</Button>,
			]}
		>
			<div className="grid gap-4 sm:gap-6">
				{/* --- Schedule Basic Info --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg grid gap-2 sm:gap-3">
					<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
						<svg
							className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="text-sm sm:text-base font-medium text-gray-800">
							Basic Information
						</span>
					</div>

					<FormInput
						control={control as any}
						name="id"
						label="Schedule ID"
						disabled
					/>
					<FormInput
						control={control as any}
						name="startTime"
						label="Start Time"
						disabled
					/>
					<FormInput
						control={control as any}
						name="endTime"
						label="End Time"
						disabled
					/>
					<FormInput
						control={control as any}
						name="price"
						label="Price"
						disabled
					/>
					<FormInput
						control={control as any}
						name="booked"
						label="Booked"
						disabled
					/>
					<FormInput
						control={control as any}
						name="status"
						label="Status"
						disabled
					/>
				</div>

				{/* --- Product Info --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg grid gap-2 sm:gap-3">
					<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
						<svg
							className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 10h16M4 14h16M4 18h16"
							/>
						</svg>
						<span className="text-sm sm:text-base font-medium text-gray-800">
							Product Information
						</span>
					</div>

					<FormInput
						control={control as any}
						name="productName"
						label="Product Name"
						disabled
					/>
					<FormTextarea
						control={control as any}
						name="productDescription"
						label="Product Description"
						disabled
						autoSize
					/>
					<FormInput
						control={control as any}
						name="quantityAvailable"
						label="Quantity Available"
						disabled
					/>
					<FormInput
						control={control as any}
						name="avgRate"
						label="Average Rate"
						disabled
					/>
					<FormInput
						control={control as any}
						name="productTime"
						label="Product Time"
						disabled
					/>
					<FormInput
						control={control as any}
						name="location"
						label="Location"
						disabled
					/>
				</div>
			</div>
		</BaseForm>
	);
};
