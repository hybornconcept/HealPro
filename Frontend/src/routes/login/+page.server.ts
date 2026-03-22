import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { API_ROUTES } from '$lib/api-routes';

const BACKEND_URL =
	(import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';


export const load: PageServerLoad = async ({ fetch, cookies }) => {
	// Check if user is already logged in
	try {
		const res = await fetch(`${BACKEND_URL}${API_ROUTES.AUTH.ME}`, {
			headers: {
				cookie: cookies
					.getAll()
					.map((c) => `${c.name}=${c.value}`)
					.join('; ')
			}
		});

		if (res.ok) {
			const data = await res.json();
			if (data.user) {
				// Redirect based on user type
				const userType = data.user.userType;
				if (userType === 'hospital') {
					throw redirect(303, '/facility');
				} else if (userType === 'hmo') {
					throw redirect(303, '/hmo');
				} else {
					throw redirect(303, '/user');
				}
			}
		}
	} catch (error) {
		// If redirect was thrown, re-throw it
		if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
			throw error;
		}
		// Otherwise ignore error and show login page
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		try {
			// Call login API
			const res = await fetch(`${BACKEND_URL}${API_ROUTES.AUTH.LOGIN}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (!res.ok) {
				const errorData = await res.json();
				return fail(401, {
					error: errorData.error || errorData.message || 'Invalid credentials'
				});
			}

			const data = await res.json();

			// Extract and set the session cookie from the response
			const setCookieHeader = res.headers.get('set-cookie');
			if (setCookieHeader) {
				// Parse the set-cookie header and set it on our response
				const sessionToken = setCookieHeader.match(/session_token=([^;]+)/)?.[1];
				if (sessionToken) {
					cookies.set('session_token', sessionToken, {
						path: '/',
						httpOnly: true,
						secure: true,
						sameSite: 'none',
						maxAge: 30 * 24 * 60 * 60 // 30 days
					});
				}
			}

			// Determine redirect path based on user type
			let redirectPath = '/user';
			if (data.user && data.user.userType) {
				const userType = data.user.userType;
				if (userType === 'hospital') {
					redirectPath = '/facility';
				} else if (userType === 'hmo') {
					redirectPath = '/hmo';
				} else if (userType === 'patient') {
					redirectPath = '/user';
				}
			}

			// Redirect to the appropriate page
			throw redirect(303, redirectPath);
		} catch (error: any) {
			// If this is a redirect, re-throw it
			if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
				throw error;
			}

			console.error('[LOGIN] Error:', error);
			return fail(500, {
				error: error.message || 'An error occurred during login'
			});
		}
	}
};
