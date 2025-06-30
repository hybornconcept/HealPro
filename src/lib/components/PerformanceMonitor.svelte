<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { dev } from '$app/environment';

	// Performance metrics
	let metrics = $state({
		fcp: 0,
		lcp: 0,
		fid: 0,
		cls: 0,
		ttfb: 0,
		loadTime: 0
	});

	let showMetrics = $state(false);

	onMount(() => {
		if (!browser || !dev) return;

		// Measure page load time
		const startTime = performance.now();
		
		// First Contentful Paint
		const fcpObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
			if (fcpEntry) {
				metrics.fcp = Math.round(fcpEntry.startTime);
			}
		});
		fcpObserver.observe({ entryTypes: ['paint'] });

		// Largest Contentful Paint
		const lcpObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			const lastEntry = entries[entries.length - 1];
			metrics.lcp = Math.round(lastEntry.startTime);
		});
		lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

		// First Input Delay
		const fidObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			entries.forEach((entry) => {
				metrics.fid = Math.round(entry.processingStart - entry.startTime);
			});
		});
		fidObserver.observe({ entryTypes: ['first-input'] });

		// Cumulative Layout Shift
		const clsObserver = new PerformanceObserver((list) => {
			let clsValue = 0;
			const entries = list.getEntries();
			entries.forEach((entry) => {
				if (!entry.hadRecentInput) {
					clsValue += entry.value;
				}
			});
			metrics.cls = Math.round(clsValue * 1000) / 1000;
		});
		clsObserver.observe({ entryTypes: ['layout-shift'] });

		// Time to First Byte
		const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
		if (navigationEntries.length > 0) {
			const entry = navigationEntries[0];
			metrics.ttfb = Math.round(entry.responseStart - entry.requestStart);
		}

		// Total load time
		window.addEventListener('load', () => {
			metrics.loadTime = Math.round(performance.now() - startTime);
		});

		// Cleanup observers
		return () => {
			fcpObserver.disconnect();
			lcpObserver.disconnect();
			fidObserver.disconnect();
			clsObserver.disconnect();
		};
	});

	function toggleMetrics() {
		showMetrics = !showMetrics;
	}

	// Color coding for metrics
	function getMetricColor(metric: string, value: number): string {
		const thresholds = {
			fcp: { good: 1800, poor: 3000 },
			lcp: { good: 2500, poor: 4000 },
			fid: { good: 100, poor: 300 },
			cls: { good: 0.1, poor: 0.25 },
			ttfb: { good: 800, poor: 1800 },
			loadTime: { good: 2000, poor: 4000 }
		};

		const threshold = thresholds[metric as keyof typeof thresholds];
		if (!threshold) return 'text-gray-600';

		if (value <= threshold.good) return 'text-green-600';
		if (value <= threshold.poor) return 'text-yellow-600';
		return 'text-red-600';
	}
</script>

{#if browser && dev}
	<!-- Performance Monitor Toggle -->
	<button
		onclick={toggleMetrics}
		class="fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700 transition-colors"
		title="Toggle Performance Metrics"
	>
		<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
		</svg>
	</button>

	<!-- Performance Metrics Panel -->
	{#if showMetrics}
		<div class="fixed bottom-20 right-4 z-50 w-80 rounded-lg bg-white p-4 shadow-xl border">
			<h3 class="text-lg font-semibold mb-3 text-gray-800">Performance Metrics</h3>
			
			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span>First Contentful Paint:</span>
					<span class={getMetricColor('fcp', metrics.fcp)}>{metrics.fcp}ms</span>
				</div>
				
				<div class="flex justify-between">
					<span>Largest Contentful Paint:</span>
					<span class={getMetricColor('lcp', metrics.lcp)}>{metrics.lcp}ms</span>
				</div>
				
				<div class="flex justify-between">
					<span>First Input Delay:</span>
					<span class={getMetricColor('fid', metrics.fid)}>{metrics.fid}ms</span>
				</div>
				
				<div class="flex justify-between">
					<span>Cumulative Layout Shift:</span>
					<span class={getMetricColor('cls', metrics.cls)}>{metrics.cls}</span>
				</div>
				
				<div class="flex justify-between">
					<span>Time to First Byte:</span>
					<span class={getMetricColor('ttfb', metrics.ttfb)}>{metrics.ttfb}ms</span>
				</div>
				
				<div class="flex justify-between">
					<span>Total Load Time:</span>
					<span class={getMetricColor('loadTime', metrics.loadTime)}>{metrics.loadTime}ms</span>
				</div>
			</div>

			<div class="mt-3 pt-3 border-t text-xs text-gray-500">
				<div class="flex gap-4">
					<span><span class="inline-block w-2 h-2 bg-green-600 rounded-full mr-1"></span>Good</span>
					<span><span class="inline-block w-2 h-2 bg-yellow-600 rounded-full mr-1"></span>Needs Improvement</span>
					<span><span class="inline-block w-2 h-2 bg-red-600 rounded-full mr-1"></span>Poor</span>
				</div>
			</div>
		</div>
	{/if}
{/if}
