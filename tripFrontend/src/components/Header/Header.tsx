import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

import { logos } from '@/assets';
import { cn } from '@/lib/cn';

const ProfileIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
		></path>
	</svg>
);
const AccountsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
		></path>
	</svg>
);
const ProductsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
		></path>
	</svg>
);
const OrderHistoryIcon: React.FC<{ className?: string }> = ({
	className = 'w-5 h-5',
}) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
		></path>
	</svg>
);
const StatisticsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
		></path>
	</svg>
);
const SettingsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
		></path>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
		></path>
	</svg>
);
const LogoutIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
		></path>
	</svg>
);

type TNavItem = {
	label: string;
	href: string;
};

type TMenuItem = {
	id: string;
	label: string;
	url: string;
	icon: React.ComponentType<{ className?: string }>;
	href?: string;
	onClick?: () => void;
};

type TUserProfileDropdownProps = {
	onItemClick: (url: string) => void;
	menuItems: TMenuItem[];
};

const UserProfileDropdown = ({
	onItemClick,
	menuItems,
}: TUserProfileDropdownProps): JSX.Element => {
	const handleLogout = (): void => {
		localStorage.removeItem('logged');
		localStorage.removeItem('role');
	};

	return (
		<div className="origin-top-right absolute right-0 w-72 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none font-sans z-10">
			<ul className="text-gray-700">
				{menuItems.map((item) => (
					<li key={item.id}>
						<a
							href={item.href || '#'}
							onClick={(e) => {
								if (!item.href) e.preventDefault();
								onItemClick(item.url);
								if (item.id === 'logout') {
									handleLogout();
								}
							}}
							className={`flex items-center gap-4 px-4 py-2.5 text-sm font-medium transition-colors duration-150 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md
                						${item.id == 'logout' && 'bg-red-600 text-white hover:bg-red-700 rounded-md'}
                						${item.label == 'Log out' ? '' : 'mx-0 my-0'}
              							`}
						>
							<item.icon
								className={`w-8 h-8  hover:text-white ${item.id == 'logout' && 'text-white'}`}
							/>
							<span className="text-3xl">{item.label}</span>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

type Props = {
	className?: string;
};

export const Header = ({ className }: Props): JSX.Element => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isLogged, setIsLogged] = useState(false);
	const nav = useNavigate();

	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

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

	const role = localStorage.getItem('role');

	const menuItems: TMenuItem[] = useMemo(() => {
		let items: TMenuItem[] = [
			{ id: 'profile', label: 'Profile', url: '/users/me', icon: ProfileIcon },
			{ id: 'accounts', label: 'Accounts', url: '/users', icon: AccountsIcon },
			{ id: 'products', label: 'Products', url: '/products', icon: ProductsIcon },
			{
				id: 'order-history',
				label: 'Order History',
				url: '/bills',
				icon: OrderHistoryIcon,
			},
			{
				id: 'statistics',
				label: 'Statistics',
				url: '/statistics',
				icon: StatisticsIcon,
			},
			{ id: 'setting', label: 'Setting', url: '/setting', icon: SettingsIcon },
			{ id: 'logout', label: 'Log Out', url: '/', icon: LogoutIcon },
		];

		if (role === 'supplier') {
			items = items.filter((item) => item.id !== 'accounts');
		} else if (role === 'tourist' || role === null) {
			items = items.filter(
				(item) =>
					item.id !== 'statistics' &&
					item.id !== 'accounts' &&
					item.id !== 'products',
			);
		}
		return items;
	}, [role]);



	const [navItemsMobile, setNavItemsMobile] = useState<TNavItem[]>(initialNavItems);

	useEffect(() => {
		const loggedInStatus = localStorage.getItem('logged') !== null;
		setIsLogged(loggedInStatus);

		if (!loggedInStatus && !navItemsMobile.some((item) => item.label === 'Login')) {
			setNavItemsMobile((prev) => [...prev, { label: 'Login', href: '/auth/login' }]);
			return;
		}
	}, [navItemsMobile, menuItems]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent): void => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return (): void => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const toggleMobileMenu = (): void => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const handleClickloginButton = (): void => {
		nav('/auth/login');
	};

	const toggleDropdown = (): void => {
		setIsOpen(!isOpen);
	};

	const handleMenuClick = (url: string): void => {
		nav(url);
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
					{initialNavItems.map((item) => (
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
							{/* Relative container for positioning the dropdown */}
							<div
								className="relative inline-block text-left"
								ref={dropdownRef}
							>
								{/* Trigger Button */}
								<button
									ref={triggerRef}
									type="button"
									onClick={toggleDropdown}
									className="p-2 hover:text-orange-500 transition-colors"
									id="options-menu"
									aria-haspopup="true"
									aria-expanded={isOpen}
								>
									<FaRegUser className="h-7 w-7" />
								</button>

								<div
									className={`transition ease-out duration-100 transform ${isOpen
										? 'opacity-100 scale-100'
										: 'opacity-0 scale-95 pointer-events-none'
										}`}
								>
									{isOpen && (
										<UserProfileDropdown
											onItemClick={handleMenuClick}
											menuItems={menuItems}
										/>
									)}
								</div>
							</div>
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
							{navItemsMobile.map((item) => (
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
