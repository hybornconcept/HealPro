<script lang="ts">
	import { Home, User, Users, Building2, Pill, FileText, Activity } from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Header from '$lib/components/header.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const items = [
		{ title: 'Home', url: '', icon: Home },
		{ title: 'Claims', url: 'claims', icon: User },
		{ title: 'Reports', url: 'reports', icon: FileText },
		{ title: 'Policies2', url: 'policies2', icon: Users },
		{ title: 'Policies', url: 'policies', icon: Users }
	];

	let { children } = $props();

	const currentPath = $derived(() => $page.url.pathname);

	function isActive(url: string) {
		if (url === '' && (currentPath() === '/user' || currentPath() === '/user/')) {
			return true;
		}
		if (url !== '' && (currentPath() === `/user/${url}` || currentPath() === `/user/${url}/`)) {
			return true;
		}
		return false;
	}

	// Remove the problematic effect that was redirecting all routes to /user
	// This was preventing navigation to subpages like /user/reports
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon" class="header-poppins">
		<Sidebar.Header>
			<a href="/" class="mx-auto flex w-[90%] items-center text-2xl">
				<Activity class="h-5 w-5 text-blue-500" />
				<span class="border-blue-300 p-2 font-bold">
					Heal<span class="text-blue-500">Pro.</span>
				</span>
			</a>
		</Sidebar.Header>

		<Sidebar.Content>
			<div class="flex flex-col px-4 py-6">
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a
										href={item.url === '' ? '/user' : '/user/' + item.url}
										{...props}
										class={`flex items-center gap-3 rounded-full px-4 py-2 transition-colors
                                            ${isActive(item.url) ? 'bg-[#2b7fff] font-medium text-white' : 'text-gray-700 hover:bg-gray-100'}
                                        `}
									>
										<div class="flex w-5 items-center justify-center">
											<item.icon class="h-5 w-5" />
										</div>
										<span>{item.title}</span>
										{#if item.badge}
											<span
												class="ml-auto rounded-full bg-[#2b7fff] px-2 py-0.5 text-xs font-medium text-white"
												>{item.badge}</span
											>
										{/if}
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</div>
		</Sidebar.Content>
	</Sidebar.Root>
	<main class="header-poppins flex-1">
		<Header />
		<div class="bg-[#f8f9fd] p-4">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>

<!-- https://multipurposethemes.com/blog/rhythm-best-responsive-medical-dashboard-with-bootstrap-ui-kit/ -->
<!-- https://www.koruux.com/50-examples-of-healthcare-UI/ -->
