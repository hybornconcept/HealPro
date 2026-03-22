<script lang="ts">
	import {
		Search,
		ChevronDown,
		Download,
		Users,
		Star,
		ArrowUp,
		ArrowDown,
		Info,
		User,
		Mail,
		Phone,
		Globe,
		FileText,
		ChevronRight
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import { createRawSnippet } from 'svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		FlexRender,
		createSvelteTable,
		renderComponent,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';

	let { data }: { data: PageData } = $props();

	// Destructure data from server
	const { hmoProfile, stats, clientsData } = data;

	// Contact information items
	const contactItems = [
		{ icon: User, label: 'Contact Person', value: hmoProfile.contactPerson },
		{ icon: Mail, label: 'Email Address', value: hmoProfile.email },
		{ icon: Phone, label: 'Support Line', value: hmoProfile.phone },
		{ icon: Globe, label: 'Official Website', value: hmoProfile.website },
		{ icon: FileText, label: 'License Type', value: hmoProfile.licenseType }
	];

	// Performance metrics
	const performanceMetrics = [
		{ label: 'Response Rate', value: hmoProfile.responseRate, color: 'bg-teal-500' },
		{ label: 'Satisfaction', value: hmoProfile.satisfaction, color: 'bg-blue-500' },
		{ label: 'Claim Speed', value: hmoProfile.claimSpeed, color: 'bg-orange-500' }
	];

	// Client type definition
	type Client = {
		id: number;
		name: string;
		email: string;
		avatar: string;
		policyId: string;
		type: string;
		status: 'Active' | 'Pending' | 'Inactive';
		lastActivity: string;
		color: string;
	};

	const statusColors = {
		Active: 'text-green-600',
		Pending: 'text-yellow-600',
		Inactive: 'text-red-600'
	};

	const statusDots = {
		Active: 'bg-green-500',
		Pending: 'bg-yellow-500',
		Inactive: 'bg-red-500'
	};

	const planBadgeColors = {
		'Gold Plan': 'bg-yellow-50 text-yellow-700 border-yellow-200',
		'Silver Plan': 'bg-gray-50 text-gray-700 border-gray-200',
		Platinum: 'bg-purple-50 text-purple-700 border-purple-200',
		Bronze: 'bg-orange-50 text-orange-700 border-orange-200'
	};

	// DataTable columns
	const columns: ColumnDef<Client>[] = [
		{
			accessorKey: 'name',
			header: 'Client Name',
			cell: ({ row }) => {
				const clientSnippet = createRawSnippet<[{ client: Client }]>((getClient) => {
					const { client } = getClient();
					return {
						render: () => `
              <div class="flex items-center gap-3">
                ${
									client.avatar.startsWith('http')
										? `<img src="${client.avatar}" alt="${client.name}" class="h-10 w-10 rounded-full object-cover" />`
										: `<div class="${client.color} flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white">${client.avatar}</div>`
								}
                <div>
                  <div class="font-medium text-gray-900">${client.name}</div>
                  <div class="text-sm text-gray-500">${client.email}</div>
                </div>
              </div>
            `
					};
				});
				return renderSnippet(clientSnippet, { client: row.original });
			}
		},
		{
			accessorKey: 'policyId',
			header: 'Policy ID',
			cell: ({ row }) => {
				const policySnippet = createRawSnippet<[{ policyId: string }]>((getPolicyId) => {
					const { policyId } = getPolicyId();
					return {
						render: () => `<span class="font-mono text-sm text-blue-600">${policyId}</span>`
					};
				});
				return renderSnippet(policySnippet, { policyId: row.original.policyId });
			}
		},
		{
			accessorKey: 'type',
			header: 'Type',
			cell: ({ row }) => {
				const typeSnippet = createRawSnippet<[{ type: string }]>((getType) => {
					const { type } = getType();
					const colorClass = planBadgeColors[type as keyof typeof planBadgeColors] || '';
					return {
						render: () =>
							`<span class="inline-flex rounded-full border px-3 py-1 text-xs font-medium ${colorClass}">${type}</span>`
					};
				});
				return renderSnippet(typeSnippet, { type: row.original.type });
			}
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const statusSnippet = createRawSnippet<[{ status: string }]>((getStatus) => {
					const { status } = getStatus();
					const dotColor = statusDots[status as keyof typeof statusDots] || 'bg-gray-500';
					const textColor = statusColors[status as keyof typeof statusColors] || 'text-gray-600';
					return {
						render: () => `
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full ${dotColor}"></div>
                <span class="text-sm font-medium ${textColor}">${status}</span>
              </div>
            `
					};
				});
				return renderSnippet(statusSnippet, { status: row.original.status });
			}
		},
		{
			accessorKey: 'lastActivity',
			header: 'Last Activity',
			cell: ({ row }) => {
				const activitySnippet = createRawSnippet<[{ lastActivity: string }]>((getActivity) => {
					const { lastActivity } = getActivity();
					return {
						render: () => `<span class="text-sm text-gray-600">${lastActivity}</span>`
					};
				});
				return renderSnippet(activitySnippet, { lastActivity: row.original.lastActivity });
			}
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: () => {
				const actionsSnippet = createRawSnippet(() => {
					return {
						render: () =>
							`<button class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Actions</button>`
					};
				});
				return renderSnippet(actionsSnippet);
			}
		}
	];

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return clientsData;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		}
	});
