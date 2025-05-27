import { Eye, Star } from 'lucide-react';
import React, { JSX } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

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

	const handlerCardOnClick = (): void => {
		nav(`/attractions/${product.id}`);
	};
	return (
		<div
			key={product.id}
			className={cn('w-full h-full md:flex-shrink-0 px-2', className)}
		>
			<button
				className="w-full h-full text-left shadow-xl"
				onClick={handlerCardOnClick}
			>
				<Card className="h-full overflow-hidden border-none shadow-lg pt-0 px-0 rounded-2xl">
					<div className="relative h-56 w-full">
						<img
							src={product.posterImageUrl}
							alt={`${product.name} image`}
							className="w-full h-full object-cover rounded-t-2xl p-1.5"
						/>
					</div>
					<CardContent className="pt-4 pb-2 px-5">
						<h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-2 truncate">{product.name}</h3>
						<div className="flex flex-row items-center mb-2">
							<p className="text-gray-400 line-through text-base mr-2">VND {product.oldPrice || product.price}</p>
							<p className="text-orange-500 font-bold text-base">VND {product.price}</p>
						</div>
						<div className="flex items-center mb-2">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`h-4 w-4 ${i < Math.floor(product.avgRate) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
								/>
							))}
							<span className="ml-2 text-gray-500 text-sm">({product.avgRate})</span>
						</div>
						<div className="flex items-center text-gray-500 text-sm mb-2">
							<Eye className="h-4 w-4 mr-1" />
							<span>{product.quantityRate}</span>
						</div>
						<div className="flex items-center text-gray-500 text-sm">
							<IoLocationOutline className="mr-1" />
							<span>{product.city}</span>
						</div>
					</CardContent>
				</Card>
			</button>
		</div>
	);
};
