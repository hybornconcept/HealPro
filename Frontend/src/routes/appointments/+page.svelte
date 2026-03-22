<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import Clock2Icon from '@lucide/svelte/icons/clock-2';
	import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import LoginDialog from '$lib/components/LoginDialog.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { Activity, ArrowRight } from 'lucide-svelte';

	import { createAppointment } from '$lib/api';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let { data }: { data: any } = $props();

	let locations = $state<{ value: string; label: string }[]>([]);
	let facilitiesByLocation = $state<Record<string, { value: string; label: string }[]>>({});
	let isDataLoading = $state(true);
	let isAuthenticated = $derived(data.isAuthenticated);

	$effect(() => {
		Promise.all([
			data.streamed.locations,
			data.streamed.facilitiesByLocation
		])
			.then(([locs, facilities]) => {
				locations = locs;
				facilitiesByLocation = facilities;
			})
			.catch((err) => {
				console.error('Failed to load locations', err);
			})
			.finally(() => {
				isDataLoading = false;
			});
	});

	let showLoginDialog = $state(false);
	let selectedLocation = $state('');
	let selectedFacility = $state('');
	let value = $state<DateValue | undefined>();
	let contentRef = $state<HTMLElement | null>(null);
	let reason = $state('');
	let comments = $state('');
	let time = $state('09:30:00');
	let isLoading = $state(false);
	let validationErrors = $state<Record<string, boolean>>({});

	const locationTriggerContent = $derived(
		isDataLoading
			? 'Loading states...'
			: locations.find((l) => l.value === selectedLocation)?.label ?? 'Select a state'
	);

	const facilityTriggerContent = $derived(
		selectedLocation && facilitiesByLocation[selectedLocation]
			? (facilitiesByLocation[selectedLocation].find((f) => f.value === selectedFacility)?.label ??
					'Select a facility')
			: 'Select a state first'
	);

	const availableFacilities = $derived(
		selectedLocation ? facilitiesByLocation[selectedLocation] || [] : []
	);

	$effect(() => {
		if (selectedLocation) {
			selectedFacility = '';
		}
	});

	async function handleSubmit() {
		if (!data.isAuthenticated) {
			showLoginDialog = true;
			return;
		}

		// Reset errors
		validationErrors = {};

		// Validation
		let hasError = false;
		if (!selectedLocation) {
			validationErrors.location = true;
			hasError = true;
		}
		if (!selectedFacility) {
			validationErrors.facility = true;
			hasError = true;
		}
		if (!value) {
			validationErrors.date = true;
			hasError = true;
		}
		if (!reason) {
			validationErrors.reason = true;
			hasError = true;
		}
		if (!time) {
			validationErrors.time = true;
			hasError = true;
		}

		if (hasError) {
			toast.error('Please fill in all required fields');
			return;
		}

		isLoading = true;
		const date = value!.toDate(getLocalTimeZone());
		const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD

		// Convert 24h time to 12h format with AM/PM for backend validation
		const [hours, minutes] = time.split(':');
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12;
		const formattedTime = `${hour12}:${minutes} ${ampm}`;

		try {
			const result = await createAppointment({
				state: selectedLocation,
				facilityName: selectedFacility,
				reason,
				additionalNotes: comments,
				scheduledDate: formattedDate,
				scheduledTime: formattedTime,
				appointmentType: 'consultation', // Default
				unit: 'General' // Default
			});

			if (result.success) {
				const timestamp = `${df.format(date)} at ${time}`;
				toast.success(`Your appointment for ${timestamp} was submitted successfully`);
				// Reset form
				selectedLocation = '';
				selectedFacility = '';
				value = undefined;
				reason = '';
				comments = '';
				time = '09:30:00';
			} else {
				toast.error(result.error || 'Failed to book appointment');
			}
		} catch (error: any) {
			console.error('Submission error:', error);
			const errorMessage =
				error?.body?.message ||
				error?.body?.error ||
				'An error occurred while booking the appointment';
			toast.error(errorMessage);
		} finally {
			isLoading = false;
		}
	}
</script>

<LoginDialog bind:open={showLoginDialog} />

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>

