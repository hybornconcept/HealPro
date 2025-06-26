<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import NewUser from '$lib/components/NewUser.svelte';
	import NewFacility from '$lib/components/NewFacility.svelte';
	import NewHMO from '$lib/components/NewHMO.svelte';

	// Registration type state
	let registrationType = $state('user'); // Default to user registration

	// Parse the URL parameter on mount
	onMount(() => {
		const type = $page.url.searchParams.get('type');
		if (type && ['user', 'hospital', 'hmo'].includes(type)) {
			registrationType = type;
		}
	});

	// Update URL when registration type changes
	$effect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set('type', registrationType);
		window.history.replaceState({}, '', url);
	});

	// Function to change registration type
	function changeRegistrationType(type: 'user' | 'hospital' | 'hmo') {
		registrationType = type;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-4">
	<div class="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-md">
		<!-- Left: Illustration (2/5 width) -->
		<div class="hidden w-2/5 bg-[#f7f7f7] md:flex md:flex-col">
			<img
				src={registrationType === 'user'
					? '	user.jpg'
					: registrationType === 'hospital'
						? 'facility.jpg'
						: 'schedule.jpg'}
				alt="Registration illustration"
				width="1920"
				height="1080"
				class="h-full w-full object-cover"
			/>

			<!-- Registration type selector -->
			<!-- <div class="absolute bottom-8 left-8 flex flex-col space-y-4">
				<h3 class="text-lg font-semibold text-white drop-shadow-md">Register as:</h3>
				<div class="flex space-x-3">
					<button
						class={`rounded-md px-4 py-2 transition ${
							registrationType === 'user'
								? 'bg-blue-600 text-white'
								: 'bg-white/80 text-gray-800 hover:bg-white'
						}`}
						on:click={() => changeRegistrationType('user')}
					>
						Patient
					</button>
					<button
						class={`rounded-md px-4 py-2 transition ${
							registrationType === 'hospital'
								? 'bg-blue-600 text-white'
								: 'bg-white/80 text-gray-800 hover:bg-white'
						}`}
						on:click={() => changeRegistrationType('hospital')}
					>
						Hospital
					</button>
					<button
						class={`rounded-md px-4 py-2 transition ${
							registrationType === 'hmo'
								? 'bg-blue-600 text-white'
								: 'bg-white/80 text-gray-800 hover:bg-white'
						}`}
						on:click={() => changeRegistrationType('hmo')}
					>
						HMO
					</button>
				</div>
			</div> -->
		</div>

		<!-- Mobile registration type selector -->
		<div class="fixed top-4 right-0 left-0 z-10 flex justify-center md:hidden">
			<div class="flex rounded-full bg-white/90 p-1 shadow-md">
				<button
					class={`rounded-full px-4 py-2 transition ${
						registrationType === 'user' ? 'bg-blue-600 text-white' : 'text-gray-800'
					}`}
					on:click={() => changeRegistrationType('user')}
				>
					Patient
				</button>
				<button
					class={`rounded-full px-4 py-2 transition ${
						registrationType === 'hospital' ? 'bg-blue-600 text-white' : 'text-gray-800'
					}`}
					on:click={() => changeRegistrationType('hospital')}
				>
					Hospital
				</button>
				<button
					class={`rounded-full px-4 py-2 transition ${
						registrationType === 'hmo' ? 'bg-blue-600 text-white' : 'text-gray-800'
					}`}
					on:click={() => changeRegistrationType('hmo')}
				>
					HMO
				</button>
			</div>
		</div>

		<!-- Right: Registration Form (3/5 width) -->
		{#if registrationType === 'user'}
			<NewUser />
		{:else if registrationType === 'hospital'}
			<NewFacility />
		{:else if registrationType === 'hmo'}
			<NewHMO />
		{/if}
	</div>
</div>
