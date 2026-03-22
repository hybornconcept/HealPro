<script lang="ts">
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import type { ChartContextValue } from '$lib/components/ui/chart/chart-utils.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { scaleUtc } from 'd3-scale';
	import { BarChart, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';

	interface ChartData {
		date: Date;
		telemedicine: number;
		inPerson: number;
	}

	interface Props {
		data?: ChartData[];
		title?: string;
		description?: string;
		footerText?: string;
		trendText?: string;
	}

	let {
		data = [
			{ date: new Date('2024-06-03'), telemedicine: 45, inPerson: 55 },
			{ date: new Date('2024-06-04'), telemedicine: 52, inPerson: 48 },
			{ date: new Date('2024-06-05'), telemedicine: 38, inPerson: 62 },
			{ date: new Date('2024-06-06'), telemedicine: 47, inPerson: 53 },
			{ date: new Date('2024-06-07'), telemedicine: 43, inPerson: 57 },
			{ date: new Date('2024-06-08'), telemedicine: 55, inPerson: 45 },
			{ date: new Date('2024-06-09'), telemedicine: 48, inPerson: 52 },
			{ date: new Date('2024-06-10'), telemedicine: 41, inPerson: 59 },
			{ date: new Date('2024-06-11'), telemedicine: 39, inPerson: 61 },
			{ date: new Date('2024-06-12'), telemedicine: 54, inPerson: 46 },
			{ date: new Date('2024-06-13'), telemedicine: 37, inPerson: 63 },
			{ date: new Date('2024-06-14'), telemedicine: 53, inPerson: 47 },
			{ date: new Date('2024-06-15'), telemedicine: 46, inPerson: 54 },
			{ date: new Date('2024-06-16'), telemedicine: 44, inPerson: 56 },
			{ date: new Date('2024-06-17'), telemedicine: 58, inPerson: 42 },
			{ date: new Date('2024-06-18'), telemedicine: 40, inPerson: 60 },
			{ date: new Date('2024-06-19'), telemedicine: 49, inPerson: 51 },
			{ date: new Date('2024-06-20'), telemedicine: 51, inPerson: 49 },
			{ date: new Date('2024-06-21'), telemedicine: 42, inPerson: 58 },
			{ date: new Date('2024-06-22'), telemedicine: 45, inPerson: 55 },
			{ date: new Date('2024-06-23'), telemedicine: 56, inPerson: 44 },
			{ date: new Date('2024-06-24'), telemedicine: 43, inPerson: 57 },
			{ date: new Date('2024-06-25'), telemedicine: 41, inPerson: 59 },
			{ date: new Date('2024-06-26'), telemedicine: 52, inPerson: 48 },
			{ date: new Date('2024-06-27'), telemedicine: 57, inPerson: 43 },
			{ date: new Date('2024-06-28'), telemedicine: 44, inPerson: 56 },
			{ date: new Date('2024-06-29'), telemedicine: 46, inPerson: 54 },
			{ date: new Date('2024-06-30'), telemedicine: 59, inPerson: 41 }
		],
		title = 'Healthcare Visit Types',
		description = 'Telemedicine vs In-Person visits over time',
		footerText = 'Showing visit patterns for the last 6 months',
		trendText = 'Telemedicine usage up by 12.3% this month'
	}: Props = $props();

	const chartConfig = {
		visits: { label: 'Visits', color: '' },
		telemedicine: { label: 'Telemedicine', color: 'var(--chart-1)' },
		inPerson: { label: 'In-Person', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
	let context = $state<ChartContextValue>();
	let activeChart = $state<keyof typeof chartConfig>('telemedicine');
	const total = $derived({
		telemedicine: data.reduce((acc, curr) => acc + curr.telemedicine, 0),
		inPerson: data.reduce((acc, curr) => acc + curr.inPerson, 0)
	});
	const activeSeries = $derived([
		{
			key: activeChart,
			label: chartConfig[activeChart].label,
			color: chartConfig[activeChart].color
		}
	]);
</script>

<Card.Root>
	<Card.Header class="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
		<div class="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
			<Card.Title>{title}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</div>
		<div class="flex">
			{#each ['telemedicine', 'inPerson'] as key (key)}
				{@const chart = key as keyof typeof chartConfig}
				<button
					data-active={activeChart === chart}
					class="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
					onclick={() => (activeChart = chart)}
				>
					<span class="text-muted-foreground text-xs">
						{chartConfig[chart].label}
					</span>
					<span class="text-lg leading-none font-bold sm:text-3xl">
						{total[key as keyof typeof total].toLocaleString()}
					</span>
				</button>
			{/each}
		</div>
	</Card.Header>
	<Card.Content class="px-2 sm:p-6">
		<Chart.Container config={chartConfig} class="aspect-auto h-[250px] w-full">
			<BarChart
				bind:context
				{data}
				x="date"
				axis="x"
				series={activeSeries}
				props={{
					bars: {
						stroke: 'none',
						rounded: 'none',
						// use the height of the chart to animate the bars
						initialY: context?.height,
						initialHeight: 0,
						motion: {
							y: { type: 'tween', duration: 500, easing: cubicInOut },
							height: { type: 'tween', duration: 500, easing: cubicInOut }
						}
					},
					highlight: { area: { fill: 'none' } },
					xAxis: {
						format: (d: Date) => {
							return d.toLocaleDateString('en-US', {
								month: 'short',
								day: '2-digit'
							});
						},
						ticks: (scale: any) => scaleUtc(scale.domain(), scale.range()).ticks()
					}
				}}
			>
				{#snippet belowMarks()}
					<Highlight area={{ class: 'fill-muted' }} />
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip
						nameKey="visits"
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							});
						}}
					/>
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-start gap-2 text-sm">
			<div class="grid gap-2">
				<div class="flex items-center gap-2 leading-none font-medium">
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
