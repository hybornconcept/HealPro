<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let {
		stats = [
			{ value: '100K', label: 'Recovered Patients' },
			{ value: '200+', label: 'Staff Members' },
			{ value: '108K+', label: 'Satisfaction Rate' },
			{ value: '310+', label: 'Range of Services' }
		]
	} = $props();

	// Parse the numeric values from the stats
	const numericValues = stats.map((stat) => {
		const match = stat.value.match(/^([\d,.]+)([^\d]*)$/);
		return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
	});

	// Create tweened stores for each value
	const animatedStores = numericValues.map((val) =>
		tweened(0, {
			duration: 3000,
			easing: cubicOut
		})
	);

	// Create a reactive array using $state
	let animatedValues = $state(Array(stats.length).fill(0));

	function getSuffix(val: string) {
		const match = val.match(/^([\d,.]+)([^\d]*)$/);
		return match ? match[2] : '';
	}

	onMount(() => {
		// Subscribe to each store and update the values array
		const unsubscribers = animatedStores.map((store, i) => {
			return store.subscribe((value) => {
				animatedValues[i] = value;
			});
		});

		// Start the animations when the component mounts
		setTimeout(() => {
			animatedStores.forEach((store, i) => {
				store.set(numericValues[i]);
			});
		}, 500);

		// Cleanup subscriptions
		return () => {
			unsubscribers.forEach((unsub) => unsub());
		};
	});
</script>


<div class="relative z-30 grid w-full grid-cols-2 gap-y-8 bg-linear-to-b from-blue-600 to-blue-900 px-4 py-8 lg:-translate-y-1/2 md:flex md:items-center md:justify-between md:px-30 md:py-10">

	{#each stats as stat, i (stat.label)}
		<div class="mx-auto flex flex-col items-center text-center">
			<span
				class="text-3xl font-bold text-white sm:text-4xl md:text-5xl"
				style="font-family: 'Inter', sans-serif; font-weight: 900;"
			>
				{animatedValues[i] % 1 === 0
					? Math.round(animatedValues[i])
					: animatedValues[i].toLocaleString(undefined, { maximumFractionDigits: 1 })}
				{getSuffix(stat.value)}
			</span>
			<span class="mt-2 text-center text-sm text-white/80">
				{stat.label}
			</span>
		</div>
		{#if i < stats.length - 1}
			<div class="hidden h-12 border-l border-slate-100 md:block"></div>
		{/if}
	{/each}
</div>
