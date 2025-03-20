import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function IsAfterToday(validationOptions?: ValidationOptions): PropertyDecorator {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			name: 'isAfterToday',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: string, _args: ValidationArguments): boolean {
					if (!value) return false;
					const date = new Date(value);
					const today = new Date();
					return date > today;
				},
				defaultMessage(args: ValidationArguments): string {
					return `${args.property} must be a date after today (${new Date()}).`;
				},
			},
		});
	};
}
