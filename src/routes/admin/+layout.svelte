<script lang="ts">
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
	import HeaderAdmin from '$lib/components/HeaderAdmin.svelte';

	// Menu items for DoctorDude sidebar
	const items = [
		{
			title: 'Appointments',
			url: 'appointments',

			icon: CalendarDays
		},

		{
			title: 'Activity',
			url: 'activity',
			icon: Users
		},
		{
			title: 'Summary',
			url: 'summary',
			icon: ListChecks
		},
		{
			title: 'Patient Information',
			url: 'patient_info',
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
											href={'/admin/' + item.url}
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
		<HeaderAdmin />
		<div class="flex justify-center overflow-x-hidden bg-[#f8f9fd]">
			<div class="w-full max-w-7xl px-2 py-6 sm:px-6 lg:px-4">
				{@render children?.()}
			</div>
		</div>
	</main>
</Sidebar.Provider>

<!-- https://multipurposethemes.com/blog/rhythm-best-responsive-medical-dashboard-with-bootstrap-ui-kit/ -->
<!-- https://www.koruux.com/50-examples-of-healthcare-UI/ -->
