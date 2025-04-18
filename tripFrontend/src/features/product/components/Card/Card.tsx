import { Eye, Star } from 'lucide-react';
import React, { JSX } from 'react';

import { cn } from '@/lib/utils';
import { TProductSumary } from '@/types';

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
	shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, ICardProps>(
	({ className, shadow = 'sm', ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'rounded-xl bg-white',
					{
						'shadow-none': shadow === 'none',
						'shadow-sm': shadow === 'sm',
						'shadow-md': shadow === 'md',
						'shadow-lg': shadow === 'lg',
					},
					className,
				)}
				{...props}
			/>
		);
	},
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('flex flex-col space-y-1.5 p-4', className)}
			{...props}
		/>
	),
);

CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('flex items-center p-4 pt-0', className)} {...props} />
));

CardFooter.displayName = 'CardFooter';

type TCardProductInput = {
	product: TProductSumary;
	className?: string;
};

export const CardProduct = ({ product, className }: TCardProductInput): JSX.Element => {
	const currency = 'VND';
	return (
		<div key={product.id} className="w-full md:md:w-1/3 md:flex-shrink-0 px-2">
			<Card className="overflow-hidden border shadow-md">
				<div className="relative h-72 w-full">
					{/* <Image
											src={product.image || "/placeholder.svg"}
											alt={product.title}
											fill
											className="object-cover"
										/> */}
					<img
						src="https://i.pinimg.com/736x/ca/b7/8d/cab78d000d6535dad1d6482e75fb9529.jpg"
						// alt={destination.name}
						className="w-full h-full object-cover"
					/>
				</div>
				<CardContent className="pt-4">
					<h3 className="font-medium text-lg">{product.name}</h3>
					<div className="flex items-center mt-2">
						<p className="text-gray-500 line-through text-sm">
							{currency} {product.price}
						</p>
						<p className="ml-2 text-orange-500 font-medium">
							{currency} {product.price}
						</p>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between items-center pt-0">
					<div className="flex items-center">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className={`h-4 w-4 ${
									i < Math.floor(product.avgRate)
										? 'text-yellow-400 fill-yellow-400'
										: 'text-gray-300'
								}`}
							/>
						))}
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<Eye className="h-4 w-4 mr-1" />
						{product.quantityRate}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};
