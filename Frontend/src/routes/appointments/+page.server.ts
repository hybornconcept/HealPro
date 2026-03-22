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

	// Fetch states from external API without awaiting, to stream it
	const locationsPromise = fetch('https://naija-places.toneflix.com.ng/api/v1/states', {
		headers: {
			'X-Api-Key': 'y6y1j1PVKYaZ9JLMTkf3zOIpriail931'
		}
	})
		.then((res) => res.json())
		.then((result) => {
			if (result.data && Array.isArray(result.data)) {
				return result.data.map((s: any) => ({
					value: s.name,
					label: s.name
				}));
			}
			return [];
		})
		.catch((error) => {
			console.error('Error fetching states:', error);
			return [];
		});

	// Get facilities from CSV without awaiting
	const facilitiesPromise = getFacilitiesByState();

	return {
		isAuthenticated,
		streamed: {
			locations: locationsPromise,
			facilitiesByLocation: facilitiesPromise
		}
	};
};
