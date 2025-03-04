import { Transform } from 'class-transformer';

export const AutoTrim = (): PropertyDecorator => {
	return Transform(({ value }) => {
		if (typeof value === 'string') {
			return value.trim();
		}
		if (Array.isArray(value)) {
			return value.map((v) => (typeof v === 'string' ? v.trim() : v));
		}
		return value;
	});
};
