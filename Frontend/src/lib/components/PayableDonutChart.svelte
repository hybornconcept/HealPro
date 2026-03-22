<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { PieChart } from 'layerchart';

	interface ChartData {
		vendor: string;
		amount: number;
		color: string;
	}

	interface Props {
		data?: ChartData[];
		title?: string;
		subtitle?: string;
		centerValue?: string;
		centerLabel?: string;
		centerSubtext?: string;
	}

	let {
		data = [
			{ vendor: 'in-network', amount: 87.5, color: 'hsl(142, 76%, 36%)' },
			{ vendor: 'out-network', amount: 12.5, color: 'hsl(48, 96%, 53%)' }
		],
		title = 'Provider Network Usage',
		subtitle = 'In-Network vs Out-of-Network',
		centerValue = '87.5%',
		centerLabel = 'In-Network',
		centerSubtext = '+1.2% vs last month'
	}: Props = $props();

	const chartConfig = {
		amount: { label: 'Percentage' },
		'in-network': { label: 'In-Network Providers', color: 'hsl(142, 76%, 36%)' },
		'out-network': { label: 'Out-of-Network Providers', color: 'hsl(48, 96%, 53%)' },
		preventive: { label: 'Preventive Care', color: 'hsl(221, 83%, 53%)' },
		specialist: { label: 'Specialist Care', color: 'hsl(262, 83%, 58%)' },
		emergency: { label: 'Emergency Services', color: 'hsl(0, 84%, 60%)' }
	} satisfies Chart.ChartConfig;
</script>

<div class="relative mx-auto mb-4 h-64 w-64">
	<Chart.Container config={chartConfig} class="mx-auto aspect-square h-64 w-64">
		<PieChart
			{data}
			key="vendor"
			value="amount"
			c="color"
			innerRadius={100}
			padding={0}
			props={{ pie: { motion: 'tween' } }}
		>
			{#snippet tooltip()}
				<Chart.Tooltip hideLabel />
			{/snippet}
		</PieChart>
	</Chart.Container>
	<div class="absolute inset-0 flex flex-col items-center justify-center">
		<div class="text-3xl font-bold text-green-600">{centerValue}</div>
		<div class="text-sm text-gray-600">{centerLabel}</div>
		<div class="text-sm text-gray-600">{centerSubtext}</div>
	</div>
</div>
