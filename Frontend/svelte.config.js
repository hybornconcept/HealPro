import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Use Vercel adapter in development (better Node.js env support)
// Use Cloudflare adapter for production builds
const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: isDev ? adapterVercel() : adapterCloudflare()
	}
};

export default config;
