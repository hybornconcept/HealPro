<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import {
		Search,
		Filter,
		Share2,
		Bookmark,
		Plus,
		AlertTriangle,
		ChevronRight,
		ChevronDown,
		ArrowRight,
		LayoutGrid,
		List as ListIcon,
		Building2,
		Activity,
		TrendingUp,
		Users,
		Stethoscope,
		Download,
		Pill,
		FlaskConical
	} from 'lucide-svelte';

	// Helper for score color
	const getScoreColor = (score: number) => {
		if (score >= 70) return 'text-emerald-500';
		if (score >= 40) return 'text-blue-500';
		if (score >= 0) return 'text-amber-500'; // Low score but positive
		return 'text-rose-500'; // Negative?
	};
	const getScoreRingColor = (score: number) => {
		if (score >= 70) return 'stroke-emerald-500';
		if (score >= 40) return 'stroke-blue-500';
		if (score >= 0) return 'stroke-amber-500';
		return 'stroke-rose-500';
	};

	// Provider Theme Helper
	const getProviderTheme = (type: string) => {
		const t = type.toLowerCase();
		if (t.includes('pharmacy')) {
			return {
				gradient: 'bg-gradient-to-tl from-emerald-50 via-white to-white',
				border: 'border-emerald-100',
				iconColor: 'text-emerald-500',
				badge: 'bg-emerald-100 text-emerald-700',
				focus: 'ring-emerald-500/10'
			};
		} else if (t.includes('specialist') || t.includes('lab')) {
			return {
				gradient: 'bg-gradient-to-tl from-rose-50 via-white to-white',
				border: 'border-rose-100',
				iconColor: 'text-rose-500',
				badge: 'bg-rose-100 text-rose-700',
				focus: 'ring-rose-500/10'
			};
		} else {
			// Hospitals / Clinics
			return {
				gradient: 'bg-gradient-to-tl from-blue-50 via-white to-white',
				border: 'border-blue-100',
				iconColor: 'text-blue-500',
				badge: 'bg-blue-100 text-blue-700',
				focus: 'ring-blue-500/10'
			};
		}
	};

	let { data } = $props();
	const {
		providers,
		concentrationData,
		kpis,
		qualityMetrics,
		facilityData,
		reviews,
		appointments,
		clients
	} = data;

	let selectedProvider = $state(providers[1]); // Default to Reddington
	let searchQuery = $state('');

	const deltaColor = (val: string) => (val.includes('+') ? 'text-green-600' : 'text-rose-500');

	const reviewCategories = [
		{
			label: 'Clinical Care',
			percentage: 48,
			value: '48%',
			color: 'bg-indigo-500',
			bgColor: 'bg-indigo-50',
			textColor: 'text-indigo-600',
			size: 'w-[130px] h-[130px] top-[5%] left-[5%]'
		},
		{
			label: 'Billing & Admin',
			percentage: 32,
			value: '32%',
			color: 'bg-emerald-500',
			bgColor: 'bg-emerald-50',
			textColor: 'text-emerald-600',
			size: 'w-[100px] h-[100px] top-[5%] left-[55%]'
		},
		{
			label: 'Wait Experience',
			percentage: 13,
			value: '13%',
			color: 'bg-rose-500',
			bgColor: 'bg-rose-50',
			textColor: 'text-rose-600',
			size: 'w-[75px] h-[75px] top-[55%] left-[50%]'
		},
		{
			label: 'Facility & Comfort',
			percentage: 7,
			value: '7%',
			color: 'bg-amber-500',
			bgColor: 'bg-amber-50',
			textColor: 'text-amber-600',
			size: 'w-[50px] h-[50px] top-[50%] left-[80%]'
		}
	];

	const getStatusStyles = (status: string) => {
		switch (status) {
			case 'Confirm':
				return 'text-emerald-700 border-emerald-200 bg-emerald-50';
			case 'Pending':
				return 'text-slate-500 border-slate-200 bg-slate-50';
			case 'Canceled':
				return 'text-rose-600 border-rose-200 bg-rose-50';
			default:
				return 'text-slate-500 border-slate-200 bg-slate-50';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Active':
				return 'bg-emerald-500';
			case 'Pending':
				return 'bg-amber-400';
			case 'Inactive':
				return 'bg-rose-500';
			default:
				return 'bg-slate-300';
		}
	};
	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="flex h-full w-full overflow-hidden bg-[#f8f9fa] text-slate-900"
	style="font-family: 'Noto Sans', 'Segoe UI', sans-serif;"
