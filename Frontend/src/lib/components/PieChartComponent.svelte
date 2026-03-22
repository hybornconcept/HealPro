<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';
	import { PieChart, Text } from 'layerchart';

	interface PieData {
		label: string;
		value: number;
		color: string;
	}
	interface Props {
		chartData: PieData[];
		centerText?: string;
		centerSubtext?: string;
		showLegend?: boolean;
		innerRadius?: number;
	}
	let {
		chartData = [],
		centerText,
		centerSubtext = 'Total Users',
		showLegend = true,
		innerRadius = 60
	}: Props = $props();

	// Calculate total if centerText is not provided
	const totalVisitors = $derived(chartData.reduce((acc, curr) => acc + curr.value, 0));
	const displayCenterText = $derived(centerText ?? totalVisitors.toLocaleString());

	// Generate chartConfig from data - keys must match item.label
	const chartConfig = $derived(
		Object.fromEntries(
			(chartData || []).map((item) => [item.label, { label: item.label, color: item.color }])
		)
	);
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
		<PieChart
			data={chartData}
			key="label"
			value="value"
			c="color"
			{innerRadius}
			padding={28}
			props={{ pie: { motion: 'tween' } }}
		>
			{#snippet aboveMarks()}
				<Text
					value={String(displayCenterText)}
					textAnchor="middle"
					verticalAnchor="middle"
					class="fill-foreground text-3xl! font-bold"
					dy={3}
				/>
				<Text
					value={centerSubtext}
					textAnchor="middle"
					verticalAnchor="middle"
					class="fill-muted-foreground! text-muted-foreground"
					dy={22}
				/>
			{/snippet}
			{#snippet tooltip()}
				<Chart.Tooltip hideLabel />
			{/snippet}
		</PieChart>
	</Chart.Container>
	{#if showLegend}
		<div class="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
			{#each chartData as item}
				<div class="flex items-center gap-1.5">
					<div class="h-2 w-2 rounded-full" style="background-color: {item.color}"></div>
					<span class="text-xs font-medium text-black">{item.label}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
