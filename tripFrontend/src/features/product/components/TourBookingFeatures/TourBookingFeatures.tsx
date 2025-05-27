import React from 'react';
import { MapPin, CreditCard, Plane } from 'lucide-react';

const TourBookingFeatures: React.FC = () => {
	const features = [
		{
			icon: MapPin,
			title: 'Choose Tour',
			description:
				'Easily select a tour that suits your preferences and budget from a list of attractive destinations.',
		},
		{
			icon: CreditCard,
			title: 'Payment',
			description:
				'Safe and fast payment with various methods: credit card, bank transfer, e-wallet.',
		},
		{
			icon: Plane,
			title: 'Start Your Journey',
			description:
				'Receive tour confirmation via email. Pack your bags and start your adventure!',
		},
	];

	return (
		<section className="container mx-auto px-4 pt-5 md:pt-20 pb-5 md:pb-0">
			<div className="text-center mb-12">
				<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
					Easy Tour Booking Features
				</h2>
				<p className="text-gray-600 max-w-2xl mx-auto">
					We have optimized the tour booking process to provide you with the
					most convenient and fastest experience.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{features.map((feature, index) => (
					<div
						key={index}
						className="bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl hover:scale-105"
					>
						<div className="mb-6 flex justify-center">
							<div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
								<feature.icon className="w-10 h-10 text-orange-500" />
							</div>
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-4">
							{feature.title}
						</h3>
						<p className="text-gray-600">{feature.description}</p>
					</div>
				))}
			</div>

			<div className="text-center mt-12 flex justify-center">
				<a href="/attractions" className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600">
					Book Tour Now
				</a>
			</div>
		</section>
	);
};

export default TourBookingFeatures;
