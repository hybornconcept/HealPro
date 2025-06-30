<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { ChevronRight, Bell, ExternalLink } from '@lucide/svelte';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import type { PageData } from './$types';

	// Lazy load chart components for better performance
	import { onMount } from 'svelte';

	let chartComponentsLoaded = $state(false);
	let scaleUtc = $state<any>(null);
	let Area = $state<any>(null);
	let AreaChart = $state<any>(null);
	let ChartClipPath = $state<any>(null);
	let curveNatural = $state<any>(null);
	let ChartContainer = $state<any>(null);
	let cubicInOut = $state<any>(null);

	onMount(async () => {
		// Lazy load heavy chart dependencies
		const [
			{ scaleUtc: scaleUtcImport },
			{ Area: AreaImport, AreaChart: AreaChartImport, ChartClipPath: ChartClipPathImport },
			{ curveNatural: curveNaturalImport },
			ChartContainerImport,
			{ cubicInOut: cubicInOutImport }
		] = await Promise.all([
			import('d3-scale'),
			import('layerchart'),
			import('d3-shape'),
			import('$lib/components/ui/chart/chart-container.svelte'),
			import('svelte/easing')
		]);

		scaleUtc = scaleUtcImport;
		Area = AreaImport;
		AreaChart = AreaChartImport;
		ChartClipPath = ChartClipPathImport;
		curveNatural = curveNaturalImport;
		ChartContainer = ChartContainerImport.default;
		cubicInOut = cubicInOutImport;
		chartComponentsLoaded = true;
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
					{#if chartComponentsLoaded && ChartContainer}
						<ChartContainer config={chartConfig} class="aspect-auto h-[250px] w-full">
							<AreaChart
								legend
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
										'fill-opacity': 0.4,
										line: { class: 'stroke-1' },
										// Disable animations for better performance
										motion: false
									},
									xAxis: {
										// Limit ticks to improve rendering performance
										ticks: areaTimeRange === '7d' ? 7 : areaTimeRange === '30d' ? 10 : 6,
										format: (v: Date) =>
											v.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
									},
									yAxis: { format: () => '' }
								}}
							>
								{#snippet marks({ series, getAreaProps }: any)}
									<defs>
										<!-- Pre-defined gradients to avoid recalculation -->
										<linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stop-color="var(--color-desktop)" stop-opacity={1.0} />
											<stop offset="95%" stop-color="var(--color-desktop)" stop-opacity={0.1} />
										</linearGradient>
										<linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stop-color="var(--color-mobile)" stop-opacity={0.8} />
											<stop offset="95%" stop-color="var(--color-mobile)" stop-opacity={0.1} />
										</linearGradient>
									</defs>
									<!-- Disable animation for better performance -->
									{#each series as s, i (s.key)}
										<Area
											{...getAreaProps(s, i)}
											fill={s.key === 'desktop' ? 'url(#fillDesktop)' : 'url(#fillMobile)'}
										/>
									{/each}
								{/snippet}
								{#snippet tooltip()}
									<Chart.Tooltip
										labelFormatter={(v: Date) => v.toLocaleDateString('en-US', { month: 'long' })}
										indicator="line"
									/>
								{/snippet}
							</AreaChart>
						</ChartContainer>
					{:else}
						<!-- Loading skeleton for chart -->
						<div
							class="flex aspect-auto h-[250px] w-full animate-pulse items-center justify-center rounded-lg bg-gray-100"
						>
							<div class="text-gray-500">Loading chart...</div>
						</div>
					{/if}
				</Card.Content>
				<Card.Footer>
					<div class="flex w-full items-start gap-2 text-sm">
						<div class="grid gap-2">
							<div class="flex items-center gap-2 leading-none font-medium">
								Trending up by 5.2% this month <TrendingUpIcon class="size-4" />
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
					<button class="flex items-center gap-1 text-xs text-gray-400 hover:underline"
						>See All <ChevronRight class="inline h-4 w-4" /></button
					>
				</div>
				<div class="px-6 pb-6">
					<div class="flex items-center gap-3 rounded-lg bg-[#f4f4f4] p-3">
						<Bell class="h-5 w-5 text-blue-500" />
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
					<button class="flex items-center gap-1 text-xs text-gray-400 hover:underline"
						>See All <ChevronRight class="inline h-4 w-4" /></button
					>
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
					<button class="flex items-center gap-1 text-xs text-gray-400 hover:underline"
						>See All <ChevronRight class="inline h-4 w-4" /></button
					>
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
	@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');
	.report-font {
		font-family: 'Nunito', sans-serif;
	}
</style>