>
	<!-- Left Panel: List -->
	<div
		class="z-10 flex w-[25%] min-w-[320px] max-w-[400px] flex-col border-r border-slate-200 bg-[#fbfcfd] shadow-[4px_0_24px_rgba(0,0,0,0.01)]"
	>
		<!-- Tabs Header -->
		<div class="border-b border-slate-100 bg-white px-3 pb-2 pt-1">
			<div class="mb-1.5 flex gap-3">
				<button
					class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50"
				>
					Listed <span class="ml-1 text-slate-400">26</span>
				</button>
				<button
					class="rounded-full bg-transparent px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
				>
					Sectors <span class="ml-1 text-slate-300">43</span>
				</button>
			</div>

			<div class="flex gap-2">
				<div class="relative flex-1">
					<Button
						variant="ghost"
						class="absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 p-0 text-slate-400 hover:bg-transparent"
					>
						<ListIcon class="h-3.5 w-3.5" />
					</Button>
					<span
						class="absolute left-6 top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs font-bold text-slate-700"
						>Listing <ChevronDown class="h-3 w-3 text-slate-400" /></span
					>
				</div>
				<div class="flex flex-1 justify-end gap-2">
					<Button
						variant="outline"
						size="sm"
						class="h-8 gap-1.5 rounded-lg border-slate-200 text-xs font-bold text-slate-600"
					>
						<Filter class="h-3 w-3" /> Filters
					</Button>
				</div>
			</div>
			<!-- Search -->
			<div class="relative mt-1">
				<Search class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
				<Input
					placeholder="Search companies..."
					class="h-8 rounded-lg border-slate-100 bg-slate-50 pl-8 text-xs"
					bind:value={searchQuery}
				/>
			</div>
		</div>

		<!-- List Content -->
		<div class="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-3">
			{#each providers as provider}
				{@const theme = getProviderTheme(provider.type)}
				<div
					class="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-3 transition-all hover:shadow-md {theme.gradient}
					{selectedProvider.id === provider.id
						? `${theme.border} shadow-md ring-1 ${theme.focus}`
						: 'border-slate-200 shadow-sm hover:border-slate-300'}"
					onclick={() => (selectedProvider = provider)}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && (selectedProvider = provider)}
				>
					<!-- Top Row: Location & Icon -->
					<div class="mb-1.5 flex items-start justify-between">
						<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
							{provider.location}
						</span>
						<div class="{theme.iconColor} opacity-70">
							{#if provider.type.toLowerCase().includes('pharmacy')}
								<Pill class="h-4 w-4" />
							{:else if provider.type.toLowerCase().includes('specialist')}
								<FlaskConical class="h-4 w-4" />
							{:else}
								<Building2 class="h-4 w-4" />
							{/if}
						</div>
					</div>

					<!-- Middle: Name -->
					<div class="mb-2">
						<h3 class="text-sm font-bold text-slate-900 group-hover:text-black">
							{provider.name}
						</h3>
						<p class="text-[10px] font-medium text-slate-400">{provider.type}</p>
					</div>

					<!-- Bottom: Badge -->
					<div class="flex items-center justify-end">
						<Badge
							variant="secondary"
							class="{theme.badge} border-none px-2 py-0.5 text-[10px] font-bold"
						>
							{provider.clients.toLocaleString()} Clients
						</Badge>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Right Panel: Details -->
	<div class="flex h-full flex-1 flex-col overflow-hidden bg-white">
		<!-- Top Header Area -->
		<div class="px-6 pb-1 pt-1.5">
			<!-- Title & Actions -->
			<div class="flex items-start justify-between">
				<div class="flex gap-3">
					<div class="rounded-full ring-2 ring-slate-100 ring-offset-2">
						<Avatar.Root class="h-12 w-12">
							<Avatar.Image src="https://github.com/shadcn.png" alt={selectedProvider.name} />
							<Avatar.Fallback>{selectedProvider.logo}</Avatar.Fallback>
						</Avatar.Root>
					</div>
					<div>
						<p class="mb-0.5 text-[10px] font-bold text-slate-400">{selectedProvider.category}</p>
						<h1 class="text-2xl font-black tracking-tight text-slate-900">
							{selectedProvider.name}
						</h1>
					</div>
				</div>
				<div class="flex gap-3">
					<Button
						variant="outline"
						class="h-10 gap-2 rounded-full border-slate-200 px-8 text-sm font-normal text-slate-600 hover:bg-slate-50"
					>
						Watchlist
						<Bookmark class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						class="h-10 gap-2 rounded-full border-red-200 px-8 text-sm font-normal text-red-600 hover:bg-red-50"
					>
						Deactivate
						<AlertTriangle class="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>

		<!-- Scrollable Content -->
		<div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-3 pb-24">
			<!-- KPI Cards -->
			<div class="mb-5 grid grid-cols-4 gap-4">
				{#each kpis as kpi}
					<div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
						<div class="flex items-center justify-between">
							<div class="flex flex-col gap-1">
								<span class="text-xs font-bold text-slate-300">{kpi.label}</span>
								<h3 class="text-lg font-black text-slate-900">{kpi.value}</h3>
								<span class="text-[10px] font-medium text-slate-400">vs previous period</span>
							</div>
							<div class="relative flex h-12 w-12 items-center justify-center">
								<svg class="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
									<!-- Background Circle -->
									<path
										class="text-slate-100"
										d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
									/>
									<!-- Progress Circle -->
									<path
										class={kpi.ringColor}
										stroke-dasharray="{kpi.progress}, 100"
										d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
									/>
								</svg>
								<span class="absolute text-[10px] font-bold text-slate-900">{kpi.progress}%</span>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Tabs -->
			<Tabs.Root value="clients" class="w-full">
				<div
					class="mb-6 overflow-hidden rounded-t-xl border-b border-slate-200 bg-slate-50/80 p-1 pb-0"
				>
					<Tabs.List class="h-auto w-full justify-start gap-1 bg-transparent p-0">
						{#each ['Clients', 'Appointments', 'Metrics', 'Reviews'] as tab}
							<Tabs.Trigger
								value={tab.toLowerCase()}
								class="rounded-t-lg border border-transparent bg-transparent px-4 py-2 text-xs font-bold text-slate-500 transition-all hover:text-slate-700 data-[state=active]:border-slate-200 data-[state=active]:border-b-white data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
							>
								{tab}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</div>

				<Tabs.Content value="clients" class="mt-0 space-y-4">
					<Card.Root class="rounded-xl border-slate-100 bg-white shadow-sm">
						<!-- Card Header / Filters -->
						<div class="flex items-center justify-between border-b border-slate-50 p-5">
							<div>
								<h3 class="text-lg font-bold text-slate-900">Client Roster</h3>
								<p class="text-xs font-medium text-slate-500">
									Manage policies and view client status
								</p>
							</div>
							<div class="flex items-center gap-3">
								<div class="relative w-64">
									<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<Input
										placeholder="Search clients..."
										class="h-9 rounded-lg border-slate-200 bg-white pl-9 text-xs focus-visible:ring-1 focus-visible:ring-blue-500"
									/>
								</div>
								<Button
									variant="outline"
									class="h-9 gap-2 border-slate-200 text-xs font-bold text-slate-600"
								>
									<Filter class="h-3.5 w-3.5" />
									All Policy Types
									<ChevronDown class="h-3.5 w-3.5 opacity-50" />
								</Button>
								<Button
									variant="outline"
									class="h-9 gap-2 border-slate-200 text-xs font-bold text-slate-600"
								>
									<Download class="h-3.5 w-3.5" />
									Export
								</Button>
							</div>
						</div>

						<!-- Table -->
						<div class="p-0">
							<Table.Root>
								<Table.Header class="hover:bg-transparent">
									<Table.Row class="border-b-slate-50 hover:bg-transparent">
										<Table.Head
											class=" py-1.5 pl-6 text-[10px] font-normal uppercase tracking-wide text-slate-400"
											>Client Name</Table.Head
										>
										<Table.Head
											class="py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400"
											>Policy ID</Table.Head
										>
										<Table.Head
											class="py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400"
											>Type</Table.Head
										>
										<Table.Head
											class="py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400"
											>Status</Table.Head
										>
										<Table.Head
											class="py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400"
											>Last Activity</Table.Head
										>
										<Table.Head
											class="py-1.5 pr-6 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400"
											>Actions</Table.Head
										>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each clients as client}
										<Table.Row class="border-b-slate-50 hover:bg-slate-50/50">
											<Table.Cell class="py-2 pl-6 font-medium">
												<div class="flex items-center gap-3">
													<Avatar.Root class="h-9 w-9 border border-slate-100 bg-slate-50">
														<Avatar.Image src={client.image} alt={client.name} />
														<Avatar.Fallback class="bg-blue-50 text-xs font-bold text-blue-600"
															>{client.avatar}</Avatar.Fallback
														>
													</Avatar.Root>
													<div>
														<div class="font-semibold text-slate-900">{client.name}</div>
														<div class="text-[10px] font-medium text-slate-500">{client.email}</div>
													</div>
												</div>
											</Table.Cell>
											<Table.Cell class="py-2 text-xs font-semibold text-slate-500">
												{client.policyId}
											</Table.Cell>
											<Table.Cell class="py-2">
												<span
													class="{client.typeColor} inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold"
												>
													{client.type}
												</span>
											</Table.Cell>
											<Table.Cell class="py-2">
												<div class="flex items-center gap-1.5">
													<div
														class="h-1.5 w-1.5 rounded-full {getStatusColor(client.status)}"
													></div>
													<span class="text-xs font-bold text-slate-700">{client.status}</span>
												</div>
											</Table.Cell>
											<Table.Cell class="py-2 text-xs font-medium text-slate-500">
												{client.lastActivity}
											</Table.Cell>
											<Table.Cell class="py-2 pr-6 text-right">
												<Button
													variant="ghost"
													size="sm"
													class="h-7 bg-blue-50 px-3 text-[10px] font-bold text-blue-600 hover:bg-blue-100 hover:text-blue-700"
												>
													Actions
												</Button>
											</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						</div>

						<!-- Footer -->
						<div class="flex items-center justify-between border-t border-slate-50 p-4">
							<div class="text-xs font-medium text-slate-500">
								Showing <span class="font-bold text-slate-900">1-5</span> of
								<span class="font-bold text-slate-900">12,450</span> clients
							</div>
							<div class="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									class="h-8 border-slate-200 text-xs font-bold text-slate-500 disabled:opacity-50"
									>Previous</Button
								>
								<Button
									variant="outline"
									size="sm"
									class="h-8 border-slate-200 text-xs font-bold text-slate-500">Next</Button
								>
							</div>
						</div>
					</Card.Root>
				</Tabs.Content>

				<Tabs.Content value="metrics" class="mt-0">
					<div class="grid grid-cols-3 gap-4">
						<!-- Card 1: Available Equipment -->
						<div
							class="rounded-xl border border-slate-100 shadow-md transition-all hover:shadow-md"
						>
							<div class="flex flex-row items-center justify-between px-5 pb-2 pt-4">
								<div>
									<h3 class="text-sm font-bold text-slate-800">Available Equipment</h3>
									<p class="text-[10px] font-medium text-slate-400">
										{facilityData.devices.length} Devices
									</p>
								</div>
								<div class="flex gap-1">
									<Button
										variant="outline"
										size="icon"
										class="h-6 w-6 rounded-full border-slate-100 bg-transparent hover:bg-white"
										><ChevronRight class="h-3 w-3 rotate-180 text-slate-400" /></Button
									>
									<Button
										variant="outline"
										size="icon"
										class="h-6 w-6 rounded-full border-slate-200 bg-transparent hover:bg-white"
										><ChevronRight class="h-3 w-3 text-slate-400" /></Button
									>
								</div>
							</div>
							<div class="space-y-3 px-4 pb-6 pt-2">
								{#each facilityData.devices as device}
									<div
										class="flex items-center gap-3 rounded-xl border border-dotted border-slate-200 bg-white/60 p-2 hover:bg-slate-50"
									>
										<div
											class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {device.color}"
										>
											<Activity class="h-5 w-5 opacity-70" />
										</div>
										<div class="flex flex-1 flex-col">
											<span class="text-xs font-bold text-slate-900">{device.name}</span>
											<span class="text-[10px] font-medium text-slate-500">{device.status}</span>
										</div>
										<Badge
											variant="outline"
											class="border-slate-200 bg-white font-mono text-[10px] text-slate-500"
										>
											{device.count}
										</Badge>
									</div>
								{/each}
							</div>
						</div>

						<!-- Card 2: Procedures -->
						<div
							class="rounded-xl border border-slate-100 shadow-md transition-all hover:shadow-md"
						>
							<div class="flex flex-row items-center justify-between px-6 pb-2 pt-4">
								<div>
									<h3 class="text-sm font-bold text-slate-800">Procedures</h3>
									<p class="text-[10px] font-medium text-slate-400">
										{facilityData.procedures.length} Procedures
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									class="h-6 w-6 rounded-full text-slate-400 hover:bg-white"
									><Filter class="h-3.5 w-3.5" /></Button
								>
							</div>
							<div class="space-y-3 px-6 pb-6 pt-2">
								{#each facilityData.procedures as proc, i}
									{@const isAvailable = i % 3 !== 0}
									<div
										class="flex items-center justify-between border-b border-dotted border-slate-200 pb-3 last:border-0 last:pb-0"
									>
										<div class="flex items-center gap-3">
											<div
												class="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-xs font-bold text-slate-600 ring-1 ring-slate-200"
											>
												{getInitials(proc.name)}
											</div>
											<div>
												<div class="text-xs font-bold text-slate-900">{proc.name}</div>
												<div class="text-[10px] font-medium text-slate-400">{proc.dept}</div>
											</div>
										</div>
										<Badge
											variant="secondary"
											class="border text-[10px] font-normal {isAvailable
												? 'border-emerald-100 bg-emerald-50 text-emerald-600'
												: 'border-rose-100 bg-rose-50 text-rose-600'}"
										>
											{isAvailable ? 'Available' : 'Unavailable'}
										</Badge>
									</div>
								{/each}
							</div>
						</div>

						<!-- Card 3: Quality Metrics -->
						<div
							class="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 via-white to-white shadow-sm transition-all hover:shadow-md"
						>
							<div class="flex flex-row items-center justify-between px-6 pb-4 pt-4">
								<div>
									<h3 class="text-xs font-bold text-slate-800">Quality Metrics</h3>
									<p class="mt-1 text-[20px] font-black tracking-tight text-slate-900">
										Hospital Rating
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8 rounded-full text-slate-400 hover:bg-white"
									><TrendingUp class="h-4 w-4" /></Button
								>
							</div>
							<div class="space-y-5 px-6 pb-6 pt-0">
								{#each qualityMetrics as metric}
									<div class="space-y-1.5">
										<div class="flex items-end justify-between">
											<span class="text-[11px] font-bold text-slate-600">{metric.label}</span>
											<span class="text-xs font-black text-slate-900">{metric.value}</span>
										</div>
										<div
											class="h-1.5 w-full overflow-hidden rounded-full bg-white/50 ring-1 ring-slate-100"
										>
											<div
												class="h-full rounded-full {metric.color.replace('text-', 'bg-')}"
												style="width: {metric.progress}%"
											></div>
										</div>
									</div>
								{/each}

								<div class="mt-4 rounded-xl bg-white/60 p-3 ring-1 ring-slate-100">
									<p class="text-[10px] leading-relaxed text-slate-500">
										<span class="font-bold text-slate-700">Insight:</span> This provider ranks in
										the top <span class="font-bold text-emerald-600">15%</span> for admission
										efficiency but requires improvement in
										<span class="font-bold text-orange-500">device maintenance</span>.
									</p>
								</div>
							</div>
						</div>
					</div>
				</Tabs.Content>

				<Tabs.Content value="reviews" class="mt-0">
					<div class="flex gap-4">
						<!-- Left: Category Analysis (35%) -->
						<div class="w-[35%]">
							<Card.Root class="flex h-full flex-col border-slate-100 bg-white shadow-sm">
								<Card.Header class="pb-2 pt-5">
									<div class="flex items-center justify-between">
										<div>
											<Card.Title class="text-base font-bold text-slate-800"
												>Review Sentiment</Card.Title
											>
											<Card.Description class="text-xs text-slate-500"
												>Categorical analysis</Card.Description
											>
										</div>
										<Button variant="outline" size="sm" class="h-7 text-[10px] font-bold"
											>View Report</Button
										>
									</div>
								</Card.Header>
								<Card.Content class="flex flex-1 flex-col">
									<!-- Bubble Chart Area -->
									<div class="relative h-[160px] w-full">
										{#each reviewCategories as cat}
											<div
												class="absolute flex items-center justify-center rounded-full border border-white/50 shadow-sm backdrop-blur-[2px] transition-transform hover:scale-105 {cat.bgColor} {cat.size} {cat.position}"
											>
												<div class="text-center">
													<div class="text-2xl font-black {cat.textColor}">{cat.percentage}%</div>
												</div>
											</div>
										{/each}
									</div>

									<!-- Dotted Separator -->
									<div class="my-4 w-full border-t-2 border-dotted border-slate-200"></div>

									<!-- Legend Grid Row 1 -->
									<div class="grid grid-cols-2 gap-4 pb-4">
										{#each reviewCategories.slice(0, 2) as cat}
											<div class="space-y-1">
												<div class="flex items-center gap-2">
													<div class="h-2.5 w-2.5 rounded-full {cat.color}"></div>
													<span class="text-[11px] font-bold text-{cat.color.split('-')[1]}-600"
														>{cat.label}</span
													>
												</div>
												<div class="pl-4 text-sm font-black text-slate-900">{cat.value}</div>
											</div>
										{/each}
									</div>

									<!-- Dotted Separator -->
									<div class="mb-4 w-full border-t-2 border-dotted border-slate-200"></div>

									<!-- Legend Grid Row 2 -->
									<div class="grid grid-cols-2 gap-4">
										{#each reviewCategories.slice(2, 4) as cat}
											<div class="space-y-1">
												<div class="flex items-center gap-2">
													<div class="h-2.5 w-2.5 rounded-full {cat.color}"></div>
													<span class="text-[11px] font-bold text-{cat.color.split('-')[1]}-600"
														>{cat.label}</span
													>
												</div>
												<div class="pl-4 text-sm font-black text-slate-900">{cat.value}</div>
											</div>
										{/each}
									</div>
								</Card.Content>
							</Card.Root>
						</div>

						<!-- Right: Comment Feed (65%) -->
						<div class="w-[65%]">
							<Card.Root class="border-slate-100 bg-white shadow-sm">
								<Card.Header class="pb-4 pt-5">
									<div class="flex items-center justify-between">
										<div>
											<Card.Title class="text-base font-bold text-slate-800"
												>Recent Feedback</Card.Title
											>
											<Card.Description class="text-xs text-slate-500">
												Detailed comments from enrollees
											</Card.Description>
										</div>
										<div class="flex items-center gap-3">
											<div class="text-right">
												<div class="text-2xl font-black text-slate-900">4.2</div>
												<div class="flex text-amber-400">
													{#each Array(4) as _}<span class="text-xs">★</span>{/each}
													<span class="text-xs text-slate-200">★</span>
												</div>
											</div>
										</div>
									</div>
								</Card.Header>
								<Card.Content class="space-y-4">
									<div class="custom-scrollbar max-h-[420px] space-y-4 overflow-y-auto pr-2">
										{#each reviews as review}
											<div
												class="rounded-xl border border-slate-50 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
											>
												<div class="mb-2 flex items-start justify-between">
													<div class="flex items-center gap-3">
														<div
															class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600"
														>
															{review.avatar}
														</div>
														<div>
															<div class="text-sm font-bold text-slate-900">{review.name}</div>
															<div class="text-[10px] font-medium text-slate-400">
																{review.date}
															</div>
														</div>
													</div>
													<div class="flex gap-0.5 text-amber-400">
														{#each Array(5) as _, i}
															<span
																class="text-xs {i < review.rating
																	? 'opacity-100'
																	: 'text-slate-200'}">★</span
															>
														{/each}
													</div>
												</div>
												<p class="mb-3 text-xs leading-relaxed text-slate-600">
													"{review.comment}"
												</p>
												<div class="flex flex-wrap gap-2">
													{#each review.tags as tag}
														<span
															class="rounded-lg bg-white px-2.5 py-1 text-[9px] font-bold text-slate-500 shadow-sm ring-1 ring-slate-100"
														>
															{tag}
														</span>
													{/each}
												</div>
											</div>
										{/each}
									</div>
								</Card.Content>
							</Card.Root>
						</div>
					</div>
				</Tabs.Content>

				<Tabs.Content value="appointments" class="mt-0">
					<div class="grid grid-cols-3 gap-4">
						{#each appointments as appt}
							<div
								class="flex flex-col gap-4 rounded-3xl border p-5 transition-all
								{appt.variant === 'blue'
									? 'border-blue-100 bg-blue-50/40 shadow-[0_4px_12px_rgba(59,130,246,0.03)]'
									: 'border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md'}"
							>
								<div class="flex items-center justify-between">
									<span class="text-lg font-bold tracking-tight text-slate-800">{appt.time}</span>
									<span
										class="rounded-full border px-3 py-1 text-[10px] font-bold {getStatusStyles(
											appt.status
										)}"
									>
										{appt.status}
									</span>
								</div>

								<div class="space-y-1">
									<h4 class="text-base font-semibold text-slate-900">{appt.title}</h4>
									<div class="flex items-center gap-2 text-sm font-medium text-slate-400">
										<span>{appt.patient}</span>
										<div class="h-1 w-1 rounded-full bg-slate-200"></div>
										<span>{appt.doctor}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>

<style>
	/* Ensure the page takes full height without scrolling the body */
	:global(body) {
		height: 100vh;
		overflow: hidden;
	}
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #cbd5e1;
	}
</style>
