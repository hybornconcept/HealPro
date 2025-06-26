import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit()
	],
	// Enhanced build optimizations
	build: {
		target: 'esnext',
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info'],
				passes: 2
			},
			mangle: {
				safari10: true
			}
		},
		// Optimized chunk splitting
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					// Vendor chunks
					if (id.includes('node_modules')) {
						if (id.includes('lucide')) return 'icons';
						if (id.includes('bits-ui') || id.includes('@melt-ui')) return 'ui-lib';
						if (id.includes('svelte')) return 'svelte-vendor';
						if (id.includes('tailwind') || id.includes('clsx')) return 'styles';
						return 'vendor';
					}
					// App chunks
					if (id.includes('components/ui')) return 'ui-components';
					if (id.includes('routes/admin')) return 'admin';
					if (id.includes('routes/user')) return 'user';
					if (id.includes('lib/components')) return 'shared-components';
				},
				// Optimize chunk names
				chunkFileNames: 'chunks/[name]-[hash].js',
				entryFileNames: 'entries/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]'
			}
		},
		cssMinify: true,
		chunkSizeWarningLimit: 500,
		sourcemap: false,
		// Enable compression
		reportCompressedSize: false
	},
	// Enhanced server config
	server: {
		fs: { strict: true },
		hmr: { overlay: false },
		// Preload optimization
		preTransformRequests: false
	},
	// Optimized dependency handling
	optimizeDeps: {
		include: [
			'@lucide/svelte',
			'@melt-ui/svelte',
			'bits-ui',
			'clsx',
			'tailwind-merge',
			'@internationalized/date'
		],
		exclude: ['@sveltejs/kit'],
		// Force optimization
		force: false
	},
	// CSS optimization
	css: {
		devSourcemap: false
	},
	// Worker optimization
	worker: {
		format: 'es'
	}
});

