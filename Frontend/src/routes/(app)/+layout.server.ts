import { redirect } from '@sveltejs/kit';
import { API_ROUTES } from '$lib/api-routes';
import type { LayoutServerLoad } from './$types';

const BACKEND_URL =
	(import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';


export const load: LayoutServerLoad = async ({ fetch, cookies, url }) => {
	try {
		// Forward the cookie to the backend to check session
		const res = await fetch(`${BACKEND_URL}${API_ROUTES.AUTH.ME}`, {
			headers: {
				cookie: cookies
					.getAll()
					.map((c) => `${c.name}=${c.value}`)
					.join('; ')
			}
		});

		if (!res.ok) {
			throw new Error('Not authenticated');
		}

		const sessionData = await res.json();

		if (!sessionData || !sessionData.user) {
			throw new Error('No user found');
		}

		// IMPORTANT: Check role via API instead of trusting userType field
		// The userType field in Better Auth is unreliable - use database lookup instead
		try {
			const roleCheckRes = await fetch(`${BACKEND_URL}${API_ROUTES.ROLE.CHECK}`, {
				headers: {
					cookie: cookies
						.getAll()
						.map((c) => `${c.name}=${c.value}`)
						.join('; ')
				}
			});

			if (roleCheckRes.ok) {
				const roleData = await roleCheckRes.json();
				if (roleData.success && roleData.redirect) {
					const path = url.pathname;
					const expectedPath = roleData.redirect;

					// Redirect if user is in wrong section
					if (!path.startsWith(expectedPath)) {
						throw redirect(307, expectedPath);
					}
				}
			}
		} catch (roleError) {
			console.error('Role check failed:', roleError);
			// If it's a redirect, we must re-throw it to allow SvelteKit to handle it
			if (roleError && typeof roleError === 'object' && 'status' in roleError && 'location' in roleError) {
				throw roleError;
			}
			// Otherwise, silently ignore role check failure and proceed with session user
		}

		return {
			user: sessionData.user,
			session: sessionData.session
		};
	} catch (err) {
		// If this is already a redirect error, just re-throw it
		if (err && typeof err === 'object' && 'status' in err && 'location' in err) {
			throw err;
		}

		// If we are in the protected app routes and not authenticated, redirect to login
		// Only add 'from' parameter if user was trying to access a specific page
		const shouldAddFrom =
			url.pathname !== '/user' && url.pathname !== '/facility' && url.pathname !== '/hmo';

		if (shouldAddFrom) {
			throw redirect(307, `/login?from=${url.pathname}`);
		} else {
			throw redirect(307, '/login');
		}
	}
};

