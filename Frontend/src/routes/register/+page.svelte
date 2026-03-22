<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import NewUser from '$lib/components/NewUser.svelte';
	import NewProvider from '$lib/components/NewProvider.svelte';
	import NewHMO from '$lib/components/NewHMO.svelte';
	import { goto } from '$app/navigation';

	// Derive registration type directly from URL params
	let registrationType = $derived($page.url.searchParams.get('type') || 'user');

	// Map types to components
	const components = {
		user: NewUser,
		provider: NewProvider,
		hmo: NewHMO
	};

	// Get current component, default to NewUser if type is invalid
	let CurrentComponent = $derived(
		components[registrationType as keyof typeof components] || NewUser
	);
</script>

<div
	class="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[#f1f5f9] p-4 pt-4 sm:pt-8 pb-10"
>
	<!-- Registration type selector -->
	<div class="mb-6 flex w-full justify-center">
		<div class="flex flex-wrap items-center justify-center rounded-full bg-white p-1 shadow-lg border border-gray-100">
			<button
				class="rounded-full px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
				onclick={() => goto('/')}
			>
				Home
			</button>
			<button
				class={`rounded-full px-5 py-2 text-sm font-semibold transition ${
					registrationType === 'user' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
				}`}
				onclick={() => goto('?type=user', { replaceState: true })}
			>
				Patient
			</button>
			<button
				class={`rounded-full px-5 py-2 text-sm font-semibold transition ${
					registrationType === 'provider' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
				}`}
				onclick={() => goto('?type=provider', { replaceState: true })}
			>
				Provider
			</button>
			<button
				class={`rounded-full px-5 py-2 text-sm font-semibold transition ${
					registrationType === 'hmo' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
				}`}
				onclick={() => goto('?type=hmo', { replaceState: true })}
			>
				HMO
			</button>
		</div>
	</div>

	<!-- Main Card Container -->
	<div class="flex w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
		<!-- Left: Illustration (2/5 width) -->
		<div class="hidden w-2/5 bg-[#f7f7f7] md:flex md:flex-col">
			<img
				src={registrationType === 'user'
					? 'userC.jpg'
					: registrationType === 'provider'
						? 'facility.jpg'
						: 'schedule.jpg'}
				alt="Registration illustration"
				width="1920"
				height="1080"
				loading="lazy"
				class="h-full w-full object-cover"
			/>
		</div>

		<!-- Right: Registration Form (3/5 width) -->
		<div class="w-full md:w-3/5">
			{#if browser}
				<CurrentComponent />
			{:else}
				<div class="flex min-h-[400px] items-center justify-center">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
					></div>
				</div>
			{/if}
		</div>
	</div>
</div>
