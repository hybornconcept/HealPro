<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	// Lazy load icons for better performance
	let ChevronRight: any = $state(null);
	let Bell: any = $state(null);
	let TrendingUpIcon: any = $state(null);

	// Progressive chart loading
	let chartComponentsLoaded = $state(false);
	let showChart = $state(false);
	let scaleUtc = $state<any>(null);
	let Area = $state<any>(null);
	let AreaChart = $state<any>(null);
	let ChartContainer = $state<any>(null);
	let curveNatural = $state<any>(null);

	onMount(async () => {
		if (!browser) return;

		// Load icons first (lightweight)
		const loadIcons = async () => {
			try {
				const [chevronModule, bellModule, trendingModule] = await Promise.all([
					import('@lucide/svelte/icons/chevron-right'),
					import('@lucide/svelte/icons/bell'),
					import('@lucide/svelte/icons/trending-up')
				]);

				ChevronRight = chevronModule.default;
				Bell = bellModule.default;
				TrendingUpIcon = trendingModule.default;
			} catch (error) {
				console.error('Failed to load icons:', error);
			}
		};

		// Load chart components after a delay for better perceived performance
		const loadChartComponents = async () => {
			try {
				// Use dynamic imports with smaller chunks
				const [scaleModule, layerModule, shapeModule, containerModule] = await Promise.all([
					import('d3-scale'),
					import('layerchart'),
					import('d3-shape'),
					import('$lib/components/ui/chart/chart-container.svelte')
				]);

				scaleUtc = scaleModule.scaleUtc;
				Area = layerModule.Area;
				AreaChart = layerModule.AreaChart;
				curveNatural = shapeModule.curveNatural;
				ChartContainer = containerModule.default;

				chartComponentsLoaded = true;
				// Show chart after components are loaded
				setTimeout(() => (showChart = true), 100);
			} catch (error) {
				console.error('Failed to load chart components:', error);
			}
		};

		// Load icons immediately, charts after delay
		await loadIcons();
		setTimeout(loadChartComponents, 500); // Delay chart loading for better UX
	});

	let { data }: { data: PageData } = $props();

	// Destructure data from server
	const { stats, barData, activities, products, revenue, chartData: serverChartData } = data;

	let timeRange = $state('Week');

	// Memoized chart data conversion for better performance
	const chartData = $derived.by(() => {
		return serverChartData.map((item) => ({
			...item,
			date: new Date(item.date)
		}));
	});

	let areaTimeRange = $state('90d');

	const selectedLabel = $derived.by(() => {
		switch (areaTimeRange) {
			case '90d':
				return 'Last 3 months';
			case '30d':
				return 'Last 30 days';
			case '7d':
				return 'Last 7 days';
			default:
				return 'Last 3 months';
		}
	});

	// Optimized filtering with memoization
	const filteredData = $derived.by(() => {
		if (!chartData) return [];

		const referenceDate = new Date('2024-06-30');
		let daysToSubtract = 90;
		if (areaTimeRange === '30d') {
			daysToSubtract = 30;
		} else if (areaTimeRange === '7d') {
			daysToSubtract = 7;
		}

		const cutoffDate = new Date(referenceDate);
		cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);

		return chartData.filter((item) => item.date >= cutoffDate);
	});

	const chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<div class="report-font min-h-screen w-full bg-[#fafbfb]">
	<div class="mx-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Left: Performance and Revenue -->
		<div class="flex flex-col gap-6 lg:col-span-2">
			<!-- Overview performance -->
			<Card.Root class="rounded-xl border bg-white p-0 shadow">
				<div class="flex flex-col gap-0">
					<div class="flex items-center justify-between px-6 pt-6 pb-2">
						<h2 class="text-lg font-semibold">Overview performance</h2>
						<div class="flex gap-2 rounded-lg bg-[#f4f4f4] p-1">
							{#each ['Day', 'Week', 'Month', 'Year'] as range}
								<button
									class={`rounded px-4 py-1 text-sm font-medium ${timeRange === range ? 'border border-[#e5e7eb] bg-white shadow' : 'bg-[#f4f4f4] text-black'}`}
									onclick={() => (timeRange = range)}
								>
									{range}
								</button>
							{/each}
						</div>
					</div>
					<div class="grid grid-cols-2 gap-0 px-6 pb-6">
						{#each stats as stat}
							<div
								class="flex flex-col gap-1 border border-[#f4f4f4] bg-white p-6 first:rounded-tl-xl last:rounded-tr-xl"
								style="min-height:110px;"
							>
								<div class="flex items-center justify-between">
									<span class="text-sm text-gray-500">{stat.label}</span>
									<span
										class="flex items-center gap-1 text-xs {stat.changePositive
											? 'bg-green-50 text-green-600'
											: 'bg-red-50 text-red-500'} rounded px-2 py-0.5 font-medium"
									>
										{#if stat.changePositive}
											<svg
												width="16"
												height="16"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg
											>
										{:else}
											<svg
												width="16"
												height="16"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												viewBox="0 0 24 24"><path d="M18 9l-6 6-6-6" /></svg
											>
										{/if}
										{stat.change}
									</span>
								</div>
								<div class="text-2xl font-bold">{stat.value}</div>
								<div class="text-xs text-gray-400">{stat.sub}</div>
							</div>
						{/each}
					</div>
				</div>
			</Card.Root>

			<!-- Revenue (Area Chart) -->
			<Card.Root>
				<Card.Header class="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
					<div class="grid flex-1 gap-1 text-center sm:text-left">
						<Card.Title>Area Chart - Interactive</Card.Title>
						<Card.Description>Showing total visitors for the last 3 months</Card.Description>
					</div>
					<Select.Root type="single" bind:value={areaTimeRange}>
						<Select.Trigger class="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
							{selectedLabel}
						</Select.Trigger>
						<Select.Content class="rounded-xl">
							<Select.Item value="90d" class="rounded-lg">Last 3 months</Select.Item>
							<Select.Item value="30d" class="rounded-lg">Last 30 days</Select.Item>
							<Select.Item value="7d" class="rounded-lg">Last 7 days</Select.Item>
						</Select.Content>
					</Select.Root>
				</Card.Header>
				<Card.Content>
					{#if showChart && chartComponentsLoaded && ChartContainer}
						<ChartContainer config={chartConfig} class="aspect-auto h-[250px] w-full">
							<AreaChart
								data={filteredData}
								x="date"
								xScale={scaleUtc()}
								series={[
									{
										key: 'mobile',
										label: 'Mobile',
										color: chartConfig.mobile.color
									},
									{
										key: 'desktop',
										label: 'Desktop',
										color: chartConfig.desktop.color
									}
								]}
								seriesLayout="stack"
								props={{
									area: {
										curve: curveNatural,
										'fill-opacity': 0.6,
										// Disable all animations for maximum performance
										motion: false,
										transition: false
									},
									xAxis: {
										// Minimal ticks for faster rendering
										ticks: 4,
										format: (v: Date) => v.toLocaleDateString('en-US', { month: 'short' })
									},
									yAxis: {
										format: () => '',
										ticks: 3
									}
								}}
							>
								{#snippet marks({ series, getAreaProps }: any)}
									<!-- Simplified rendering without gradients for speed -->
									{#each series as s, i (s.key)}
										<Area {...getAreaProps(s, i)} fill={s.color} opacity={0.6} />
									{/each}
								{/snippet}
							</AreaChart>
						</ChartContainer>
					{:else}
						<!-- Enhanced loading skeleton -->
						<div class="aspect-auto h-[250px] w-full rounded-lg bg-gray-50 p-4">
							<div class="flex h-full flex-col justify-between">
								<!-- Skeleton chart bars -->
								<div class="flex h-32 items-end justify-between gap-2">
									{#each Array(8) as _, i}
										<div
											class="animate-pulse rounded-t bg-gray-200"
											style="height: {Math.random() * 80 + 20}%; width: 12%;"
										></div>
									{/each}
								</div>
								<!-- Skeleton labels -->
								<div class="mt-4 flex justify-between">
									{#each Array(4) as _}
										<div class="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
									{/each}
								</div>
							</div>
							<div class="mt-4 text-center text-sm text-gray-500">
								{chartComponentsLoaded ? 'Rendering chart...' : 'Loading chart components...'}
							</div>
						</div>
					{/if}
				</Card.Content>
				<Card.Footer>
					<div class="flex w-full items-start gap-2 text-sm">
						<div class="grid gap-2">
							<div class="flex items-center gap-2 leading-none font-medium">
								Trending up by 5.2% this month
								{#if TrendingUpIcon}
									<TrendingUpIcon class="size-4" />
								{:else}
									<div class="size-4 animate-pulse rounded bg-green-300"></div>
								{/if}
							</div>
							<div class="text-muted-foreground flex items-center gap-2 leading-none">
								January - June 2024
							</div>
						</div>
					</div>
				</Card.Footer>
			</Card.Root>
		</div>

		<!-- Right: Shop Advisor, Products, Activities -->
		<div class="flex flex-col gap-6">
			<!-- Shop Advisor -->
			<Card.Root class="rounded-xl border bg-white p-0 shadow">
				<div class="flex items-center justify-between px-6 pt-6 pb-2">
					<h2 class="text-base font-semibold">Shop Advisor</h2>
					<button class="flex items-center gap-1 text-xs text-gray-400 hover:underline">
						See All
						{#if ChevronRight}
							<ChevronRight class="inline h-4 w-4" />
						{:else}
							<div class="inline h-4 w-4 animate-pulse rounded bg-gray-300"></div>
						{/if}
					</button>
				</div>
				<div class="px-6 pb-6">
					<div class="flex items-center gap-3 rounded-lg bg-[#f4f4f4] p-3">
						{#if Bell}
							<Bell class="h-5 w-5 text-blue-500" />
						{:else}
							<div class="h-5 w-5 animate-pulse rounded bg-blue-300"></div>
						{/if}
						<div>
							<div class="text-sm font-medium">The Black Friday Starts Tomorrow</div>
							<div class="text-xs text-gray-500">
								Find out how to take the advantage of the upcoming sales event
							</div>
						</div>
						<Button
							class="ml-auto rounded-lg bg-blue-500 px-4 py-1 text-xs font-medium text-white hover:bg-blue-600"
							>Learn More</Button
						>
					</div>
				</div>
			</Card.Root>

			<!-- Products -->
			<Card.Root class="rounded-xl border bg-white p-0 shadow">
				<div class="flex items-center justify-between px-6 pt-6 pb-2">
					<h2 class="text-base font-semibold">Products</h2>
					<button class="flex items-center gap-1 text-xs text-gray-400 hover:underline">
						See All
						{#if ChevronRight}
							<ChevronRight class="inline h-4 w-4" />
						{:else}
							<div class="inline h-4 w-4 animate-pulse rounded bg-gray-300"></div>
						{/if}
					</button>
				</div>
				<div class="px-6 pb-6">
					<div class="flex flex-col gap-2">
						{#each products as item}
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-500">{item.label}</span>
								<span class="text-lg font-bold">{item.value}</span>
							</div>
						{/each}
					</div>
				</div>
			</Card.Root>

			<!-- Recent Activities -->
			<Card.Root class="rounded-xl border bg-white p-0 shadow">
				<div class="flex items-center justify-between px-6 pt-6 pb-2">
					<h2 class="text-base font-semibold">Recent Activities</h2>
					<button class="flex items-center gap-1 text-xs text-gray-400 hover:underline">
						See All
						{#if ChevronRight}
							<ChevronRight class="inline h-4 w-4" />
						{:else}
							<div class="inline h-4 w-4 animate-pulse rounded bg-gray-300"></div>
						{/if}
					</button>
				</div>
				<div class="px-6 pb-6">
					<div class="flex flex-col gap-4">
						{#each activities as activity}
							<div class="flex items-center gap-3">
								<img
									src={activity.avatar}
									alt={activity.name}
									class="h-9 w-9 rounded-full object-cover"
								/>
								<div>
									<div class="text-sm font-medium">
										{activity.name} <span class="font-normal text-gray-500">{activity.action}</span>
									</div>
									<div class="text-xs text-gray-400">{activity.time}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</Card.Root>
		</div>
	</div>
</div>

<style>
	.report-font {
		font-family:
			'Nunito',
			system-ui,
			-apple-system,
			sans-serif;
	}
</style>
