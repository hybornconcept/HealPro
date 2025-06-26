<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';
	import { debounce } from '$lib/utils/performance';

	// Lazy load icons to reduce initial bundle
	import { Search } from '@lucide/svelte';
	let MoreHorizontal: any;

	let { data }: { data: PageData } = $props();

	// State for search and filters
	let searchQuery = $state('');
	let selectedTab = $state('All Items');

	// Pagination for better performance
	let currentPage = $state(1);
	let itemsPerPage = $state(10);

	// Filtered and paginated data
	let filteredClaims = $derived.by(() => {
		let filtered = data.macbooks;

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(claim =>
				claim.patientName.toLowerCase().includes(query) ||
				claim.policyNumber.toLowerCase().includes(query) ||
				claim.diagnosis.toLowerCase().includes(query)
			);
		}

		// Apply tab filter
		if (selectedTab === 'Approved') {
			filtered = filtered.filter(claim => claim.claimStatus === 'Approved');
		}

		return filtered;
	});

	let paginatedClaims = $derived.by(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredClaims.slice(start, end);
	});

	let totalPages = $derived.by(() => Math.ceil(filteredClaims.length / itemsPerPage));

	// Debounced search to improve performance
	const debouncedSearch = debounce((value: string) => {
		searchQuery = value;
		currentPage = 1; // Reset to first page on search
	}, 300);

	// Load icons on mount
	onMount(async () => {
		const { MoreHorizontal: MoreHorizontalIcon } = await import('@lucide/svelte');
		MoreHorizontal = MoreHorizontalIcon;
	});

	// Function to get badge variant based on grade
	function getGradeVariant(grade: string) {
		switch (grade) {
			case 'Grade A':
				return 'default'; // Green
			case 'Grade B':
				return 'secondary'; // Yellow/Orange
			case 'Grade C':
				return 'destructive'; // Red
			default:
				return 'outline';
		}
	}

	// Function to get badge color classes
	function getGradeClasses(grade: string) {
		switch (grade) {
			case 'Grade A':
				return 'bg-green-500 text-white hover:bg-green-600';
			case 'Grade B':
				return 'bg-yellow-500 text-white hover:bg-yellow-600';
			case 'Grade C':
				return 'bg-red-500 text-white hover:bg-red-600';
			default:
				return '';
		}
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="mb-8">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<!-- Left: Title and Badge -->
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-semibold text-gray-900">Insurance Claims</h1>
				<Badge class="border-yellow-200 bg-yellow-100 text-yellow-800">Pending Claims</Badge>
			</div>
			<!-- Right: Claim Info -->
			<div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:grid-cols-4 md:gap-x-8 md:gap-y-0">
				<div>
					<div class="mb-1 text-gray-500">Claim ID</div>
					<div class="font-medium text-gray-900">{data.orderInfo.orderId}</div>
				</div>
				<div>
					<div class="mb-1 text-gray-500">Submission Date</div>
					<div class="font-medium text-gray-900">{data.orderInfo.orderTime}</div>
				</div>
				<div>
					<div class="mb-1 text-gray-500">Total Claims</div>
					<div class="font-medium text-gray-900">{data.orderInfo.totalItems}</div>
				</div>
				<div>
					<div class="mb-1 text-gray-500">Total Amount</div>
					<div class="font-medium text-gray-900">{data.orderInfo.totalPrice}</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Search and Actions -->
	<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<!-- Left: Search and Claims list -->
		<div class="flex w-full items-center gap-4 md:w-auto">
			<div class="relative w-full md:w-80">
				<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
				<Input
					oninput={(e) => debouncedSearch(e.currentTarget.value)}
					placeholder="Search for patient or claim"
					class="w-full pl-10"
				/>
			</div>
		</div>
		<!-- Right: Tabs, Actions, Submit claim -->
		<div class="flex w-full items-center gap-4 md:w-auto">
			<div class="flex rounded-lg bg-gray-100 p-1">
				<Button
					variant={selectedTab === 'All Claims' ? 'default' : 'ghost'}
					size="sm"
					class={selectedTab === 'All Claims' ? 'bg-white shadow-sm' : ''}
					onclick={() => (selectedTab = 'All Claims')}
				>
					All Claims
				</Button>
				<Button
					variant={selectedTab === 'Approved' ? 'default' : 'ghost'}
					size="sm"
					class={selectedTab === 'Approved' ? 'bg-white shadow-sm' : ''}
					onclick={() => (selectedTab = 'Approved')}
				>
					Approved
				</Button>
				<Button variant="ghost" size="sm" class="cursor-not-allowed text-gray-400" disabled>
					Invoices
				</Button>
			</div>
			<Select.Root>
				<Select.Trigger class="w-32">
					<span>Actions</span>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="export">Export</Select.Item>
					<Select.Item value="delete">Delete</Select.Item>
					<Select.Item value="duplicate">Duplicate</Select.Item>
				</Select.Content>
			</Select.Root>
			<Button class="min-w-[140px] bg-teal-500 text-white hover:bg-teal-600">Submit claim</Button>
		</div>
	</div>

	<!-- Data Table -->
	<!-- Data Table -->
	<div class="overflow-x-hidden">
		<div class="rounded-lg border border-gray-200 bg-white">
			<Table.Root class="w-full">
				<Table.Header>
					<Table.Row class="bg-gray-50">
						<Table.Head class="w-10">
							<input type="checkbox" class="rounded border-gray-300" />
						</Table.Head>
						<Table.Head class="w-32 text-left font-medium text-gray-700">Patient</Table.Head>
						<Table.Head class="w-28 text-left font-medium text-gray-700">Policy #</Table.Head>
						<Table.Head class="w-36 text-left font-medium text-gray-700">Diagnosis</Table.Head>
						<Table.Head class="w-28 text-left font-medium text-gray-700">Treatment</Table.Head>
						<Table.Head class="w-40 text-left font-medium text-gray-700">Notes</Table.Head>
						<Table.Head class="w-24 text-left font-medium text-gray-700">Amount</Table.Head>
						<Table.Head class="w-28 text-left font-medium text-gray-700">Status</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each paginatedClaims as claim}
						<Table.Row class="border-b border-gray-100 hover:bg-gray-50">
							<!-- Checkbox -->
							<Table.Cell class="w-10 py-4 align-top">
								<input type="checkbox" class="mt-1 rounded border-gray-300" />
							</Table.Cell>
							<!-- Patient Info -->
							<Table.Cell class="w-32 align-top">
								<div class="truncate font-medium text-gray-900">{claim.patientName}</div>
								<div class="mt-1 flex gap-1 text-xs text-gray-500">
									<span>{claim.gender}</span>
									<span>|</span>
									<span>Age: {claim.age}</span>
								</div>
							</Table.Cell>
							<!-- Policy Number -->
							<Table.Cell class="w-28 align-top">
								<div class="truncate text-xs text-gray-700">{claim.policyNumber}</div>
							</Table.Cell>
							<!-- Diagnosis -->
							<Table.Cell class="w-36 align-top">
								<div class="truncate text-xs font-medium text-gray-900">{claim.diagnosis}</div>
								<div class="truncate text-xs text-gray-500">{claim.claimDescription}</div>
							</Table.Cell>
							<!-- Treatment -->
							<Table.Cell class="w-28 align-top">
								<div class="truncate text-xs text-gray-700">{claim.treatment}</div>
							</Table.Cell>
							<!-- Notes -->
							<Table.Cell class="w-40 align-top">
								<div class="truncate text-xs text-gray-700">{claim.notes}</div>
								{#if claim.additionalNotes}
									<div class="truncate text-xs text-gray-400">{claim.additionalNotes}</div>
								{/if}
							</Table.Cell>
							<!-- Amount (Naira) -->
							<Table.Cell class="w-24 align-top">
								<div class="text-xs font-medium text-gray-900">&#8358;{claim.amount}</div>
							</Table.Cell>
							<!-- Status Dropdown -->
							<Table.Cell class="w-28 align-top">
								<Select.Root value={claim.claimStatus}>
									<Select.Trigger class="w-full min-w-[80px]">
										<span>{claim.claimStatus}</span>
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="Approved">Approve</Select.Item>
										<Select.Item value="Rejected">Reject</Select.Item>
										<Select.Item value="Pending">Pending</Select.Item>
									</Select.Content>
								</Select.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Pagination Controls -->
		{#if totalPages > 1}
			<div class="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
				<div class="flex flex-1 justify-between sm:hidden">
					<Button
						variant="outline"
						onclick={() => currentPage = Math.max(1, currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						onclick={() => currentPage = Math.min(totalPages, currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</div>
				<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
					<div>
						<p class="text-sm text-gray-700">
							Showing
							<span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
							to
							<span class="font-medium">{Math.min(currentPage * itemsPerPage, filteredClaims.length)}</span>
							of
							<span class="font-medium">{filteredClaims.length}</span>
							results
						</p>
					</div>
					<div>
						<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
							<Button
								variant="outline"
								size="sm"
								onclick={() => currentPage = Math.max(1, currentPage - 1)}
								disabled={currentPage === 1}
								class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
							>
								Previous
							</Button>

							{#each Array(Math.min(5, totalPages)) as _, i}
								{@const pageNum = i + 1}
								<Button
									variant={currentPage === pageNum ? "default" : "outline"}
									size="sm"
									onclick={() => currentPage = pageNum}
									class="relative inline-flex items-center px-4 py-2 text-sm font-semibold"
								>
									{pageNum}
								</Button>
							{/each}

							<Button
								variant="outline"
								size="sm"
								onclick={() => currentPage = Math.min(totalPages, currentPage + 1)}
								disabled={currentPage === totalPages}
								class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
							>
								Next
							</Button>
						</nav>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
