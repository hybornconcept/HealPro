<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Table from '$lib/components/ui/table';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Pagination from '$lib/components/ui/pagination';
	import AreaChart from '$lib/components/AreaChart.svelte';
	import InsightBarChart from '$lib/components/InsightBarChart.svelte';
	import { PieChart, Text } from 'layerchart';
	import * as Chart from '$lib/components/ui/chart';
	import { Progress } from '$lib/components/ui/progress';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import {
		Calendar as CalendarIcon,
		Search,
		FileText,
		CheckCircle,
		XCircle,
		Activity,
		ChevronDown,
		User,
		Shield,
		TrendingUp
	} from 'lucide-svelte';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		CalendarDate
	} from '@internationalized/date';
	import * as Popover from '$lib/components/ui/popover';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	// Chart Configuration
	const barChartConfig = {
		percentage: { label: 'Claims', color: 'hsl(217, 91%, 60%)' }
	} satisfies Chart.ChartConfig;

	// Use data from server
	let rawAnalyticsData = $derived(data.analyticsBarData);
	let claimsData = $derived(data.claimsData);
	let analyticsBarData = $derived(
		rawAnalyticsData.map((d) => ({
			disease: d.name,
			percentage: d.total,
			color: '#3b82f6'
		}))
	);
	let kpiCards = $derived(data.kpiCards);
	let topFacilities = $derived(data.topFacilities);
	let donutChartData = $derived(data.donutChartData);

	let totalClaimsAmount = $derived(topFacilities.reduce((acc, curr) => acc + curr.amount, 0));
	let totalDonutValue = $derived(donutChartData.reduce((acc, curr) => acc + curr.value, 0));

	// Donut Chart Config
	const donutChartConfig = $derived(
		Object.fromEntries(
			(donutChartData || []).map((item) => [item.label, { label: item.label, color: item.color }])
		)
	) satisfies Chart.ChartConfig;

	// Range Calendar State
	let dateRangeValue = $state<CalendarDate[]>([
		new CalendarDate(2025, 6, 12),
		new CalendarDate(2025, 7, 24)
	]);
	// svelte-ignore state_referenced_locally
	let dateRangePlaceholder = $state<DateValue>(dateRangeValue[0]);

	let searchQuery = $state('');
	let selectedRows: string[] = $state([]);
	let activeTab = $state('claims');

	// Filter States
	let statusValue = $state('');
	let providerValue = $state('');

	const statusOptions = [
		{ value: 'all', label: 'All Status' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'accepted', label: 'Accepted' },
		{ value: 'rejected', label: 'Rejected' }
	];

	const providerOptions = [
		{ value: 'all', label: 'All Providers' },
		{ value: 'lagos', label: 'Lagos General' },
		{ value: 'abuja', label: 'Abuja National' }
	];

	const statusTriggerContent = $derived(
		statusOptions.find((o) => o.value === statusValue)?.label ?? 'Status'
	);

	const providerTriggerContent = $derived(
		providerOptions.find((o) => o.value === providerValue)?.label ?? 'Provider'
	);

	// Sheet Logic
	let isSheetOpen = $state(false);
	let selectedClaim: (typeof claimsData)[0] | null = $state(null);
	let sheetTab = $state('overview');
	let insuranceOpen = $state(false);
	let policyOpen = $state(false);

	function openSheet(claim: (typeof claimsData)[0]) {
		selectedClaim = claim;
		isSheetOpen = true;
	}

	function toggleRow(id: string) {
		if (selectedRows.includes(id)) {
			selectedRows = selectedRows.filter((rowId) => rowId !== id);
		} else {
			selectedRows = [...selectedRows, id];
		}
	}

	function toggleAll() {
		if (selectedRows.length === claimsData.length) {
			selectedRows = [];
		} else {
			selectedRows = claimsData.map((c) => c.id);
		}
	}

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.substring(0, 2);
	}

	// Status Background Color for Rows
	function getStatusRowClass(status: string) {
		switch (status) {
			case 'Rejected':
				return 'bg-red-50/80 hover:bg-red-50';
			case 'Accepted':
			case 'Approved':
				return 'bg-emerald-50/80 hover:bg-emerald-50';
			case 'Treated':
				return 'bg-slate-100/80 hover:bg-slate-100';
			case 'Pending':
				return 'bg-white hover:bg-slate-50';
			default:
				return 'bg-white hover:bg-slate-50';
		}
	}

	function getStatusDot(status: string) {
		switch (status) {
			case 'Pending':
			case 'Open':
				return 'bg-slate-500';
			case 'Accepted':
			case 'Approved':
				return 'bg-emerald-500';
			case 'Rejected':
				return 'bg-rose-500';
			case 'Treated':
				return 'bg-slate-400';
			default:
				return 'bg-slate-300';
		}
	}

	function getPolicyBadgeStyle(type: string) {
		switch (type) {
			case 'Platinum':
				return 'bg-violet-100 text-violet-700 hover:bg-violet-200';
			case 'Gold':
				return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
			case 'Silver':
				return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
			case 'Bronze':
				return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	}

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});
</script>

