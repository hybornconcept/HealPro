<script lang="ts">
	import type { PageData } from './$types';
	import { ArrowLeft, Search, FileText, Mail, CreditCard, ChevronDown } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');

	interface Claim {
		id: string;
		claimNumber: string;
		patientName: string;
		claimType: string;
		amount: number;
		status: 'Approved';
		date: string;
		dueDate: string;
		isPaid: boolean;
		enrolleeId: string;
		plan: 'Gold' | 'Silver' | 'Platinum';
		clientId: string;
		provider: string;
		services: Array<{
			description: string;
			units: number;
			price: number;
			amount: number;
		}>;
		patientInfo: {
			address: string;
			phone: string;
			email: string;
			policyNumber: string;
		};
	}

	let selectedClaim: Claim = $state(data.claims[0]);
	let isTransitioning = $state(false);

	function selectClaim(claim: Claim) {
		if (claim.id === selectedClaim.id) return;

		isTransitioning = true;
		setTimeout(() => {
			selectedClaim = claim;
			isTransitioning = false;
		}, 150);
	}

	function getStatusColor(_status: string) {
		return 'bg-green-500';
	}

	// Filter claims based on search term
	const filteredClaims = $derived(() => {
		if (!searchTerm.trim()) return data.claims;

		const term = searchTerm.toLowerCase();
		return data.claims.filter(
			(claim) =>
				claim.claimNumber.toLowerCase().includes(term) ||
				claim.patientName.toLowerCase().includes(term)
		);
	});

	function getClaimStatus(claim: Claim) {
		if (claim.isPaid) return 'Paid';
		return 'Unpaid';
	}

	function getStatusBadgeColor(claim: Claim) {
		if (claim.isPaid) return 'bg-green-500';
		return 'bg-orange-500';
	}

	function getPlanBadgeColor(plan: string) {
		switch (plan) {
			case 'Gold':
				return 'bg-yellow-500';
			case 'Silver':
				return 'bg-gray-500';
			case 'Platinum':
				return 'bg-purple-500';
			default:
				return 'bg-blue-500';
		}
	}
</script>

