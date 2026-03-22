<script lang="ts">
	import { page } from '$app/stores';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Bell, Settings, Activity, Search, ChevronDown } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import NavigationSidebar from '$lib/components/NavigationSidebar.svelte';
	import {
		hmoNavItems,
		facilityNavItems,
		userNavItems,
		getPageTitle
	} from '$lib/config/navigation';

	let { children, data } = $props();

	// Determine current nav items based on path
	let currentNavItems = $derived.by(() => {
		const path = $page.url.pathname;
		if (path.startsWith('/facility')) return facilityNavItems;
		if (path.startsWith('/hmo')) return hmoNavItems;
		return userNavItems;
	});

	let brandUrl = $derived.by(() => {
		const path = $page.url.pathname;
		if (path.startsWith('/facility')) return '/facility';
		if (path.startsWith('/hmo')) return '/hmo';
		return '/user';
	});

	let section = $derived.by((): 'hmo' | 'facility' | 'user' => {
		const path = $page.url.pathname;
		if (path.startsWith('/facility')) return 'facility';
		if (path.startsWith('/hmo')) return 'hmo';
		return 'user';
	});

	let pageTitle = $derived(getPageTitle($page.url.pathname, section));
</script>

<Sidebar.Provider>
	<NavigationSidebar navItems={currentNavItems} currentPath={$page.url.pathname} {brandUrl} />
	<Sidebar.Inset>
		<header
			class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-8 shadow-sm transition-[width,height] ease-linear"
		>
			<!-- Left Section: Trigger and Page Title -->
			<div class="flex items-center gap-2">
				<Sidebar.Trigger
					class="-ml-1 h-9 w-9 rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
				/>
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<h1 class="text-xl font-semibold text-gray-900">{pageTitle}</h1>
			</div>

			<!-- Right Section: Search and User -->
			<div class="flex items-center gap-4">
				<button
					class="rounded-full bg-white p-2 shadow hover:bg-gray-100"
					aria-label="Notifications"
				>
					<Bell class="h-5 w-5 text-gray-400" />
				</button>
				<button class="rounded-full bg-white p-2 shadow hover:bg-gray-100" aria-label="Settings">
					<Settings class="h-5 w-5 text-gray-400" />
				</button>
				<div class="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
					<img
						src={data.user?.avatar || '/placeholder-avatar-1.svg'}
						alt="User"
						class="h-8 w-8 rounded-full"
						loading="lazy"
						decoding="async"
					/>
					<div class="flex flex-col text-left">
						<span class="text-sm font-normal text-gray-800">{data.user?.email}</span>
						<span class="text-xs capitalize text-gray-400"
							>{data.user?.role === 'user' ? 'patient' : data.user?.role}</span
						>
					</div>
				</div>
			</div>
		</header>

		<main class="flex-1 overflow-y-auto bg-[#f4f8fb]">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
