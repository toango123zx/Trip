'use client';

import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { JSX, useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { BaseForm } from '@/components/Form/BaseForm';
import { FormInput } from '@/components/Form/FormInput';
import { DateTimeField, ErrorText } from '@/components';
import { FormSelect } from '@/components/Form/FormSelect';
import { TRequestBodyCreateRoomType } from '../../product.type';
import { Button, Table, Space, message, notification } from 'antd';
import { FormTextarea } from '@/components/Form/FormTextarea';
import { Trash2 } from 'lucide-react';
import { EProductScheduleStatus } from '@/types/product.type';

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

type TScheduleFormProps = {
	productName: string;
	data: TRequestBodyCreateRoomType;
	setData: React.Dispatch<React.SetStateAction<TRequestBodyCreateRoomType>>;
	isCreate?: boolean;
	isRemove?: boolean;
	disabled?: boolean;
	onSave?: (data: TRequestBodyCreateRoomType) => void;
	onRemove?: () => void;
	onCancel?: () => void;
	onDeleteSuccess?: () => void;
};

type TError = {
	price: boolean;
	startTime: boolean;
	endTime: boolean;
	startOrder: boolean;
	endOrder: boolean;
};

type TAmenityItem = {
	id: string;
	name: string;
};

type TBedTypeItem = {
	id: string;
	name: string;
	quantity: number;
};

export const RoomTypeForm = ({
	productName,
	data,
	setData,
	isCreate = false,
	isRemove = false,
	disabled = false,
	onSave = (): void => { },
	onRemove = (): void => { },
	onCancel = (): void => { },
	onDeleteSuccess = (): void => { },
}: TScheduleFormProps): JSX.Element => {
	console.log(`🚀 ~ RoomTypeForm.tsx:68 ~ data:`, data)
	const form = useForm<TRequestBodyCreateRoomType>({
		defaultValues: data,
	});

	const { control, setValue, watch, getValues } = form;
	const isInitialMount = useRef(true);
	const prevDataRef = useRef(data);

	// State for selected amenities and bed types
	const [selectedAmenities, setSelectedAmenities] = useState<TAmenityItem[]>([]);
	const [selectedBedTypes, setSelectedBedTypes] = useState<TBedTypeItem[]>([]);
	const [currentAmenity, setCurrentAmenity] = useState<string>('');
	const [currentBedType, setCurrentBedType] = useState<string>('');
	const [bedQuantity, setBedQuantity] = useState<number>(1);

	const optionAmenities = useMemo(
		() => [
			{ id: 'cmc935fz60000e5rccap1pbte', value: 'cmc935fz60000e5rccap1pbte', label: 'WiFi' },
			{ id: 'cmc935fz60001e5rc1alxq41j', value: 'cmc935fz60001e5rc1alxq41j', label: 'Parking' },
			{ id: 'cmc935fz60002e5rcftanvbfc', value: 'cmc935fz60002e5rcftanvbfc', label: 'Pool' },
			{ id: 'cmc935fz60003e5rckoo81sq4', value: 'cmc935fz60003e5rckoo81sq4', label: 'Gym' },
			{ id: 'cmc935fz60004e5rcuce8jrwe', value: 'cmc935fz60004e5rcuce8jrwe', label: 'Hair dryer' },
			{ id: 'cmc935fz60005e5rcbl8kqi8u', value: 'cmc935fz60005e5rcbl8kqi8u', label: 'Television' },
			{ id: 'cmc935fz60006e5rc1bvcmpo6', value: 'cmc935fz60006e5rc1bvcmpo6', label: 'Washing machine' },
			{ id: 'cmc935fz60007e5rcbxptw1n1', value: 'cmc935fz60007e5rcbxptw1n1', label: 'Electric stove' },
			{ id: 'cmc935fz60008e5rcu92rabcq', value: 'cmc935fz60008e5rcu92rabcq', label: 'Kitchen utensils' },
			{ id: 'cmc935fz60009e5rcsx58a64t', value: 'cmc935fz60009e5rcsx58a64t', label: 'Air conditioning' },
			{ id: 'cmc935fz6000ae5rca302aiun', value: 'cmc935fz6000ae5rca302aiun', label: 'Scenic view' },
		],
		[],
	);

	const optionBedTypes = useMemo(
		() => [
			{ id: 'cmc92lu9q0000e5wg5jv4yuek', value: 'cmc92lu9q0000e5wg5jv4yuek', label: 'Single bed' },
			{ id: 'cmc92lu9r0001e5wgrxnabt9f', value: 'cmc92lu9r0001e5wgrxnabt9f', label: 'Double bed' },
			{ id: 'cmc92lu9r0002e5wg7221lk1q', value: 'cmc92lu9r0002e5wg7221lk1q', label: 'Queen bed' },
			{ id: 'cmc92lu9r0003e5wggdf9ugrl', value: 'cmc92lu9r0003e5wggdf9ugrl', label: 'King bed' },
		],
		[],
	);

	// Synchronize form data with component state only on initial mount or when data prop changes
	useEffect(() => {
		if (data && JSON.stringify(data) !== JSON.stringify(prevDataRef.current)) {
			Object.keys(data).forEach((key) => {
				setValue(key as keyof TRequestBodyCreateRoomType, data[key as keyof TRequestBodyCreateRoomType]);
			});
			prevDataRef.current = data;

			// Initialize selected amenities and bed types from data
			if (data.amenityIds && data.amenityIds.length > 0) {
				const amenities = data.amenityIds.map(id => {
					const amenity = optionAmenities.find(a => a.id === id);
					return amenity ? { id: amenity.id, name: amenity.label } : null;
				}).filter(Boolean) as TAmenityItem[];
				setSelectedAmenities(amenities);
			}

			if (data.bedTypes && data.bedTypes.length > 0) {
				const bedTypes = data.bedTypes.map(bed => {
					const bedType = optionBedTypes.find(b => b.id === bed.id);
					return bedType ? { id: bed.id, name: bedType.label, quantity: bed.quantity } : null;
				}).filter(Boolean) as TBedTypeItem[];
				setSelectedBedTypes(bedTypes);
			}
		}
	}, [data, setValue, optionAmenities, optionBedTypes]);

	useEffect(() => {
		if (!data) return;

		// Reset states khi data thay đổi
		if (data.amenityIds && Array.isArray(data.amenityIds)) {
			const amenities = data.amenityIds.map(id => {
				const amenity = optionAmenities.find(a => a.id === id);
				return amenity ? { id: amenity.id, name: amenity.label } : null;
			}).filter(Boolean) as TAmenityItem[];
			setSelectedAmenities(amenities);
		}

		if (data.bedTypes && Array.isArray(data.bedTypes)) {
			const bedTypes = data.bedTypes.map(bed => {
				const bedType = optionBedTypes.find(b => b.id === bed.id);
				return bedType ? { id: bed.id, name: bedType.label, quantity: bed.quantity } : null;
			}).filter(Boolean) as TBedTypeItem[];
			setSelectedBedTypes(bedTypes);
		}
	}, [data?.amenityIds, data?.bedTypes, optionAmenities, optionBedTypes]);

	// Watch price changes and update component state
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

	const [error, setError] = useState<TError>({} as TError);

	// Function to add amenity
	const handleAddAmenity = () => {
		if (!currentAmenity) {
			message.warning('Please select an amenity');
			return;
		}

		// Check if already exists
		if (selectedAmenities.some(a => a.id === currentAmenity)) {
			message.warning('This amenity has already been added');
			return;
		}

		const amenity = optionAmenities.find(a => a.id === currentAmenity);
		if (amenity) {
			const newAmenity: TAmenityItem = {
				id: amenity.id,
				name: amenity.label
			};
			setSelectedAmenities([...selectedAmenities, newAmenity]);
			setCurrentAmenity(''); // Reset selection
		}
	};

	// Function to remove amenity
	const handleRemoveAmenity = (amenityId: string) => {
		setSelectedAmenities(selectedAmenities.filter(a => a.id !== amenityId));
	};

	// Function to add bed type
	const handleAddBedType = () => {
		if (!currentBedType) {
			message.warning('Please select a bed type');
			return;
		}

		if (bedQuantity <= 0) {
			message.warning('Quantity must be greater than 0');
			return;
		}

		// Check if already exists
		if (selectedBedTypes.some(b => b.id === currentBedType)) {
			message.warning('This bed type has already been added');
			return;
		}

		const bedType = optionBedTypes.find(b => b.id === currentBedType);
		if (bedType) {
			const newBedType: TBedTypeItem = {
				id: bedType.id,
				name: bedType.label,
				quantity: bedQuantity
			};
			setSelectedBedTypes([...selectedBedTypes, newBedType]);
			setCurrentBedType(''); // Reset selection
			setBedQuantity(1); // Reset quantity
		}
	};

	// Function to remove bed type
	const handleRemoveBedType = (bedTypeId: string) => {
		setSelectedBedTypes(selectedBedTypes.filter(b => b.id !== bedTypeId));
	};

	const handleSaveOnClick = (): void => {
		setError({} as TError);
		if (selectedBedTypes.length === 0) {
			notification.error({
				message: 'Error',
				description: 'Please add at least 1 bed type',
				duration: 3,
			});
			return;
		}
		// Format data according to TRequestBodyCreateRoomType
		const formValues = getValues();
		const roomTypeData: TRequestBodyCreateRoomType = {
			...formValues,
			id: data.id || `room-${Date.now()}`, // Generate ID if not exists
			amenityIds: selectedAmenities.map(a => a.id),
			bedTypes: selectedBedTypes.map(b => ({
				id: b.id,
				quantity: b.quantity
			})),
			// Add status for waiting add if needed
			status: EProductScheduleStatus.waitingAdd,
		};

		// Update data state
		setData(roomTypeData);
		onSave?.(roomTypeData);
	};

	const validateGreaterThanZero = (value: string | number | boolean): string | boolean => {
		const numValue = Number(value);
		return isNaN(numValue) || numValue <= 0 ? 'Price must be greater than 0' : true;
	};

	// Columns for amenities table
	const amenityColumns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: '30%',
		},
		{
			title: 'Amenity Name',
			dataIndex: 'name',
			key: 'name',
			width: '50%',
		},
		{
			title: 'Action',
			key: 'action',
			width: '20%',
			render: (_: any, record: TAmenityItem) => (
				<Button
					type="text"
					danger
					icon={<Trash2 size={16} />}
					onClick={() => handleRemoveAmenity(record.id)}
					disabled={disabled}
				/>
			),
		},
	];

	// Columns for bed types table
	const bedTypeColumns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: '25%',
		},
		{
			title: 'Bed Type Name',
			dataIndex: 'name',
			key: 'name',
			width: '35%',
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
			width: '20%',
		},
		{
			title: 'Action',
			key: 'action',
			width: '20%',
			render: (_: any, record: TBedTypeItem) => (
				<Button
					type="text"
					danger
					icon={<Trash2 size={16} />}
					onClick={() => handleRemoveBedType(record.id)}
					disabled={disabled}
				/>
			),
		},
	];

	return (
		<BaseForm
			title={isCreate ? 'New Room Type' : 'Room Type Detail'}
			form={form}
			isCreate={isCreate}
			isRemove={isRemove}
			disabled={!isCreate || disabled}
			open={true}
			onSave={isCreate ? handleSaveOnClick : undefined}
			onRemove={isRemove ? onRemove : undefined}
			onCancel={onCancel}
		>
			{/* Basic Information */}
			<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-6 flex flex-col gap-4">
				<FormInput
					control={control}
					name="name"
					label="Room Name"
					rules={{ required: 'Room name is required' }}
					disabled={disabled}
				/>

				<FormInput
					control={control}
					name="price"
					label="Price (VND)"
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

				<FormInput
					control={control}
					name="maxOccupancy"
					label="Max Occupancy"
					type="number"
					disabled={disabled}
					placeholder="Enter max occupancy"
					rules={{
						required: 'Max occupancy is required',
						min: { value: 1, message: 'Max occupancy must be at least 1' }
					}}
				/>

				<FormInput
					control={control}
					name="quantity"
					label="Available Rooms"
					type="number"
					disabled={disabled}
					placeholder="Enter number of available rooms"
					rules={{
						required: 'Number of available rooms is required',
						min: { value: 1, message: 'Number of available rooms must be at least 1' }
					}}
				/>

				<FormTextarea
					control={control}
					name="description"
					label="Description"
					rules={{
						required: 'Description is required',
						minLength: {
							value: 10,
							message: 'Description must be at least 10 characters long',
						},
					}}
					disabled={disabled}
				/>
			</div>

			{/* Amenities Section */}
			<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
				<h4 className="text-lg font-medium mb-3">Amenities</h4>

				{/* Add Amenity Form */}
				<div className="flex gap-2 w-full items-end mb-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Select Amenity
						</label>
						<select
							value={currentAmenity}
							onChange={(e) => setCurrentAmenity(e.target.value)}
							disabled={disabled}
							className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">-- Select an amenity --</option>
							{optionAmenities
								.filter(amenity => !selectedAmenities.some(a => a.id === amenity.id))
								.map(amenity => (
									<option key={amenity.id} value={amenity.id}>
										{amenity.label}
									</option>
								))}
						</select>
					</div>
					<Button
						type="primary"
						onClick={handleAddAmenity}
						disabled={disabled || !currentAmenity}
					>
						Add
					</Button>
				</div>

				{/* Amenities Table */}
				<Table
					columns={amenityColumns}
					dataSource={selectedAmenities}
					rowKey="id"
					pagination={false}
					size="small"
					locale={{ emptyText: 'No amenities selected' }}
				/>
			</div>

			{/* Bed Types Section */}
			<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
				<h4 className="text-lg font-medium mb-3">
					Bed Types <span className="text-red-500">*</span>
				</h4>

				{/* Add Bed Type Form */}
				<div className="flex gap-2 w-full items-end mb-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Select Bed Type <span className="text-red-500">*</span>
						</label>
						<select
							value={currentBedType}
							onChange={(e) => setCurrentBedType(e.target.value)}
							disabled={disabled}
							className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">-- Select a bed type --</option>
							{optionBedTypes
								.filter(bedType => !selectedBedTypes.some(b => b.id === bedType.id))
								.map(bedType => (
									<option key={bedType.id} value={bedType.id}>
										{bedType.label}
									</option>
								))}
						</select>
					</div>
					<div className="w-24">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Quantity
						</label>
						<input
							type="number"
							value={bedQuantity}
							onChange={(e) => setBedQuantity(Number(e.target.value))}
							min="1"
							disabled={disabled}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="flex gap-2 w-full sm:w-auto">
						<Button
							type="primary"
							onClick={handleAddBedType}
							disabled={disabled || !currentBedType || bedQuantity <= 0}
							className="flex-1 sm:flex-none"
						>
							Add
						</Button>
					</div>
				</div>

				{/* Bed Types Table */}
				<Table
					columns={bedTypeColumns}
					dataSource={selectedBedTypes}
					rowKey="id"
					pagination={false}
					size="small"
					locale={{ emptyText: 'Please add at least 1 bed type to save' }}
				/>

				{/* Warning message when no bed types */}
				{/* {selectedBedTypes.length === 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            ⚠️ You must add at least 1 bed type before saving.
                        </p>
                    </div>
                )} */}
			</div>
		</BaseForm>
	);
};