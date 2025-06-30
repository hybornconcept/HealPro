import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Edge runtime for better performance
			runtime: 'edge',
			// Split the build into smaller chunks
			split: true
		})
	}
};

export default config;
