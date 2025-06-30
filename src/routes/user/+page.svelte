<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Mail, MapPin, Phone, Feather, EllipsisVertical, Pill } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	// State for performance optimization
	let isLoaded = $state(false);

	// Lightweight initial data
	const userProfile = {
		name: 'Ludmila Sidorshina',
		email: 'ludmilasidorshina@gmail.com',
		avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
		stats: { past: 5, upcoming: 2 }
	};

	// Type definition for appointments
	interface Appointment {
		date: string;
		type: string;
		time: string;
		comments: string | null;
		payment: { status: string; color: string };
	}

	// Lazy load appointment data
	let appointments = $state<Appointment[]>([]);

	// Load appointments after initial render for better performance
	onMount(() => {
		// Load data immediately for better UX
		appointments = [
			{
				date: '13 Jan, 2022',
				type: 'Regular checkup',
				time: '4.00 pm',
				comments: null,
				payment: { status: 'Pending', color: 'text-orange-500' }
			},
			{
				date: '21 Nov, 2021',
				type: 'Bleaching',
				time: '1.00 pm',
				comments: 'See Comment',
				payment: { status: 'Complete', color: 'text-green-600' }
			},
			{
				date: '12 Sep, 2021',
				type: 'Regular checkup',
				time: '5.00 pm',
				comments: null,
				payment: { status: 'Complete', color: 'text-green-600' }
			},
			{
				date: '19 Aug, 2021',
				type: 'Regular checkup',
				time: '11.00 am',
				comments: 'See Comment',
				payment: { status: 'Complete', color: 'text-green-600' }
			},
			{
				date: '24 Jul, 2021',
				type: 'Bleaching',
				time: '6.00 pm',
				comments: null,
				payment: { status: 'Complete', color: 'text-green-600' }
			}
		];
		isLoaded = true;
	});

	// Optimized filtered appointments - simplified for performance
	const filteredAppointments = $derived(appointments);

	// Tabs for appointment filtering
	const tabs = [
		{ id: 'all', label: 'All Appointment', active: true },
		{ id: 'upcoming', label: 'Upcoming', active: false },
		{ id: 'completed', label: 'Completed', active: false }
	];

	// Doctor contact info
	const contactInfo = [
		{ icon: Phone, label: 'Phone Number', value: '+123-456-7890' },
		{ icon: Mail, label: 'Email', value: 'laurent.blake@example.com' },
		{ icon: MapPin, label: 'Address', value: '456 Elm Street, Cityville, State, 78901' }
	];
</script>

<div
	class="header-poppins flex min-h-screen w-full items-start justify-center gap-8 bg-gray-50 p-6"
