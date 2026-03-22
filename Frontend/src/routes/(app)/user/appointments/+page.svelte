<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Clock as Clock2Icon, Calendar as CalendarIcon, Activity } from 'lucide-svelte';
	import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import LoginDialog from '$lib/components/LoginDialog.svelte';
	import { toast } from 'svelte-sonner';

	import { createAppointment } from '$lib/api';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let { data } = $props();

	const {
		locations,
		facilitiesByLocation,
		isAuthenticated
	}: {
		locations: { value: string; label: string }[];
		facilitiesByLocation: Record<string, { value: string; label: string }[]>;
		isAuthenticated: boolean;
	} = data;

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
		locations.find((l) => l.value === selectedLocation)?.label ?? 'Select a state'
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

<div class="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
	<Card.Root
		class="flex w-full flex-col rounded-2xl bg-gradient-to-b from-blue-200/60 via-white/40 to-white px-12 py-8 shadow-2xl md:w-[50%]"
	>
		<!-- Header Section -->
		<div class="mb-2 flex items-center justify-between">
			<div class="rounded-full border-2 border-gray-200 p-1.5">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600"
				>
					<Activity class="h-4 w-4 text-white" />
				</div>
			</div>
			<div class="flex gap-2">
				<div class="h-1 w-8 rounded-full bg-blue-900"></div>
				<div class="h-1 w-8 rounded-full bg-gray-400"></div>
				<div class="h-1 w-8 rounded-full bg-gray-400"></div>
			</div>
		</div>

		<div class="mb-2 space-y-2">
			<p class="max-w-fit rounded-full border-2 border-blue-600 p-1 px-4 text-base text-blue-600">
				hello
			</p>
			<h1 class="text-3xl font-bold text-gray-900">Book Appointment</h1>
			<p class="text-base text-gray-500">Get an appointment in less than a minute.</p>
			<div class="mt-3 h-px w-full bg-gray-300"></div>
		</div>

		<!-- Location and Facility select -->
		<div class="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="space-y-2">
				<Label for="location" class="text-base {validationErrors.location ? 'text-red-500' : ''}"
					>State</Label
				>
				<Select.Root type="single" name="location" bind:value={selectedLocation}>
					<Select.Trigger
						class="w-full bg-gray-50 {validationErrors.location
							? 'border-red-500 ring-red-500 focus:ring-red-500'
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
				<Label for="facility" class="text-base {validationErrors.facility ? 'text-red-500' : ''}"
					>Health Facility</Label
				>
				<Select.Root type="single" name="facility" bind:value={selectedFacility}>
					<Select.Trigger
						class="w-full bg-gray-50 {validationErrors.facility
							? 'border-red-500 ring-red-500 focus:ring-red-500'
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
		<div class="mb-2 grid grid-cols-1 gap-4 md:grid-cols-1">
			<div class="space-y-2">
				<Label for="reason" class="text-base {validationErrors.reason ? 'text-red-500' : ''}"
					>Reason for appointment</Label
				>
				<Textarea
					id="reason"
					bind:value={reason}
					placeholder="ex: Annual monthly check-up"
					class="bg-gray-50 {validationErrors.reason
						? 'border-red-500 focus-visible:ring-red-500'
						: ''}"
				/>
			</div>
			<div class="space-y-2">
				<Label for="comments" class="text-base">Additional comments/notes</Label>
				<Textarea
					id="comments"
					bind:value={comments}
					placeholder="ex: Prefer afternoon appointments, if possible"
					class="bg-gray-50"
				/>
			</div>
		</div>

		<!-- Appointment Date and Time -->
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="space-y-2">
				<Label for="date" class="text-base {validationErrors.date ? 'text-red-500' : ''}"
					>Expected appointment date</Label
				>
				<Popover.Root>
					<Popover.Trigger
						class={cn(
							buttonVariants({
								variant: 'outline',
								class: 'w-full justify-start text-left font-normal'
							}),
							!value && 'text-muted-foreground',
							validationErrors.date && 'border-red-500 ring-red-500 focus:ring-red-500'
						)}
					>
						<CalendarIcon class="mr-2 h-4 w-4" />
						{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
					</Popover.Trigger>
					<Popover.Content bind:ref={contentRef} class="w-auto p-0">
						<Calendar type="single" bind:value minValue={today(getLocalTimeZone())} />
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="space-y-2">
				<Label for="time-from" class="text-base {validationErrors.time ? 'text-red-500' : ''}"
					>Time</Label
				>
				<div class="relative flex w-full items-center gap-2">
					<Clock2Icon
						class="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none"
					/>
					<Input
						id="time-from"
						type="time"
						step="1"
						bind:value={time}
						class="appearance-none pl-8 {validationErrors.time
							? 'border-red-500 focus-visible:ring-red-500'
							: ''}"
					/>
				</div>
			</div>
		</div>
		<!-- Submit Button -->
		<Button
			onclick={handleSubmit}
			disabled={isLoading}
			class="mt-4 flex w-full items-center justify-center rounded-full bg-blue-600 py-6 text-base font-bold text-white transition-all duration-300 hover:bg-blue-700"
		>
			{isLoading ? 'Submitting...' : 'Submit'}
			<CalendarIcon class="ml-2 h-4 w-4" />
		</Button>
	</Card.Root>
</div>

<LoginDialog bind:open={showLoginDialog} />
