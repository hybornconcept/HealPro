import { json } from '@sveltejs/kit';

export async function GET() {
	// Return an empty response for Chrome DevTools
	// This prevents the 404 error in the console
	return json({});
}
