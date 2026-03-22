import { redirect, type Handle } from '@sveltejs/kit';
import { API_ROUTES } from '$lib/api-routes';

const BACKEND_URL =
	(import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';

export const handle: Handle = async ({ event, resolve }) => {
	// For protected routes, you could check session via your backend
	if (event.route.id?.startsWith('/(protected)/')) {
		// Make request to your Hono backend to check session
		const sessionResponse = await fetch(`${BACKEND_URL}${API_ROUTES.AUTH.GET_SESSION}`, {
			headers: {
				Cookie: event.request.headers.get('cookie') || ''
			}
		});

		if (!sessionResponse.ok) {
			redirect(307, '/signin');
		}

		const sessionData = await sessionResponse.json();
		event.locals.session = sessionData.session;
		event.locals.user = sessionData.user;
	}

	return resolve(event);
};

