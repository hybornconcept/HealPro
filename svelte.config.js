import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Optimize preprocess for Svelte 5
	preprocess: vitePreprocess({
		// Add TypeScript optimization
		script: true,
		// Optimize style processing
		style: true,
		// Add postcss optimization
		postcss: true
	}),

	kit: {
		// Enhanced adapter configuration
		adapter: adapter({
			runtime: 'edge',
			regions: 'auto',
			precompress: true
		}),

		// Security and performance
		csrf: {
			checkOrigin: true
		},

		// Optimized asset handling
		inlineStyleThreshold: 4096, // Reduced for better caching

		// Enhanced preloading strategy
		output: {
			preloadStrategy: 'preload-mjs'
		},

		// Service worker for caching
		serviceWorker: {
			register: true,
			files: (filepath) => !/\.DS_Store/.test(filepath)
		},

		// Enhanced alias configuration
		alias: {
			$components: 'src/lib/components',
			$utils: 'src/lib/utils',
			$types: 'src/lib/types'
		}
	},
	// Enable Svelte 5 features with compatibility
	compilerOptions: {
		runes: true,
		compatibility: {
			componentApi: 4
		}
	},

	// Vite-specific optimizations for dependencies
	vite: {
		optimizeDeps: {
			include: ['svelte/internal'],
			// Exclude problematic packages from optimization
			exclude: ['lucide-svelte', '@lucide/svelte']
		}
	}
};

export default config;