</script>

<div class="flex overflow-x-hidden overflow-hidden bg-gray-50">
	<!-- Left Sidebar -->
	<div class="w-[32%] flex-shrink-0 space-y-4 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
		<!-- HMO Profile Card -->
		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<!-- Profile Header - Horizontal Layout -->
			<div class="mb-6 flex items-start gap-4">
				<!-- Avatar/Logo -->
				<div class="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-5xl shadow-lg">
					{hmoProfile.logo}
				</div>
				
				<!-- Info Section -->
				<div class="flex-1">
					<!-- Name with Status Indicator -->
					<div class="mb-1 flex items-center gap-2">
						<h2 class="text-xl font-bold text-gray-900">{hmoProfile.name}</h2>
						<div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
					</div>
					
					<!-- Email -->
					<p class="mb-3 text-sm text-gray-500">{hmoProfile.email}</p>
					
					<!-- Edit Profile Button -->
					<button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
						Edit profile
					</button>
				</div>
			</div>

			<!-- Profile Strength with Expandable -->
			<div class="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
							<Star class="h-4 w-4 text-blue-600" />
						</div>
						<span class="text-sm font-semibold text-gray-900">Profile strength {hmoProfile.profileStrength}%</span>
					</div>
					<ChevronDown class="h-5 w-5 text-gray-400" />
				</div>
				<div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
					<div
						class="h-full rounded-full bg-blue-600 transition-all"
						style="width: {hmoProfile.profileStrength}%"
					></div>
				</div>
			</div>



			<!-- Contact Information -->
			<div class="mb-4 pt-4">
				<h3 class="mb-3 text-sm font-semibold text-gray-900">Contact Information</h3>

				{#snippet contactCard(item: typeof contactItems[0])}
					<div class="flex items-center justify-between rounded-2xl bg-gray-50 p-3 transition-colors hover:bg-gray-100">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
								<svelte:component this={item.icon} class="h-5 w-5" />
							</div>
							<div class="overflow-hidden">
							<p class="truncate text-sm font-semibold text-gray-900">{item.value}</p>
								<p class="text-xs text-gray-500">{item.label}</p>
							</div>
					</div>
					<ChevronRight class="h-4 w-4 flex-shrink-0 text-gray-400" />
				</div>
				{/snippet}

				<div class="space-y-3">
					{#each contactItems as item (item.label)}
						{@render contactCard(item)}
					{/each}
				</div>
			</div>

			<!-- Performance Metrics -->
			<div class="space-y-3 border-t border-gray-100 pt-4">
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-semibold text-gray-900">Performance Metrics</h3>
					<button class="text-gray-400 hover:text-gray-600">
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
							></path>
						</svg>
					</button>
				</div>

				{#snippet metricBar(metric: typeof performanceMetrics[0])}
					<div>
						<div class="mb-1 flex items-center justify-between">
							<span class="text-xs text-gray-600">{metric.label}</span>
							<span class="text-sm font-bold text-gray-900">{metric.value}%</span>
						</div>
						<div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
							<div
								class="h-full rounded-full {metric.color}"
								style="width: {metric.value}%"
							></div>
						</div>
					</div>
				{/snippet}

				<div class="space-y-3">
					{#each performanceMetrics as metric (metric.label)}
						{@render metricBar(metric)}
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1 space-y-4 overflow-y-auto px-2 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
		<!-- Stats Grid -->
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<!-- Left Column: Income & Expenses (Takes 1/3 width) -->
			<div class="space-y-4 lg:col-span-1">
				<!-- Total Income -->
				<div class="relative rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
					<div class="flex items-start justify-between">
						<div>
							<div class="mb-1 text-xs font-medium text-gray-500">Total Income</div>
							<div class="mt-1 text-xl font-bold text-gray-900">$5,200.00</div>
						</div>
						<div class="rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
							+6.5%
						</div>
					</div>
					<div class="mt-3 flex items-center justify-between">
						<div class="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500">
							<ArrowUp class="h-2.5 w-2.5" />
						</div>
						<div class="text-xs text-gray-400">Last Month</div>
					</div>
				</div>

				<!-- Total Expenses -->
				<div class="relative rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
					<div class="flex items-start justify-between">
						<div>
							<div class="mb-1 text-xs font-medium text-gray-500">Total Expenses</div>
							<div class="mt-1 text-xl font-bold text-gray-900">$3,750.90</div>
						</div>
						<div class="rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
							-4.2%
						</div>
					</div>
					<div class="mt-3 flex items-center justify-between">
						<div class="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500">
							<ArrowDown class="h-2.5 w-2.5" />
						</div>
						<div class="text-xs text-gray-400">Last Month</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Revenue (Takes 2/3 width) -->
			<div class="flex flex-col rounded-2xl bg-white p-4 shadow-sm lg:col-span-2">
				<!-- Revenue Header -->
				<div class="mb-3 flex items-center gap-4 border-b border-gray-100 pb-3">
					<div>
						<h3 class="text-base font-bold text-gray-900">Revenue</h3>
						<p class="text-xs text-gray-500">This Month</p>
					</div>
					<div class="h-6 w-px bg-gray-200"></div>
					<div class="text-2xl font-bold text-gray-900">$6,742.40</div>
				</div>

				<!-- Revenue Cards container -->
				<div class="grid flex-1 gap-4 md:grid-cols-2">
					<!-- Savings Graph Card -->
					<div class="rounded-2xl bg-gray-50 p-4">
						<div class="flex h-full flex-col justify-between">
							<div>
								<p class="text-xs font-medium text-gray-500">Total Revenue Savings</p>
								<p class="mt-1 text-xl font-bold text-gray-900">$3,800</p>
								<p class="mt-0.5 text-xs text-gray-400">You're saving more! 💰</p>
							</div>

							<div class="mt-3 flex items-center justify-end">
								<div class="relative">
									<div
										class="absolute -top-5 right-0 rounded-lg bg-gray-900 px-2 py-0.5 text-xs font-bold text-white"
									>
										+12%
									</div>
									<!-- Simple SVG Line Chart -->
									<svg width="100" height="32" viewBox="0 0 120 40" class="opacity-75">
										<path
											d="M0 30 Q 30 35, 60 15 T 120 10"
											fill="none"
											stroke="#4b5563"
											stroke-width="2"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<!-- Available Savings Card (Dark) -->
					<div class="rounded-2xl bg-[#1e293b] p-4 text-white">
						<div class="flex h-full flex-col justify-between">
							<div class="flex items-start justify-between">
								<p class="text-xs font-medium text-gray-300">Available Savings</p>
								<div class="flex h-4 w-4 items-center justify-center rounded-full border border-gray-600 text-xs text-gray-400 hover:bg-gray-700/50 cursor-pointer">
									<Info class="h-2.5 w-2.5" />
								</div>
							</div>

							<div class="mt-4">
								<p class="text-2xl font-bold text-white">$15,600</p>
							</div>

							<div class="mt-3 text-xs leading-relaxed text-gray-400">
								Savings percentage is <span class="font-bold text-green-400">30.4%</span> of total revenue
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Client Roster DataTable -->
		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<div class="mb-6">
				<h2 class="mb-1 text-xl font-bold text-gray-900">Client Roster</h2>
				<p class="text-sm text-gray-500">Manage policies and view client status</p>
			</div>

			<div class="w-full">
				<div class="mb-4 flex items-center gap-3">
					<div class="relative flex-1 max-w-sm">
						<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Search clients..."
							value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
							oninput={(e) => table.getColumn('name')?.setFilterValue(e.currentTarget.value)}
							onchange={(e) => {
								table.getColumn('name')?.setFilterValue(e.currentTarget.value);
							}}
							class="pl-9"
						/>
					</div>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" class="gap-2">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
									</svg>
									All Policy Types
									<ChevronDown class="h-4 w-4" />
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							{#each table
								.getAllColumns()
								.filter((col) => col.getCanHide()) as column (column)}
								<DropdownMenu.CheckboxItem
									class="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
								>
									{column.id}
								</DropdownMenu.CheckboxItem>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
					<Button variant="outline" class="gap-2">
						<Download class="h-4 w-4" />
						Export
					</Button>
				</div>
				<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
					<Table.Root>
						<Table.Header class="bg-gray-50">
							{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
								<Table.Row class="border-b border-gray-200 hover:bg-gray-50">
									{#each headerGroup.headers as header (header.id)}
										<Table.Head class="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
											{#if !header.isPlaceholder}
												<FlexRender
													content={header.column.columnDef.header}
													context={header.getContext()}
												/>
											{/if}
										</Table.Head>
									{/each}
								</Table.Row>
							{/each}
						</Table.Header>
						<Table.Body>
							{#each table.getRowModel().rows as row (row.id)}
								<Table.Row data-state={row.getIsSelected() && 'selected'} class="border-b border-gray-100 transition-colors hover:bg-gray-50">
									{#each row.getVisibleCells() as cell (cell.id)}
										<Table.Cell class="py-4">
											<FlexRender
												content={cell.column.columnDef.cell}
												context={cell.getContext()}
											/>
										</Table.Cell>
									{/each}
								</Table.Row>
							{:else}
								<Table.Row>
									<Table.Cell colspan={columns.length} class="h-24 text-center text-gray-500">
										No results.
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
				<div class="mt-4 flex items-center justify-between text-sm">
					<div class="text-gray-600">
						Showing <span class="font-semibold">{table.getRowModel().rows.length}</span> of <span class="font-semibold">{clientsData.length}</span> clients
					</div>
					<div class="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onclick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onclick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
