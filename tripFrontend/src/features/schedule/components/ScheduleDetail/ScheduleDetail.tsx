import React, { JSX, useEffect, useState } from 'react';
import { useForm, FieldValues, Control, Controller, RegisterOptions, Path, PathValue } from 'react-hook-form';
import { FormInput } from '@/components/Form/FormInput';
import { BaseForm } from '@/components/Form/BaseForm/BaseForm';
import { EProductScheduleStatus, TProductSchedule } from '@/types';
import { FormTextarea } from '@/components/Form/FormTextarea';
import { formatDateTime } from '@/components/BaseTable/BaseTable';
import { scheduleApi } from '../../scheduleApi';
import { notification, Button, Table, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type ScheduleDetailProps = {
	schedule: TProductSchedule;
	open: boolean;
	isComplete?: boolean;
	isRemove?: boolean;
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

type User = {
	id: string;
	name: string;
	email: string;
	gender: string | null;
	phoneNumber: string | null;
	address: string | null;
	image: string;
	dateOfBirth: string | null;
	status: string;
	quantity: number;
	billStatus: string;
};

export const ScheduleDetail = ({ schedule, open, isComplete = true, isRemove = false, onCancel, onDeleteSuccess }: ScheduleDetailProps) => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);

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

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const response = await scheduleApi.getScheduleUsers(schedule.id);
				setUsers(response.data);
			} catch (error) {
				notification.error({
					message: 'Error',
					description: 'Failed to fetch users',
					duration: 3,
				});
			} finally {
				setLoading(false);
			}
		};

		if (open) {
			fetchUsers();
		}
	}, [schedule.id, open]);

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

	const handleComplete = async () => {
		try {
			await scheduleApi.completeSchedule(schedule.id);
			notification.success({
				message: 'Success',
				description: 'Schedule completed successfully',
				duration: 3,
			});
			onCancel();
			onDeleteSuccess?.();
		} catch (error) {
			notification.error({
				message: 'Error',
				description: 'Failed to complete schedule',
				duration: 3,
			});
		}
	};

	const columns: ColumnsType<User> = [
		{
			title: 'User',
			dataIndex: 'name',
			key: 'name',
			render: (text: string, record: User) => (
				<div className="flex items-center gap-2">
					<Avatar src={record.image} alt={text} />
					<div>
						<div className="font-medium">{text}</div>
						<div className="text-sm text-gray-500">{record.email}</div>
					</div>
				</div>
			),
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
			render: (text: number) => `${text} người`,
		},
		{
			title: 'Status',
			dataIndex: 'billStatus',
			key: 'billStatus',
			render: (text: string) => (
				<span className={`px-2 py-1 rounded-full text-xs font-medium ${text === 'paid' ? 'bg-green-100 text-green-800' :
					text === 'pending' ? 'bg-yellow-100 text-yellow-800' :
						'bg-gray-100 text-gray-800'
					}`}>
					{text === 'paid' ? 'Đã thanh toán' :
						text === 'pending' ? 'Chờ thanh toán' :
							text}
				</span>
			),
		},
	];

	return (
		<BaseForm
			title="Schedule Details"
			form={form}
			open={open}
			isRemove={isRemove}
			onCancel={onCancel}
			onRemove={handleDelete}
			isCreate={false}
			footer={
				[
					<Button key="cancel" onClick={onCancel}>
						Hủy
					</Button>,
					isRemove && (
						<Button key="remove" danger onClick={handleDelete}>
							Xóa
						</Button>
					),
					(schedule.status === EProductScheduleStatus.active || schedule.status === EProductScheduleStatus.full) && isComplete && (
						<Button key="complete" type="primary" onClick={handleComplete}>
							Hoàn thành
						</Button>
					),
				]
			}
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
						name="productTime"
						label="Product Time"
						disabled
					/>
				</div>

				{/* --- Booked Users --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
					<div className="flex items-center gap-2 sm:gap-3 mb-4">
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
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
						<span className="text-sm sm:text-base font-medium text-gray-800">
							Booked Users
						</span>
					</div>

					<Table
						columns={columns}
						dataSource={users}
						rowKey="id"
						loading={loading}
						pagination={false}
					/>
				</div>
			</div>
		</BaseForm>
	);
};
