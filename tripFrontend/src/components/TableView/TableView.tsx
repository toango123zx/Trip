import { Table, TableColumnsType } from 'antd';
import { JSX } from 'react';

import { cn } from '@/lib';

import './style.scss';

type TTable<T> = {
	columnTable: TableColumnsType<T>;
	data?: T[];
	className?: string;
	pagination?: boolean;
	pageSize?: number;
};

export const TableView = <T,>({
	className,
	columnTable,
	pageSize = 10,
	data,
	pagination = true,
}: TTable<T>): JSX.Element => {
	return (
		<Table<T>
			rowKey="id"
			columns={columnTable}
			dataSource={data}
			pagination={pagination ? { pageSize } : false}
			className={cn(`relative md:pt-0 `, className)}
		/>
	);
};
