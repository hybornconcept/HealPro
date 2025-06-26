<script lang="ts">
	import { page } from '$app/stores';

	import {
		CalendarDays,
		ClipboardList,
		CreditCard,
		FileText,
		Home,
		Image,
		Inbox,
		Layers,
		ListChecks,
		Users
	} from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Header from '$lib/components/header.svelte';

	// Menu items for DoctorDude sidebar
	const items = [
		{
			title: 'Home',
			url: 'home',
			icon: Home
		},
		{
			title: "Today's Visits",
			url: 'visits',
			icon: FileText
		},
		{
			title: 'Schedule',
			url: 'schedule',
			icon: CalendarDays
		},
		{
			title: 'Patients',
			url: 'patients',
			icon: Users
		},
		{
			title: 'To-Dos',
			url: 'todos',
			icon: ListChecks
		},
		{
			title: 'Fax Inbox',
			url: 'fax',
			icon: Inbox,
			badge: '22'
		},
		{
			title: 'Staff',
			url: 'staff',
			icon: Users
		},

		{
			title: 'Imaging',
			url: 'imaging',
			icon: Image,
			dot: true
		},
		{
			title: 'Billing',
			url: 'billing',
			icon: CreditCard
		},
		{
			title: 'Memberships',
			url: 'memberships',
			icon: Layers
		},
		{
			title: 'CME',
			url: 'cme',
			icon: ClipboardList
		}
	];

	let { children } = $props();
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon">
		<Sidebar.Content>
			<div class="flex items-center px-4 py-2">
				<span class="text-lg font-semibold">🩺 DoctorDude</span>
			</div>
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a
											href={'/user/' + item.url}
											{...props}
											class="flex items-center gap-3 px-3 py-2"
										>
											<div class="flex w-5 items-center justify-center">
												<item.icon class="h-5 w-5" />
											</div>
											<span>{item.title}</span>
											{#if item.badge}
												<span
													class="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white"
													>{item.badge}</span
												>
											{/if}
											{#if item.dot}
												<span class="ml-auto h-2 w-2 rounded-full bg-red-500"></span>
											{/if}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
	<main class="flex-1">
		<Header />
		<div class="bg-[#f8f9fd] p-4">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>

<!-- https://multipurposethemes.com/blog/rhythm-best-responsive-medical-dashboard-with-bootstrap-ui-kit/ -->
<!-- https://www.koruux.com/50-examples-of-healthcare-UI/ -->
