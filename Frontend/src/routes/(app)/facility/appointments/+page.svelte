<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import { toast } from 'svelte-sonner';
	import {
		ChevronDown,
		TriangleAlert,
		Hourglass,
		Check,
		X,
		Search,
		Lightbulb,
		Calendar as CalendarIcon
	} from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';
	import { type DateValue, DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	// Local state for appointments to allow updates
	let appointments = $state(data.appointments);
	// Active time filter
	let activeRow: string | null = $state(null);
	let searchQuery = $state('');
	let selectedType = $state('All');
	// Date Range Picker State
	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});
	let dateRange = $state({
		start: today(getLocalTimeZone()),
		end: today(getLocalTimeZone()).add({ days: 7 })
	});
	let filteredAppointments = $derived(
		appointments.filter((appointment) => {
			const matchesSearch =
				appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				appointment.id.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesType = selectedType === 'All' || appointment.visitType === selectedType;
			return matchesSearch && matchesType;
		})
	);
	function handleAccept(id: string, time: string, date: string) {
		const index = appointments.findIndex((a) => a.id === id);
		if (index !== -1) {
			appointments[index].status = 'Scheduled';
			toast.success(`You accepted the appointment for ${time} and ${date}`, {
				description: 'We will notify the client.'
			});
			activeRow = null; // Close the expanded row
		}
	}
	function handleReject(id: string, time: string, date: string) {
		const index = appointments.findIndex((a) => a.id === id);
		if (index !== -1) {
			appointments[index].status = 'Cancelled';
			toast.error(`You cancelled the appointment for ${time} and ${date}`, {
				description: 'We will notify the client.'
			});
			activeRow = null; // Close the expanded row
		}
	}
	// Package badge styles
	function getPackageStyle(pkg: string | undefined) {
		switch (pkg) {
			case 'Gold':
				return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
			case 'Platinum':
				return 'bg-slate-800 text-white hover:bg-slate-700';
			case 'Silver':
				return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
			default:
				return 'bg-slate-100 text-slate-700';
		}
	}
</script>

