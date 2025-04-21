import { Eye, Star } from 'lucide-react';
import React, { JSX } from 'react';
import { IoLocationOutline } from 'react-icons/io5';

import { cn } from '@/lib/utils';
import { TProductSumary } from '@/types';
import { useNavigate } from 'react-router-dom';

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

export const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex flex-col space-y-1.5 p-4', className)}
		{...props}
	/>
));

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
	const nav = useNavigate();
	const currency = 'VND';

	const handlerCardOnClick = () => {
		nav(`/product/${product.id}`);
	}
	return (
		<div
			key={product.id}
			// className={cn('w-full md:w-1/3 md:flex-shrink-0 px-2', className)}
			className={cn('w-full h-full md:flex-shrink-0 px-2', className)}
		>
			<button className="w-full h-full text-left shadow-xl" onClick={handlerCardOnClick}>
				<Card className="h-full overflow-hidden border-none shadow-md pt-4 px-3">
					<div className="relative h-72 w-full">
						<img
							src={product.posterImageUrl}
							// alt={destination.name}
							className="w-full h-full object-cover rounded-xl "
						/>
					</div>
					<CardContent className="pt-4">
						<h3 className="font-medium text-2xl leading-11 tracking-wide py-3">
							{product.name}
						</h3>
						<div className="flex flex-col-reverse md:flex-row justify-between">
							<div className="flex items-center mt-2">
								<p className="text-gray-500 line-through text-lg">
									{currency} {product.price}
								</p>
								<p className="ml-2 text-orange-500 font-medium text-xl">
									{currency} {product.price}
								</p>
							</div>
							<div className="flex flex-row items-center gap-2.5">
								<IoLocationOutline />
								<p className="text-black text-lg">{product.city}</p>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex justify-between items-center pt-0">
						<div className="flex items-center">
							<p className="pr-2.5 text-xl">{product.avgRate}</p>
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`h-4 w-4 ${i < Math.floor(product.avgRate)
											? 'text-yellow-400 fill-yellow-400'
											: 'text-gray-300'
										}`}
								/>
							))}
						</div>
						<div className="flex items-center text-sm text-gray-500">
							<Eye className="h-6 w-6 mr-1" />
							<p className="text-black-500 text-xl">
								{product.quantityRate}
							</p>
						</div>
					</CardFooter>
				</Card>
			</button>
		</div>
	);
};
