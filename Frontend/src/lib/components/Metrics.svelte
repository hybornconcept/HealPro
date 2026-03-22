<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	// Removed unused today import
	import RangeCalendar from '$lib/components/ui/range-calendar/range-calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { getLocalTimeZone } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';

	import {
		Plus,
		Search,
		ArrowDown,
		Send,
		ArrowRight,
		ArrowUp,
		ChevronDown,
		ArrowUpDown,
		Lock,
		TrendingUp,
		TrendingDown,
		Phone,
		Mail,
		User,
		Clock
	} from '@lucide/svelte';

	let { data } = $props();

	// Remove problematic id prop
	let open = $state(false);
	let value = $state<DateRange | undefined>();

	let status = $state('');
	let priority = $state('');

	let selectedFacility = $state<any>(null);
	let message = $state('');
	let selectedMessageFacility = $state('');

	const facilityTriggerContent = $derived(
		data.facilities?.find((f) => f.id === selectedMessageFacility)?.hospitalName ??
			'Select facility'
	);

	const filterOptions = {
		status: [
			{ value: 'active', label: 'Active', count: 42, icon: ArrowDown },
			{ value: 'inactive', label: 'Inactive', count: 18, icon: ArrowRight },
			{ value: 'pending', label: 'Pending', count: 60, icon: ArrowUp }
		],
		priority: [
			{ value: 'low', label: 'Low', count: 36, icon: ArrowDown },
			{ value: 'medium', label: 'Medium', count: 33, icon: ArrowRight },
			{ value: 'high', label: 'High', count: 31, icon: ArrowUp }
		],
		view: [
			{ value: 'list', label: 'List', count: 24, icon: ArrowDown },
			{ value: 'grid', label: 'Grid', count: 18, icon: ArrowRight },
			{ value: 'card', label: 'Card', count: 12, icon: ArrowUp }
		]
	};

	const dashboardCards = [
		{
			title: 'Claims Acceptance Rate',
			value: '94.2%',
			type: 'balance',
			buttons: [
				{ label: 'Review', icon: ArrowUpDown },
				{ label: 'Export', icon: Plus }
			]
		},
		{
			title: 'Avg Processing Time',
			value: '2.8 days',
			type: 'income',
			trend: { value: '-12%', direction: 'down', text: 'from last month' }
		}
	];

	const expenseData = [
		{ title: 'Claims Rejection Rate', value: '5.8%', trend: '+1.2%' },
		{ title: 'High-Cost Claims', value: '₦2,456,000', trend: '+8.5%' }
	];
</script>

