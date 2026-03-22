<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Search, Download, Bell, ChevronDown, Info } from '@lucide/svelte';

	import BarChart from '$lib/components/BarChart.svelte';
	import AreaChart from '$lib/components/AreaChart.svelte';

	let { data }: { data: PageData } = $props();

	const { months, platforms, dateRanges, sortOptions, transactions, barChartData, areaChartData } =
		data;

	let monthValue = $state('feb2024');
	let platformValue = $state('all');
	let dateRangeValue = $state('feb');
	let sortValue = $state('date');

	const monthTriggerContent = $derived(
		months.find((m) => m.value === monthValue)?.label ?? 'Select month'
	);

	const platformTriggerContent = $derived(
		platforms.find((p) => p.value === platformValue)?.label ?? 'Select platform'
	);

	const dateRangeTriggerContent = $derived(
		dateRanges.find((d) => d.value === dateRangeValue)?.label ?? 'Select date range'
	);

	const sortTriggerContent = $derived(
		sortOptions.find((s) => s.value === sortValue)?.label ?? 'Sort by'
	);
</script>

<div class="min-h-screen w-full p-6">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
			</div>
			<div class="flex items-center gap-3">
				<div class="relative">
					<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input placeholder="Search" class="w-64 pl-10" />
					<span class="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">⌘F</span>
				</div>
				<Select.Root type="single" bind:value={monthValue}>
					<Select.Trigger class="w-40">
						{monthTriggerContent}
					</Select.Trigger>
					<Select.Content>
						{#each months as month (month.value)}
							<Select.Item value={month.value} label={month.label}>
								{month.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Select.Root type="single" bind:value={platformValue}>
					<Select.Trigger class="w-32">
						{platformTriggerContent}
					</Select.Trigger>
					<Select.Content>
						{#each platforms as platform (platform.value)}
							<Select.Item value={platform.value} label={platform.label}>
								{platform.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Button variant="ghost" size="icon">
					<Bell class="h-4 w-4" />
				</Button>
				<Button class="bg-blue-500 hover:bg-blue-600">
					<Download class="mr-2 h-4 w-4" />
					Export
				</Button>
			</div>
		</div>

		<!-- Campaign Performance SLA Report -->
		<Card.Root class="mb-6">
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Campaign Performance SLA Report</Card.Title>
					<Card.Description class="max-w-sm">
						Monitor how effectively campaigns are meeting deadlines and Service Level Agreements
						(SLA).
					</Card.Description>
				</div>
				<Button variant="ghost" class="text-gray-500">See Details</Button>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-3 gap-8">
					<!-- Completed on Time -->
					<div>
						<div class="mb-2 text-sm font-medium text-gray-600">COMPLETED ON TIME</div>
						<div class="mb-1 text-3xl font-bold">93%</div>
						<div class="mb-2 text-sm text-gray-500">493 OF 521</div>
						<Progress value={93} max={100} class="w-full" />
						<div class="mt-2 flex items-center gap-2 text-sm">
							<span class="text-green-600">+24%</span>
							<span class="text-gray-500">Compared to the previous 30 day period</span>
							<Info class="h-4 w-4 text-gray-400" />
						</div>
					</div>

					<!-- Completed Late -->
					<div>
						<div class="mb-2 text-sm font-medium text-gray-600">COMPLETED LATE</div>
						<div class="mb-1 text-3xl font-bold">7%</div>
						<div class="mb-2 text-sm text-gray-500">36 OF 521</div>
						<Progress value={7} max={100} class="w-full" />
						<div class="mt-2 flex items-center gap-2 text-sm">
							<span class="text-red-600">-18%</span>
							<span class="text-gray-500">Compared to the previous 30 day period</span>
							<Info class="h-4 w-4 text-gray-400" />
						</div>
					</div>

					<!-- Undefined Deadlines -->
					<div>
						<div class="mb-2 text-sm font-medium text-gray-600">UNDEFINED DEADLINES</div>
						<div class="mb-1 text-3xl font-bold">0%</div>
						<div class="mb-2 text-sm text-gray-500">2 OF 521</div>
						<Progress value={0} max={100} class="w-full" />
						<div class="mt-2 flex items-center gap-2 text-sm">
							<span class="text-green-600">-9%</span>
							<span class="text-gray-500">Compared to the previous 30 day period</span>
							<Info class="h-4 w-4 text-gray-400" />
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Charts Row -->
		<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Bar Chart -->
			<BarChart
				data={barChartData}
				title="Monthly Analytics"
				description="Desktop vs Mobile usage"
				footerText="Showing analytics for the last 6 months"
				trendText="Desktop usage up by 8.2% this month"
			/>

			<!-- Area Chart -->
			<div class="lg:col-span-2">
				<AreaChart
					data={areaChartData}
					title="Claims Processing Performance"
					description="Claims processed vs denied over time"
					footerText="Denial rate decreased to 3.2% - within target range"
					trendText="Claims processing improved by 12.3% this month"
				/>
			</div>
		</div>

		<!-- Recent Transactions -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<Card.Title>Recent Transaction</Card.Title>
				<div class="flex items-center gap-3">
					<Select.Root type="single" bind:value={dateRangeValue}>
						<Select.Trigger class="w-48">
							{dateRangeTriggerContent}
						</Select.Trigger>
						<Select.Content>
							{#each dateRanges as dateRange (dateRange.value)}
								<Select.Item value={dateRange.value} label={dateRange.label}>
									{dateRange.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Select.Root type="single" bind:value={sortValue}>
						<Select.Trigger class="w-32">
							{sortTriggerContent}
						</Select.Trigger>
						<Select.Content>
							{#each sortOptions as sortOption (sortOption.value)}
								<Select.Item value={sortOption.value} label={sortOption.label}>
									{sortOption.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Button class="bg-blue-500 hover:bg-blue-600">
						<Download class="mr-2 h-4 w-4" />
						Download
					</Button>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b text-left text-sm font-medium text-gray-500">
								<th class="pb-3">NAME</th>
								<th class="pb-3">TRANSACTION ID</th>
								<th class="pb-3">DATE</th>
								<th class="pb-3">TIME</th>
								<th class="pb-3">TYPE</th>
								<th class="pb-3">AMOUNT</th>
								<th class="pb-3">STATUS</th>
							</tr>
						</thead>
						<tbody>
							{#each transactions as transaction}
								<tr class="border-b">
									<td class="py-4 font-medium">{transaction.name}</td>
									<td class="py-4 text-gray-600">{transaction.id}</td>
									<td class="py-4 text-gray-600">{transaction.date}</td>
									<td class="py-4 text-gray-600">{transaction.time}</td>
									<td class="py-4 text-gray-600">{transaction.type}</td>
									<td class="py-4 font-medium">{transaction.amount}</td>
									<td class="py-4">
										<Badge variant={transaction.status === 'Pending' ? 'secondary' : 'destructive'}>
											{transaction.status}
										</Badge>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
