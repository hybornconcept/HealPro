<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { ArrowRight, ArrowDown, Landmark, Hospital, User, Activity, Menu, X } from '@lucide/svelte';
	import SlideButton from '$lib/components/SlideButton.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let menuItems = $state([
		{ name: 'Features', href: '#features', label: 'Features' },
		{ name: 'About', href: '#about', label: 'About' },
		{ name: 'How it works', href: '#process', label: 'How it works' },
		{ name: 'Solutions', href: '#Solutions', label: 'Solutions' },
		{ name: 'Vision', href: '#Vision', label: 'Vision' }
	]);

	let menuState = $state(false);
	let registerMenuState = $state(false);
	let mounted = $state(false);
	let y = $state(0);

	onMount(() => {
		mounted = true;
		const handleScroll = () => {
			y = window.scrollY;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Use $derived for computed values
	let isScrolled = $derived(mounted && y > 50);

	// Smooth scroll function
	function smoothScroll(event: MouseEvent, targetId: string) {
		if (!browser) return;

		event.preventDefault();

		const targetElement = document.querySelector(targetId);
		if (!targetElement) return;

		const headerOffset = 80;
		const elementPosition = targetElement.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});

		menuState = false;
	}
</script>

<!-- Header -->
<header
	class="fixed left-0 right-0 top-0 z-50 w-full bg-white py-4 transition-all duration-300"
	class:bg-white={isScrolled}
	class:shadow-md={isScrolled}
>
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6">
		<!-- Logo (10%) -->
		<a href="/" class="flex w-auto items-center text-xl sm:text-2xl md:w-[15%] lg:w-[10%]">
			<!-- <Activity class="h-5 w-5 text-blue-500" /> -->
			<div class="rounded-full border border-blue-500 p-1 sm:p-1.5">
				<div class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 sm:h-9 sm:w-9">
					<Activity class="h-3 w-3 text-white sm:h-4 sm:w-4" />
				</div>
			</div>
			<span class="border-blue-300 p-2 font-bold">
				Heal<span class="text-blue-500">Pro.</span>
			</span>
		</a>

		<!-- Navigation (60%) -->
		<nav class="hidden w-[60%] items-center justify-center gap-8 md:flex">
			{#each menuItems as item}
				<a
					href={item.href}
					class="font-medium text-gray-800 transition-colors hover:text-blue-600"
					onclick={(e) => smoothScroll(e, item.href)}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- login Button (30%) -->
		<div class="flex w-auto items-center justify-end gap-2 md:w-[30%]">
			<div class="hidden md:block">
				<SlideButton title="Login" rounded="full" icon={ArrowRight} href="/login" width="w-auto" />
			</div>
			<div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class="hidden items-center justify-center rounded-lg border-2 border-blue-600 px-4 py-2 text-blue-500 transition-colors hover:bg-blue-50 md:flex"
					>
						Register
						<ArrowDown class="ml-1 h-4 w-4" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-30 z-50">
						<DropdownMenu.Group>
							<DropdownMenu.Item onSelect={() => (window.location.href = '/register?type=user')}>
								<User class="mr-2 h-4 w-4" />
								<span>Patient</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								onSelect={() => (window.location.href = '/register?type=provider')}
							>
								<Hospital class="mr-2 h-4 w-4" />
								<span>Provider</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={() => (window.location.href = '/register?type=hmo')}>
								<Landmark class="mr-2 h-4 w-4" />
								<span>HMO</span>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<!-- Mobile Menu Toggle Button -->
			<button class="ml-3 flex items-center justify-center rounded-md p-2 text-blue-600 transition-colors duration-200 hover:bg-blue-50 md:hidden" onclick={() => menuState = !menuState} aria-label="Toggle menu">
				{#if menuState}
					<X class="h-6 w-6" />
				{:else}
					<Menu class="h-6 w-6" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Dropdown Menu -->
	<div 
		class="overflow-hidden bg-white shadow-lg shadow-blue-900/5 transition-all duration-300 ease-in-out md:hidden"
		class:border-t={menuState}
		class:border-gray-100={menuState}
		style:max-height={menuState ? '500px' : '0px'}
		style:opacity={menuState ? '1' : '0'}
	>
		<nav class="flex flex-col space-y-4 px-6 py-4">
			{#each menuItems as item}
				<a
					href={item.href}
					class="block font-medium text-gray-800 transition-colors hover:text-blue-600"
					onclick={(e) => smoothScroll(e, item.href)}
				>
					{item.label}
				</a>
			{/each}
			
			<div class="mt-2 border-t border-gray-100 pt-4">
				<a
					href="/login"
					class="mb-4 flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
				>
					Login <ArrowRight class="ml-2 h-4 w-4" />
				</a>

				<button 
					class="mb-3 flex w-full items-center justify-center rounded-full border-2 border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-50"
					onclick={() => registerMenuState = !registerMenuState}
				>
					Register
					<ArrowDown class="ml-2 h-4 w-4 transition-transform duration-200 {registerMenuState ? 'rotate-180' : ''}" />
				</button>
				
				<div 
					class="flex flex-col overflow-hidden transition-all duration-300"
					style:max-height={registerMenuState ? '200px' : '0px'}
					style:opacity={registerMenuState ? '1' : '0'}
				>
					<a href="/register?type=user" class="mb-3 mt-1 flex items-center text-sm font-medium text-gray-800 transition-colors hover:text-blue-600">
						<User class="mr-2 h-4 w-4" /> Patient
					</a>
					<a href="/register?type=provider" class="mb-3 flex items-center text-sm font-medium text-gray-800 transition-colors hover:text-blue-600">
						<Hospital class="mr-2 h-4 w-4" /> Provider
					</a>
					<a href="/register?type=hmo" class="mb-2 flex items-center text-sm font-medium text-gray-800 transition-colors hover:text-blue-600">
						<Landmark class="mr-2 h-4 w-4" /> HMO
					</a>
				</div>
			</div>
		</nav>
	</div>
</header>
