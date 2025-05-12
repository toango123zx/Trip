import { OrderByEnum } from 'src/common';
export class OrderBySearchDto {
	convertOrderByToORM<T>(filter: T): Partial<Record<keyof T, OrderByEnum>>[] {
		const orderBy = [];
		for (const key in filter) {
			if (filter[key]) {
				orderBy.push({
					[key]: filter[key],
				});
			}
		}
		return orderBy;
	}
}
