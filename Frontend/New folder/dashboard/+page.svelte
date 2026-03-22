<script lang="ts">
	import { Area } from 'layerchart';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { getLocalTimeZone } from '@internationalized/date';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Plus,
		Search,
		CheckCircle,
		ArrowDown,
		ArrowRight,
		ArrowUp,
		Building2,
		Clock,
		MoreHorizontal,
		Download,
		HeadphonesIcon,
		ChevronDownIcon,
		TrendingUp,
		TrendingDown,
		AlertTriangle,
		Users,
		FileText,
		DollarSign
	} from '@lucide/svelte';
	import AreaChart from '$lib/components/AreaChart.svelte';
	import PayableDonutChart from '$lib/components/PayableDonutChart.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { DateRange } from 'bits-ui';

	const { data } = $props();
	const { filterOptions, criticalKPIs, qualityMetrics, topFacilities } = data;

	let open = $state(false);
	let value = $state<DateRange | undefined>();
	let status = $state('');
	let priority = $state('');

	// Icon mapping for dynamic rendering
	const iconMap = {
		FileText,
		Clock,
		CheckCircle,
		Users,
		TrendingUp,
		AlertTriangle
	};
</script>

<div class="flex min-h-screen flex-col space-y-6 p-6">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<div>
			<div class="mb-2 flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
					<Building2 class="h-5 w-5 text-white" />
				</div>
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Good Morning, Dr. Adebayo</h1>
					<p class="text-sm text-gray-600">
						Monitor HMO facility performance and quality metrics across your network
					</p>
				</div>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<Button variant="outline" class="gap-2">
				<Download class="h-4 w-4" />
				Download Report
			</Button>
			<Button class="gap-2 bg-blue-600 hover:bg-blue-700">
				<HeadphonesIcon class="h-4 w-4" />
				AI Support
			</Button>
		</div>
	</div>

	<!-- Filters -->
	<div class="space-between mb-3 flex items-center">
		<div class="flex-1">
			<Input type="text" placeholder="Search facilities..." class="max-w-xs" />
		</div>
		<div class="flex items-center space-x-4">
			<Select.Root bind:value={status} type="single">
				<Select.Trigger class="w-32 border-gray-300 bg-white text-gray-900 hover:bg-gray-50">
					<div class="flex items-center gap-2">
						<Plus class="h-4 w-4 text-gray-400" />
						Status
					</div>
				</Select.Trigger>
				<Select.Content class="border-gray-300 bg-white">
					<div class="border-b border-gray-300 px-3 py-2">
						<div class="flex items-center gap-2 text-gray-600">
							<Search class="h-4 w-4" />
							<span class="text-sm">Status</span>
						</div>
					</div>
					{#each filterOptions.status as option (option.value)}
						<Select.Item
							value={option.value}
							label={option.label}
							class="flex items-center gap-3 px-3 py-2 text-gray-900 hover:bg-gray-100"
						>
							<div class="h-4 w-4 rounded border border-gray-400"></div>
							<span class="text-gray-600">
								{#if option.value === 'active'}<ArrowDown class="h-4 w-4" />
								{:else if option.value === 'inactive'}<ArrowRight class="h-4 w-4" />
								{:else}<ArrowUp class="h-4 w-4" />
								{/if}
							</span>
							<span>{option.label}</span>
							<span class="ml-auto text-sm text-gray-500">{option.count}</span>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<Select.Root bind:value={priority} type="single">
				<Select.Trigger class="w-32 border-gray-300 bg-white text-gray-900 hover:bg-gray-50">
					<div class="flex items-center gap-2">
						<Plus class="h-4 w-4 text-gray-400" />
						Priority
					</div>
				</Select.Trigger>
				<Select.Content class="border-gray-300 bg-white">
					<div class="border-b border-gray-300 px-3 py-2">
						<div class="flex items-center gap-2 text-gray-600">
							<Search class="h-4 w-4" />
							<span class="text-sm">Priority</span>
						</div>
					</div>
					{#each filterOptions.priority as option (option.value)}
						<Select.Item
							value={option.value}
							label={option.label}
							class="flex items-center gap-3 px-3 py-2 text-gray-900 hover:bg-gray-100"
						>
							<div class="h-4 w-4 rounded border border-gray-400"></div>
							<span class="text-gray-600">
								{#if option.value === 'low'}<ArrowDown class="h-4 w-4" />
								{:else if option.value === 'medium'}<ArrowRight class="h-4 w-4" />
								{:else}<ArrowUp class="h-4 w-4" />
								{/if}
							</span>
							<span>{option.label}</span>
							<span class="ml-auto text-sm text-gray-500">{option.count}</span>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<!-- Range Calendar -->
			<Popover.Root bind:open>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="w-56 justify-between font-normal">
							{value?.start && value?.end
								? `${value.start.toDate(getLocalTimeZone()).toLocaleDateString()} - ${value.end.toDate(getLocalTimeZone()).toLocaleDateString()}`
								: 'Select date'}
							<ChevronDownIcon />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto overflow-hidden p-0" align="start">
					<RangeCalendar bind:value captionLayout="dropdown" />
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>

	<!-- Main Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
		<!-- Critical KPIs -->
		<div class="my-0 flex h-[400px] flex-col gap-4 lg:col-span-2">
			<Card.Root class="flex-1 py-3">
				<Card.Header class="mt-2 flex h-[30px] min-h-0 items-center justify-between border-b">
					<h2 class="text-lg font-semibold">Critical Claims KPIs</h2>
					<MoreHorizontal class="h-4 w-4" />
				</Card.Header>
				<Card.Content class="p-3 pt-2">
					<div class="grid grid-cols-3 gap-4">
						{#each criticalKPIs as item}
							<div class="text-center">
								<div
									class="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg {item.status ===
									'good'
										? 'bg-green-100'
										: item.status === 'warning'
											? 'bg-yellow-100'
											: 'bg-red-100'}"
								>
									<svelte:component
										this={iconMap[item.icon]}
										class="h-4 w-4 {item.status === 'good'
											? 'text-green-600'
											: item.status === 'warning'
												? 'text-yellow-600'
												: 'text-red-600'}"
									/>
								</div>
								<p class="mb-1 text-xs text-gray-600">{item.title}</p>
								<p class="mb-1 text-xl font-bold text-gray-900">{item.value}</p>
								<p class="text-xs {item.trend === 'up' ? 'text-green-600' : 'text-red-600'}">
									{item.change}
								</p>
								<p class="text-xs text-gray-500">Target: {item.target}</p>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root class="flex-1 py-3">
				<Card.Header class="mt-2 flex h-[30px] min-h-0 items-center justify-between border-b">
					<h2 class="text-lg font-semibold">Quality & Safety Metrics</h2>
					<MoreHorizontal class="h-4 w-4" />
				</Card.Header>
				<Card.Content class="-mt-5 p-3">
					<div class="grid grid-cols-3 gap-4">
						{#each qualityMetrics as item}
							<div class="text-center">
								<div
									class="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg {item.status ===
									'good'
										? 'bg-green-100'
										: item.status === 'warning'
											? 'bg-yellow-100'
											: 'bg-red-100'}"
								>
									<svelte:component
										this={iconMap[item.icon]}
										class="h-4 w-4 {item.status === 'good'
											? 'text-green-600'
											: item.status === 'warning'
												? 'text-yellow-600'
												: 'text-red-600'}"
									/>
								</div>
								<p class="mb-1 text-xs text-gray-600">{item.title}</p>
								<p class="mb-1 text-xl font-bold text-gray-900">{item.value}</p>
								<p class="text-xs {item.trend === 'up' ? 'text-green-600' : 'text-red-600'}">
									{item.change}
								</p>
								<p class="text-xs text-gray-500">Target: {item.target}</p>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Performance Chart -->
		<div class="my-0 lg:col-span-3">
			<AreaChart />
		</div>
	</div>

	<!-- Second Row -->
	<div class="mt-10 flex gap-6">
		<!-- Top Performing Facilities -->
		<div class="w-[38%]">
			<Card.Root>
				<Card.Header
					class="flex h-[30px] min-h-0 flex-row items-center justify-between border-b pb-2"
				>
					<Card.Title class="text-lg font-semibold">Top Performing Facilities</Card.Title>
					<Button variant="ghost" size="sm">
						<MoreHorizontal class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content class="pt-2">
					<div class="mb-4 flex items-center justify-between">
						<div>
							<div class="text-2xl font-bold">156</div>
							<div class="text-xs text-blue-600">Total Network Facilities</div>
						</div>
						<div class="text-right">
							<div class="text-xs whitespace-nowrap text-gray-600">Network Compliance: 94.2%</div>
						</div>
					</div>

					<!-- Performance distribution -->
					<div class="mb-4">
						<div class="h-3 overflow-hidden rounded-full bg-gray-200">
							<div class="flex h-full">
								<div class="bg-green-500" style="width: 65%"></div>
								<div class="bg-yellow-500" style="width: 25%"></div>
								<div class="bg-red-500" style="width: 10%"></div>
							</div>
						</div>
					</div>

					<div
						class="mb-4 flex items-center justify-between text-xs whitespace-nowrap text-gray-600"
					>
						<div class="flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							<span>Excellent: 101</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-yellow-500"></div>
							<span>Good: 39</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-red-500"></div>
							<span>Needs Attention: 16</span>
						</div>
					</div>

					<div class="mb-3 flex items-center justify-between">
						<div class="text-sm font-medium">Top Performers</div>
						<Button variant="ghost" size="sm" class="text-xs text-blue-600">View All →</Button>
					</div>

					<!-- Facility List -->
					<div class="space-y-3">
						{#each topFacilities as facility}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
										<Building2 class="h-4 w-4 text-blue-600" />
									</div>
									<div>
										<div class="text-sm font-medium">{facility.name}</div>
										<div class="text-xs text-gray-500">
											Claims Rate: {facility.claimsAcceptanceRate}%
										</div>
									</div>
								</div>
								<Badge
									variant={facility.status === 'excellent'
										? 'default'
										: facility.status === 'good'
											? 'secondary'
											: 'destructive'}
									class="text-xs {facility.status === 'excellent'
										? 'bg-green-100 text-green-700'
										: facility.status === 'good'
											? 'bg-blue-100 text-blue-700'
											: 'bg-yellow-100 text-yellow-700'}"
								>
									{facility.status}
								</Badge>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Claims by Service Type -->
		<div class="w-[31%]">
			<Card.Root>
				<Card.Header
					class="flex h-[30px] min-h-0 flex-row items-center justify-between border-b py-4"
				>
					<div>
						<Card.Title class="text-lg font-semibold">Claims by Service Type</Card.Title>
						<p class="text-sm text-gray-600">Monitor claim distribution across services</p>
					</div>
					<Button variant="ghost" size="sm">
						<MoreHorizontal class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content class="pt-0">
					<div class="mb-2 flex items-start justify-between rounded-lg bg-gray-100 p-4">
						<div>
							<div class="text-2xl font-bold">12,847</div>
							<div class="text-xs text-green-600">+8.2% Last 30 days</div>
						</div>
						<div class="text-right">
							<div class="text-xs text-gray-600">Total claims processed</div>
							<div class="text-xs text-gray-600">this month</div>
						</div>
					</div>
					<div class="space-y-3">
						<div class="mx-auto ml-2 space-y-1">
							<div class="text-xs font-medium text-gray-700">Primary Care</div>
							<div class="flex items-center gap-2">
								<Progress value={65} max={100} class="h-4 flex-1" />
								<span class="w-8 text-xs font-medium text-gray-900">5,751</span>
							</div>
						</div>
						<div class="mx-auto ml-2 space-y-1">
							<div class="text-xs font-medium text-gray-700">Specialist Care</div>
							<div class="flex items-center gap-2">
								<Progress value={45} max={100} class="h-4 flex-1" />
								<span class="w-8 text-xs font-medium text-gray-900">3,854</span>
							</div>
						</div>
						<div class="mx-auto ml-2 space-y-1">
							<div class="text-xs font-medium text-gray-700">Emergency Services</div>
							<div class="flex items-center gap-2">
								<Progress value={35} max={100} class="h-4 flex-1" />
								<span class="w-8 text-xs font-medium text-gray-900">2,128</span>
							</div>
						</div>
						<div class="mx-auto ml-2 space-y-1">
							<div class="text-xs font-medium text-gray-700">Diagnostic Services</div>
							<div class="flex items-center gap-2">
								<Progress value={25} max={100} class="h-4 flex-1" />
								<span class="w-8 text-xs font-medium text-gray-900">1,114</span>
							</div>
						</div>
					</div>
					<div class="mt-4">
						<Button variant="ghost" size="sm" class="text-xs text-blue-600">View Details →</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Cost Distribution -->
		<div class="w-[31%]">
			<Card.Root>
				<Card.Header
					class="flex h-[30px] min-h-0 flex-row items-center justify-between border-b py-4"
				>
					<Card.Title class="text-lg font-semibold">Cost Distribution</Card.Title>
					<Button variant="ghost" size="sm">
						<MoreHorizontal class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content class="py-0">
					<div class="mb-2 flex items-center gap-2">
						<div class="rounded-lg border-2 bg-gray-50 p-3">
							<DollarSign class="h-5 w-5 text-green-600" />
						</div>
						<div class="flex flex-col">
							<div class="text-xl font-bold">₦847.2M</div>
							<div class="mb-4 text-sm text-gray-600">Total PMPM: ₦15,420</div>
						</div>
					</div>

					<!-- Donut chart -->
					<PayableDonutChart />

					<div class="flex justify-center gap-4 text-xs">
						<div class="flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-blue-500"></div>
							<span>Primary Care</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							<span>Specialist</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-yellow-500"></div>
							<span>Emergency</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
