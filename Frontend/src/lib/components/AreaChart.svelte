<script lang="ts">
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { scaleUtc } from 'd3-scale';
	import { Area, AreaChart, ChartClipPath } from 'layerchart';
	import { curveNatural } from 'd3-shape';
	import ChartContainer from './ui/chart/chart-container.svelte';
	import { cubicInOut } from 'svelte/easing';

	interface ChartDataPoint {
		date: Date;
		claimsProcessed: number;
		claimsDenied: number;
	}

	interface Props {
		data?: ChartDataPoint[];
		title?: string;
		description?: string;
		footerText?: string;
		trendText?: string;
		colors?: { processed: string; denied: string };
		height?: string;
	}

	let {
		data: chartData = [
			{ date: new Date('2024-05-04'), claimsProcessed: 385, claimsDenied: 42 },
			{ date: new Date('2024-05-05'), claimsProcessed: 481, claimsDenied: 39 },
			{ date: new Date('2024-05-06'), claimsProcessed: 498, claimsDenied: 52 },
			{ date: new Date('2024-05-07'), claimsProcessed: 388, claimsDenied: 30 },
			{ date: new Date('2024-05-08'), claimsProcessed: 149, claimsDenied: 21 },
			{ date: new Date('2024-05-09'), claimsProcessed: 227, claimsDenied: 18 },
			{ date: new Date('2024-05-10'), claimsProcessed: 293, claimsDenied: 33 },
			{ date: new Date('2024-05-11'), claimsProcessed: 335, claimsDenied: 27 },
			{ date: new Date('2024-05-12'), claimsProcessed: 197, claimsDenied: 24 },
			{ date: new Date('2024-05-13'), claimsProcessed: 197, claimsDenied: 16 },
			{ date: new Date('2024-05-14'), claimsProcessed: 448, claimsDenied: 49 },
			{ date: new Date('2024-05-15'), claimsProcessed: 473, claimsDenied: 38 },
			{ date: new Date('2024-05-16'), claimsProcessed: 338, claimsDenied: 40 },
			{ date: new Date('2024-05-17'), claimsProcessed: 499, claimsDenied: 42 },
			{ date: new Date('2024-05-18'), claimsProcessed: 315, claimsDenied: 35 },
			{ date: new Date('2024-05-19'), claimsProcessed: 235, claimsDenied: 18 },
			{ date: new Date('2024-05-20'), claimsProcessed: 177, claimsDenied: 23 },
			{ date: new Date('2024-05-21'), claimsProcessed: 82, claimsDenied: 14 },
			{ date: new Date('2024-05-22'), claimsProcessed: 81, claimsDenied: 12 },
			{ date: new Date('2024-05-23'), claimsProcessed: 252, claimsDenied: 29 },
			{ date: new Date('2024-05-24'), claimsProcessed: 294, claimsDenied: 22 },
			{ date: new Date('2024-05-25'), claimsProcessed: 201, claimsDenied: 25 },
			{ date: new Date('2024-05-26'), claimsProcessed: 213, claimsDenied: 17 },
			{ date: new Date('2024-05-27'), claimsProcessed: 420, claimsDenied: 46 },
			{ date: new Date('2024-05-28'), claimsProcessed: 233, claimsDenied: 19 },
			{ date: new Date('2024-05-29'), claimsProcessed: 78, claimsDenied: 13 },
			{ date: new Date('2024-05-30'), claimsProcessed: 340, claimsDenied: 28 },
			{ date: new Date('2024-05-31'), claimsProcessed: 178, claimsDenied: 23 },
			{ date: new Date('2024-06-01'), claimsProcessed: 178, claimsDenied: 20 },
			{ date: new Date('2024-06-02'), claimsProcessed: 470, claimsDenied: 41 },
			{ date: new Date('2024-06-03'), claimsProcessed: 103, claimsDenied: 16 },
			{ date: new Date('2024-06-04'), claimsProcessed: 439, claimsDenied: 38 },
			{ date: new Date('2024-06-05'), claimsProcessed: 88, claimsDenied: 14 },
			{ date: new Date('2024-06-06'), claimsProcessed: 294, claimsDenied: 25 },
			{ date: new Date('2024-06-07'), claimsProcessed: 323, claimsDenied: 37 },
			{ date: new Date('2024-06-08'), claimsProcessed: 385, claimsDenied: 32 },
			{ date: new Date('2024-06-09'), claimsProcessed: 438, claimsDenied: 48 },
			{ date: new Date('2024-06-10'), claimsProcessed: 155, claimsDenied: 20 },
			{ date: new Date('2024-06-11'), claimsProcessed: 92, claimsDenied: 15 },
			{ date: new Date('2024-06-12'), claimsProcessed: 492, claimsDenied: 42 },
			{ date: new Date('2024-06-13'), claimsProcessed: 81, claimsDenied: 13 },
			{ date: new Date('2024-06-14'), claimsProcessed: 426, claimsDenied: 38 },
			{ date: new Date('2024-06-15'), claimsProcessed: 307, claimsDenied: 35 },
			{ date: new Date('2024-06-16'), claimsProcessed: 371, claimsDenied: 31 },
			{ date: new Date('2024-06-17'), claimsProcessed: 475, claimsDenied: 52 },
			{ date: new Date('2024-06-18'), claimsProcessed: 107, claimsDenied: 17 },
			{ date: new Date('2024-06-19'), claimsProcessed: 341, claimsDenied: 29 },
			{ date: new Date('2024-06-20'), claimsProcessed: 408, claimsDenied: 45 },
			{ date: new Date('2024-06-21'), claimsProcessed: 169, claimsDenied: 21 },
			{ date: new Date('2024-06-22'), claimsProcessed: 317, claimsDenied: 27 },
			{ date: new Date('2024-06-23'), claimsProcessed: 480, claimsDenied: 53 },
			{ date: new Date('2024-06-24'), claimsProcessed: 132, claimsDenied: 18 },
			{ date: new Date('2024-06-25'), claimsProcessed: 141, claimsDenied: 19 },
			{ date: new Date('2024-06-26'), claimsProcessed: 434, claimsDenied: 38 },
			{ date: new Date('2024-06-27'), claimsProcessed: 448, claimsDenied: 49 },
			{ date: new Date('2024-06-28'), claimsProcessed: 149, claimsDenied: 20 },
			{ date: new Date('2024-06-29'), claimsProcessed: 103, claimsDenied: 16 },
			{ date: new Date('2024-06-30'), claimsProcessed: 446, claimsDenied: 40 }
		],
		title = 'Claims Processing Performance',
		description = 'Claims processed vs denied over time',
		footerText = 'Denial rate decreased to 3.2% - within target range',
		trendText = 'Claims processing improved by 12.3% this month',
		colors = { processed: 'var(--chart-1)', denied: 'var(--chart-2)' },
		height = 'h-[250px]'
	}: Props = $props();

	let timeRange = $state('90d');

	const selectedLabel = $derived.by(() => {
		switch (timeRange) {
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

	const filteredData = $derived(
		chartData.filter((item) => {
			const referenceDate = new Date('2024-06-30');
			let daysToSubtract = 90;
			if (timeRange === '30d') {
				daysToSubtract = 30;
			} else if (timeRange === '7d') {
				daysToSubtract = 7;
			}

			referenceDate.setDate(referenceDate.getDate() - daysToSubtract);
			return item.date >= referenceDate;
		})
	);

	const chartConfig = $derived({
		claimsProcessed: { label: 'Claims Processed', color: colors.processed },
		claimsDenied: { label: 'Claims Denied', color: colors.denied }
	}) satisfies Chart.ChartConfig;
</script>

<Card.Root>
	<Card.Header class="flex h-10 items-center gap-2 space-y-0 border-b  py-0 sm:flex-row">
		<div class="grid flex-1 gap-1 text-center sm:text-left">
			<Card.Title>{title}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</div>
		<Select.Root type="single" bind:value={timeRange}>
			<Select.Trigger class="w-40 rounded-lg sm:ml-auto" aria-label="Select a value">
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
		<ChartContainer config={chartConfig} class="aspect-auto {height} w-full">
			<AreaChart
				legend
				data={filteredData}
				x="date"
				xScale={scaleUtc()}
				series={[
					{
						key: 'claimsDenied',
						label: 'Claims Denied',
						color: chartConfig.claimsDenied.color
					},
					{
						key: 'claimsProcessed',
						label: 'Claims Processed',
						color: chartConfig.claimsProcessed.color
					}
				]}
				seriesLayout="stack"
				props={{
					area: {
						curve: curveNatural,
						'fill-opacity': 0.4,
						line: { class: 'stroke-1' },
						motion: 'tween'
					},
					xAxis: {
						ticks: timeRange === '7d' ? 7 : undefined,
						format: (v) => {
							return v.toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric'
							});
						}
					},
					yAxis: { format: () => '' }
				}}
			>
				{#snippet marks({ series, getAreaProps })}
					<defs>
						<linearGradient id="fillClaimsProcessed" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-claimsProcessed)" stop-opacity={1.0} />
							<stop offset="95%" stop-color="var(--color-claimsProcessed)" stop-opacity={0.1} />
						</linearGradient>
						<linearGradient id="fillClaimsDenied" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-claimsDenied)" stop-opacity={0.8} />
							<stop offset="95%" stop-color="var(--color-claimsDenied)" stop-opacity={0.1} />
						</linearGradient>
					</defs>
					<ChartClipPath
						initialWidth={0}
						motion={{
							width: { type: 'tween', duration: 1000, easing: cubicInOut }
						}}
					>
						{#each series as s, i (s.key)}
							<Area
								{...getAreaProps(s, i)}
								fill={s.key === 'claimsProcessed'
									? 'url(#fillClaimsProcessed)'
									: 'url(#fillClaimsDenied)'}
							/>
						{/each}
					</ChartClipPath>
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString('en-US', {
								month: 'long'
							});
						}}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</ChartContainer>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-start gap-2 text-sm">
			<div class="grid gap-2">
				<div class="flex items-center gap-2 font-medium leading-none">
					{trendText}
					<TrendingUpIcon class="size-4" />
				</div>
				<div class="text-muted-foreground flex items-center gap-2 leading-none">
					{footerText}
				</div>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
