import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
	{
		variants: {
			variant: {
				default: 'bg-orange-500 text-white hover:bg-orange-600',
				outline: 'border border-orange-500 text-orange-500 hover:bg-orange-50',
				ghost: 'text-orange-500 hover:bg-orange-50',
				link: 'text-orange-500 underline-offset-4 hover:underline',
				icon: 'p-2 rounded-full',
				circle: 'rounded-full',
			},
			size: {
				default: 'h-10 py-2 px-4',
				sm: 'h-8 px-3 text-xs',
				lg: 'h-12 px-6 text-base',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface IButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = 'Button';
