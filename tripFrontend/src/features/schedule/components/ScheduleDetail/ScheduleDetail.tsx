import React, { JSX, useEffect } from 'react';

import { EProductScheduleStatus } from '@/types';

import { TRequestBodyCreateSchedule } from '../../schedule.type';
import { scheduleApi } from '../../scheduleApi';
import { ScheduleForm } from '../ScheduleForm';

type TScheduleDetailProps = {
	productName: string;
	scheduleId: string;
	isCreate: boolean;
	disabled?: boolean;
	onSave?: (data: TRequestBodyCreateSchedule) => void;
	onRemove?: () => void;
	onCancel?: () => void;
};

export const ScheduleDetail = ({
	productName,
	scheduleId,
	isCreate,
	disabled = false,
	onSave = (): void => {},
	onRemove = (): void => {},
	onCancel,
}: TScheduleDetailProps): JSX.Element => {
	const [schedule, setSchedule] = React.useState<TRequestBodyCreateSchedule>(
		{} as TRequestBodyCreateSchedule,
	);

	useEffect(() => {
		const fetchSchedule = async (): Promise<void> => {
			if (!scheduleId) {
				return;
			}
			const data = await scheduleApi.getScheduleByScheduleId(
				scheduleId,
				EProductScheduleStatus.active,
			);
			setSchedule({
				id: data.id,
				startTime: data.startTime,
				endTime: data.endTime,
				startOrder: data.startOrder,
				endOrder: data.endOrder,
				price: data.price,
			});
		};
		fetchSchedule();
	}, [scheduleId]);

	return (
		<ScheduleForm
			productName={productName}
			data={schedule}
			disabled={disabled}
			setData={setSchedule}
			isCreate={isCreate}
			onSave={onSave}
			onRemove={onRemove}
			onCancel={onCancel}
		/>
	);
};
