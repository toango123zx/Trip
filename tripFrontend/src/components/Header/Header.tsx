import { JSX } from 'react';
import { Link } from 'react-router-dom';

import { logos } from '@/assets';
import { cn } from '@/lib/cn';

type TNavItem = {
	label: string;
	href: string;
};

const navItems: TNavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Attractions', href: '/attractions' },
	{ label: 'Services', href: '/services' },
	{ label: 'Sales', href: '/sales' },
	{ label: 'Contact', href: '/contact' },
];

type Props = {
	className?: string;
};

export const Header = ({ className }: Props): JSX.Element => {
	return (
		<header
			className={cn(
				'w-full py-4 px-6 md:py-12 md:px-24  bg-gradient-to-b from-[#fffdea]/100 to-white/0',
				className,
			)}
		>
			<div className="max-w-7xl mx-auto flex justify-start items-center gap-[287px]">
				<Link to="/" className="flex items-center">
					<img
						src={logos.mainTravalidLogo}
						alt="Travalid Logo"
						className="h-14 p-2.5"
					/>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex justify-start items-center gap-24 font-[Montserrat] text-2xl ">
					{navItems.map((item) => (
						<Link
							key={item.label}
							to={item.href}
							className="text-gray-800 hover:text-[#FF7A22] transition-colors duration-200"
						>
							{item.label}
						</Link>
					))}
				</nav>

				{/* Mobile Navigation Toggle */}
				<button className="md:hidden text-gray-800">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</button>
			</div>
		</header>
	);
};
