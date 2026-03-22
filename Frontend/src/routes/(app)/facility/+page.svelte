<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { Slider } from '$lib/components/ui/slider';
	import { Switch } from '$lib/components/ui/switch';
	import { slide, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import {
		User,
		Crown,
		HelpCircle,
		ChevronDown,
		Search,
		ArrowRight,
		Users,
		FileText,
		ArrowUpDown,
		RefreshCw,
		Star,
		Activity,
		Calendar,
		Building2,
		ChevronRight,
		Sparkles,
		TrendingUp,
		Briefcase,
		Globe,
		Phone,
		Mail,
		Stethoscope,
		Info,
		ExternalLink,
		Shield,
		Hash,
		CreditCard,
		X,
		Check,
		CalendarDays,
		MessageSquare
	} from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Search state for filtering reviews
	let reviewSearch = $state('');

	// Client directory search
	let clientSearch = $state('');

	// Tab state for right column
	let activeTab: 'ratings' | 'insights' = $state('ratings');

	// Accordion state for profile card
	let isProfileExpanded = $state(false);

	// Hospital Profile Data - From server load or fallback
	const hospital = data.hospital ?? {
		id: 0,
		facilityName: 'No Hospital Found',
		facilityType: '-',
		facilityTier: '-',
		licenseNumber: '-',
		cmdName: '-',
		cmdFolio: '-',
		contactPerson: '-',
		primaryPhone: '-',
		email: '-',
		website: '-',
		address: '-',
		city: '-',
		state: '-',
		operatingHours: '-',
		bedCapacity: 0,
		specialties: [],
		equipment: [],
		verificationStatus: false,
		organizationId: '-',
		taxId: '-',
		bankName: '-',
		accountNumber: '-',
		accountName: '-',
		dates: [
			{ label: 'Member since', day: '--', month: '---', year: '----' },
			{ label: 'Last updated', day: '--', month: '---', year: '----' }
		]
	};

	// Helper to access hospital fields (handles snake_case from DB)
	const h = {
		facility_name: hospital.facilityName ?? hospital.facility_name ?? 'Unknown',
		facility_type: hospital.facilityType ?? hospital.facility_type ?? '-',
		facility_tier: hospital.facilityTier ?? hospital.facility_tier ?? '-',
		license_number: hospital.licenseNumber ?? hospital.license_number ?? '-',
		cmd_name: hospital.cmdName ?? hospital.cmd_name ?? '-',
		cmd_folio: hospital.cmdFolio ?? hospital.cmd_folio ?? '-',
		contact_person: hospital.contactPerson ?? hospital.contact_person ?? '-',
		primary_phone: hospital.primaryPhone ?? hospital.primary_phone ?? '-',
		email: hospital.email ?? '-',
		website: hospital.website ?? '-',
		address: hospital.address ?? '-',
		city: hospital.city ?? '-',
		state: hospital.state ?? '-',
		operating_hours: hospital.operatingHours ?? hospital.operating_hours ?? '-',
		bed_capacity: hospital.bedCapacity ?? hospital.bed_capacity ?? 0,
		specialties: hospital.specialties ?? [],
		equipment: hospital.equipment ?? [],
		verification_status: hospital.verificationStatus ?? hospital.verification_status ?? false,
		dates: hospital.dates ?? [],
		organization_id: hospital.organizationId ?? hospital.organization_id ?? '-',
		tax_id: hospital.taxId ?? hospital.tax_id ?? '-',
		bank_name: hospital.bankName ?? hospital.bank_name ?? '-',
		account_number: hospital.accountNumber ?? hospital.account_number ?? '-',
		account_name: hospital.accountName ?? hospital.account_name ?? '-'
	};

	// Icon map for KPI items (since we can't pass component references from server)
	const iconMap: Record<string, typeof Users> = {
		Users,
		FileText,
		Calendar
	};

	// Get data from server
	const overviewItems = data.overviewItems;
	let clientsState = $state(data.clients.map((c) => ({ ...c })));
	const baseRatingMetrics = data.baseRatingMetrics;
	const patientReviews = data.patientReviews;
	const hmoClients = data.hmoClients;
	const ratingStats = data.ratingStats;
	const insights = data.insights;
	const weeklyData = data.weeklyData;

	// Filtered clients based on search and filters
	let hmoFilter = $state('all');
	let visitTypeFilter = $state('all');

	// Pagination state
	let currentPage = $state(1);
	let itemsPerPage = 5;

	let filteredClients = $derived.by(() => {
		const filtered = clientsState.filter((client) => {
			const matchesSearch =
				clientSearch.trim() === '' ||
				client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
				client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
				client.hmo.toLowerCase().includes(clientSearch.toLowerCase());

			const matchesHmo = hmoFilter === 'all' || client.hmo === hmoFilter;
			const matchesVisitType = visitTypeFilter === 'all' || client.visitType === visitTypeFilter;

			return matchesSearch && matchesHmo && matchesVisitType;
		});
		return filtered;
	});

	let paginatedClients = $derived.by(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredClients.slice(start, end);
	});

	let totalPages = $derived(Math.ceil(filteredClients.length / itemsPerPage));

	function nextPage() {
		if (currentPage < totalPages) currentPage++;
	}

	function prevPage() {
		if (currentPage > 1) currentPage--;
	}

	// Unique HMOs and Visit Types for filters
	let uniqueHmos = $derived([...new Set(clientsState.map((c) => c.hmo))]);
	let uniqueVisitTypes = $derived([...new Set(clientsState.map((c) => c.visitType))]);

	// Helper to get initials from name
	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.substring(0, 2)
			.toUpperCase();
	}

	// Filtered reviews based on search
	let filteredReviews = $derived(
		reviewSearch.trim() === ''
			? patientReviews
			: patientReviews.filter(
					(review) =>
						review.patientName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
						review.department.toLowerCase().includes(reviewSearch.toLowerCase()) ||
						review.comment.toLowerCase().includes(reviewSearch.toLowerCase())
				)
	);

	// Filtered rating metrics based on search
	let filteredRatingMetrics = $derived(() => {
		// If a client is selected, show their specific ratings
		if (selectedClient) {
			const ratings = selectedClient.ratings || [0, 0, 0, 0, 0];
			// Map the client's ratings to the metrics structure
			// Assuming order: Cleanliness, Staff, Wait Time, Care, Overall (matching the 5 metrics usually shown)
			// But baseRatingMetrics has 6 items in the mock data usually (5 stars to 0 stars distribution).
			// Wait, the user page has specific categories: "Cleanliness", "Staff Attitude", "Wait Time", etc.
			// The facility page currently shows "5 stars", "4 stars", etc. distribution.
			// The user wants the facility page to look like the user page "rating hospital service" section.
			// That section has categories like "Cleanliness", "Staff", etc.
			// So I should transform the display to show these categories instead of the star distribution.

			const categories = [
				{ label: 'Cleanliness', value: ratings[0] },
				{ label: 'Staff Attitude', value: ratings[1] },
				{ label: 'Wait Time', value: ratings[2] },
				{ label: 'Medical Care', value: ratings[3] },
				{ label: 'Overall Exp.', value: ratings[4] }
			];

			return categories.map((c) => ({
				label: c.label,
				value: c.value,
				count: c.value, // Reusing count for value to minimize refactor if needed, but we'll use value in template
				percentage: c.value * 10 // Convert 1-10 to percentage
			}));
		}

		// Default aggregate view (mocked averages for now since we don't have real aggregate data for categories)
		return [
			{ label: 'Cleanliness', value: 8.5, percentage: 85 },
			{ label: 'Staff Attitude', value: 9.2, percentage: 92 },
			{ label: 'Wait Time', value: 7.8, percentage: 78 },
			{ label: 'Medical Care', value: 8.9, percentage: 89 },
			{ label: 'Overall Exp.', value: 8.8, percentage: 88 }
		];
	});

	// Selected client for feedback view
	let selectedClient = $state<(typeof clientsState)[0] | null>(null);
	let showReply = $state(false);

	function handleFeedbackClick(client: (typeof clientsState)[0]) {
		selectedClient = client;
		// Reset reply switch when changing client
		showReply = false;
	}