>
	<div class="flex w-full max-w-7xl flex-col gap-6">
		<!-- Two-column layout -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
			<!-- Column 1: Main content (75% width) -->
			<div class="flex flex-col gap-6 lg:col-span-3">
				<!-- Main profile card -->
				<Card.Root class="rounded-2xl bg-white p-0 shadow-md">
					<div class="flex w-full flex-col md:flex-row">
						<!-- Left: Profile and stats -->
						<div class="flex w-full flex-col items-center p-8 md:w-1/3">
							<img
								src="https://randomuser.me/api/portraits/women/44.jpg"
								alt="Ludmila Sidorshina"
								class="mb-4 h-20 w-20 rounded-full object-cover"
							/>
							<div class="w-full text-center">
								<h2 class="text-lg font-bold text-gray-800">Ludmila Sidorshina</h2>
								<div class="mb-4 text-sm text-gray-500">ludmilasidorshina@gmail.com</div>
							</div>
							<div class="flex w-full flex-col items-center">
								<div class="mb-2 font-semibold text-gray-800">Appointments</div>
								<div class="flex w-full items-center justify-center">
									<div class="flex flex-1 flex-col items-center">
										<span class="text-2xl font-bold text-gray-800">5</span>
										<span class="text-sm text-gray-500">Past</span>
									</div>
									<div class="mx-4 h-10 w-px bg-gray-200"></div>
									<div class="flex flex-1 flex-col items-center">
										<span class="text-2xl font-bold text-gray-800">2</span>
										<span class="text-sm text-gray-500">Upcoming</span>
									</div>
								</div>
							</div>
							<Button
								class="mt-6 w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
							>
								Send Message
							</Button>
						</div>
						<!-- Vertical divider -->
						<div class="my-8 hidden w-px bg-gray-200 md:block"></div>
						<!-- Right: Details with horizontal lines -->
						<div class="flex-1 p-8 text-sm">
							<!-- Personal Details Header -->
							<div class="col-span-4 mb-4">
								<h2 class="mb-2 text-base font-bold tracking-wide text-gray-700">
									Personal Details
								</h2>
							</div>
							<div class="grid grid-cols-4 gap-x-8 gap-y-2">
								<div>
									<div class="text-gray-400">First Name</div>
									<div class="font-medium text-gray-800">Peter</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">Last Name</div>
									<div class="font-medium text-gray-800">Meogan</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">SN/SSN</div>
									<div class="font-medium text-gray-800">458 19 5642</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">Country of Birth</div>
									<div class="font-medium text-gray-800">United States</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">Gender</div>
									<div class="font-medium text-gray-800">Male</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">Marital Status</div>
									<div class="font-medium text-gray-800">Married</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">Region</div>
									<div class="font-medium text-gray-800">USA</div>
									<hr class="my-2 border-gray-200" />
								</div>

								<div>
									<div class="text-gray-400">DOB</div>
									<div class="font-medium text-gray-800">Jul. 10, 1982</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">Age</div>
									<div class="font-medium text-gray-800">38 Years</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">Occupation</div>
									<div class="font-medium text-gray-800">Architecture</div>
									<hr class="my-2 border-gray-200" />
								</div>
								<div>
									<div class="text-gray-400">Smoker</div>
									<div class="font-medium text-gray-800">No</div>
									<hr class="my-2 border-gray-200" />
								</div>
							</div>
							<!-- Contact Details Header -->
							<div class="col-span-4 mt-8 mb-4">
								<h2 class="mb-2 text-base font-bold tracking-wide text-gray-700">
									Contact Details
								</h2>
							</div>
							<div class="grid grid-cols-4 gap-x-8 gap-y-2">
								<div>
									<div class="text-gray-400">Address</div>
									<div class="font-medium text-gray-800">Crescent</div>
									<hr class="my-2 border-gray-200" />
								</div>

								<div>
									<div class="text-gray-400">Province/State</div>
									<div class="font-medium text-gray-800">California</div>
									<hr class="my-2 border-gray-200" />
								</div>

								<div>
									<div class="text-gray-400">Personal Email</div>
									<div class="font-medium text-gray-800">peter@gmail.com</div>
									<hr class="my-2 border-gray-200" />
								</div>

								<div>
									<div class="text-gray-400">Phone Number</div>
									<div class="font-medium text-gray-800">(949) 853 0552</div>
									<hr class="my-2 border-gray-200" />
								</div>
							</div>
							<!-- Provider Details Header (example, add more fields as needed) -->
							<!--
							<div class="col-span-4 mt-8 mb-4">
								<h2 class="text-base font-bold text-gray-700 tracking-wide mb-2">Provider Details</h2>
							</div>
							<div class="grid grid-cols-4 gap-x-8 gap-y-2">
								...
							</div>
							-->
						</div>
					</div>
				</Card.Root>

				<!-- Appointment Table -->
				<Card.Root class="w-full rounded-2xl bg-white p-6 shadow-md">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="header-poppins text-lg font-bold text-gray-800">Appointment</h2>
						<button class="text-sm font-semibold text-blue-600 hover:underline"
							>+ Add Appointment</button
						>
					</div>

					<!-- Tabs -->
					<div class="nunito flex border-b border-gray-200 text-sm text-gray-500">
						{#each tabs as tab}
							<div
								class="w-1/6 cursor-pointer py-3 font-semibold {tab.active
									? 'border-b-2 border-blue-500 text-blue-600'
									: 'hover:text-blue-600'}"
							>
								{tab.label}
							</div>
						{/each}
					</div>

					<!-- Table -->
					<table class="nunito mt-4 w-full text-sm">
						<thead>
							<tr class="text-left text-gray-500">
								<th class="py-2 font-semibold">Date</th>
								<th class="py-2 font-semibold">Treatment Type</th>
								<th class="py-2 font-semibold">Booking Time</th>
								<th class="py-2 font-semibold">Comments</th>
								<th class="py-2 font-semibold">Payment</th>
								<th class="py-2 font-semibold">Action</th>
							</tr>
						</thead>
						<tbody class="text-gray-700">
							{#if !isLoaded}
								<tr>
									<td colspan="6" class="py-8 text-center text-gray-500">
										<div class="flex items-center justify-center">
											<div
												class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
											></div>
											Loading appointments...
										</div>
									</td>
								</tr>
							{:else}
								{#each filteredAppointments as appointment}
									<tr class="border-b last:border-b-0">
										<td class="py-3">{appointment.date}</td>
										<td>{appointment.type}</td>
										<td>{appointment.time}</td>
										<td>
											{#if appointment.comments}
												<button class="text-blue-600 hover:underline">{appointment.comments}</button
												>
											{:else}
												No Comments
											{/if}
										</td>
										<td class="font-semibold {appointment.payment.color}"
											>{appointment.payment.status}</td
										>
										<td>
											<button class="rounded-full px-2 py-1 hover:bg-gray-100">
												<span class="text-xl">⋯</span>
											</button>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</Card.Root>
			</div>

			<!-- Column 2: Sidebar content (25% width) -->
			<div class="flex flex-col gap-6 lg:col-span-1">
				<!-- Assurance Card -->
				<Card.Root
					class="relative w-full rounded-2xl p-5 shadow-md"
					style="background: linear-gradient(135deg, #1e3cff 0%, #2d6aff 100%); min-height: 140px;"
				>
					<!-- Top Row: Logo and Check -->
					<div class="mb-2 flex items-start justify-between">
						<h2 class="flex items-center gap-2 text-lg font-semibold text-white">
							<Feather class="h-5 w-5" />
							<span> Axa Mansard</span>
						</h2>
						<span class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
							<svg
								class="h-4 w-4 text-white"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</span>
					</div>
					<!-- Card Number -->
					<div class="mt-2 mb-4">
						<div class="mb-1 text-xs font-medium text-white/80">Enrolee ID</div>
						<div class="flex items-center gap-2">
							<span class="text-lg font-semibold tracking-widest text-white md:text-xl"
								>5323 2099 2000</span
							>
							<svg
								class="h-4 w-4 text-white/70"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<rect x="9" y="9" width="13" height="13" rx="2" />
								<rect x="3" y="3" width="13" height="13" rx="2" />
							</svg>
						</div>
					</div>
					<!-- Expiry, CVC, Mastercard -->
					<div class="mt-2 flex items-end justify-between">
						<div>
							<div class="text-xs text-white/80">Exp Date</div>
							<div class="flex items-center gap-2">
								<span class="text-sm font-semibold text-white">05/26</span>
								<svg
									class="h-4 w-4 text-white/70"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
								>
									<rect x="9" y="9" width="13" height="13" rx="2" />
									<rect x="3" y="3" width="13" height="13" rx="2" />
								</svg>
							</div>
						</div>
						<div>
							<div class="text-xs text-white/80">CVC</div>
							<div class="flex items-center gap-2">
								<span class="text-sm font-semibold text-white">•••</span>
								<svg
									class="h-4 w-4 text-white/70"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
								>
									<rect x="9" y="9" width="13" height="13" rx="2" />
									<rect x="3" y="3" width="13" height="13" rx="2" />
								</svg>
							</div>
						</div>
						<div class="flex flex-col items-end">
							<div class="flex items-center gap-1">
								<!-- Mastercard logo -->
								<span class="inline-block h-7 w-7 rounded-full bg-[#ff5f00]"></span>
								<span class="-ml-3 inline-block h-7 w-7 rounded-full bg-[#f9bc15]"></span>
							</div>
							<span class="mt-1 text-xs text-white/80">Platinum</span>
						</div>
					</div>
				</Card.Root>

				<!-- Medications Card -->
				<Card.Root>
					<Card.Header class="flex h-[35px] min-h-0 items-center justify-between border-b pb-1.5">
						<h2 class="text-lg font-semibold">Medications</h2>
						<Pill class="ml-1 h-5 w-5 text-gray-400" />
					</Card.Header>
					<Card.Content class="px-6 py-0">
						<div class="space-y-3">
							<div class="relative flex flex-col gap-1 rounded-xl border bg-white p-4 shadow-sm">
								<div class="text-base font-semibold">Fenofibrate (48mq)</div>
								<div class="text-sm text-gray-500">Take with food every morning.</div>
								<a href="#" class="mt-1 text-xs font-medium text-blue-600"
									>Last Refil 27 Apr, 2020</a
								>
								<button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
									<EllipsisVertical class="h-5 w-5" />
								</button>
							</div>
							<div class="relative flex flex-col gap-1 rounded-xl border bg-white p-4 shadow-sm">
								<div class="text-base font-semibold">Fenofibrate (48mq)</div>
								<div class="text-sm text-gray-500">Take with food every morning.</div>
								<a href="#" class="mt-1 text-xs font-medium text-blue-600"
									>Last Refil 27 Apr, 2020</a
								>
								<button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
									<EllipsisVertical class="h-5 w-5" />
								</button>
							</div>
							<div class="relative flex flex-col gap-1 rounded-xl border bg-white p-4 shadow-sm">
								<div class="text-base font-semibold">Alfuzosin (10mg)</div>
								<div class="text-sm text-gray-500">
									Take 1 with food twice a day, and avoid drinking alcohol for 2 hours after
								</div>
								<a href="#" class="mt-1 text-xs font-medium text-blue-600"
									>Last Refil 27 Apr, 2020</a
								>
								<button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
									<EllipsisVertical class="h-5 w-5" />
								</button>
							</div>
							<div class="relative flex flex-col gap-1 rounded-xl border bg-white p-4 shadow-sm">
								<div class="text-base font-semibold">Dexamethasone (4mg)</div>
								<div class="text-sm text-gray-500">Take 3 tablets, 3 times a day for 7 days</div>
								<a href="#" class="mt-1 text-xs font-medium text-blue-600"
									>Last Refil 27 Apr, 2020</a
								>
								<button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
									<EllipsisVertical class="h-5 w-5" />
								</button>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>