{#snippet dashboardCard(card: any)}
	<Card.Root class="p-4">
		<Card.Content class="p-0">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="text-sm text-gray-500">{card.title}</h3>
				{#if card.type === 'balance'}
					<div class="flex items-center space-x-2">
						<div class="h-3 w-3 rounded-full bg-red-500"></div>
						<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
						<span class="text-xs text-gray-400">•••• 3241</span>
						<ChevronDown class="h-4 w-4 text-gray-400" />
					</div>
				{:else}
					<div class="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
						<Lock class="h-3 w-3 text-blue-600" />
					</div>
				{/if}
			</div>
			<div class="mb-3 text-2xl font-bold text-gray-900">{card.value}</div>
			{#if card.buttons}
				<div class="flex space-x-2">
					{#each card.buttons as btn}
						<Button class="bg-blue-600 px-3 py-1 text-xs hover:bg-blue-700">
							<btn.icon class="mr-1 h-3 w-3" />
							{btn.label}
						</Button>
					{/each}
				</div>
			{:else if card.trend}
				<div class="flex items-center text-sm">
					<TrendingUp class="mr-1 h-3 w-3 text-green-600" />
					<span class="font-medium text-green-600">{card.trend.value}</span>
					<span class="ml-1 text-gray-500">{card.trend.text}</span>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet facilityCard(facility: any)}
	<Card.Root
		class="cursor-pointer overflow-hidden border border-gray-200 bg-white py-0 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg"
		onclick={() => (selectedFacility = facility)}
	>
		<Card.Content class="p-0">
			<div class="flex">
				<!-- Left Section -->
				<div class="w-[38%] bg-gray-50 px-4 py-3">
					<div class="flex items-center space-x-3">
						<div
							class="flex h-22 w-18 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white"
						>
							<img
								src={facility.logoUrl}
								alt="{facility.hospitalName} logo"
								class="h-14 w-14 object-contain"
							/>
						</div>
						<div class="flex-1">
							<div class="mb-1 flex items-start justify-between">
								<h3 class="text-left text-base font-semibold text-gray-900">
									{facility.hospitalName}
								</h3>
								<span class="text-xs text-gray-500">({facility.hospitalCode})</span>
							</div>
							<p class="mb-2 text-left text-sm text-gray-600">{facility.address}</p>
							<div class="mb-2 flex space-x-2">
								<span class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
									>{facility.facilityType}</span
								>
								<span
									class="rounded-full {facility.accreditationStatus === 'Approved'
										? 'bg-green-100 text-green-700'
										: 'bg-yellow-100 text-yellow-700'} px-2 py-1 text-xs"
								>
									{facility.accreditationStatus}
								</span>
							</div>
							<div class="space-y-1 text-xs text-gray-500">
								<div class="flex items-center space-x-4">
									<div class="flex items-center space-x-1">
										<Phone class="h-3 w-3" />
										<span>{facility.phone}</span>
									</div>
									<div class="flex items-center space-x-1">
										<Mail class="h-3 w-3" />
										<span>{facility.email}</span>
									</div>
								</div>
								<div class="flex items-center space-x-1">
									<User class="h-3 w-3" />
									<span>{facility.contactPerson.name} - {facility.contactPerson.title}</span>
								</div>
								<div class="flex items-center space-x-1">
									<Clock class="h-3 w-3" />
									<span>{facility.operatingHours}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Right Section -->
				<div class="relative w-[62%] border-l border-gray-200 bg-white px-4 py-2">
					<div class="flex h-full">
						<div class="flex w-[30%] flex-col pr-4">
							<div class="flex items-center justify-start space-x-3">
								<span
									class="inline-flex items-center rounded-full {facility.status === 'Active'
										? 'bg-green-100 text-green-800'
										: 'bg-yellow-100 text-yellow-800'} px-2 py-0.5 text-xs font-medium whitespace-nowrap"
								>
									● {facility.status}
								</span>
								<div class="flex items-center space-x-1">
									{#each Array(4) as _}<span class="text-yellow-400">★</span>{/each}
									<span class="text-gray-300">★</span>
									<span class="ml-2 text-sm font-medium text-gray-700">4.2</span>
								</div>
							</div>
							<div class="mt-4 flex w-3/4 flex-col items-start space-y-2">
								<div class="h-2 w-full rounded-full bg-gray-200">
									<div
										class="h-2 rounded-full bg-green-500"
										style="width: {facility.claimsAcceptanceRate}%"
									></div>
								</div>
								<div class="text-lg font-bold text-gray-900">
									{facility.claimsAcceptanceRate} of 100
								</div>
								<div class="h-0.5 w-1/2 bg-gray-300"></div>
								<div class="text-left text-sm text-gray-500">Billing Compliance Rate</div>
							</div>
						</div>
						<div class="flex w-[70%] flex-col justify-between pt-5">
							<div class="flex items-center justify-end space-x-8">
								{#each [{ value: facility.claimsAcceptanceRate, label: 'Total Claims Submitted', color: 'teal', shape: 'diamond' }, { value: facility.preAuthApprovalRate, label: 'Claims Acceptance Rate', color: 'purple', shape: 'circle' }, { value: facility.rejectionRate, label: 'Claims Rejection Rate', color: 'red', shape: 'square' }] as metric}
									<div class="text-center">
										<div
											class="mx-auto mb-2 flex h-12 w-12 items-center justify-center border-2 border-{metric.color}-400 bg-white {metric.shape ===
											'diamond'
												? 'rotate-45 transform'
												: metric.shape === 'circle'
													? 'rounded-full'
													: ''}"
										>
											<span
												class="text-lg font-bold text-{metric.color}-600 {metric.shape === 'diamond'
													? '-rotate-45 transform'
													: ''}">{metric.value}</span
											>
										</div>
										<div class="text-xs font-medium text-{metric.color}-600">{metric.label}</div>
									</div>
								{/each}
							</div>
							<div class="flex justify-end">
								<div class="flex w-120 items-center justify-between rounded-lg p-3">
									{#each [{ value: facility.avgProcessingTime, label: 'Avg Wait Time' }, { value: facility.claimsAcceptanceRate, label: 'Patient Visits' }, { value: facility.rejectionRate, label: 'Missed Rate' }, { value: `$${facility.costPerEnrollee}`, label: 'Cost per Enrollee' }, { value: facility.utilizationRate, label: 'Referral Freq' }] as metric, i}
										<div class="text-center">
											<div class="text-2xl font-bold text-gray-900">{metric.value}</div>
											<div class="text-xs text-gray-900">{metric.label}</div>
										</div>
										{#if i < 4}<div class="mx-2 h-8 w-px bg-gray-300"></div>{/if}
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

<div class="mx-auto max-w-7xl border border-gray-200 bg-white p-6">
	<!-- Filters -->

	<div class="space-between mb-3 flex items-center">
		<div class="flex-1">
			<Input type="email" placeholder="email" class="max-w-xs" />
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
				<Popover.Trigger id="{id}-dates">
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
	<!-- Dashboard Cards -->
	<div class="mb-8 flex gap-6">
		<!-- Column A: 30% width -->
		<div class="w-[30%] space-y-4">
			{#each dashboardCards as card}
				<Card.Root class="p-4">
					<Card.Content class="p-0">
						<div class="mb-3 flex items-center justify-between">
							<h3 class="text-sm text-gray-500">{card.title}</h3>
							{#if card.type === 'balance'}
								<div class="flex items-center space-x-2">
									<div class="h-3 w-3 rounded-full bg-red-500"></div>
									<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
									<span class="text-xs text-gray-400">•••• 3241</span>
									<ChevronDown class="h-4 w-4 text-gray-400" />
								</div>
							{:else}
								<div class="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
									<Lock class="h-3 w-3 text-blue-600" />
								</div>
							{/if}
						</div>
						<div class="mb-3 text-2xl font-bold text-gray-900">{card.value}</div>
						{#if card.buttons}
							<div class="flex space-x-2">
								{#each card.buttons as btn}
									<Button class="bg-blue-600 px-3 py-1 text-xs hover:bg-blue-700">
										{#if btn.icon === ArrowUpDown}<ArrowUpDown class="mr-1 h-3 w-3" />
										{:else}<Plus class="mr-1 h-3 w-3" />
										{/if}
										{btn.label}
									</Button>
								{/each}
							</div>
						{:else if card.trend}
							<div class="flex items-center text-sm">
								<TrendingUp class="mr-1 h-3 w-3 text-green-600" />
								<span class="font-medium text-green-600">{card.trend.value}</span>
								<span class="ml-1 text-gray-500">{card.trend.text}</span>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<!-- Column B: 70% width -->
		<div class="w-[70%]">
			<Card.Root class="h-full p-0">
				<Card.Content class="flex h-full p-2">
					<!-- Left section: 40% -->
					<div class=" mb-5 w-[40%] border-r border-gray-200 p-3">
						{#each expenseData as expense, i}
							<div class={i > 0 ? 'border-t border-gray-200 p-2' : 'mb-6'}>
								<div class="mb-2 flex items-center justify-between">
									<h3 class="text-sm text-gray-500">{expense.title}</h3>
									<div class="flex h-6 w-6 items-center justify-center rounded-lg bg-red-100">
										<TrendingDown class="h-3 w-3 text-red-600" />
									</div>
								</div>
								<div class="mb-1 text-2xl font-bold text-gray-900">{expense.value}</div>
								<div class="flex items-center text-sm">
									<TrendingDown class="mr-1 h-3 w-3 text-red-600" />
									<span class="font-medium text-red-600">{expense.trend}</span>
									<span class="ml-1 text-gray-500">from last weeks</span>
								</div>
							</div>
						{/each}
					</div>

					<!-- Right section: 60% -->
					<div class="w-[60%] p-3">
						<!-- Claims Budget Limit -->
						<div class="mb-2 flex items-center justify-between">
							<h3 class="text-sm text-gray-500">Claims Budget Limit</h3>
							<div class="flex items-center space-x-2">
								<span class="text-xs text-gray-400">Monthly</span>
								<ChevronDown class="h-4 w-4 text-gray-400" />
							</div>
						</div>
						<div class="mb-1 text-2xl font-bold text-gray-900">₦2,456,000</div>
						<div class="mb-3 text-sm text-gray-500">used from ₦10,000,000</div>

						<!-- Progress Bar -->
						<div class="mb-3">
							<Progress value={25} class="h-3" />
						</div>

						<!-- Divider -->
						<div class="border-t border-gray-200"></div>

						<!-- Claims Analytics -->
						<div class="pt-3">
							<div class="mb-2 flex items-center justify-between">
								<h3 class="text-sm text-gray-500">Claims Analytics</h3>
								<div class="flex items-center space-x-2">
									<span class="text-xs text-gray-400">Monthly</span>
									<ChevronDown class="h-4 w-4 text-gray-400" />
								</div>
							</div>
							<div class="mb-2 flex space-x-1">
								<div class="h-3 w-20 rounded-full bg-pink-400"></div>
								<div class="h-3 w-20 rounded-full bg-purple-400"></div>
								<div class="h-3 w-12 rounded-full bg-blue-400"></div>
							</div>
							<div class="flex items-center justify-between text-xs">
								<div class="flex items-center space-x-1">
									<div class="h-2 w-2 rounded-full bg-pink-400"></div>
									<span class="text-gray-600">Inpatient</span>
								</div>
								<div class="flex items-center space-x-1">
									<div class="h-2 w-2 rounded-full bg-purple-400"></div>
									<span class="text-gray-600">Outpatient</span>
								</div>
								<div class="flex items-center space-x-1">
									<div class="h-2 w-2 rounded-full bg-blue-400"></div>
									<span class="text-gray-600">Emergency</span>
								</div>
							</div>
							<div
								class="mt-1 flex items-center justify-between text-xs font-semibold text-gray-900"
							>
								<span>₦1,200,000</span>
								<span>₦800,000</span>
								<span>₦456,000</span>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>

	<!-- Facility Cards -->
	<div class="space-y-3">
		{#each data.facilities as facility}
			{@render facilityCard(facility)}
		{/each}
	</div>
</div>

<!-- Message Sheet -->
<Sheet.Root
	open={selectedFacility !== null}
	onOpenChange={(open) => !open && (selectedFacility = null)}
>
	<Sheet.Content side="right" class="w-[400px] sm:w-[540px]">
		<Sheet.Header>
			<div class="flex items-center gap-4 pb-4">
				<div
					class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white"
				>
					<img
						src={selectedFacility?.logoUrl ||
							'https://via.placeholder.com/48x48/e5e7eb/6b7280?text=H'}
						alt="{selectedFacility?.hospitalName || 'Hospital'} logo"
						class="h-12 w-12 object-contain"
						onerror={(e) => {
							const target = e.target as HTMLImageElement;
							if (target) target.src = 'https://via.placeholder.com/48x48/e5e7eb/6b7280?text=H';
						}}
					/>
				</div>
				<div class="flex-1">
					<Sheet.Title class="text-xl font-semibold">{selectedFacility?.hospitalName}</Sheet.Title>
					<div class="mt-1 flex items-center gap-2">
						<div class="flex items-center">
							<span class="text-sm text-yellow-500">★★★★★</span>
							<span class="ml-1 text-sm text-gray-600">4.8</span>
						</div>
					</div>
					<Sheet.Description class="mt-2 text-sm text-gray-600">
						Send a message to {selectedFacility?.hospitalName} ({selectedFacility?.hospitalCode})
					</Sheet.Description>
				</div>
			</div>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 px-4 py-6">
			<div class="grid gap-3">
				<Label for="facility" class="text-left">Facility</Label>
				<Select.Root type="single" name="messageFacility" bind:value={selectedMessageFacility}>
					<Select.Trigger class="w-full">
						{facilityTriggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Select Facility</Select.Label>
							{#each data.facilities as facility (facility.id)}
								<Select.Item value={facility.id} label={facility.hospitalName}>
									{facility.hospitalName}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-3">
				<Label for="message" class="text-left">Message</Label>
				<Textarea
					id="message"
					bind:value={message}
					placeholder="Type your message here..."
					class="min-h-[200px] resize-none text-3xl"
				/>
			</div>
		</div>
		<Sheet.Footer>
			<Button
				onclick={() => {
					message = '';
					selectedMessageFacility = '';
					selectedFacility = null;
				}}
				class="group flex items-center justify-between rounded-full bg-blue-600 py-6 text-white transition-all duration-500 hover:bg-blue-700"
			>
				<div class="relative h-6 flex-1 overflow-hidden text-center">
					<span
						class="absolute inset-0 flex items-center justify-center opacity-100 transition-transform duration-500 ease-in-out group-hover:-translate-y-full group-hover:opacity-0"
						>SEND A MESSAGE</span
					>
					<span
						class="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition-transform duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100"
						>SEND A MESSAGE</span
					>
				</div>
				<div class="relative h-8 w-8 overflow-hidden rounded-full">
					<div
						class="absolute inset-0 flex items-center justify-center rounded-full bg-white opacity-100 transition-all duration-500 ease-in-out group-hover:translate-x-full group-hover:opacity-0"
					>
						<Send class="h-4 w-4 text-blue-600" />
					</div>
					<div
						class="absolute inset-0 flex -translate-x-full items-center justify-center rounded-full border-2 border-white bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100"
					>
						<Send class="h-4 w-4 text-white" />
					</div>
				</div>
			</Button>
			<Sheet.Close class={buttonVariants({ variant: 'outline' }) + ' rounded-full px-5 py-6'}
				>Cancel</Sheet.Close
			>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
