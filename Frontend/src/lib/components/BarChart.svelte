<script lang="ts">
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { BarChart } from 'layerchart';
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';

	interface ChartDataPoint {
		month: string;
		desktop: number;
		mobile: number;
	}

	interface Props {
		data?: ChartDataPoint[];
		title?: string;
		description?: string;
		footerText?: string;
		trendText?: string;
	}

	let {
		data = [
			{ month: 'January', desktop: 186, mobile: 80 },
			{ month: 'February', desktop: 305, mobile: 200 },
			{ month: 'March', desktop: 237, mobile: 120 },
			{ month: 'April', desktop: 73, mobile: 190 },
			{ month: 'May', desktop: 209, mobile: 130 },
			{ month: 'June', desktop: 214, mobile: 140 }
		],
		title = 'Bar Chart - Custom Label',
		description = 'January - June 2024',
		footerText = 'Showing total visitors for the last 6 months',
		trendText = 'Trending up by 5.2% this month'
	}: Props = $props();

	const chartConfig = {
		desktop: { label: 'Desktop', color: 'hsl(221, 83%, 53%)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
		label: { color: 'var(--background)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig}>
			<BarChart
				labels={{ offset: 12 }}
				{data}
				orientation="horizontal"
				yScale={scaleBand().padding(0.25)}
				y="month"
				axis="y"
				rule={false}
				series={[{ key: 'desktop', label: 'Desktop', color: chartConfig.desktop.color }]}
				padding={{ right: 16 }}
				props={{
					bars: {
						stroke: 'none',
						radius: 5,
						rounded: 'all',
						initialWidth: 0,
						initialX: 0,
						motion: {
							x: { type: 'tween', duration: 500, easing: cubicInOut },
							width: { type: 'tween', duration: 500, easing: cubicInOut }
						}
					},
					highlight: { area: { fill: 'none' } },
					yAxis: {
						tickLabelProps: {
							textAnchor: 'start',
							dx: 6,
							fill: 'white'
						},
						tickLength: 0
					},
					labels: {
						textProps: {
							textAnchor: 'middle',
							dy: 4,
							fill: 'white'
						}
					}
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
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
