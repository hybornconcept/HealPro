<script lang="ts">
	// Critical components loaded immediately
	import Heroheader from '$lib/components/heroheader.svelte';
	import Hero from '$lib/components/Hero.svelte';
	// Below-the-fold components
	import StatsCard from '$lib/components/StatsCard.svelte';
	import FeatureGrid from '$lib/components/FeatureGrid.svelte';
	import About from '$lib/components/About.svelte';
	import Process from '$lib/components/Process.svelte';
	import Statement from '$lib/components/Statement.svelte';
	import Newsletter from '$lib/components/Newsletter.svelte';
	import Solutions from '$lib/components/Solutions.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<!-- Critical above-the-fold content loads immediately -->
<Heroheader />
<Hero />

<!-- Below-the-fold content with slight delay -->
<StatsCard />
<FeatureGrid />
<About />
<Process />
<Solutions />
<Statement />
<Newsletter />
<Footer />