<div class="flex h-full w-full flex-col gap-6 bg-[#F8F9FE] px-12 py-8">
	<!-- Top Section -->
	<div class="flex w-full flex-col gap-6 lg:flex-row">
		<!-- Left Text Section (40%) -->
		<div class="flex w-full justify-center space-y-4 lg:w-[40%]">
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-2">
					<Badge variant="outline" class="border-violet-200 bg-violet-50 text-violet-700">
						<CalendarIcon class="mr-1 h-3 w-3" />
						Upcoming Schedule
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
					<h1 class="text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
						Scheduled <span
							class="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
							>Appointments</span
						>
					</h1>
					<p class="text-md mt-4 leading-relaxed text-slate-500">
						Manage your patient visits efficiently. Never miss a scheduled appointment again with
						our smart tracking system.
					</p>
				</div>
			</div>
		</div>
		<!-- Right Cards Section (60%) -->
		<div class="flex w-full flex-col gap-4 lg:w-[60%]">
			<div class="flex justify-end">
				<Popover.Root>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="outline"
								class="w-[260px] justify-start rounded-full border-slate-200 bg-white pl-4 text-left font-normal hover:bg-slate-50"
							>
								<CalendarIcon class="mr-2 h-4 w-4 text-slate-500" />
								{#if dateRange && dateRange.start}
									{#if dateRange.end}
										{df.format(dateRange.start.toDate(getLocalTimeZone()))} - {df.format(
											dateRange.end.toDate(getLocalTimeZone())
										)}
									{:else}
										{df.format(dateRange.start.toDate(getLocalTimeZone()))}
									{/if}
								{:else}
									<span class="text-slate-500">Pick a date range</span>
								{/if}
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="end">
						<RangeCalendar
							bind:value={dateRange}
							initialFocus
							numberOfMonths={2}
							placeholder={dateRange?.start}
						/>
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
				{#each data.cards as card}
					<div
						class="flex flex-col justify-between rounded-[2rem] p-6 transition-all hover:shadow-md {card.variant ===
						'purple'
							? 'bg-violet-50'
							: card.variant === 'blue'
								? 'bg-blue-50'
								: 'bg-rose-50'}"
					>
						<!-- Header -->
						<div>
							<p class="mb-1 text-xs font-medium text-slate-400">{card.tag}</p>
							<h3 class="mb-1 text-lg font-bold text-slate-900">{card.title}</h3>
							<p class="text-xs text-slate-400">{card.subtitle}</p>
						</div>
						<!-- Stats -->
						<div class="mt-6 flex items-center gap-8">
							<div>
								<p class="text-4xl font-bold text-slate-900">{card.stats[0].value}</p>
								<p class="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
									{card.stats[0].label}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<!-- Bottom Section -->
	<div class="w-full">
		<!-- Recent Payments History -->
		{#snippet statusIcon(status: string)}
			{#if status === 'Scheduled'}
				<div class="rounded-full p-2 ring-1 ring-emerald-500">
					<Check class="h-4 w-4 text-emerald-500" />
				</div>
			{:else if status === 'Pending'}
				<div class="rounded-full p-2 ring-1 ring-amber-500">
					<Hourglass class="h-4 w-4 text-amber-500" />
				</div>
			{:else}
				<div class="rounded-full p-2 ring-1 ring-rose-500">
					<X class="h-4 w-4 text-rose-500" />
				</div>
			{/if}
		{/snippet}

		<div class="mx-auto w-full max-w-full">
			<Card.Root class="w-full overflow-visible border-none bg-transparent px-0 py-2 shadow-none">
				<Card.Header class="flex flex-row items-center justify-between px-6">
					<h2 class="mt-8 text-xl font-bold text-slate-900">Appointments</h2>
					<div class="mt-8 flex items-center gap-4">
						<!-- Search Bar -->
						<div class="relative w-64">
							<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<Input
								type="text"
								placeholder="Search patients..."
								class="rounded-full border-slate-200 bg-white pl-10 focus-visible:ring-violet-500"
								bind:value={searchQuery}
							/>
						</div>
						<!-- Filter Select -->
						<Select.Root type="single" bind:value={selectedType}>
							<Select.Trigger class="w-[180px] rounded-full border-slate-200 bg-white">
								{selectedType}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="All">All Appointments</Select.Item>
								<Select.Item value="Check-up">Check-up</Select.Item>
								<Select.Item value="Follow-up">Follow-up</Select.Item>
								<Select.Item value="Emergency">Emergency</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</Card.Header>
				<div class="flex w-full flex-col gap-3">
					<!-- Header Row -->
					<div class="mb-4 flex w-full items-center px-8 py-2">
						<div class="w-[20%] px-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
							Patient Name
						</div>
						<div class="w-[14%] px-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
							Date
						</div>
						<div class="w-[11%] px-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
							Time
						</div>
						<div class="w-[15%] px-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
							Visit Type
						</div>
						<div class="w-[14%] px-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
							Insurance HMO
						</div>
						<div class="w-[10%] px-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
							Status
						</div>
						<div
							class="w-[6%] px-3 text-right text-sm font-semibold uppercase tracking-wide text-slate-400"
						>
							Actions
						</div>
						<div class="w-[10%]"></div>
					</div>

					<!-- Rows -->
					{#each filteredAppointments as appointment (appointment.id)}
						<div animate:flip={{ duration: 300, easing: cubicInOut }} class="flex flex-col">
							<!-- Card Row -->
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="group flex w-full cursor-pointer items-center rounded-full px-6 py-8 shadow-sm transition-all duration-300 hover:shadow-md {appointment.status ===
								'Scheduled'
									? 'bg-emerald-50'
									: appointment.status === 'Cancelled'
										? 'bg-rose-50'
										: 'bg-white'} {activeRow === appointment.id
									? 'scale-[1.01] shadow-md ring-1 ring-violet-200'
									: ''}"
								onclick={() => (activeRow = activeRow === appointment.id ? null : appointment.id)}
							>
								<!-- Patient Name -->
								<div class="w-[20%] px-3">
									<div class="flex items-center gap-3">
										<Avatar.Root class="h-10 w-10 ring-1 ring-indigo-500 ring-offset-2">
											<Avatar.Fallback class=" text-md font-semibold text-violet-600">
												{appointment.patientName
													.split(' ')
													.map((n) => n[0])
													.join('')
													.substring(0, 2)}
											</Avatar.Fallback>
										</Avatar.Root>
										<div>
											<p
												class="text-md font-semibold text-slate-900 transition-colors group-hover:text-black"
											>
												{appointment.patientName}
											</p>
											<p
												class="text-xs font-semibold text-slate-400 transition-colors group-hover:text-slate-600"
											>
												{appointment.patientId}
											</p>
										</div>
									</div>
								</div>

								<!-- Date -->
								<div
									class="text-md w-[14%] px-3 font-semibold text-slate-600 transition-colors group-hover:text-black"
								>
									{appointment.date}
								</div>

								<!-- Time -->
								<div
									class="text-md w-[11%] px-3 font-semibold text-slate-600 transition-colors group-hover:text-black"
								>
									{appointment.time}
								</div>

								<!-- Visit Type -->
								<div class="w-[15%] px-3">
									<Badge
										variant="outline"
										class="rounded-full border-0 px-4 py-2 text-sm font-medium transition-colors {appointment.visitType ===
										'Emergency'
											? 'bg-rose-50 text-rose-600'
											: 'bg-violet-50 text-violet-600'}"
									>
										{appointment.visitType}
									</Badge>
								</div>

								<!-- HMO -->
								<div
									class="text-md w-[14%] px-3 font-semibold text-slate-600 transition-colors group-hover:text-black"
								>
									{appointment.hmo}
								</div>

								<!-- Status -->
								<div
									class="w-[10%] px-3 text-base font-medium text-slate-600 transition-colors group-hover:text-black"
								>
									<div class="flex items-center gap-2">
										{@render statusIcon(appointment.status)}
										<span class="text-sm">{appointment.status}</span>
									</div>
								</div>

								<!-- Actions -->
								<div class="w-[10%] px-3 text-right">
									<Button
										variant="ghost"
										size="icon"
										class="h-10 w-10 rounded-full  p-0 text-slate-400 ring-2 ring-indigo-200 transition-colors hover:bg-violet-50 hover:text-violet-600"
										onclick={(e) => {
											e.stopPropagation();
											activeRow = activeRow === appointment.id ? null : appointment.id;
										}}
									>
										<ChevronDown
											class="h-4 w-4 text-indigo-800 transition-transform duration-300 {activeRow ===
											appointment.id
												? 'rotate-180'
												: ''}"
										/>
									</Button>
								</div>
								<div class="w-[10%]"></div>
							</div>

							<!-- Expanded Details -->
							{#if activeRow === appointment.id}
								<div
									transition:slide={{ duration: 300, easing: cubicInOut }}
									class="px-8 pb-2 pt-2"
								>
									<div
										class="flex w-full rounded-2xl border border-violet-100 bg-violet-50/50 p-6 shadow-inner"
									>
										<!-- Left: Coverage Details -->
										<div class="flex-1 pr-6">
											<div class="mb-2 flex items-center justify-between">
												<h3 class="text-lg font-bold text-slate-900">
													{appointment.visitType}
												</h3>
												<Badge
													variant="outline"
													class="border-0 px-3 py-1 shadow-none {getPackageStyle(
														appointment.package
													)}"
												>
													{appointment.package}
												</Badge>
											</div>
											<p class="mb-6 text-sm leading-relaxed text-slate-500">
												Patient reported recurring headaches and dizziness over the past two weeks.
												Previous medication showed little improvement. Recommended a full
												neurological examination and blood work to rule out underlying conditions.
												Follow-up required.
											</p>
											<div class="flex gap-12">
												<div>
													<p class="mb-1 text-xs text-slate-400">Assigned</p>
													<p class="text-sm font-medium text-slate-900">
														{appointment.patientName}
													</p>
												</div>
												<div class="border-l border-slate-200 pl-12">
													<p class="mb-1 text-xs text-slate-400">Schedule</p>
													<p class="text-sm font-medium text-slate-900">
														{appointment.date} | {appointment.time}
													</p>
												</div>
											</div>
										</div>
										<!-- Right: Billing Info -->
										<div class="w-64 border-l border-slate-200 pl-6">
											<div class="flex h-full flex-col justify-center text-center">
												<Button
													onclick={() =>
														handleAccept(appointment.id, appointment.time, appointment.date)}
													class="w-full rounded-lg bg-emerald-600 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-700"
												>
													Accept
													<Check class="ml-2 h-4 w-4" />
												</Button>
												<div class="mt-2"></div>
												<Button
													onclick={() =>
														handleReject(appointment.id, appointment.time, appointment.date)}
													class="w-full rounded-lg bg-red-600 text-sm font-bold text-white transition-all duration-300 hover:bg-red-700"
												>
													Reject
													<X class="ml-2 h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</Card.Root>
		</div>
	</div>
</div>
