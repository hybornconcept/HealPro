import {
	createSvelteTable,
	renderComponent,
	renderSnippet
} from '$lib/components/ui/data-table/index.js';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import DataTableActions from '$lib/components/DataTableActions.svelte';
import { createRawSnippet } from 'svelte';
import {
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	type ColumnDef,
	type PaginationState,
	type SortingState,
	type ColumnFiltersState,
	type RowSelectionState,
	type VisibilityState
} from '@tanstack/table-core';

export function abbreviateHospital(facility: string): string {
	const abbreviations: { [key: string]: string } = {
		'Lagos University Teaching Hospital': 'LUTH',
		'General Hospital Lagos': 'GH Lagos',
		'National Hospital Abuja': 'NH Abuja'
	};
	return abbreviations[facility] || facility;
}

export function getCoveragePercentage(coverage: string): number {
	const amount = parseInt(coverage.replace(/[₦,]/g, ''));
	return Math.min(Math.round((amount / 150000) * 100), 100);
}

export function getAverage(value: number): string {
	if (value >= 9) return 'Excellent';
	if (value >= 6) return 'Good';
	if (value >= 3) return 'Fair';
	return 'Poor';
}

export function getTextColorByValue(val: number): string {
	if (val <= 2) return 'text-red-600';
	if (val <= 5) return 'text-orange-500';
	if (val <= 8) return 'text-yellow-600';
	return 'text-green-600';
}

export function getRatingColor(val: number): string {
	if (val <= 2) return '#dc2626';
	if (val <= 5) return '#ea580c';
	if (val <= 8) return '#ca8a04';
	return '#16a34a';
}

export function wrapText(text: string): string {
	if (!text) return '';
	if (text.includes(' ')) {
		const [firstWord, ...rest] = text.split(' ');
		return `${firstWord}<br />${rest.join(' ')}`;
	}
	return text;
}

export class UserDashboardState {
	showFeedback = $state(false);
	sheetOpen = $state(false);
	selectedAppointment: any = $state(null);
	activeDetailsTab = $state('personal');
	sliderValues = $state([[0], [0], [0], [0], [0]]);

	pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });
	sorting = $state<SortingState>([]);
	columnFilters = $state<ColumnFiltersState>([]);
	rowSelection = $state<RowSelectionState>({});
	columnVisibility = $state<VisibilityState>({});

	data = $state<any>(null);
	table: any;

	constructor(data: any) {
		this.data = data;
		if (data?.sliders) {
			this.sliderValues = data.sliders.map(() => [0]);
		}

		const self = this;
		this.table = createSvelteTable({
			get data() {
				return self.data?.appointments || [];
			},
			columns: this.getColumns(),
			state: {
				get pagination() {
					return self.pagination;
				},
				get sorting() {
					return self.sorting;
				},
				get columnVisibility() {
					return self.columnVisibility;
				},
				get rowSelection() {
					return self.rowSelection;
				},
				get columnFilters() {
					return self.columnFilters;
				}
			},
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			onPaginationChange: (updater) => {
				if (typeof updater === 'function') {
					this.pagination = updater(this.pagination);
				} else {
					this.pagination = updater;
				}
			},
			onSortingChange: (updater) => {
				if (typeof updater === 'function') {
					this.sorting = updater(this.sorting);
				} else {
					this.sorting = updater;
				}
			},
			onColumnFiltersChange: (updater) => {
				if (typeof updater === 'function') {
					this.columnFilters = updater(this.columnFilters);
				} else {
					this.columnFilters = updater;
				}
			},
			onColumnVisibilityChange: (updater) => {
				if (typeof updater === 'function') {
					this.columnVisibility = updater(this.columnVisibility);
				} else {
					this.columnVisibility = updater;
				}
			},
			onRowSelectionChange: (updater) => {
				if (typeof updater === 'function') {
					this.rowSelection = updater(this.rowSelection);
				} else {
					this.rowSelection = updater;
				}
			}
		});
	}

	getColumns(): ColumnDef<any>[] {
		return [
			{
				id: 'select',
				header: ({ table }) =>
					renderComponent(Checkbox, {
						checked: table.getIsAllPageRowsSelected(),
						indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
						onCheckedChange: (value: any) => table.toggleAllPageRowsSelected(!!value),
						'aria-label': 'Select all'
					}),
				cell: ({ row }) =>
					renderComponent(Checkbox, {
						checked: row.getIsSelected(),
						onCheckedChange: (value: any) => row.toggleSelected(!!value),
						'aria-label': 'Select row'
					}),
				enableSorting: false,
				enableHiding: false
			},
			{
				accessorKey: 'date',
				header: 'Date & Time',
				cell: ({ row }) => {
					const snippet = createRawSnippet<[{ date: string; time: string }]>((params) => {
						const { date, time } = params();
						return {
							render: () =>
								`<div class="flex flex-col"><span class="font-medium text-gray-900">${date}</span><span class="text-sm text-gray-500">${time}</span></div>`
						};
					});
					return renderSnippet(snippet, { date: row.original.date, time: row.original.time });
				}
			},
			{
				accessorKey: 'facility',
				header: 'Facility',
				cell: ({ row }) => {
					const snippet = createRawSnippet<[{ facility: string }]>((params) => {
						const { facility } = params();
						return {
							render: () =>
								`<div class="whitespace-normal break-words">${wrapText(abbreviateHospital(facility))}</div>`
						};
					});
					return renderSnippet(snippet, { facility: row.original.facility });
				}
			},

			{
				accessorKey: 'reason',
				header: 'Reason',
				cell: ({ row }) => {
					const snippet = createRawSnippet<[{ reason: string }]>((params) => {
						const { reason } = params();
						const truncated =
							reason && reason.length > 15 ? reason.slice(0, 15) + '...' : reason || '-';
						return {
							render: () => `<div title="${reason || ''}">${truncated}</div>`
						};
					});
					return renderSnippet(snippet, { reason: row.original.reason });
				}
			},
			{
				accessorKey: 'additionalNotes',
				header: 'Notes',
				cell: ({ row }) => {
					const snippet = createRawSnippet<[{ notes: string }]>((params) => {
						const { notes } = params();
						const truncated =
							notes && notes.length > 15 ? notes.slice(0, 15) + '...' : notes || '-';
						return {
							render: () => `<div title="${notes || ''}">${truncated}</div>`
						};
					});
					return renderSnippet(snippet, { notes: row.original.additionalNotes });
				}
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => {
					const snippet = createRawSnippet<[{ status: string }]>((params) => {
						const { status } = params();
						let colorClass = 'bg-gray-100 text-gray-800';
						if (status === 'completed') colorClass = 'bg-green-100 text-green-800';
						if (status === 'upcoming') colorClass = 'bg-blue-100 text-blue-800';
						if (status === 'pending') colorClass = 'bg-yellow-100 text-yellow-800';

						return {
							render: () =>
								`<div class="capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${status}</div>`
						};
					});
					return renderSnippet(snippet, { status: row.original.status });
				}
			},
			{
				id: 'actions',
				header: 'Feedback',
				cell: ({ row }) => {
					return renderComponent(DataTableActions, {
						appointment: row.original,
						onFeedback: (apt: any) => {
							this.selectedAppointment = apt;
							this.sheetOpen = true;
						}
					});
				}
			}
		];
	}
}