<div class="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-white px-4 lg:h-screen lg:overflow-hidden lg:justify-end lg:px-0 lg:pr-[5%] py-4">
	<!-- Background Image -->
	<div class="absolute inset-0 z-0 hidden overflow-hidden bg-slate-50 md:block">
		<img
			src="femaledocs.png"
			alt="Background"
			loading="lazy"
			class="h-full w-full object-contain object-left opacity-100 transition-opacity duration-700"
		/>
		<div class="absolute inset-0 bg-black/20"></div>
	</div>

	<!-- Appointment Card -->
	<div class="relative z-10 w-full max-w-2xl px-2 lg:px-4">
		<Card.Root
			class="no-scrollbar border-0 bg-white/80 px-6 py-8 shadow-2xl backdrop-blur-md lg:bg-linear-to-b lg:from-blue-50/90 lg:to-white/95 lg:px-12 lg:max-h-[95vh] lg:overflow-y-auto"
		>
			<Card.Header class="mb-7 p-0">
				<!-- Logo and Welcome -->
				<div class="mb-5 flex items-center gap-1">
					<div class="rounded-full border border-blue-500 p-1.5">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
							<Activity class="h-4 w-4 text-white" />
						</div>
					</div>
					<div>
						<h1 class="p-2 text-2xl font-bold text-gray-900 leading-none">
							Heal<span class="text-blue-500">Pro.</span>
						</h1>
					</div>
				</div>

				<div class="space-y-2 px-1">
					<Card.Title class="text-4xl font-light text-gray-900">Hello!</Card.Title>
					<Card.Description class="text-base text-gray-600">
						Get an appointment in less than a minute ...
					</Card.Description>
				</div>
			</Card.Header>

			<Card.Content class="p-0">
				<!-- Location and Facility select -->
				<div class="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="location" class="text-sm font-semibold text-gray-700 {validationErrors.location ? 'text-red-500' : ''}"
							>State</Label
						>
						<Select.Root type="single" name="location" bind:value={selectedLocation}>
							<Select.Trigger
								class="h-12 w-full border-gray-200 bg-white/50 backdrop-blur-sm {validationErrors.location
									? 'border-red-500 ring-red-500'
									: ''}"
							>
								<div class="flex items-center gap-2">
									{locationTriggerContent}
								</div>
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Available States</Select.Label>
									{#each locations as location (location.value)}
										<Select.Item value={location.value} label={location.label}>
											<span>{location.label}</span>
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2">
						<Label for="facility" class="text-sm font-semibold text-gray-700 {validationErrors.facility ? 'text-red-500' : ''}"
							>Health Facility</Label
						>
						<Select.Root type="single" name="facility" bind:value={selectedFacility}>
							<Select.Trigger
								class="h-12 w-full border-gray-200 bg-white/50 backdrop-blur-sm {validationErrors.facility
									? 'border-red-500 ring-red-500'
									: ''}"
								disabled={!selectedLocation}
							>
								<div class="flex items-center gap-2">
									{facilityTriggerContent}
								</div>
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Available Facilities</Select.Label>
									{#each availableFacilities as facility (facility.value)}
										<Select.Item value={facility.value} label={facility.label}>
											<span>{facility.label}</span>
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				</div>

				<!-- Reason and Comments -->
				<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="reason" class="text-sm font-semibold text-gray-700 {validationErrors.reason ? 'text-red-500' : ''}"
							>Reason for appointment</Label
						>
						<Textarea
							id="reason"
							bind:value={reason}
							placeholder="ex: Annual monthly check-up"
							class="min-h-[100px] border-gray-200 bg-white/50 backdrop-blur-sm {validationErrors.reason
								? 'border-red-500'
								: ''}"
						/>
					</div>
					<div class="space-y-2">
						<Label for="comments" class="text-sm font-semibold text-gray-700">Additional comments</Label>
						<Textarea
							id="comments"
							bind:value={comments}
							placeholder="ex: Prefer afternoon appointments"
							class="min-h-[100px] border-gray-200 bg-white/50 backdrop-blur-sm"
						/>
					</div>
				</div>

				<!-- Appointment Date and Time -->
				<div class="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="date" class="text-sm font-semibold text-gray-700 {validationErrors.date ? 'text-red-500' : ''}"
							>Date of visit</Label
						>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({
										variant: 'outline',
										class: 'h-12 w-full justify-start border-gray-200 bg-white/50 text-left font-normal backdrop-blur-sm'
									}),
									!value && 'text-muted-foreground',
									validationErrors.date && 'border-red-500'
								)}
							>
								<CalendarIcon class="mr-2 h-4 w-4 text-blue-600" />
								{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
							</Popover.Trigger>
							<Popover.Content bind:ref={contentRef} class="w-auto p-0 z-50">
								<Calendar type="single" bind:value minValue={today(getLocalTimeZone())} />
							</Popover.Content>
						</Popover.Root>
					</div>
					<div class="space-y-2">
						<Label for="time-from" class="text-sm font-semibold text-gray-700 {validationErrors.time ? 'text-red-500' : ''}"
							>Preferred Time</Label
						>
						<div class="relative flex w-full items-center">
							<Clock2Icon
								class="pointer-events-none absolute left-3.5 h-4 w-4 select-none text-blue-600 z-20"
							/>
							<Input
								id="time-from"
								type="time"
								step="1"
								bind:value={time}
								class="h-12 w-full appearance-none border-gray-200 bg-white/50 pl-10 backdrop-blur-sm {validationErrors.time
									? 'border-red-500'
									: ''}"
							/>
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<Button
					onclick={handleSubmit}
					disabled={isLoading}
					class="h-14 w-full rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70"
				>
					{#if isLoading}
						<div class="flex items-center gap-2">
							<div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
							Processiing...
						</div>
					{:else}
						Book Appointment
						<ArrowRight class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
					{/if}
				</Button>
			</Card.Content>
		</Card.Root>
	</div>
</div>
