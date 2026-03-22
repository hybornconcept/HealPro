<script lang="ts">
	import { Axis, LineChart, Text } from 'layerchart';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import { curveLinearClosed } from 'd3-shape';
	import { scaleBand } from 'd3-scale';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	interface ChartDataPoint {
		category: string;
		current: number;
		target: number;
	}

	interface Props {
		data?: ChartDataPoint[];
		title?: string;
		description?: string;
		footerText?: string;
		trendText?: string;
	}

	let {
		data = [],
		title = 'Health Metrics Overview',
		description = 'Current performance vs targets across key health areas',
		footerText = 'Based on last 6 months of data',
		trendText = 'Overall health score improving by 8.3% this quarter'
	}: Props = $props();

	const chartConfig = {
		current: { label: 'Current', color: 'var(--chart-1)' },
		target: { label: 'Target', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root>
	<Card.Header class="items-center">
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1 px-4">
		<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-[250px] ">
			<LineChart
				{data}
				series={[
					{
						key: 'current',
						label: 'Current',
						color: chartConfig.current.color,
						props: {
							fill: chartConfig.current.color,
							fillOpacity: 0.6
						}
					},
					{
						key: 'target',
						label: 'Target',
						color: chartConfig.target.color,
						props: {
							fill: chartConfig.target.color,
							fillOpacity: 0.2
						}
					}
				]}
				radial
				x="category"
				xScale={scaleBand()}
				padding={12}
				props={{
					spline: {
						curve: curveLinearClosed,
						stroke: '0',
						motion: 'tween'
					},
					xAxis: {
						tickLength: 0
					},
					yAxis: {
						format: () => ''
					},
					grid: {
						radialY: 'linear'
					},
					tooltip: {
						context: {
							mode: 'voronoi'
						}
					},
					highlight: {
						lines: false,
						points: { r: 4 }
					}
				}}
			>
				{#snippet axis({ getAxisProps })}
					<Axis {...getAxisProps('x')}>
						{#snippet tickLabel({ props, index })}
							{@const y = props.y
								? typeof props.y === 'number'
									? props.y
									: Number.parseInt(props.y)
								: 0}
							{@const dataPoint = data[index]}
							<Text
								{...props}
								{y}
								value="{dataPoint.current}% / {dataPoint.target}%"
								class="fill-foreground"
							/>
							<Text {...props} y={y + 14} />
						{/snippet}
					</Axis>
					<Axis {...getAxisProps('y')} />
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip />
				{/snippet}
			</LineChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer class="flex-col gap-2 text-sm">
		<div class="flex items-center gap-2 leading-none font-medium">
			{trendText}
			<TrendingUpIcon class="size-4" />
		</div>
		<div class="text-muted-foreground flex items-center gap-2 leading-none">
			{footerText}
		</div>
	</Card.Footer>
</Card.Root>
