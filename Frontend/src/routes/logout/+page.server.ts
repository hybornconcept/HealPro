import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { API_ROUTES } from '$lib/api-routes';

const BACKEND_URL =
	(import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';

export const actions: Actions = {
	default: async ({ fetch, cookies }) => {
		try {
			// Call backend logout if needed
			await fetch(`${BACKEND_URL}${API_ROUTES.AUTH.LOGOUT}`, {
				method: 'POST',
				headers: {
					cookie: cookies
						.getAll()
						.map((c) => `${c.name}=${c.value}`)
						.join('; ')
				}
			});
		} catch (error) {
			console.error('Logout error:', error);
		}

		// Clear all cookies
		const allCookies = cookies.getAll();
		for (const cookie of allCookies) {
			cookies.delete(cookie.name, { path: '/' });
		}

		throw redirect(303, '/login');
	}
};
