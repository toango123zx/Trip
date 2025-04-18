export const user = {
	id: '1',
	name: 'Kham Thuan',
	avatar: '/placeholder.svg?height=40&width=40',
};

export const destinations: Destination[] = [
	{
		id: '1',
		name: 'Ha Long Bay',
		location: 'Quang Ninh',
		rating: 4.7,
		image: '/placeholder.svg?height=300&width=300',
		price: {
			amount: 165000,
			currency: 'VND',
			discountedAmount: 150000,
		},
	},
	{
		id: '2',
		name: 'My Khe Beach',
		location: 'Da Nang',
		rating: 4.8,
		image: '/placeholder.svg?height=300&width=300',
		price: {
			amount: 180000,
			currency: 'VND',
			discountedAmount: 165000,
		},
	},
	{
		id: '3',
		name: 'Ngu Hanh Mountain',
		location: 'Da Nang',
		rating: 4.7,
		image: '/placeholder.svg?height=300&width=300',
		price: {
			amount: 150000,
			currency: 'VND',
			discountedAmount: 165000,
		},
	},
	{
		id: '4',
		name: 'Than Tai Waterfall',
		location: 'Da Nang',
		rating: 4.8,
		image: '/placeholder.svg?height=300&width=300',
		price: {
			amount: 120000,
			currency: 'VND',
			discountedAmount: 165000,
		},
	},
	{
		id: '5',
		name: 'Son Tra Peninsula',
		location: 'Da Nang',
		rating: 4.7,
		image: '/placeholder.svg?height=300&width=300',
		price: {
			amount: 140000,
			currency: 'VND',
			discountedAmount: 165000,
		},
	},
	{
		id: '6',
		name: 'Phu Quoc Island',
		location: 'Phu Quoc',
		rating: 4.9,
		image: '/placeholder.svg?height=300&width=300',
		price: {
			amount: 200000,
			currency: 'VND',
			discountedAmount: 165000,
		},
	},
];

export const services: Service[] = [
	{
		id: '1',
		title: 'Best Tour Guide',
		icon: '/assets/images/services/guide.png',
		description: 'Meet the quality standards you expect',
	},
	{
		id: '2',
		title: 'Easy Booking',
		icon: '/assets/images/services/booking.png',
		description:
			'By adopting technology and best practice to ensure ordering becomes easier',
	},
	{
		id: '3',
		title: 'Famous Destinations',
		icon: '/assets/images/services/destination.png',
		description: 'Not to be missed',
	},
	{
		id: '4',
		title: 'Best Tour Guide',
		icon: '/assets/images/services/guide.png',
		description: 'Professional guides for your journey',
	},
	{
		id: '5',
		title: 'Best Tour Guide',
		icon: '/assets/images/services/guide.png',
		description: 'Experienced guides for a memorable experience',
	},
];

export const stats: Stat[] = [
	{
		value: '141,432',
		label: 'Satisfied Customers',
	},
	{
		value: '12,929',
		label: 'Staff',
	},
	{
		value: '1,367',
		label: 'Destinations',
	},
];
