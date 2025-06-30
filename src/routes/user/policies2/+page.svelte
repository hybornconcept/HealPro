<script lang="ts">
	import { Building2, Car, Umbrella, Briefcase } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-[#f7fafd] px-8 py-6">
	<!-- Header -->
	<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="mb-1 text-2xl font-bold text-gray-900">My Insurance</h1>
			<p class="text-sm text-gray-400">Setup Your Projects Insurance Recruitments</p>
		</div>
		<div class="flex w-full items-center gap-3 md:w-auto">
			<div class="relative flex-1 md:flex-none">
				<input
					type="text"
					placeholder="Quick Search"
					class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-100 focus:outline-none"
				/>
				<svg
					class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</div>
			<button class="relative rounded-full bg-white p-2 shadow hover:bg-gray-100">
				<svg
					class="h-5 w-5 text-gray-400"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
					<circle cx="12" cy="21" r="1"></circle>
				</svg>
				<span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
				></span>
			</button>
		</div>
	</div>

	<!-- Tabs and Actions -->
	<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="flex gap-2">
			<button
				class="rounded-lg border border-blue-600 bg-white px-5 py-2 text-sm font-semibold text-blue-600 shadow"
				>My own</button
			>
			<button
				class="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-500 shadow"
				>Users</button
			>
		</div>
		<div class="flex gap-2">
			<button
				class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				Attachments
			</button>
			<button
				class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<circle cx="18" cy="5" r="3"></circle>
					<circle cx="6" cy="12" r="3"></circle>
					<circle cx="18" cy="19" r="3"></circle>
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
				</svg>
				Share
			</button>
			<button
				class="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow"
			>
				Add Insurance
				<span class="text-lg font-bold">+</span>
			</button>
		</div>
	</div>

	<!-- Insurance List -->
	<div class="flex flex-col gap-5">
		<!-- Insurance Card -->
		<div class="grid grid-cols-1 gap-4">
			<!-- General Liability -->
			<div class="grid grid-cols-5 items-center rounded-xl border bg-white p-5 shadow">
				<div class="col-span-2 flex items-center gap-4">
					<Building2 class="h-8 w-8 rounded-full bg-blue-50 p-1.5 text-blue-400" />
					<div>
						<div class="font-semibold text-gray-800">
							Out Patient Care, General and Specialist Consultation (Nephrologist, Urologist,
							Endocrinologist, etc)
						</div>
						<div class="text-sm text-gray-500">Out-Patient Services</div>
					</div>
				</div>
				<div>
					<div class="text-xs text-gray-400">Total Limit</div>
					<div class="text-lg font-bold text-gray-800">$14,000</div>
					<div class="text-xs text-gray-400">Policy Started: 12-03-2023</div>
					<div class="text-xs text-gray-400">Policy End: 12-09-2023</div>
				</div>
				<div class="flex items-center gap-3">
					<img
						src="https://www.nationwide.com/content/dam/nw/img/logo/nationwide-logo.png"
						alt="Carrier"
						class="h-10 w-10 object-contain"
					/>
					<div>
						<div class="text-xs text-gray-400">Carrier</div>
						<div class="leading-tight font-semibold text-gray-700">Health Insurance</div>
					</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div class="flex items-center gap-2">
						<span class="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
						<span class="text-sm font-semibold text-blue-600">Active</span>
					</div>
					<button class="rounded-lg bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700"
						>View</button
					>
				</div>
			</div>
			<!-- Automobile -->
			<div class="grid grid-cols-5 items-center rounded-xl border bg-white p-5 shadow">
				<div class="col-span-2 flex items-center gap-4">
					<Car class="h-8 w-8 rounded-full bg-green-50 p-1.5 text-green-400" />
					<div>
						<div class="font-semibold text-gray-800">Automobile</div>
						<div class="text-sm text-gray-500">Cameron Williamson</div>
						<div class="text-xs text-gray-400">(480) 555-0103</div>
						<div class="text-xs text-gray-400">Alex@Kingstan.Gamail.Com</div>
					</div>
				</div>
				<div>
					<div class="text-xs text-gray-400">Total Limit</div>
					<div class="text-lg font-bold text-gray-800">$200,000</div>
					<div class="text-xs text-gray-400">Policy Started: 12-03-2023</div>
					<div class="text-xs text-gray-400">Policy End: 12-09-2023</div>
				</div>
				<div class="flex items-center gap-3">
					<img
						src="https://www.nationwide.com/content/dam/nw/img/logo/nationwide-logo.png"
						alt="Carrier"
						class="h-10 w-10 object-contain"
					/>
					<div>
						<div class="text-xs text-gray-400">Carrier</div>
						<div class="leading-tight font-semibold text-gray-700">Health Insurance</div>
					</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div class="flex items-center gap-2">
						<span class="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
						<span class="text-sm font-semibold text-blue-600">Active</span>
					</div>
					<button class="rounded-lg bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700"
						>View</button
					>
				</div>
			</div>
			<!-- Umbrella -->
			<div class="grid grid-cols-5 items-center rounded-xl border bg-white p-5 shadow">
				<div class="col-span-2 flex items-center gap-4">
					<Umbrella class="h-8 w-8 rounded-full bg-yellow-50 p-1.5 text-yellow-400" />
					<div>
						<div class="font-semibold text-gray-800">Umbralla</div>
						<div class="text-sm text-gray-500">Cameron Williamson</div>
						<div class="text-xs text-gray-400">(480) 555-0103</div>
						<div class="text-xs text-gray-400">Alex@Kingstan.Gamail.Com</div>
					</div>
				</div>
				<div>
					<div class="text-xs text-gray-400">Total Limit</div>
					<div class="text-lg font-bold text-gray-800">$9900,000</div>
					<div class="text-xs text-gray-400">Policy Started: 12-03-2023</div>
					<div class="text-xs text-gray-400">Policy End: 12-09-2023</div>
				</div>
				<div class="flex items-center gap-3">
					<img
						src="https://www.nationwide.com/content/dam/nw/img/logo/nationwide-logo.png"
						alt="Carrier"
						class="h-10 w-10 object-contain"
					/>
					<div>
						<div class="text-xs text-gray-400">Carrier</div>
						<div class="leading-tight font-semibold text-gray-700">Health Insurance</div>
					</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div class="flex items-center gap-2">
						<span class="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
						<span class="text-sm font-semibold text-blue-600">Active</span>
					</div>
					<button class="rounded-lg bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700"
						>View</button
					>
				</div>
			</div>
			<!-- Worker compensation -->
			<div class="grid grid-cols-5 items-center rounded-xl border bg-white p-5 shadow">
				<div class="col-span-2 flex items-center gap-4">
					<Briefcase class="h-8 w-8 rounded-full bg-blue-50 p-1.5 text-blue-400" />
					<div>
						<div class="font-semibold text-gray-800">Worker compensation</div>
						<div class="text-sm text-gray-500">Cameron Williamson</div>
						<div class="text-xs text-gray-400">(480) 555-0103</div>
						<div class="text-xs text-gray-400">Alex@Kingstan.Gamail.Com</div>
					</div>
				</div>
				<div>
					<div class="text-xs text-gray-400">Total Limit</div>
					<div class="text-lg font-bold text-gray-800">$9900,000</div>
					<div class="text-xs text-gray-400">Policy Started: 12-03-2023</div>
					<div class="text-xs text-gray-400">Policy End: 12-09-2023</div>
				</div>
				<div class="flex items-center gap-3">
					<img
						src="https://www.nationwide.com/content/dam/nw/img/logo/nationwide-logo.png"
						alt="Carrier"
						class="h-10 w-10 object-contain"
					/>
					<div>
						<div class="text-xs text-gray-400">Carrier</div>
						<div class="leading-tight font-semibold text-gray-700">Health Insurance</div>
					</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div class="flex items-center gap-2">
						<span class="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
						<span class="text-sm font-semibold text-blue-600">Active</span>
					</div>
					<button class="rounded-lg bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700"
						>View</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
