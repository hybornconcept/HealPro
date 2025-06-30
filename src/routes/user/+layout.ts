import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	// Preload critical data for user dashboard
	const preloadData = async () => {
		// Simulate API calls - replace with actual data fetching
		const userProfile = {
			name: 'Ludmila Sidorshina',
			email: 'ludmilasidorshina@gmail.com',
			avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
			stats: { past: 5, upcoming: 2 }
		};

		const appointments = [
			{
				date: '13 Jan, 2022',
				type: 'Regular checkup',
				time: '4.00 pm',
				comments: null,
				payment: { status: 'Pending', color: 'text-orange-500' }
			},
			{
				date: '21 Nov, 2021',
				type: 'Bleaching',
				time: '1.00 pm',
				comments: 'See Comment',
				payment: { status: 'Complete', color: 'text-green-600' }
			}
		];

		return {
			userProfile,
			appointments
		};
	};

	// Only preload data for user dashboard pages
	if (url.pathname.startsWith('/user')) {
		const data = await preloadData();
		return {
			...data,
			currentPath: url.pathname
		};
	}

	return {
		currentPath: url.pathname
	};
};

// Enable client-side routing for better performance
export const ssr = true;
export const prerender = false;
