<script lang="ts">
	import { Search, UserCircle, Calendar, Clock }  from '@lucide/svelte';

	// Define the steps array
	const steps = [
		{
			icon: Search,
			title: 'Search Doctor',
			desc: 'Search by need, location, expertise. Thousands of trusted professionals, personalized care at your fingertips, book in minutes, be seen on time.'
		},
		{
			icon: UserCircle,
			title: 'Check Doctor Profile',
			desc: "Explore our trusted doctors' profiles to learn more about their expertise, experience and commitment to providing exceptional care."
		},
		{
			icon: Calendar,
			title: 'Schedule Appointment',
			desc: 'Schedule appointments in just a few taps, choose your doctor, date, and time, no long waits, no stress. Instant confirmations, real-time slots.'
		},
		{
			icon: Calendar,
			title: 'Schedule Appointment',
			desc: 'Schedule appointments in just a few taps, choose your doctor, date, and time, no long waits, no stress. Instant confirmations, real-time slots.'
		}
	];
</script>

<section id="process" class="mx-auto w-full max-w-6xl bg-white px-2 py-12 md:px-8">
	<!-- Section Heading -->
	<div class="mb-8 text-center">
		<div class="mb-2 text-base font-semibold text-blue-600">How It Works</div>
		<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">
			Our Process Simple Steps to Follow
		</h2>
		<p class="mx-auto max-w-2xl text-base text-gray-500">
			Our process is designed to be simple and stress-free with easy steps to follow, we guide you
			every step of the way no confusion, just a clear path to success we make sure you're
			comfortable and informed throughout
		</p>
	</div>

	<!-- Steps and Opening Hours -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<!-- Steps Cards (span 2 columns on desktop) -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-2">
			{#each steps as step}
				<div class="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-6 shadow">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600"
					>
						<step.icon size={24} strokeWidth={1.5} />
					</div>
					<h3 class="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
					<p class="mt-2 text-sm text-gray-500">{step.desc}</p>
				</div>
			{/each}
		</div>
		<!-- Opening Hours Card -->
		<div class="flex h-full flex-col justify-between rounded-xl bg-blue-600 p-6 text-white shadow">
			<div>
				<h3 class="mb-2 text-xl font-semibold">Opening Hours</h3>
				<p class="mb-6 text-sm text-blue-100">
					Explore our opening hours and choose a time that fits your schedule best whether it's
					early in the day or later in the evening, we're here to offer the care and support you
					need whenever you need it most.
				</p>
				<div class="mb-4">
					<div class="flex items-center justify-between border-b border-blue-400 py-2">
						<span>Mon-Fri</span>
						<span class="flex items-center gap-1">
							<Clock class="h-4 w-4 text-blue-200" />
							6am-10pm
						</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span>Sat-Sun</span>
						<span class="flex items-center gap-1">
							<Clock class="h-4 w-4 text-blue-200" />
							7am-10pm
						</span>
					</div>
				</div>
			</div>

			<button
				class="mt-4 flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
			>
				<Calendar class="mr-2 h-5 w-5" />
				Book Appointment
			</button>
		</div>
	</div>
</section>

