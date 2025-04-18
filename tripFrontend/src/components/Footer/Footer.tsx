import { Instagram, Facebook, Twitter, Dribbble, Github } from 'lucide-react';
import { JSX } from 'react';
import { Link } from 'react-router-dom';

import { logos } from '@/assets';

export const Footer = (): JSX.Element => {
	return (
		<footer className="bg-[#FF7A22] text-white py-12  md:px-16 font-[Poppins]">
			<div className="max-w-[1728px] mx-auto px-6">
				<div className="flex gap-64 justify-between">
					{/* Logo and Description */}
					<div className="md:col-span-1">
						<Link to="/" className="inline-block mb-4">
							<img
								src={logos.subTravalidName}
								alt="Travalid Logo"
								className="w-44 h-20 py-2.5"
							/>
						</Link>
						<p className="text-sm leading-relaxed max-w-96">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
							aliquam, purus sit amet luctus venenatis, lectus magna
							fringilla urna, porttitor rhoncus dolor purus non enim
							praesent elementum facilisis leo, vel
						</p>
					</div>
					<div className="flex flex-row pt-4">
						{/* Links */}
						<div className="mr-44">
							<h3 className="text-lg font-bold mb-7">Links</h3>
							<ul className="w-max space-y-5 font-[Regular] text-[16px]">
								<li>
									<Link
										to="/discover"
										className="text-sm hover:underline"
									>
										Discover
									</Link>
								</li>
								<li>
									<Link
										to="/special-deals"
										className="text-sm hover:underline"
									>
										Special Deals
									</Link>
								</li>
								<li>
									<Link
										to="/services"
										className="text-sm hover:underline"
									>
										Services
									</Link>
								</li>
								<li>
									<Link
										to="/community"
										className="text-sm hover:underline"
									>
										Community
									</Link>
								</li>
								<li>
									<Link
										to="/about-us"
										className="text-sm hover:underline"
									>
										About Us
									</Link>
								</li>
							</ul>
						</div>

						{/* Services */}
						<div className="mr-60">
							<h3 className="text-lg font-bold mb-4">Services</h3>
							<ul className="w-max space-y-5 font-[Regular] text-[16px]">
								<li>
									<Link to="/blog" className="text-sm hover:underline">
										Blog & Articles
									</Link>
								</li>
								<li>
									<Link to="/terms" className="text-sm hover:underline">
										Term and Condition
									</Link>
								</li>
								<li>
									<Link
										to="/privacy"
										className="text-sm hover:underline"
									>
										Privacy Policy
									</Link>
								</li>
							</ul>
						</div>

						{/* Contact */}
						<div>
							<h3 className="text-lg font-bold mb-4">Contact</h3>
							<ul className="w-max space-y-5 font-[Regular] text-[16px]">
								<li className="text-sm">Address: 54 Nguyễn Lương Bằng</li>
								<li className="text-sm">Liên Chiểu, Đà Nẵng</li>
								<li className="text-sm">Phone: 123 456 7890</li>
								<li className="text-sm">Email: travalid@gmail.com</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Social Media */}
				<div className="mt-12">
					<h3 className="text-lg font-bold mb-4 pt-1">Social Media</h3>
					<div className="flex space-x-4">
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white/80 transition-colors"
						>
							<Instagram size={20} />
						</a>
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white/80 transition-colors"
						>
							<Facebook size={20} />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white/80 transition-colors"
						>
							<Twitter size={20} />
						</a>
						<a
							href="https://dribbble.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white/80 transition-colors"
						>
							<Dribbble size={20} />
						</a>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white/80 transition-colors"
						>
							<Github size={20} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};