</script>

<div class="flex h-full w-full flex-row items-stretch justify-start gap-6 px-4 py-4">
	<!-- Left Column: Profile, Overview, Staff Directory -->
	<div class="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
		<!-- Provider Profile Card with Accordion -->
		<Card.Root class="overflow-hidden rounded-xl border-none py-0 shadow-sm">
			<Card.Content class="p-0">
				<!-- Header Section -->
				<div class="flex items-start justify-between border-b border-slate-100 p-4">
					<div class="flex gap-4">
						<!-- Avatar Placeholder -->
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
							<Building2 class="h-6 w-6 text-slate-400" />
						</div>

						<!-- Title & Info -->
						<div class="space-y-0.5">
							<div class="flex items-center gap-2">
								<h1 class="text-xl font-bold text-slate-800">{h.facility_name}</h1>
								{#if h.verification_status}
									<div class="flex h-5 w-5 items-center justify-center rounded bg-emerald-100">
										<svg class="h-3 w-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
								{:else}
									<div class="flex h-5 w-5 items-center justify-center rounded bg-yellow-100">
										<Crown class="h-3 w-3 text-yellow-500" />
									</div>
								{/if}
							</div>
							<p class="text-xs text-slate-400">License : {h.license_number}</p>
							<p class="text-xs text-slate-500">
								Chief Medical Director : <span class="font-medium text-slate-700">{h.cmd_name}</span
								>
							</p>
						</div>
					</div>

					<!-- Dates -->
					<div class="flex items-center gap-6">
						{#each h.dates as date, i}
							{#if i > 0}
								<div class="h-8 w-px bg-slate-200"></div>
							{/if}
							<div>
								<p class="text-[9px] font-medium text-slate-400">{date.label}</p>
								<div class="flex items-end gap-1">
									<span class="text-2xl font-bold leading-none text-indigo-200">{date.day}</span>
									<div class="flex flex-col text-[10px] font-semibold leading-tight text-slate-600">
										<span>{date.month}</span>
										<span class="text-slate-400">{date.year}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Body Section - 4 COLUMNS -->
				<div class="grid grid-cols-4 gap-3 p-4">
					<!-- Column 1: Facility Type & Tier -->
					<div class="space-y-3">
						<div>
							<p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
								Facility Type
							</p>
							<p class="text-sm font-medium text-slate-600">{h.facility_type}</p>
						</div>
						<div>
							<p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
								Tier Level
							</p>
							<Badge
								class="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600"
							>
								{h.facility_tier}
							</Badge>
						</div>
					</div>

					<!-- Column 2: Location & Contact -->
					<div class="space-y-3">
						<div>
							<p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
								Location
							</p>
							<p class="text-xs text-slate-500">{h.address}</p>
							<p class="text-xs text-slate-500">{h.city}, {h.state}</p>
						</div>
						<div>
							<p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
								Contact
							</p>
							<p class="text-xs text-slate-500">{h.primary_phone}</p>
							<p class="text-xs text-slate-400">{h.email}</p>
						</div>
					</div>

					<!-- Column 3: CMD & Operations -->
					<div class="space-y-3">
						<div>
							<p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
								CMD Folio Number
							</p>
							<p class="text-sm font-medium text-slate-600">{h.cmd_folio}</p>
						</div>
						<div>
							<p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
								Operating Hours
							</p>
							<Badge
								class="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-600"
							>
								{h.operating_hours}
							</Badge>
						</div>
						<div>
							<p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
								Bed Capacity
							</p>
							<p class="text-sm font-medium text-slate-600">{h.bed_capacity} beds</p>
						</div>
					</div>

					<!-- Column 4: Specialties -->
					<div>
						<p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
							Specialties
						</p>
						<div class="flex flex-wrap gap-1.5">
							{#each h.specialties as specialty}
								<span
									class="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-400"
								>
									{specialty}
								</span>
							{/each}
							{#if h.specialties.length === 0}
								<span class="text-xs text-slate-400">No specialties listed</span>
							{/if}
						</div>
					</div>
				</div>

				<!-- Accordion Expanded Section with smooth slide animation -->
				{#if isProfileExpanded}
					<div
						transition:slide={{ duration: 300, easing: cubicInOut }}
						class="border-t border-slate-100 bg-slate-50/50 p-4"
					>
						<div class="grid grid-cols-3 gap-6">
							<!-- Medical Equipment -->
							<div>
								<div class="mb-3 flex items-center gap-2">
									<Stethoscope class="h-4 w-4 text-indigo-500" />
									<p class="text-xs font-semibold text-slate-700">Medical Equipment</p>
								</div>
								<div class="space-y-1.5">
									{#each h.equipment as equip}
										<div class="flex items-center gap-2 text-xs text-slate-600">
											<div class="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
											{equip}
										</div>
									{/each}
									{#if h.equipment.length === 0}
										<p class="text-xs text-slate-400">No equipment listed</p>
									{/if}
								</div>
							</div>

							<!-- Online Presence (Website only) -->
							<div>
								<div class="mb-3 flex items-center gap-2">
									<Globe class="h-4 w-4 text-indigo-500" />
									<p class="text-xs font-semibold text-slate-700">Online Presence</p>
								</div>
								<div class="space-y-2">
									<div class="flex items-center gap-2 text-xs text-slate-600">
										<Globe class="h-3 w-3 text-slate-400" />
										<a
											href={h.website}
											target="_blank"
											class="text-indigo-600 hover:underline"
											rel="noopener noreferrer"
										>
											{h.website || 'Not provided'}
										</a>
									</div>
								</div>
							</div>

							<!-- Banking Information -->
							<div>
								<div class="mb-3 flex items-center gap-2">
									<Briefcase class="h-4 w-4 text-indigo-500" />
									<p class="text-xs font-semibold text-slate-700">Banking Information</p>
								</div>
								<div class="space-y-2 text-xs text-slate-600">
									<div class="flex justify-between">
										<span class="text-slate-400">Bank Name:</span>
										<span class="font-medium">{h.bank_name}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-400">Account Name:</span>
										<span class="font-medium">{h.account_name}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-400">Account No:</span>
										<span class="font-medium">{h.account_number}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-slate-400">Tax ID:</span>
										<span class="font-medium">{h.tax_id}</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Additional Row: Organization & Compliance Details -->
						<div class="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
							<div class="flex items-center gap-2">
								<div class="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100">
									<Hash class="h-3 w-3 text-violet-600" />
								</div>
								<div>
									<p class="text-[9px] font-medium uppercase text-slate-400">Organization ID</p>
									<p class="text-xs font-semibold text-slate-700">{h.organization_id}</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<div class="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-100">
									<User class="h-3 w-3 text-cyan-600" />
								</div>
								<div>
									<p class="text-[9px] font-medium uppercase text-slate-400">Contact Person</p>
									<p class="text-xs font-semibold text-slate-700">{h.contact_person}</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<div
									class="flex h-6 w-6 items-center justify-center rounded-lg {h.verification_status
										? 'bg-emerald-100'
										: 'bg-amber-100'}"
								>
									{#if h.verification_status}
										<Shield class="h-3 w-3 text-emerald-600" />
									{:else}
										<Info class="h-3 w-3 text-amber-600" />
									{/if}
								</div>
								<div>
									<p class="text-[9px] font-medium uppercase text-slate-400">Status</p>
									<p
										class="text-xs font-semibold {h.verification_status
											? 'text-emerald-600'
											: 'text-amber-600'}"
									>
										{h.verification_status ? 'Verified' : 'Pending'}
									</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Footer Section -->
				<div class="flex items-center justify-between bg-indigo-50 px-4 py-2">
					<div class="flex items-center gap-2">
						<p class="text-sm font-semibold text-indigo-500">
							{h.verification_status ? '✓ Verified Healthcare Provider' : '⏳ Verification Pending'}
							• Contact: {h.contact_person}
						</p>
						<HelpCircle class="h-3.5 w-3.5 text-indigo-400" />
					</div>
					<Button
						variant="outline"
						size="sm"
						class="flex h-8 items-center gap-2 border-indigo-200 text-xs text-indigo-400 transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600"
						onclick={() => (isProfileExpanded = !isProfileExpanded)}
					>
						{isProfileExpanded ? 'Less' : 'More'}
						<span
							class="inline-block transition-transform duration-300"
							class:rotate-180={isProfileExpanded}
						>
							<ChevronDown class="h-3.5 w-3.5" />
						</span>
					</Button>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Provider KPI Section -->
		<div class="w-full">
			<div class="grid grid-cols-3 gap-4">
				{#each overviewItems as item}
					{@const Icon = iconMap[item.iconName]}
					<Card.Root
						class="rounded-none border-0 border-t-2 border-indigo-300 bg-indigo-50/80 py-0 shadow-md"
					>
						<Card.Content class="p-2">
							<div class="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100"
								>
									<Icon class="h-4 w-4 text-violet-600" />
								</div>
								<div class="min-w-0 flex-1">
									<p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">
										{item.label}
									</p>
									<div class="flex items-center gap-1.5">
										<span class="text-lg font-bold text-slate-900">{item.amount}</span>
										<Badge
											class="h-4 rounded-full px-1.5 text-[9px] font-semibold {item.changeColor}"
										>
											{item.change}
										</Badge>
									</div>
								</div>
								<ArrowRight class="h-3.5 w-3.5 shrink-0 text-slate-300" />
							</div>
							<div class="mt-1.5 flex items-center gap-1 px-1 text-[10px]">
								<span class="font-medium text-emerald-600">{item.delta}</span>
								<span class="text-slate-400">{item.deltaText}</span>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</div>

		<!-- Client Feedback Table -->
		<Card.Root class="w-full overflow-hidden rounded-xl bg-white py-3 shadow-sm">
			<Card.Header class="px-3 pb-0 pt-0">
				<!-- Title Row -->
				<div class="flex items-center gap-2">
					<h2 class="p-2 text-lg font-semibold text-slate-900">Client Feedback</h2>
					<Badge
						class="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-600"
					>
						{clientsState.length} Total
					</Badge>
				</div>
				<!-- Search Row -->
				<div class="mb-0 flex items-center justify-between gap-2 px-2">
					<!-- Search Input -->
					<div class="relative w-[220px]">
						<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							type="text"
							placeholder="Search clients..."
							bind:value={clientSearch}
							class="h-8 w-full rounded-lg border-slate-200 bg-slate-50 pl-9 text-sm focus:border-indigo-300 focus:bg-white focus:ring-1 focus:ring-indigo-100"
						/>
					</div>

					<!-- Filters -->
					<div class="flex items-center gap-2">
						<Select.Root type="single" bind:value={hmoFilter}>
							<Select.Trigger class="h-8 w-[140px] text-xs">
								{hmoFilter === 'all' ? 'All HMO Plans' : hmoFilter}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="all" class="text-xs">All HMO Plans</Select.Item>
								{#each uniqueHmos as hmo}
									<Select.Item value={hmo} class="text-xs">{hmo}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>

						<Select.Root type="single" bind:value={visitTypeFilter}>
							<Select.Trigger class="h-8 w-[140px] text-xs">
								{visitTypeFilter === 'all' ? 'All Visit Types' : visitTypeFilter}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="all" class="text-xs">All Visit Types</Select.Item>
								{#each uniqueVisitTypes as type}
									<Select.Item value={type} class="text-xs">{type}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
			</Card.Header>
			<Card.Content class="py-0">
				<div class="min-h-[350px] overflow-hidden">
					<Table.Root class="mt-0">
						<Table.Header class="sticky top-0 z-10 bg-white">
							<Table.Row class="border-y border-slate-200 bg-white hover:bg-white">
								<Table.Head class="py-2 pl-4 text-xs font-medium text-slate-600">
									<button class="flex items-center gap-1 hover:text-slate-900">
										Member Name
										<ArrowUpDown class="h-3 w-3 text-slate-400" />
									</button>
								</Table.Head>
								<Table.Head class="py-2 text-xs font-medium text-slate-600">
									<button class="flex items-center gap-1 hover:text-slate-900">
										Title
										<ArrowUpDown class="h-3 w-3 text-slate-400" />
									</button>
								</Table.Head>
								<Table.Head class="py-2 text-xs font-medium text-slate-600">Appointment</Table.Head>
								<Table.Head class="py-2 text-xs font-medium text-slate-600">Visit Type</Table.Head>
								<Table.Head class="py-2 text-xs font-medium text-slate-600">HMO Plan</Table.Head>
								<Table.Head class="py-2 text-xs font-medium text-slate-600">Action</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each paginatedClients as client (client.id)}
								<tr
									class="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
									in:fly={{ y: 10, duration: 200, delay: 50 }}
								>
									<Table.Cell class="py-3 pl-4">
										<div class="flex items-center gap-3">
											<!-- Avatar with gray ring border (no color fill) -->
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-600 ring-1 ring-slate-300"
											>
												{getInitials(client.name)}
											</div>
											<div>
												<span class="text-sm font-medium text-slate-900">{client.name}</span>
												<p class="text-xs text-slate-400">{client.email}</p>
											</div>
										</div>
									</Table.Cell>
									<Table.Cell class="py-3">
										<div>
											<span class="text-sm font-medium text-slate-900">{client.hmo}</span>
											<p class="text-xs text-slate-400">{client.enrolleeId}</p>
										</div>
									</Table.Cell>
									<Table.Cell class="py-3">
										<div>
											<span class="text-sm font-medium text-slate-900"
												>{client.appointmentDate}</span
											>
											<p class="text-xs text-slate-400">{client.appointmentTime}</p>
										</div>
									</Table.Cell>
									<Table.Cell class="py-3">
										<span class="text-sm text-slate-600">{client.visitType}</span>
									</Table.Cell>
									<Table.Cell class="py-3">
										<Badge
											variant="outline"
											class={client.tier === 'Platinum'
												? 'rounded-full border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600'
												: client.tier === 'Gold'
													? 'rounded-full border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600'
													: 'rounded-full border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600'}
										>
											{client.tier}
										</Badge>
									</Table.Cell>
									<Table.Cell class="py-3">
										<Button
											variant="ghost"
											size="sm"
											class="h-8 gap-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 {selectedClient?.id ===
											client.id
												? 'bg-indigo-50 ring-1 ring-indigo-200'
												: ''}"
											onclick={() => handleFeedbackClick(client)}
										>
											<MessageSquare class="h-4 w-4" />
											Feedback
										</Button>
									</Table.Cell>
								</tr>
							{/each}
							{#if paginatedClients.length === 0}
								<Table.Row>
									<Table.Cell colspan={6} class="py-8 text-center">
										<p class="text-sm text-slate-500">No clients found</p>
									</Table.Cell>
								</Table.Row>
							{/if}
						</Table.Body>
					</Table.Root>
				</div>

				<!-- Pagination Controls -->
				<div class="flex items-center justify-between border-t border-slate-100 px-2 py-2">
					<p class="text-xs text-slate-500">
						Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
							currentPage * itemsPerPage,
							filteredClients.length
						)} of {filteredClients.length} entries
					</p>
					<div class="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							class="h-7 w-7 p-0"
							disabled={currentPage === 1}
							onclick={prevPage}
						>
							<ChevronRight class="h-4 w-4 rotate-180" />
						</Button>
						<span class="text-xs font-medium text-slate-700"
							>Page {currentPage} of {totalPages}</span
						>
						<Button
							variant="outline"
							size="sm"
							class="h-7 w-7 p-0"
							disabled={currentPage === totalPages}
							onclick={nextPage}
						>
							<ChevronRight class="h-4 w-4" />
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Right Column: Ratings & Insights (Plan-style design) -->
	<div class="flex w-[380px] shrink-0 flex-col">
		<Card.Root
			class="flex flex-1 flex-col overflow-hidden rounded-2xl border-none bg-white shadow-lg"
		>
			<Card.Content class="flex flex-1 flex-col p-0">
				<!-- Tab Header -->
				<div class="border-b border-slate-100 px-4 py-3">
					<div class="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
						<button
							onclick={() => (activeTab = 'ratings')}
							class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all {activeTab ===
							'ratings'
								? 'bg-white text-slate-900 shadow-sm'
								: 'text-slate-500 hover:text-slate-700'}"
						>
							Ratings
						</button>
						<button
							onclick={() => (activeTab = 'insights')}
							class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all {activeTab ===
							'insights'
								? 'bg-white text-slate-900 shadow-sm'
								: 'text-slate-500 hover:text-slate-700'}"
						>
							Insights
						</button>
					</div>
				</div>

				<!-- Tab Content with slide transition -->
				<div class="relative flex-1 overflow-hidden">
					{#if activeTab === 'ratings'}
						<div
							class="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden p-5"
							in:fly={{ x: -20, duration: 300, easing: cubicInOut }}
							out:fly={{ x: 20, duration: 200, easing: cubicInOut }}
						>
							<!-- Plan-style header (matching the image) -->
							<div class="flex items-start justify-between">
								<div>
									<div class="flex items-center gap-2">
										<h3 class="text-lg font-bold text-slate-900">Provider Rating</h3>
										<Badge
											class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[8px] font-semibold text-indigo-600"
										>
											Excellent
										</Badge>
									</div>
									<p class="mt-0.5 text-xs text-slate-500">Active since Jan 2024</p>
								</div>
								<div class="text-right">
									<div class="flex items-baseline gap-0.5">
										<span class="text-3xl font-bold text-slate-900">{ratingStats.overall}</span>
										<span class="text-sm text-slate-400">/5</span>
									</div>
								</div>
							</div>

							<!-- Search bar removed as requested -->

							<!-- Rating Progress Bars (Reverted to colored bars style as requested) -->
							<div class="mt-5 space-y-5">
								{#each filteredRatingMetrics() as metric, i}
									{@const colors = [
										'bg-violet-100',
										'bg-amber-100',
										'bg-emerald-100',
										'bg-blue-100',
										'bg-rose-100',
										'bg-indigo-100'
									]}
									{@const barColors = [
										'bg-violet-400',
										'bg-amber-400',
										'bg-emerald-400',
										'bg-blue-400',
										'bg-rose-400',
										'bg-indigo-400'
									]}
									<div transition:slide>
										<div class="flex items-center gap-3">
											<div
												class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full {colors[
													i % colors.length
												]}"
											>
												<Activity class="h-4 w-4 text-slate-600" />
											</div>
											<div class="min-w-0 flex-1">
												<div class="flex items-center justify-between">
													<p class="text-sm font-medium text-slate-900">{metric.label}</p>
													<p class="text-sm font-semibold text-slate-900">
														{metric.value}/10
													</p>
												</div>
												<p class="text-[10px] text-slate-400">Average Rating</p>
											</div>
										</div>
										<div
											class="ml-12 mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
											style="width: calc(100% - 3rem)"
										>
											<div
												class="h-full rounded-full {barColors[
													i % barColors.length
												]} transition-all duration-500 ease-in-out"
												style="width: {metric.percentage}%"
											></div>
										</div>
									</div>
								{/each}
							</div>

							<!-- Reviews / Feedback Section -->
							<div class="mt-6 flex-1 overflow-hidden">
								<p class="mb-3 text-xs font-semibold text-slate-700">
									{selectedClient ? 'Patient Feedback' : 'Recent Feedback'}
								</p>

								{#if selectedClient}
									<!-- Selected Client Feedback -->
									<div in:fly={{ y: 10, duration: 300 }} class="space-y-4">
										<div class="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
											<div class="mb-3 flex items-center gap-3">
												<div
													class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-indigo-100"
												>
													{getInitials(selectedClient.name)}
												</div>
												<div>
													<p class="text-sm font-bold text-slate-900">{selectedClient.name}</p>
													<p class="text-xs text-slate-500">{selectedClient.visitType}</p>
												</div>
											</div>
											<p class="text-xs leading-relaxed text-slate-700">
												"{selectedClient.feedback}"
											</p>
											<p class="mt-2 text-right text-[10px] text-slate-400">
												{selectedClient.appointmentDate}
											</p>
										</div>

										<!-- Reply Section -->
										<Card.Root class="mb-1 flex flex-1 flex-col p-3 shadow-sm">
											<div class="flex items-center justify-between">
												<h3 class="text-xs font-medium text-slate-700">Reply to Patient</h3>
												<Switch bind:checked={showReply} class="scale-75" />
											</div>
											{#if showReply}
												<div transition:slide class="flex flex-1 flex-col">
													<textarea
														class="w-full flex-1 resize-none rounded-md border border-slate-200 bg-slate-50 p-2 text-xs focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
														placeholder="Write a reply..."
														rows="6"
													></textarea>
													<div class="mt-1 flex justify-end">
														<Button size="sm" class="h-7 bg-indigo-600 text-xs hover:bg-indigo-700">
															Send Reply
														</Button>
													</div>
												</div>
											{/if}
										</Card.Root>
									</div>
								{:else}
									<!-- Default Recent Reviews List -->
									<ScrollArea class="h-64 w-full">
										<div class="space-y-2 pr-2">
											{#each filteredReviews as review, i}
												<div
													class="rounded-lg border border-slate-100 bg-white p-3 transition-all hover:border-slate-200 hover:shadow-sm"
												>
													<!-- Header: Avatar, Name, and HMO Badge -->
													<div class="flex items-center justify-between">
														<div class="flex items-center gap-2.5">
															<div
																class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600 ring-1 ring-slate-300"
															>
																{review.patientInitials}
															</div>
															<div>
																<p class="text-xs font-semibold text-slate-900">
																	{review.patientName}
																</p>
																<p class="text-[10px] text-slate-400">{review.date}</p>
															</div>
														</div>
														<Badge
															class="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-medium text-indigo-600"
														>
															{review.hmo}
														</Badge>
													</div>
													<!-- Comment -->
													<p class="mt-2 text-[11px] leading-relaxed text-slate-600">
														"{review.comment}"
													</p>
												</div>
												{#if i < filteredReviews.length - 1}
													<Separator class="my-1" />
												{/if}
											{/each}
											{#if filteredReviews.length === 0}
												<div class="flex flex-col items-center justify-center py-8 text-center">
													<Search class="h-8 w-8 text-slate-300" />
													<p class="mt-2 text-xs font-medium text-slate-500">No reviews found</p>
												</div>
											{/if}
										</div>
									</ScrollArea>
								{/if}
							</div>
						</div>
					{:else}
						<!-- Insights Tab Content -->
						<div
							class="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden p-5"
							in:fly={{ x: 20, duration: 300, easing: cubicInOut }}
							out:fly={{ x: -20, duration: 200, easing: cubicInOut }}
						>
							<div class="flex items-center justify-between">
								<div>
									<h3 class="text-base font-bold text-slate-900">Facility Insights</h3>
									<p class="text-[10px] text-slate-500">Last 30 days performance</p>
								</div>
								<div
									class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100"
								>
									<Activity class="h-4 w-4 text-indigo-600" />
								</div>
							</div>

							<!-- Stats Grid -->
							<div class="mt-4 grid grid-cols-2 gap-3">
								<div class="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 p-3">
									<p class="text-[10px] font-medium text-slate-500">Patients Reached</p>
									<p class="mt-0.5 text-xl font-bold text-slate-900">
										{insights.patientsReached.toLocaleString()}
									</p>
									<div class="mt-1.5 flex items-center gap-1">
										<TrendingUp class="h-3 w-3 text-emerald-500" />
										<span class="text-[10px] font-medium text-emerald-600">+12.5%</span>
									</div>
								</div>
								<div class="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 p-3">
									<p class="text-[10px] font-medium text-slate-500">New Patients</p>
									<p class="mt-0.5 text-xl font-bold text-slate-900">+{insights.newPatients}</p>
									<div class="mt-1.5 flex items-center gap-1">
										<TrendingUp class="h-3 w-3 text-emerald-500" />
										<span class="text-[10px] font-medium text-emerald-600">+8.3%</span>
									</div>
								</div>
								<div class="rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 p-3">
									<p class="text-[10px] font-medium text-slate-500">Avg Wait Time</p>
									<p class="mt-0.5 text-xl font-bold text-slate-900">{insights.avgWaitTime}</p>
									<div class="mt-1.5 flex items-center gap-1">
										<TrendingUp class="h-3 w-3 text-emerald-500" />
										<span class="text-[10px] font-medium text-emerald-600">-2 min</span>
									</div>
								</div>
								<div class="rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 p-3">
									<p class="text-[10px] font-medium text-slate-500">Bed Occupancy</p>
									<p class="mt-0.5 text-xl font-bold text-slate-900">{insights.bedOccupancy}</p>
									<div class="mt-1.5 flex items-center gap-1">
										<TrendingUp class="h-3 w-3 text-emerald-500" />
										<span class="text-[10px] font-medium text-emerald-600">+5%</span>
									</div>
								</div>
							</div>

							<!-- Mini bar chart -->
							<div class="mt-4">
								<div class="flex items-center justify-between">
									<p class="text-[10px] font-medium text-slate-500">Weekly Patient Visits</p>
									<span class="text-[10px] font-semibold text-indigo-600">This Week</span>
								</div>
								<div class="mt-2.5 flex items-end justify-between gap-1">
									{#each weeklyData as value, i}
										<div class="flex flex-1 flex-col items-center gap-0.5">
											<div
												class="w-full rounded-t transition-all duration-300 hover:opacity-80 {i ===
												weeklyData.length - 1
													? 'bg-gradient-to-t from-indigo-600 to-violet-500'
													: 'bg-gradient-to-t from-indigo-200 to-violet-200'}"
												style="height: {value * 0.5}px"
											></div>
											<span class="text-[8px] text-slate-400"
												>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span
											>
										</div>
									{/each}
								</div>
							</div>

							<!-- Unique finding -->
							<div class="mt-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
								<div class="flex items-start gap-2.5">
									<div
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-100"
									>
										<Sparkles class="h-3.5 w-3.5 text-indigo-600" />
									</div>
									<div>
										<p class="text-xs font-semibold text-slate-800">Unique Finding</p>
										<p class="mt-0.5 text-[10px] leading-relaxed text-slate-600">
											Your patient satisfaction rate increased by 4% when appointment wait times
											were reduced.
										</p>
									</div>
								</div>
							</div>

							<!-- HMO Partners - Matching Reference Design -->
							<div class="mt-4">
								<!-- Header with large total -->
								<p class="text-xs text-slate-500">HMO Patients</p>
								<p class="text-3xl font-bold text-slate-900">5,718</p>

								<!-- Table header -->
								<div class="mt-4 flex items-center justify-between border-b border-slate-100 pb-2">
									<span class="text-[10px] font-medium text-slate-500">Categories</span>
									<span class="text-[10px] font-medium text-slate-500">Total Patients</span>
								</div>

								<!-- Rows with horizontal bar labels -->
								<div class="mt-2 space-y-2">
									{#each hmoClients as hmo}
										<div class="flex items-center justify-between">
											<div
												class="rounded px-3 py-1.5 text-xs font-medium text-slate-700 {hmo.barColor.replace(
													'500',
													'100'
												)}"
												style="width: {hmo.percentage}%"
											>
												{hmo.name}
											</div>
											<span class="text-xs font-semibold text-slate-900"
												>{hmo.clients.toLocaleString()}</span
											>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
