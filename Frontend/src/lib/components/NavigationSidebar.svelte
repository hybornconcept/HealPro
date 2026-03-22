<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { PowerOff, Activity } from 'lucide-svelte';

	import type { ComponentProps } from 'svelte';

	import { cn } from '$lib/utils';
	import { getIcon } from '$lib/config/navigation';
	import type { NavItem } from '$lib/config/navigation';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		currentPath = '/',
		navItems = [],
		brandName = 'HealPro.',
		brandUrl = '/',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		currentPath?: string;
		navItems?: NavItem[];
		brandName?: string;
		brandUrl?: string;
	} = $props();

	// Function to check if a nav item is active
	const isActive = (url: string) => {
		return currentPath === url;
	};
</script>

<Sidebar.Root {collapsible} bind:ref {...restProps}>
	<Sidebar.Header>
		<a
			href={brandUrl}
			class="flex items-center justify-center gap-2 px-4 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
		>
			<div
				class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 ring-1 ring-blue-500 ring-offset-2 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:ring-offset-1"
			>
				<Activity
					class="h-3.5 w-3.5 text-white group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:w-3"
				/>
			</div>
			<span class="text-2xl font-bold text-gray-900 group-data-[collapsible=icon]:sr-only">
				Heal<span class="text-blue-500">Pro.</span>
			</span>
		</a>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navItems as item}
						{@const itemIsActive = isActive(item.url)}
						{@const Icon = getIcon(item.icon)}
						<Sidebar.MenuItem
							class={itemIsActive
								? 'mx-2 rounded-lg bg-blue-100 group-data-[collapsible=icon]:mx-1'
								: 'mx-2 group-data-[collapsible=icon]:mx-1'}
						>
							<Sidebar.MenuButton isActive={itemIsActive}>
								{#snippet child({ props })}
									<a
										href={item.url}
										{...props}
										class={cn(
											props.class,
											'flex h-auto w-full items-center justify-between px-2 py-2 text-base font-normal transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2',
											itemIsActive
												? 'text-blue-700'
												: 'text-gray-700 hover:bg-blue-50 hover:text-gray-900'
										)}
										style="font-family: 'Nunito Sans', sans-serif;"
										data-sveltekit-preload-data="hover"
									>
										<div
											class="flex items-center gap-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
										>
											<Icon
												class="h-4 w-4 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
											/>
											<span class="group-data-[collapsible=icon]:sr-only">{item.title}</span>
										</div>
										<svg
											class="h-4 w-4 text-gray-400 transition-colors group-data-[collapsible=icon]:sr-only {itemIsActive
												? 'text-blue-500'
												: 'group-hover:text-gray-600'}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="m9 18 6-6-6-6"
											/>
										</svg>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<!-- <Separator orientation="horizontal" /> -->
	<Sidebar.Footer>
		<div class="px-2 py-2 group-data-[collapsible=icon]:p-0">
			<form action="/logout" method="POST">
				<button
					type="submit"
					class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-base font-normal text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
					style="font-family: 'Nunito Sans', sans-serif;"
				>
					<PowerOff class="h-5 w-5" />
					<span class="group-data-[collapsible=icon]:sr-only">Logout</span>
				</button>
			</form>
		</div>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
