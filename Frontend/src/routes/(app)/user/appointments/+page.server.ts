import type { PageServerLoad } from './$types';
import { getFacilitiesByState } from '$lib/server/facilities';

export const load: PageServerLoad = async ({ fetch, parent }) => {
	// Check if user is authenticated
	let isAuthenticated = false;
	try {
		const { user } = await parent();
		isAuthenticated = !!user;
	} catch (error) {
		console.log('User not authenticated');
	}

	// Fetch states from external API
	let locations: { value: string; label: string }[] = [];
	try {
		const response = await fetch('https://naija-places.toneflix.com.ng/api/v1/states', {
			headers: {
				'X-Api-Key': 'y6y1j1PVKYaZ9JLMTkf3zOIpriail931'
			}
		});
		const result = await response.json();
		if (result.data && Array.isArray(result.data)) {
			locations = result.data.map((s: any) => ({
				value: s.name,
				label: s.name
			}));
		}
	} catch (error) {
		console.error('Error fetching states:', error);
	}

	// Get facilities from CSV
	const facilitiesByLocation = await getFacilitiesByState();

	return {
		locations,
		facilitiesByLocation,
		isAuthenticated
	};
};
