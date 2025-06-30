<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { performanceMonitor } from '$lib/utils/performance';
	import { preloadCommonIcons } from '$lib/utils/icons';
	import PerformanceMonitor from '$lib/components/PerformanceMonitor.svelte';

	let { children } = $props();

	// Lazy load NProgress to reduce initial bundle
	let NProgress = $state<any>();
	let isNavigating = $state(false);

	onMount(async () => {
		// Load NProgress only when needed
		const [nprogress] = await Promise.all([import('nprogress'), import('nprogress/nprogress.css')]);

		NProgress = nprogress.default;
		NProgress.configure({
			showSpinner: false,
			minimum: 0.1,
			speed: 200,
			trickleSpeed: 50
		});

		// Preload critical resources
		if (browser) {
			// Preload common icons
			preloadCommonIcons();

			// Add resource hints for critical assets
			const link = document.createElement('link');
			link.rel = 'preload';
			link.href = '/heroimage.png';
			link.as = 'image';
			document.head.appendChild(link);
		}
	});

	beforeNavigate(() => {
		isNavigating = true;
		if (NProgress) {
			NProgress.start();
		}
	});

	afterNavigate(() => {
		isNavigating = false;
		if (NProgress) {
			NProgress.done();
		}

		// Report performance metrics after navigation
		if (performanceMonitor) {
			setTimeout(() => performanceMonitor.reportMetrics(), 1000);
		}
	});
</script>

<!-- Loading indicator for when NProgress isn't loaded yet -->
{#if isNavigating && !NProgress}
	<div class="fixed top-0 right-0 left-0 z-50 h-1 animate-pulse bg-blue-500"></div>
{/if}

{@render children()}

<!-- Performance Monitor (only in development) -->
<PerformanceMonitor />
