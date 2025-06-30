<script lang="ts">
	import { page } from '$app/stores';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';

	import { Settings } from '@lucide/svelte';

	import * as Avatar from '$lib/components/ui/avatar/index.js';

	import { Input } from '$lib/components/ui/input/index.js';

	import { BellIcon, Search, ChevronDown, Phone, Mail } from '@lucide/svelte';

	// Import patient data from lib/index.ts
	import {
		kpis,
		patientInfo,
		tabs,
		demographics,
		visitData,
		visitChartConfig,
		totalVisits
	} from '$lib/index';

	// Get the sidebar context
	const sidebar = useSidebar();

	// Function to get the current route name
	function getRouteName(path: string): string {
		// Extract the last part of the path
		const segments = path.split('/').filter(Boolean);
		const lastSegment = segments[segments.length - 1] || 'home';

		// Convert to title case and replace hyphens with spaces
		return lastSegment
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Get the current route name using Svelte 5 runes
	const routeName = $derived(getRouteName($page.url.pathname));
</script>

<header class="header-poppins flex w-full items-center justify-between border-b bg-white px-8 py-4">
	<!-- Left: Back link and title -->
	<div class="flex flex-col">
		<a
			href="/user/doctors"
			class="mb-1 flex items-center text-xs text-gray-400 hover:text-gray-600"
		>
			<svg
				class="mr-1 h-4 w-4"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Doctor List
		</a>
		<span class="text-2xl font-semibold text-gray-900">{routeName}</span>
	</div>
	<!-- Right: Notification and user -->
	<div class="flex items-center gap-4">
		<!-- Notification icon -->
		<div class="flex items-center justify-center rounded-full bg-[#edeaff] p-2">
			<svg
				class="h-5 w-5 text-[#a99cf7]"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
				/>
			</svg>
		</div>
		<!-- User info -->
		<div class="flex items-center gap-2">
			<img
				src="https://randomuser.me/api/portraits/women/44.jpg"
				alt="Milla Willow"
				class="h-9 w-9 rounded-full object-cover"
			/>
			<div class="flex flex-col">
				<span class="text-sm font-semibold text-gray-900">Milla Willow</span>
				<span class="text-xs text-gray-400">Admin</span>
			</div>
		</div>
	</div>
</header>

<style>
	.header-poppins {
		font-family: 'Poppins', sans-serif;
	}
</style>
