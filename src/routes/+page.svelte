<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Critical components loaded immediately
	import Heroheader from '$lib/components/heroheader.svelte';
	import Hero from '$lib/components/Hero.svelte';

	// Lazy load non-critical components for better performance
	let StatsCard: any = $state(null);
	let FeatureGrid: any = $state(null);
	let About: any = $state(null);
	let Process: any = $state(null);
	let Testimonials: any = $state(null);
	let Newsletter: any = $state(null);
	let Footer: any = $state(null);

	let componentsLoaded = $state(false);

	onMount(async () => {
		if (!browser) return;

		// Load components progressively for better perceived performance
		const loadComponents = async () => {
			try {
				// Load in batches to prevent blocking
				const [statsModule, featureModule] = await Promise.all([
					import('$lib/components/StatsCard.svelte'),
					import('$lib/components/FeatureGrid.svelte')
				]);

				StatsCard = statsModule.default;
				FeatureGrid = featureModule.default;

				// Load next batch
				const [aboutModule, processModule] = await Promise.all([
					import('$lib/components/About.svelte'),
					import('$lib/components/Process.svelte')
				]);

				About = aboutModule.default;
				Process = processModule.default;

				// Load final batch
				const [testimonialsModule, newsletterModule, footerModule] = await Promise.all([
					import('$lib/components/Testimonials.svelte'),
					import('$lib/components/Newsletter.svelte'),
					import('$lib/components/Footer.svelte')
				]);

				Testimonials = testimonialsModule.default;
				Newsletter = newsletterModule.default;
				Footer = footerModule.default;

				componentsLoaded = true;
			} catch (error) {
				console.error('Failed to load components:', error);
			}
		};

		// Start loading after a short delay to prioritize critical content
		setTimeout(loadComponents, 100);
	});
</script>

<!-- Critical above-the-fold content loads immediately -->
<Heroheader />
<Hero />

<!-- Progressive loading of below-the-fold content -->
{#if StatsCard}
	<StatsCard />
{:else}
	<div class="mx-auto my-8 h-32 max-w-6xl animate-pulse rounded-lg bg-gray-100"></div>
{/if}

{#if FeatureGrid}
	<FeatureGrid />
{:else}
	<div class="mx-auto my-8 h-64 max-w-6xl animate-pulse rounded-lg bg-gray-100"></div>
{/if}

{#if About}
	<About />
{:else}
	<div class="mx-auto my-8 h-48 max-w-6xl animate-pulse rounded-lg bg-gray-100"></div>
{/if}

{#if Process}
	<Process />
{:else}
	<div class="mx-auto my-8 h-56 max-w-6xl animate-pulse rounded-lg bg-gray-100"></div>
{/if}

{#if Testimonials}
	<Testimonials />
{:else}
	<div class="mx-auto my-8 h-40 max-w-6xl animate-pulse rounded-lg bg-gray-100"></div>
{/if}

{#if Newsletter}
	<Newsletter />
{:else}
	<div class="mx-auto my-8 h-32 max-w-6xl animate-pulse rounded-lg bg-gray-100"></div>
{/if}

{#if Footer}
	<Footer />
{:else}
	<div class="mx-auto my-8 h-48 max-w-6xl animate-pulse rounded-lg bg-gray-100"></div>
{/if}