<div class="flex h-full w-full flex-col gap-6 overflow-y-auto bg-[#F8F9FE] px-12 py-8">
	<!-- Top Section (KPIs) -->
	<div class="flex w-full shrink-0 flex-col gap-6 lg:flex-row">
		<!-- Left Text Section (35% width) -->
		<div class="flex w-full flex-col justify-start space-y-4 lg:w-[35%]">
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-2">
					<Badge variant="outline" class="border-violet-200 bg-violet-50 text-violet-700">
						<FileText class="mr-1 h-3 w-3" />
						Claims Overview
					</Badge>
					<span class="h-1 w-1 rounded-full bg-slate-300"></span>
					<span class="text-xs font-medium text-slate-500">
						{new Date().toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</span>
				</div>
				<div>
					<h1 class="text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
						Manage <span
							class="bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
							>Claims</span
						>
					</h1>
					<p class="text-md mt-2 line-clamp-2 leading-relaxed text-slate-500">
						Efficiently manage and track all your HMO claims.
					</p>
				</div>
			</div>
		</div>
		<!-- Right Cards Section (65% width) - Alternating White and Blue -->
		<div class="flex h-full w-full flex-col lg:w-[65%]">
			<div class="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-4">
				{#each kpiCards as card}
					<div
						class="flex flex-col justify-between rounded-lg p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md
                            {card.theme === 'blue'
							? 'bg-[#1773f8] text-white shadow-blue-200'
							: 'border border-slate-100 bg-white text-slate-900'}"
						style="min-height: 207px;"
					>
						<!-- Header -->
						<div class="space-y-4">
							<div class="flex items-center gap-2">
								<Activity
									class="h-5 w-5 {card.theme === 'blue' ? 'text-blue-200' : 'text-slate-400'}"
								/>
								<span
									class="text-sm font-medium {card.theme === 'blue'
										? 'text-blue-100'
										: 'text-slate-500'}">{card.tag}</span
								>
							</div>

							<div class="flex flex-col items-end">
								<h3 class="mt-1 text-2xl font-bold tracking-tight">{card.stats[0].value}</h3>
								<div class="flex items-center gap-2">
									<span
										class="text-xs font-medium {card.stats[0].label.includes('+')
											? 'text-emerald-500'
											: 'text-rose-500'}"
									>
										{card.stats[0].label.includes('+') ? '↗' : '↘'}
										{card.stats[0].label}
									</span>
								</div>
							</div>
						</div>

						<!-- Tiny Chart Placeholder -->
						<div class="h-8 w-full opacity-50">
							{#if card.theme === 'blue'}
								<!-- Bar SVG for Blue Cards -->
								<svg
									viewBox="0 0 100 20"
									preserveAspectRatio="none"
									class="h-full w-full overflow-visible"
								>
									<rect x="5" y="10" width="8" height="10" fill="currentColor" rx="2" />
									<rect x="20" y="5" width="8" height="15" fill="currentColor" rx="2" />
									<rect x="35" y="8" width="8" height="12" fill="currentColor" rx="2" />
									<rect x="50" y="3" width="8" height="17" fill="currentColor" rx="2" />
									<rect x="65" y="12" width="8" height="8" fill="currentColor" rx="2" />
									<rect x="80" y="6" width="8" height="14" fill="currentColor" rx="2" />
								</svg>
							{:else}
								<!-- Trend Line for White Cards -->
								<svg
									viewBox="0 0 100 20"
									preserveAspectRatio="none"
									class="h-full w-full overflow-visible"
								>
									<path
										d="M0 15 Q 10 5, 20 15 T 40 15 T 60 5 T 80 15 T 100 10"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
									/>
								</svg>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Bottom Section (Separated Tabs & Content) -->
	<div class="mt-4 flex w-full flex-col gap-4">
		<Tabs.Root bind:value={activeTab} class="flex w-full flex-col gap-4">
			<!-- Tabs Navigation - Full Width Underline -->
			<div class="relative w-full border-b border-slate-200">
				<div class="flex items-center justify-between">
					<Tabs.List class="w-auto gap-8 bg-transparent p-0">
						<Tabs.Trigger
							value="claims"
							class="relative h-10 rounded-none border-0 border-b-2 border-transparent bg-transparent px-2 pb-2 pt-0 text-base font-semibold text-slate-400 shadow-none hover:text-slate-800 focus-visible:ring-0 data-[state=active]:border-b-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
						>
							Claims List
						</Tabs.Trigger>
						<Tabs.Trigger
							value="analytics"
							class="relative h-10 rounded-none border-0 border-b-2 border-transparent bg-transparent px-2 pb-2 pt-0 text-base font-semibold text-slate-400 shadow-none hover:text-slate-800 focus-visible:ring-0 data-[state=active]:border-b-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
						>
							Analytics
						</Tabs.Trigger>
					</Tabs.List>
				</div>
			</div>

			<!-- Claims Tab Content -->
			<!-- Claims Tab Content -->
			<Tabs.Content value="claims" class="mt-2 text-inherit">
				<div in:fly={{ x: 20, duration: 500, delay: 200 }} out:fly={{ x: -20, duration: 200 }}>
				<!-- Controls shifted inside Claims tab, aligned right -->
				<div class="mb-4 flex items-center justify-end gap-3">
					<div class="relative w-64">
						<Search class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
						<Input
							placeholder="Search details..."
							bind:value={searchQuery}
							class="h-9 rounded-full border-slate-200 bg-white pl-9 text-xs shadow-sm"
						/>
					</div>
					<Select.Root type="single" bind:value={statusValue}>
						<Select.Trigger class="h-9 w-[130px] rounded-full border-slate-200 text-xs">
							{statusTriggerContent}
						</Select.Trigger>
						<Select.Content>
							{#each statusOptions as option}
								<Select.Item value={option.value} label={option.label}>
									{option.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Select.Root type="single" bind:value={providerValue}>
						<Select.Trigger class="h-9 w-[130px] rounded-full border-slate-200 text-xs">
							{providerTriggerContent}
						</Select.Trigger>
						<Select.Content>
							{#each providerOptions as option}
								<Select.Item value={option.value} label={option.label}>
									{option.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
					<!-- Table -->
					<div class="w-full">
						<Table.Root>
							<Table.Header class="bg-gray-50/50">
								<Table.Row class="border-b-slate-100 hover:bg-transparent">
									<Table.Head class="w-[50px] pl-6">
										<Checkbox
											checked={selectedRows.length === claimsData.length && claimsData.length > 0}
											onCheckedChange={toggleAll}
										/>
									</Table.Head>
									<Table.Head class="font-semibold text-slate-500">Patient Details</Table.Head>
									<Table.Head class="font-semibold text-slate-500">Claim ID</Table.Head>
									<Table.Head class="font-semibold text-slate-500">Provider</Table.Head>
									<Table.Head class="font-semibold text-slate-500">Policy Type</Table.Head>
									<Table.Head class="font-semibold text-slate-500">Coverage</Table.Head>
									<Table.Head class="font-semibold text-slate-500">Status</Table.Head>
									<Table.Head class="font-semibold text-slate-500">Date</Table.Head>
									<Table.Head class="pr-6 text-right font-semibold text-slate-500"
										>Actions</Table.Head
									>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each claimsData as claim}
									<Table.Row
										class="h-16 {getStatusRowClass(claim.status)} {selectedRows.includes(claim.id)
											? 'ring-1 ring-inset ring-blue-600'
											: ''} border-b-slate-50 transition-colors"
										onclick={() => toggleRow(claim.id)}
									>
										<Table.Cell class="pl-6">
											<Checkbox
												checked={selectedRows.includes(claim.id)}
												class={selectedRows.includes(claim.id)
													? 'border-blue-600 data-[state=checked]:bg-blue-600'
													: ''}
											/>
										</Table.Cell>
										<Table.Cell>
											<div class="flex items-center gap-3">
												<Avatar.Root class="h-9 w-9 border border-slate-600 bg-transparent">
													<Avatar.Fallback
														class="bg-transparent text-sm font-normal text-slate-600"
													>
														{getInitials(claim.fullName)}
													</Avatar.Fallback>
												</Avatar.Root>
												<div class="flex flex-col">
													<span class="text-md font-semibold text-slate-900">{claim.fullName}</span>
													<span class="text-xs text-slate-500">{claim.enrolleeId}</span>
												</div>
											</div>
										</Table.Cell>
										<Table.Cell>
											<span class="font-mono text-sm text-slate-500">{claim.claimId}</span>
										</Table.Cell>
										<Table.Cell>
											<div class="flex flex-col">
												<span class="max-w-[150px] truncate text-sm font-medium text-slate-700"
													>{claim.providerName}</span
												>
												<span class="text-xs text-slate-400">{claim.providerState}</span>
											</div>
										</Table.Cell>
										<Table.Cell>
											<Badge
												variant="secondary"
												class="font-medium {getPolicyBadgeStyle(claim.policyType)}"
											>
												{claim.policyType}
											</Badge>
										</Table.Cell>
										<Table.Cell class="w-[15%]">
											<div class="flex items-center gap-2">
												<Progress value={claim.coverage} class="h-2 w-20" />
												<span class="text-xs text-slate-500">{claim.coverage}%</span>
											</div>
										</Table.Cell>
										<!-- Colored Status Cell -->
										<Table.Cell>
											<div class="flex items-center gap-2 text-xs font-bold">
												<div class="h-1.5 w-1.5 rounded-full {getStatusDot(claim.status)}"></div>
												{claim.status}
											</div>
										</Table.Cell>
										<Table.Cell class="text-xs font-medium text-slate-700">{claim.date}</Table.Cell>
										<Table.Cell class="pr-6 text-right">
											<Button
												variant="ghost"
												size="sm"
												class="rounded-lg border border-blue-100 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700"
												onclick={(e: MouseEvent) => {
													e.stopPropagation();
													openSheet(claim);
												}}
											>
												View Details
											</Button>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>

					<!-- Footer/Pagination -->
					<div class="flex items-center justify-between border-t border-slate-100 p-4">
						<div class="text-xs text-slate-500">
							Showing <strong>10</strong> of <strong>50</strong> results
						</div>
						<div class="flex items-center gap-2">
							<Button variant="outline" size="sm" class="h-8 w-8 p-0">
								<span class="sr-only">Previous</span>
								<span>&larr;</span>
							</Button>
							<div class="flex items-center gap-1">
								<Button size="sm" class="h-8 w-8 bg-slate-900 text-white p-0">1</Button>
								<Button variant="ghost" size="sm" class="h-8 w-8 text-slate-600 p-0 hover:bg-slate-50">2</Button>
								<Button variant="ghost" size="sm" class="h-8 w-8 text-slate-600 p-0 hover:bg-slate-50">3</Button>
								<span class="text-xs text-slate-400">...</span>
							</div>
							<Button variant="outline" size="sm" class="h-8 w-8 p-0">
								<span class="sr-only">Next</span>
								<span>&rarr;</span>
							</Button>
						</div>
				</div>
					</div>
				</div>
			</Tabs.Content>

			<!-- Analytics Tab Content -->
			<!-- Analytics Tab Content -->
			<Tabs.Content value="analytics" class="mt-2 space-y-6">
				<div in:fly={{ x: 20, duration: 300, delay: 100 }} out:fly={{ x: -20, duration: 200 }}>
				<!-- Filters Row -->
				<div class="flex items-center justify-end gap-3">
					<!-- Range Calendar Filter -->
					<Popover.Root>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button
									variant="outline"
									class="h-9 w-60 justify-start rounded-full border-slate-200 text-left text-xs font-normal"
									{...props}
								>
									<CalendarIcon class="mr-2 h-4 w-4 opacity-50" />
									{#if dateRangeValue && dateRangeValue.length > 0}
										{df.format(dateRangeValue[0].toDate(getLocalTimeZone()))} - {df.format(
											dateRangeValue[dateRangeValue.length - 1].toDate(getLocalTimeZone())
										)}
									{:else}
										<span>Pick a date range</span>
									{/if}
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="end">
							<Calendar
								type="multiple"
								bind:value={dateRangeValue}
								bind:placeholder={dateRangePlaceholder}
								maxDays={5}
								class="rounded-lg border shadow-sm"
								numberOfMonths={2}
							/>
						</Popover.Content>
					</Popover.Root>

					<!-- Facility Filter -->
					<Select.Root type="single">
						<Select.Trigger class="h-9 w-40 rounded-full border-slate-200 text-xs">
							Filter by Facility
						</Select.Trigger>
						<Select.Content>
							{#each topFacilities as facility}
								<Select.Item value={facility.name} label={facility.name} class="text-xs">
									{facility.name}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>

					<!-- State Filter -->
					<Select.Root type="single">
						<Select.Trigger class="w-32.5 h-9 rounded-full border-slate-200 text-xs">
							All States
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="lagos" label="Lagos" class="text-xs">Lagos State</Select.Item>
							<Select.Item value="abuja" label="Abuja" class="text-xs">Abuja FCT</Select.Item>
							<Select.Item value="rivers" label="Rivers" class="text-xs">Rivers State</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-10">
					<!-- Left Column: Top Facilities (30%) -->
					<div class="md:col-span-3">
						<!-- Combined Stats & List Card -->
						<div class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
							<!-- Top Section: Stats with Blue Gradient -->
							<div class="bg-gradient-to-br from-blue-50 via-white to-white p-5 pb-6">
								<div class="mb-6 flex items-center justify-between">
									<h3 class="font-bold text-slate-900">Claims Overview</h3>
									<button
										class="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-sm"
									>
										Full stats
									</button>
								</div>
								<div class="mb-2">
									<span class="text-4xl font-bold tracking-tight text-slate-900">
										₦{(totalClaimsAmount / 1000000).toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										})}M
									</span>
									<span class="ml-1 text-sm font-semibold text-slate-400">NGN</span>
								</div>
								<p class="mb-2 text-xs font-medium text-blue-600">
									<span class="mr-1 inline-block rounded-full bg-blue-100 px-1.5 py-0.5"
										>+12.5%</span
									> this month
								</p>
							</div>

							<!-- Bottom Section: List -->
							<div class="px-6 pb-6 pt-2">
								<!-- Toggle Buttons -->
								<div class="relative -mt-8 mb-6 flex gap-2">
									<button
										class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-lg"
									>
										Top Facilities
									</button>
									<button
										class="rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
									>
										Lowest Facilities
									</button>
								</div>

								<!-- List -->
								<div class="space-y-4">
									{#each topFacilities as facility}
										<div
											class="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
										>
											<div class="min-w-0 flex-1 pr-4">
												<p class="truncate text-sm font-bold text-slate-900">{facility.name}</p>
												<p class="text-xs text-slate-400">{facility.state}</p>
											</div>
											<div class="flex flex-col items-end gap-1">
												<span class="text-sm font-bold text-slate-900">
													₦{facility.amount >= 1000000
														? (facility.amount / 1000000).toFixed(1) + 'M'
														: (facility.amount / 1000).toFixed(0) + 'k'}
												</span>
												<Badge
													class="flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
												>
													{((facility.amount / totalClaimsAmount) * 100).toFixed(1)}%
													<TrendingUp class="h-2 w-2" />
												</Badge>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>

					<!-- Right Column: Charts (70%) -->
					<div class="space-y-6 md:col-span-7">
						<!-- Top Row: Side-by-Side Charts -->
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<!-- 1. Avg. Claims Data (Bar Chart) -->
							<Card.Root class="overflow-hidden border-slate-100 py-0 shadow-sm">
								<Card.Header class="bg-gradient-to-br from-blue-50 via-white to-white p-4 pb-1">
									<div class="flex items-center justify-between">
										<Card.Title class="text-base font-bold text-slate-900"
											>Avg. Claims Data</Card.Title
										>
										<button
											class="flex items-center gap-1 rounded-md border border-slate-200 bg-white/50 px-2 py-1 text-xs font-medium text-slate-600 backdrop-blur-sm hover:bg-white"
										>
											Per day <ChevronDown class="h-3 w-3" />
										</button>
									</div>
									<div class="mt-4">
										<div class="flex items-baseline gap-1">
											<span class="text-3xl font-bold tracking-tight text-slate-900">2,589</span>
											<span class="text-sm font-medium text-slate-400">claims</span>
										</div>
										<p class="text-xs text-slate-400">Avg. per day</p>
									</div>
								</Card.Header>
								<Card.Content class="p-4 pt-1">
									<InsightBarChart
										data={analyticsBarData}
										chartConfig={barChartConfig}
										orientation="horizontal"
										height="h-[180px]"
									/>
								</Card.Content>
							</Card.Root>

							<!-- 2. Status Distribution (Donut Chart) -->
							<Card.Root class="overflow-hidden border-slate-100 py-0 shadow-sm">
								<Card.Header class="bg-gradient-to-br from-blue-50 via-white to-white p-5 pb-2">
									<Card.Title class="text-base font-bold text-slate-900">Claim Status</Card.Title>
									<Card.Description>Distribution ratio</Card.Description>
								</Card.Header>
								<Card.Content class="p-5 pt-0">
									<Chart.Container
										config={donutChartConfig}
										class="mx-auto aspect-square max-h-[220px] w-full"
									>
										<PieChart
											data={donutChartData}
											key="label"
											value="value"
											c="color"
											innerRadius={45}
											padding={28}
											props={{ pie: { motion: 'tween' } }}
										>
											{#snippet aboveMarks()}
												<Text
													value={String(totalDonutValue)}
													textAnchor="middle"
													verticalAnchor="middle"
													class="fill-foreground text-3xl! font-bold"
													dy={3}
												/>
												<Text
													value="Claims"
													textAnchor="middle"
													verticalAnchor="middle"
													class="fill-muted-foreground! text-muted-foreground"
													dy={22}
												/>
											{/snippet}
											{#snippet tooltip()}
												<Chart.Tooltip
													class="rounded-lg border border-slate-100 bg-white/95 px-3 py-2 text-sm font-medium shadow-lg backdrop-blur-sm"
												/>
											{/snippet}
										</PieChart>
									</Chart.Container>
									<!-- Legend -->
									<div class="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
										{#each donutChartData as item}
											<div class="flex items-center gap-1.5">
												<div
													class="h-2 w-2 rounded-full"
													style="background-color: {item.color}"
												></div>
												<span class="text-xs font-medium text-slate-700">{item.label}</span>
											</div>
										{/each}
									</div>
								</Card.Content>
							</Card.Root>
						</div>

						<!-- Active Users (Area Chart) - Full Width Bottom -->
						<AreaChart
							title="Active Users"
							description="Sessions over time"
							trendText="See performance"
							colors={{ processed: '#1e3a8a', denied: '#60a5fa' }}
							height="h-[200px]"
						/>
					</div>
				</div>
					</div>
			
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

<!-- View Details Sheet -->
<Sheet.Root bind:open={isSheetOpen}>
	<Sheet.Content side="right" class="sm:w-165 flex h-full w-full flex-col bg-white p-0">
		{#if selectedClaim}
			<!-- Header -->
			<div
				class="sticky top-0 z-20 flex items-start justify-between border-b border-slate-100 bg-white px-6 py-4"
			>
				<div>
					<h2 class="text-xl font-bold text-slate-900">{selectedClaim.claimId}</h2>
					<div class="mt-1 flex items-center gap-2">
						<a href="##" class="text-sm font-semibold text-blue-600 hover:underline">
							{selectedClaim.enrolleeId} ↗
						</a>
						<Badge
							variant="secondary"
							class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
						>
							{selectedClaim.policyType}
						</Badge>
					</div>
				</div>
				<Sheet.Close class="rounded-full p-2 transition-colors hover:bg-slate-100">
					<XCircle class="h-6 w-6 text-slate-400" />
				</Sheet.Close>
			</div>

			<!-- Main Content (Scrollable Area) -->
			<div class="flex-1 overflow-y-auto px-4 py-4">
				<!-- Tabs -->
				<Tabs.Root bind:value={sheetTab} class="w-full">
					<Tabs.List class="mb-5 h-auto w-full justify-start rounded-lg bg-slate-100 p-1">
						<Tabs.Trigger
							value="overview"
							class="h-8 flex-1 rounded-md px-3 text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
						>
							Details
						</Tabs.Trigger>
						<Tabs.Trigger
							value="history"
							class="h-8 flex-1 rounded-md px-3 text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
						>
							History
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="overview" class="space-y-5">
						<!-- Card 1: Provider Details (List Card) -->
						{@const details = [
							{ label: 'Provider Name', value: selectedClaim.providerName },
							{ label: 'Doctor Name', value: 'Dr. Sadiq Obanla' },
							{ label: 'Date of Claim', value: selectedClaim.date },
							{ label: 'Phone Number', value: '+234 801 234 5678' },
							{ label: 'Email', value: selectedClaim.email }
						]}
						<div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
							{#each details as detail, i}
								<div
									class="flex items-center justify-between p-3 {i < details.length - 1
										? 'border-b border-slate-100'
										: ''}"
								>
									<span class="text-xs font-medium text-slate-500">{detail.label}</span>
									<span class="text-xs font-semibold text-slate-900">{detail.value}</span>
								</div>
							{/each}
						</div>

						<!-- Card 2: Claims Detail (Blue Bordered Card) -->
						<div
							class="relative overflow-hidden rounded-xl border-2 border-blue-500 bg-white p-4 shadow-sm"
						>
							<div class="mb-6 flex items-start justify-between">
								<div>
									<h3 class="text-md font-bold text-slate-900">Claims Detail</h3>
									<p class="text-xs font-medium text-slate-400">Services Provided</p>
								</div>
								<div class="text-right">
									<p class="text-lg font-bold text-slate-900">
										₦{selectedClaim.totalAmount.toLocaleString()}
									</p>
									<p class="text-xs text-slate-400">Total Listed</p>
								</div>
							</div>

							<div class="space-y-0 divide-y divide-blue-100">
								{#each selectedClaim.services as service}
									<div class="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
										<CheckCircle class="mt-0.5 h-3 w-3 shrink-0 text-blue-600" />
										<div class="flex w-full justify-between">
											<span class="text-xs font-medium text-slate-700">{service.description}</span>
											<span class="text-xs font-bold text-slate-900">
												₦{service.amount.toLocaleString()}
											</span>
										</div>
									</div>
								{/each}
							</div>

							<!-- Coverage/Total Info -->
							<div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
								<div class="flex items-center gap-2 text-xs text-slate-500">
									<Shield class="h-4 w-4 text-blue-500" />
									<span
										>Coverage Applied: <span class="font-bold text-slate-900"
											>{selectedClaim.coverage}%</span
										></span
									>
								</div>
								<div class="text-right">
									<p class="text-sm font-bold text-slate-900">
										₦{(
											selectedClaim.totalAmount *
											(1 - selectedClaim.coverage / 100)
										).toLocaleString()}
									</p>
									<p class="text-[10px] font-medium tracking-wide text-slate-400">Amount Payable</p>
								</div>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="history">
						<div class="relative ml-2 space-y-4 border-l-2 border-slate-100 pb-4 pl-3 pt-2">
							{#each data.historyItems as item}
								<div class="relative">
									<!-- Timeline Dot -->
									<div
										class="absolute -left-5 top-4 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-slate-400"
									></div>

									<!-- History Card -->
									<div
										class="rounded-xl border border-slate-100 p-4 shadow-sm {item.status ===
										'Rejected'
											? 'bg-rose-50'
											: item.status === 'Accepted'
												? 'bg-emerald-50'
												: 'bg-white'}"
									>
										<div class="flex items-start justify-between">
											<!-- Date & Details Grid -->
											<div class="flex gap-4">
												<!-- Date -->
												<div class="flex flex-col items-center border-r border-slate-100 pr-4 pt-1">
													<span class="text-[10px] font-bold text-slate-400">{item.month}</span>
													<span class="text-lg font-black text-slate-800">{item.day}</span>
												</div>

												<!-- Simplified Finance & Procedure -->
												<div class="flex flex-col justify-center gap-0.5">
													<div class="flex items-baseline gap-2">
														<span class="text-sm font-black text-slate-900"
															>₦{item.amount.toLocaleString()}</span
														>
														<span class="text-[10px] font-medium text-slate-500"
															>Coverage: <span class="text-slate-700">{item.coverage}%</span></span
														>
													</div>
													<div class="flex flex-col gap-0.5">
														<span
															class="line-clamp-1 text-[10px] font-bold text-slate-800"
															title={item.procedure}>{item.procedure}</span
														>
														<span class="text-[9px] font-medium text-slate-400"
															>{item.provider}</span
														>
													</div>
												</div>
											</div>

											<!-- Status Badge -->
											<div class="flex items-center">
												{#if item.status === 'Accepted'}
													<Badge
														variant="default"
														class="bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold text-emerald-600 hover:bg-emerald-500/20"
													>
														Accepted
													</Badge>
												{:else if item.status === 'Rejected'}
													<Badge
														variant="destructive"
														class="bg-rose-500/10 px-2 py-0.5 text-[8px] font-bold text-rose-600 hover:bg-rose-500/20"
													>
														Rejected
													</Badge>
												{:else}
													<Badge
														variant="secondary"
														class="bg-amber-500/10 px-2 py-0.5 text-[8px] font-bold text-amber-600 hover:bg-amber-500/20"
													>
														Pending
													</Badge>
												{/if}
											</div>
										</div>

										<!-- Financial & Procedure Context -->

										<!-- Optional Reason (e.g. for pending) -->

										<!-- Patient Comment -->
										<div class="mt-3 flex gap-2.5 rounded-lg bg-blue-50/80 p-2.5">
											<div
												class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100"
											>
												<User class="h-3 w-3 text-blue-600" />
											</div>
											<div>
												<p
													class="mb-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-900"
												>
													Patient Comment
												</p>
												<p class="text-[10px] font-medium leading-relaxed text-slate-600">
													"{item.note}"
												</p>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>

			<!-- Footer with Action Buttons (Fixed at bottom via Flex) -->
			<div
				class="mt-auto flex w-full items-center gap-4 border-t border-slate-100 bg-white px-6 py-4"
			>
				<Button class="flex-1 rounded-full bg-rose-500 font-bold text-white hover:bg-rose-600">
					Decline
				</Button>
				<Button
					class="flex-1 rounded-full bg-emerald-500 font-bold text-white hover:bg-emerald-600"
				>
					Accept
				</Button>
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>

<style>
	/* Custom Scrollbar for the page */
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}
	::-webkit-scrollbar-track {
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
