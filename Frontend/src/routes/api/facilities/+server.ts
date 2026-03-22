import { json } from '@sveltejs/kit';
import { getFacilitiesByState } from '$lib/server/facilities';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const facilities = await getFacilitiesByState();
	return json(facilities);
};
