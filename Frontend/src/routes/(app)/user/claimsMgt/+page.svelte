<script lang="ts">
	import {
		Search,
		ArrowUp,
		ArrowDown,
		Command,
		Hexagon,
		Layers,
		Zap,
		Hourglass,
		Trash2,
		Pencil
	} from 'lucide-svelte';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ButtonGroup } from '$lib/components/ui/button-group/index.js';

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

	import {
		FlexRender,
		createSvelteTable,
		renderComponent
	} from '$lib/components/ui/data-table/index.js';

	let { data } = $props();

	// Greeting Logic
	const date = new Date();
	const hour = date.getHours();
	const greeting = hour >= 18 ? 'Good evening' : hour >= 12 ? 'Good afternoon' : 'Good morning';

	// Data Type
	type Company = {
		id: string;
		name: string;
		domain: string;
		status: 'Customer' | 'Churned';
		aboutTitle: string;
		aboutDesc: string;
		users: string[];
		userCount: number;
		licenseUse: number;
		icon: string;
		iconColor: string;
		iconBg: string;
	};

	const iconMap: Record<string, any> = {
		Command,
		Hexagon,
		Zap,
		Hourglass,
		Layers,
		ArrowUp,
		ArrowDown
	};

	// Columns Definition
	const columns: ColumnDef<Company>[] = [
		{
			id: 'select',
			header: ({ table }) =>
				renderComponent(Checkbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (v) => table.toggleAllPageRowsSelected(!!v),
					'aria-label': 'Select all'
				}),
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (v) => row.toggleSelected(!!v),
					'aria-label': 'Select row'
				}),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'name',
			header: 'Company'
		},
		{
			accessorKey: 'status',
			header: 'Status'
		},
		{
			accessorKey: 'aboutTitle',
			header: 'About'
		},
		{
			accessorKey: 'users',
			header: 'Users'
		},
		{
			accessorKey: 'licenseUse',
			header: 'License use'
		},
		{
			id: 'actions'
		}
	];

	// Table State
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return data.companies;
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
			if (typeof updater === 'function') pagination = updater(pagination);
			else pagination = updater;
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') sorting = updater(sorting);
			else sorting = updater;
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') columnFilters = updater(columnFilters);
			else columnFilters = updater;
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') columnVisibility = updater(columnVisibility);
			else columnVisibility = updater;
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') rowSelection = updater(rowSelection);
			else rowSelection = updater;
		}
	});
</script>

