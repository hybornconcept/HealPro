import { API_ROUTES } from '$lib/api-routes';
import type { LayoutServerLoad } from './$types';

// Resolved by Vite at dev/build time from VITE_BACKEND_URL in .env
const BACKEND_URL =
	(import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';

/** Wraps a fetch in a race against a timeout promise */
function fetchWithTimeout(fetchFn: typeof fetch, url: string, opts: RequestInit, ms: number) {
	const timeout = new Promise<never>((_, reject) =>
		setTimeout(() => reject(new Error('TIMEOUT')), ms)
	);
	return Promise.race([fetchFn(url, opts), timeout]);
}

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	try {
		const res = await fetchWithTimeout(
			fetch,
			`${BACKEND_URL}${API_ROUTES.AUTH.ME}`,
			{
				headers: {
					cookie: cookies
						.getAll()
						.map((c) => `${c.name}=${c.value}`)
						.join('; ')
				}
			},
			3000 // 3-second hard timeout
		);

		if (res.ok) {
			const sessionData = await res.json();
			if (sessionData?.user) {
				return { user: sessionData.user, session: sessionData.session };
			}
		}
	} catch (err: any) {
		// Backend is down, unreachable, or timed out — that's fine for the homepage
		console.log('[layout] Session check skipped:', err?.message ?? err);
	}

	return { user: null, session: null };
};

