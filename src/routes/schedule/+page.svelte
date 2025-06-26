<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Calendar as CalendarIcon } from '@lucide/svelte';
	import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { TimeRangePicker } from '$lib/components/ui/time-range-picker/index.js';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const doctors = [
		{ value: 'hospital-1', label: 'Hospital 1' },
		{ value: 'hospital-2', label: 'Hospital 2' },
		{ value: 'hospital-3', label: 'Hospital 3' },
		{ value: 'hospital-4', label: 'Hospital 4' },
		{ value: 'hospital-5', label: 'Hospital 5' }
	];

	let selectedHospital = $state('');
	let selectedDate = $state<DateValue | undefined>(today(getLocalTimeZone()));
	let contentRef = $state<HTMLElement | null>(null);

	// Time picker state variables
	let startHour = $state('9');
	let startMinute = $state('00');
	let startSecond = $state('00');
	let startAMPM = $state('AM');

	const triggerContent = $derived(
		doctors.find((d) => d.value === selectedHospital)?.label ?? 'Select a doctor'
	);
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-[#f8fafc] p-4">
	<Card.Root class="flex w-full max-w-6xl overflow-hidden rounded-tl-3xl rounded-bl-3xl shadow-lg">
		<Card.Content class="flex w-full flex-row p-0">
			<!-- Left: Appointment Form (3/5 width) -->
			<div class="flex w-full flex-col px-12 py-10 md:w-3/5">
				<!-- Logo and Welcome -->
				<div class="mb-10 flex items-center gap-3">
					<h1 class="border-blue-300 p-2 text-2xl font-bold">
						Heal<span class="text-blue-500">Pro.</span>
					</h1>
				</div>

				<Card.Header class="mb-6 p-0">
					<Card.Title class="flex items-center gap-2 text-4xl font-light">Hello !</Card.Title>
					<Card.Description class="text-base">
						Get an appointment in less than a minute ...
					</Card.Description>
				</Card.Header>

				<!-- Doctor select -->
				<div class="mb-6 space-y-2">
					<Label for="doctor" class="text-base">Hospital</Label>
					<Select.Root type="single" name="doctor" bind:value={selectedHospital}>
						<Select.Trigger class="w-full bg-gray-50">
							<div class="flex items-center gap-2">
								{triggerContent}
							</div>
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Available Hospital</Select.Label>
								{#each doctors as doctor (doctor.value)}
									<Select.Item value={doctor.value} label={doctor.label}>
										<span>{doctor.label}</span>
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Reason and Comments -->
				<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="reason" class="text-base">Reason for appointment</Label>
						<Textarea id="reason" placeholder="ex: Annual monthly check-up" class="bg-gray-50" />
					</div>
					<div class="space-y-2">
						<Label for="comments" class="text-base">Additional comments/notes</Label>
						<Textarea
							id="comments"
							placeholder="ex: Prefer afternoon appointments, if possible"
							class="bg-gray-50"
						/>
					</div>
				</div>

				<!-- Appointment Date and Time -->
				<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="date" class="text-base">Expected appointment date</Label>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({
										variant: 'outline',
										class: 'w-full justify-start bg-white text-left font-normal'
									}),
									!selectedDate && 'text-muted-foreground'
								)}
							>
								<CalendarIcon class="mr-2 h-4 w-4 text-gray-400" />
								{selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : 'Pick a date'}
							</Popover.Trigger>
							<Popover.Content bind:ref={contentRef} class="w-auto p-0">
								<Calendar
									type="single"
									bind:value={selectedDate}
									minValue={today(getLocalTimeZone())}
								/>
							</Popover.Content>
						</Popover.Root>
					</div>
					<div class="space-y-2">
						<Label for="time" class="text-base">Appointment time</Label>
						<div class="flex items-center">
							<TimeRangePicker bind:startHour bind:startMinute bind:startSecond bind:startAMPM />
						</div>
					</div>
				</div>
				<Button
					type="submit"
					class="w-full bg-blue-500 py-4 text-base font-semibold hover:bg-blue-600"
				>
					Book Appointment
				</Button>
			</div>
			<!-- Right: Illustration (2/5 width) -->
			<div class="hidden w-2/5 md:block">
				<img
					src="schedule.jpg"
					alt="Medical background"
					width="1920"
					height="1080"
					class="h-full w-full object-cover"
				/>
			</div>
		</Card.Content>
	</Card.Root>
</div>
