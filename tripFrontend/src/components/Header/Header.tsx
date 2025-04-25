import { JSX, useEffect, useMemo, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

import { logos } from '@/assets';
import { cn } from '@/lib/cn';

type TNavItem = {
	label: string;
	href: string;
};

type Props = {
	className?: string;
};

export const Header = ({ className }: Props): JSX.Element => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isLogged, setIsLogged] = useState(false);
	const nav = useNavigate();

	const initialNavItems = useMemo(
		() => [
			{ label: 'Home', href: '/' },
			{ label: 'Attractions', href: '/attractions' },
			{ label: 'Services', href: '/services' },
			{ label: 'Sales', href: '/sales' },
			{ label: 'Profile', href: '/user/me' },
			{ label: 'Cart', href: '/cart' },
			{ label: 'Contact', href: '/contact' },
		],
		[],
	);

	const [navItems, setNavItems] = useState<TNavItem[]>(initialNavItems);

	useEffect(() => {
		const loggedInStatus = localStorage.getItem('logged') !== null;
		setIsLogged(loggedInStatus);

		if (!loggedInStatus && !navItems.some((item) => item.label === 'Login')) {
			setNavItems((prev) => [...prev, { label: 'Login', href: '/auth/login' }]);
		}
	}, [navItems]);

	const toggleMobileMenu = (): void => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const handleClickloginButton = (): void => {
		nav('auth/login');
	};

	return (
		<header
			className={cn(
				'w-full py-4 px-6 md:py-12 md:px-24 bg-gradient-to-b from-[#fffdea]/100 to-white/0',
				className,
			)}
		>
			<div className="max-w-[1728px] mx-auto flex justify-between md:justify-between items-center]">
				<Link to="/" className="flex items-center">
					<img
						src={logos.mainTravalidName}
						alt="Travalid Logo"
						className="h-5 md:h-14 md:p-2.5"
					/>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex justify-start items-center gap-12 font-[Montserrat] text-2xl ">
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
				<div className="w-fit">
					{isLogged ? (
						<div className="hidden md:flex items-center space-x-4 ">
							<Link
								to="/cart"
								className="p-2 hover:text-orange-500 transition-colors"
							>
								<IoCartOutline className="h-8 w-8" />
							</Link>
							<Link
								to="/account"
								className="p-2 hover:text-orange-500 transition-colors"
							>
								<FaRegUser className="h-7 w-7" />
							</Link>
						</div>
					) : (
						<button
							onClick={handleClickloginButton}
							className="hidden md:block w-36 bg-orange-500 text-white py-3 rounded-3xl hover:bg-orange-600 text-xl text-center font-bold transition-colors duration-200"
						>
							Login
						</button>
					)}
				</div>
				{/* Mobile Navigation Toggle */}
				<button
					className="md:hidden text-gray-800"
					onClick={toggleMobileMenu}
					aria-label="Toggle mobile menu"
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-menu"
				>
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
				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden absolute top-12 left-0 right-0 bg-white p-4 shadow-md z-50">
						<nav className="flex flex-col space-y-4">
							{navItems.map((item) => (
								<Link
									key={item.label}
									to={item.href}
									className="text-gray-800 hover:text-[#FF7A22] transition-colors duration-200"
									onClick={() => setMobileMenuOpen(false)}
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>
				)}
			</div>
		</header>
	);
};