{#snippet companyCell(company: Company)}
	{@const Icon = iconMap[company.icon]}
	<div class="flex items-center gap-3">
		<div class="flex h-10 w-10 items-center justify-center rounded-full {company.iconBg}">
			{#if Icon}
				<Icon class="h-5 w-5 {company.iconColor}" />
			{:else}
				<span class="text-xs text-red-500">?</span>
			{/if}
		</div>
		<div>
			<div class="font-medium text-gray-900">{company.name}</div>
			<div class="text-sm text-gray-500">{company.domain}</div>
		</div>
	</div>
{/snippet}

{#snippet statusCell(status: 'Customer' | 'Churned')}
	<div
		class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {status ===
		'Customer'
			? 'bg-green-50 text-green-700'
			: 'bg-gray-100 text-gray-700'}"
	>
		{status}
	</div>
{/snippet}

{#snippet aboutCell(title: string, desc: string)}
	<div>
		<div class="text-sm font-medium text-gray-900">{title}</div>
		<div class="text-xs text-gray-500">{desc}</div>
	</div>
{/snippet}

{#snippet usersCell(users: string[], count: number)}
	<div class="flex items-center -space-x-2">
		{#each users.slice(0, 4) as user}
			<Avatar.Root class="h-8 w-8 border-2 border-white">
				<Avatar.Image src={user} alt="User" />
				<Avatar.Fallback>U</Avatar.Fallback>
			</Avatar.Root>
		{/each}
		{#if count > 0}
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-xs font-medium text-gray-500"
			>
				+{count}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet licenseCell(value: number)}
	<div class="w-[120px]">
		<Progress {value} class="h-2" />
	</div>
{/snippet}

{#snippet actionsCell(id: string)}
	<div class="flex items-center gap-2">
		<Button variant="ghost" size="icon" class="h-8 w-8 text-gray-500 hover:text-red-600">
			<Trash2 class="h-4 w-4" />
		</Button>
		<Button variant="ghost" size="icon" class="h-8 w-8 text-gray-500 hover:text-blue-600">
			<Pencil class="h-4 w-4" />
		</Button>
	</div>
{/snippet}

<div class="flex min-h-screen w-full flex-col bg-gray-50/50 p-6">
	<div class="mx-auto w-full max-w-7xl space-y-4">
		<!-- top Section -->
		<!-- top Section -->
		<section class="grid grid-cols-1 gap-4 lg:grid-cols-5">
			<!-- greet Section -->
			<div class="flex flex-col gap-2 lg:col-span-2">
				<h1 class="mt-5 text-3xl font-normal tracking-tight text-gray-900">
					Hi franklyn, <span class="font-light italic text-blue-600">{greeting}</span>
				</h1>
				<p class="max-w-md text-lg text-gray-500">
					Here is what is happening with your claims management today
				</p>
			</div>
			<!-- Right Side Section -->
			<div class="flex flex-col gap-4 lg:col-span-3">
				<div class="flex justify-end">
					<ButtonGroup>
						{#each data.buttonGroupData as item}
							<Button variant="outline" class="relative">
								{item.text}
								{#if item.badge}
									<Badge
										class="absolute -right-2 -top-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
										variant="destructive"
									>
										{item.badge}
									</Badge>
								{/if}
							</Button>
						{/each}
					</ButtonGroup>
				</div>

				<div class="grid grid-cols-3 gap-4">
					{#each data.kpiData as card}
						{@const Icon = iconMap[card.changeIcon]}
						<div class="rounded-xl border bg-white p-4 shadow-sm">
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium text-gray-500">{card.title}</span>
								<Badge variant="secondary" class={card.badgeClass}>
									<Icon class="mr-1 h-3 w-3" />
									{card.change}
								</Badge>
							</div>

							<div class="mt-2 flex items-end justify-between">
								<span class="text-2xl font-bold">{card.value}</span>
							</div>
							<div class="mt-2 text-xs {card.footerClass}">{card.footerText}</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Company Table Section -->
		<section class="mt-10 flex flex-col gap-4">
			<!-- Filters and Search -->
			<div class="flex items-end justify-between">
				<div>
					<div class="flex items-center gap-2">
						<h2 class="text-lg font-semibold text-gray-900">Vendor Activity History</h2>
						<Badge
							variant="secondary"
							class="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 hover:bg-purple-50"
						>
							116 Total
						</Badge>
					</div>
					<p class="mt-1 text-sm text-gray-500">
						Here you can track your vendor's performance everyday.
					</p>
				</div>
				<div class="flex items-center gap-3">
					<div class="relative w-64">
						<Input
							placeholder="Search..."
							class="h-10 w-full rounded-full pl-4 pr-10"
							value={table.getColumn('name')?.getFilterValue() as string}
							onchange={(e) => table.getColumn('name')?.setFilterValue(e.currentTarget.value)}
							oninput={(e) => table.getColumn('name')?.setFilterValue(e.currentTarget.value)}
						/>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<Search class="h-4 w-4 text-gray-400" />
						</div>
					</div>
					<Button variant="outline" class="h-10 gap-2 rounded-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-filter"
						>
							<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
						</svg>
						Filter
					</Button>
					<Button class="h-10 gap-2 rounded-full bg-gray-900 hover:bg-gray-800">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-plus"
						>
							<path d="M5 12h14" />
							<path d="M12 5v14" />
						</svg>
						Add Vendor
					</Button>
				</div>
			</div>

			<div class="rounded-md border bg-white">
				<Table.Root>
					<Table.Header class="bg-gray-50">
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row>
								{#each headerGroup.headers as header (header.id)}
									<Table.Head class="[&:has([role=checkbox])]:pl-3">
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
							<Table.Row data-state={row.getIsSelected() && 'selected'}>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell class="[&:has([role=checkbox])]:pl-3">
										{#if cell.column.id === 'name'}
											{@render companyCell(row.original)}
										{:else if cell.column.id === 'status'}
											{@render statusCell(row.original.status)}
										{:else if cell.column.id === 'aboutTitle'}
											{@render aboutCell(row.original.aboutTitle, row.original.aboutDesc)}
										{:else if cell.column.id === 'users'}
											{@render usersCell(row.original.users, row.original.userCount)}
										{:else if cell.column.id === 'licenseUse'}
											{@render licenseCell(row.original.licenseUse)}
										{:else if cell.column.id === 'actions'}
											{@render actionsCell(row.original.id)}
										{:else}
											<FlexRender
												content={cell.column.columnDef.cell}
												context={cell.getContext()}
											/>
										{/if}
									</Table.Cell>
								{/each}
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={columns.length} class="h-24 text-center"
									>No results.</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
			<div
				class="-mt-5 flex items-center justify-end space-x-2 rounded-b-lg bg-white p-2 shadow-lg"
			>
				<div class="text-muted-foreground flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div class="space-x-2">
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
		</section>
	</div>
</div>
