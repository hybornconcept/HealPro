import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), imagetools()],
	server: {
		port: 5173,
		strictPort: true,
		fs: { strict: false },
		watch: {
			ignored: ['**/.svelte-kit/**'],
			usePolling: true
		}
	},
	optimizeDeps: {
		include: ['lucide-svelte']
	},
	ssr: {
		noExternal: ['lucide-svelte']
	},

	clearScreen: false
});