<div class="min-h-screen bg-gray-50 p-6">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<button class="flex items-center gap-2 text-gray-600 hover:text-gray-800">
					<ArrowLeft size={20} />
					Claims
				</button>
				<h1 class="text-2xl font-semibold text-gray-900">Insurance Claims Management</h1>
			</div>
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2 text-gray-600">
					<span>Preview</span>
					<button
						class="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
					>
						<FileText size={16} />
						PDF
					</button>
					<button
						class="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
					>
						<Mail size={16} />
						Email
					</button>
					<button
						class="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
					>
						<CreditCard size={16} />
						Online Payment
					</button>
				</div>
				<button
					class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					Save Invoice
					<ChevronDown size={16} />
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-10">
			<!-- Left Panel - Form -->
			<div class="space-y-4 rounded-lg bg-gray-50 p-4 lg:col-span-3">
				<!-- Search -->
				<div class="relative">
					<input
						type="text"
						placeholder="Search Claims"
						bind:value={searchTerm}
						class="w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					<div class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
						<Search size={16} />
					</div>
				</div>

				<!-- Claims List -->
				<div class="space-y-2">
					{#each filteredClaims() as claim}
						<button
							class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 transition-colors hover:bg-gray-50 {selectedClaim.id ===
							claim.id
								? 'ring-2 ring-blue-500'
								: ''}"
							onclick={() => selectClaim(claim)}
						>
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full border-1 border-gray-500 bg-white font-extralight text-gray-500"
								>
									{claim.patientName
										.split(' ')
										.map((n) => n.charAt(0))
										.join('')}
								</div>
								<div class="text-left">
									<div class="font-medium text-gray-900">{claim.claimNumber}</div>
									<div class="text-sm text-gray-500">{claim.patientName}</div>
									<div class="text-sm text-gray-500">{claim.enrolleeId}</div>
								</div>
							</div>
							<div class="text-right">
								<div class="text-base font-bold text-gray-500">
									₦{claim.amount.toLocaleString()}
								</div>
								<div class="text-sm text-gray-500">{claim.date}</div>

								<span
									class="inline-block rounded-full px-2 py-1 text-xs font-medium text-white {getPlanBadgeColor(
										claim.plan
									)}"
								>
									{claim.plan}
								</span>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Right Panel - Preview -->
			<div
				class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 shadow-sm lg:col-span-7"
			>
				{#if !isTransitioning}
					<div
						in:slide={{ delay: 150, duration: 150, easing: quintOut, axis: 'x' }}
						out:slide={{ duration: 250, easing: quintOut, axis: 'x' }}
					>
						<!-- Watermark -->
						{#if selectedClaim.isPaid}
							<div
								class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
							>
								<div class="rotate-12 text-[16rem] font-bold text-green-200 opacity-30 select-none">
									PAID
								</div>
							</div>
						{/if}

						<!-- Invoice Header -->
						<div class="mb-8 flex items-start justify-between">
							<div>
								<h2 class="mb-2 text-3xl font-bold text-gray-900">Insurance Claim</h2>
								<p class="text-gray-600">{selectedClaim.claimNumber}</p>
							</div>
							<div class="text-right">
								<h3 class="text-2xl font-bold text-gray-900">{selectedClaim.provider}</h3>
								<div
									class="mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium {getStatusBadgeColor(
										selectedClaim
									)} text-white"
								>
									{getClaimStatus(selectedClaim)}
								</div>
							</div>
						</div>

						<!-- Claim Type and Dates -->
						<div class="mb-8 grid grid-cols-2 gap-8">
							<div>
								<p class="mb-1 text-sm text-gray-600">Claim Type</p>
								<p class="font-medium text-gray-900">{selectedClaim.claimType}</p>
							</div>
							<div class="text-right">
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="mb-1 text-sm text-gray-600">Claim Date</p>
										<p class="font-medium text-gray-900">{selectedClaim.date}</p>
									</div>
									<div>
										<p class="mb-1 text-sm text-gray-600">Due Date</p>
										<p class="font-medium text-gray-900">{selectedClaim.dueDate}</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Provider and Patient -->
						<div class="mb-8 grid grid-cols-2 gap-8">
							<div>
								<p class="mb-2 text-sm text-gray-600">Healthcare Provider</p>
								<div class="space-y-1">
									<p class="font-medium text-gray-900">{selectedClaim.patientInfo.address}</p>
									<p class="text-gray-600">Provider ID: HP-2025-001</p>
									<p class="text-gray-600">provider@healthcare.com</p>
									<p class="text-gray-600">+1 (555) 123-4567</p>
									<p class="text-gray-600">www.healthcareprovider.com</p>
								</div>
							</div>
							<div class="text-right">
								<p class="mb-2 text-sm text-gray-600">Patient</p>
								<div class="space-y-1">
									<p class="font-medium text-gray-900">{selectedClaim.patientName}</p>
									<p class="text-gray-600">Policy: {selectedClaim.patientInfo.policyNumber}</p>
									<p class="text-gray-600">{selectedClaim.patientInfo.email}</p>
									<p class="text-gray-600">{selectedClaim.patientInfo.phone}</p>
								</div>
							</div>
						</div>

						<!-- Medical Services Table -->
						<div class="mb-8">
							<table class="w-full">
								<thead>
									<tr class="border-b border-gray-200">
										<th class="py-3 text-left text-sm font-medium text-gray-600"
											>Service Description</th
										>
										<th class="py-3 text-center text-sm font-medium text-gray-600">Units</th>
										<th class="py-3 text-center text-sm font-medium text-gray-600">Rate</th>
										<th class="py-3 text-center text-sm font-medium text-gray-600">Coverage</th>
										<th class="py-3 text-right text-sm font-medium text-gray-600">Amount</th>
									</tr>
								</thead>
								<tbody>
									{#each selectedClaim.services as service}
										<tr class="border-b border-gray-100">
											<td class="py-4 text-gray-900">{service.description}</td>
											<td class="py-4 text-center text-gray-900">{service.units}</td>
											<td class="py-4 text-center text-gray-900"
												>₦{service.price.toLocaleString()}</td
											>
											<td class="py-4 text-center text-gray-900">100%</td>
											<td class="py-4 text-right text-gray-900"
												>₦{service.amount.toLocaleString()}</td
											>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<!-- Total -->
						<div class="mb-8 flex justify-end">
							<div class="text-right">
								<div class="mb-2 flex items-center justify-between gap-8">
									<span class="font-medium text-gray-900">Total Claim Amount</span>
									<span class="text-xl font-bold text-gray-900"
										>₦{selectedClaim.amount.toLocaleString()}</span
									>
								</div>
							</div>
						</div>

						<!-- Note -->
						<div class="mb-8 rounded-md bg-gray-50 p-4">
							<p class="text-sm text-gray-600">
								<strong>Note:</strong> This claim is subject to policy terms and conditions. Coverage
								is based on your current insurance plan and deductible status.
							</p>
						</div>

						<!-- Insurance Details and Authorization -->
						<div class="grid grid-cols-2 gap-8">
							<div>
								<h4 class="mb-3 font-medium text-gray-900">Insurance Details</h4>
								<div class="space-y-1 text-sm text-gray-600">
									<p>Policy Number: {selectedClaim.patientInfo.policyNumber}</p>
									<p>Group Number: GRP-789456</p>
									<p>Plan Type: {selectedClaim.claimType} Coverage</p>
									<p>Effective Date: Jan 1, 2025</p>
								</div>
							</div>
							<div class="text-right">
								<div class="mb-4">
									<div class="mb-2 ml-auto h-16 w-32 border-b border-gray-300"></div>
									<p class="font-medium text-gray-900">Dr. Sarah Wilson</p>
									<p class="text-sm text-gray-600">Authorized Healthcare Provider</p>
									<p class="text-sm text-gray-600">License: MD-12345</p>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
