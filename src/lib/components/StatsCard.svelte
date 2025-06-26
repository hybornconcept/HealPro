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
			duration: 2000,
			easing: cubicOut
		})
	);

	// Create a reactive array using $state
	let animatedValues = $state(Array(stats.length).fill(0));

	// Subscribe to each store and update the values array
	animatedStores.forEach((store, i) => {
		store.subscribe((value) => {
			animatedValues[i] = value;
		});
	});

	function getSuffix(val) {
		const match = val.match(/^([\d,.]+)([^\d]*)$/);
		return match ? match[2] : '';
	}

	onMount(() => {
		// Start the animations when the component mounts
		animatedStores.forEach((store, i) => {
			store.set(numericValues[i]);
		});
	});
</script>

<div class="flex w-full items-center justify-between bg-[#0b1623] px-30 py-10">
	{#each stats as stat, i (stat.label)}
		<div class="mx-auto flex flex-col items-center text-center">
			<span class="text-5xl font-bold text-white">
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
			<div class="h-12 border-l border-gray-700"></div>
		{/if}
	{/each}
</div>
