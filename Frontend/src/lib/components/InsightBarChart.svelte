<script lang="ts">
	import { BarChart } from 'layerchart';
	import * as Chart from '$lib/components/ui/chart';
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';

	interface BarData {
		disease: string;
		percentage: number;
		color: string;
		[key: string]: any;
	}

	interface Props {
		data: BarData[];
		chartConfig: any;
		orientation?: 'horizontal' | 'vertical';
		height?: string;
	}

	let { data, chartConfig, orientation = 'horizontal', height = 'h-50' }: Props = $props();

	// Wrap text for vertical orientation
	function wrapLabel(text: string, maxLength = 8) {
		if (text.length <= maxLength) return text;
		const mid = Math.ceil(text.length / 2);
		return text.slice(0, mid) + '\n' + text.slice(mid);
	}

	const wrappedData = $derived(
		orientation === 'vertical'
			? data.map((item) => ({
					...item,
					displayDisease: wrapLabel(item.disease)
				}))
			: data
	);

	const isVertical = $derived(orientation === 'vertical');
</script>

{#if isVertical}
	<Chart.Container {chartConfig} class="{height} my-0 w-full py-0 [&_.lc-grid-line]:hidden">
		<BarChart
			labels={{ offset: 12 }}
			data={wrappedData}
			orientation="vertical"
			xScale={scaleBand().padding(0.15)}
			grid={false}
			x="displayDisease"
			axis="x"
			rule={false}
			cRange={wrappedData.map((d) => d.color)}
			c="color"
			series={[{ key: 'percentage', label: 'Prevalence' }]}
			padding={{ top: 16, bottom: 35 }}
			props={{
				bars: {
					stroke: 'none',
					radius: 4,
					rounded: 'all',
					initialHeight: 3,
					initialY: 0,
					motion: {
						y: { type: 'tween', duration: 500, easing: cubicInOut },
						height: { type: 'tween', duration: 500, easing: cubicInOut }
					}
				},
				xAxis: {
					tickLabelProps: {
						textAnchor: 'middle',
						dy: 10,
						class: 'text-[8px] font-bold text-gray-700',
						fill: '#374151',
						style: 'fill: #374151 !important; white-space: pre;'
					},
					tickLength: 0
				},
				yAxis: {
					rule: false,
					grid: false
				}
			}}
		>
			{#snippet tooltip()}
				<Chart.Tooltip class="rounded-md border bg-white px-2 py-1 shadow-md" />
			{/snippet}
		</BarChart>
	</Chart.Container>
{:else}
	<Chart.Container {chartConfig} class="{height} my-0 w-full py-0 [&_.lc-grid-line]:hidden">
		<BarChart
			labels={{ offset: 12 }}
			data={wrappedData}
			orientation="horizontal"
			yScale={scaleBand().padding(0.1)}
			grid={false}
			y="disease"
			axis="y"
			rule={false}
			cRange={wrappedData.map((d) => d.color)}
			c="color"
			series={[{ key: 'percentage', label: 'Prevalence' }]}
			padding={{ right: 16 }}
			props={{
				bars: {
					stroke: 'none',
					radius: 4,
					rounded: 'all',
					initialWidth: 3,
					initialX: 0,
					motion: {
						x: { type: 'tween', duration: 500, easing: cubicInOut },
						width: { type: 'tween', duration: 500, easing: cubicInOut }
					}
				},
				yAxis: {
					tickLabelProps: {
						textAnchor: 'start',
						dx: 6,
						class: 'text-[9px] font-bold',
						fill: '#ffffff',
						style: 'fill: #ffffff !important;'
					},
					tickLength: 0
				},
				xAxis: {
					rule: false,
					grid: false
				}
			}}
		>
			{#snippet tooltip()}
				<Chart.Tooltip class="rounded-md border bg-white px-2 py-1 shadow-md" />
			{/snippet}
		</BarChart>
	</Chart.Container>
{/if}
