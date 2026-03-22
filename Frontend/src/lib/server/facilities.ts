import hospitals from '../../../hospitals.json';

export interface Facility {
	state: string;
	lga: string;
	facility_name: string;
}

import fs from 'fs';
export const getFacilities = async (): Promise<Facility[]> => {
	try {
		fs.writeFileSync('C:\\Users\\DELL PRECISION 5520\\Documents\\HEALPRO\\Frontend\\debug.log', 'HOSPITALS TYPE: ' + Array.isArray(hospitals) + ' len: ' + (hospitals ? Object.keys(hospitals).length : 0));
		return hospitals as Facility[];
	} catch (error) {
		console.error('Error parsing hospitals.json', error);
		return [];
	}
};

let cachedFacilitiesByState: Record<string, { value: string; label: string }[]> | null = null;

export const getFacilitiesByState = async (): Promise<
	Record<string, { value: string; label: string }[]>
> => {
	if (cachedFacilitiesByState) return cachedFacilitiesByState;

	const facilities = await getFacilities();
	const grouped: Record<string, { value: string; label: string }[]> = {};

	facilities.forEach((facility) => {
		if (!facility.state) return;
		// Normalize state name: trim and replace hyphens with spaces to match API (e.g. "Akwa-Ibom" -> "Akwa Ibom")
		const state = facility.state.trim().replace(/-/g, ' ');
		if (!grouped[state]) {
			grouped[state] = [];
		}
		grouped[state].push({
			value: facility.facility_name,
			label: facility.facility_name
		});
	});

	cachedFacilitiesByState = grouped;
	return grouped;
};
