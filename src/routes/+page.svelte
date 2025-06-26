<script lang="ts">
	// Import components normally for now (we can optimize later)
	import Heroheader from '$lib/components/heroheader.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import StatsCard from '$lib/components/StatsCard.svelte';
	import FeatureGrid from '$lib/components/FeatureGrid.svelte';
	import About from '$components/About.svelte';
	import Process from '$lib/components/Process.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Newsletter from '$lib/components/Newsletter.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<!-- Main page content -->
<Heroheader />
<Hero />
<StatsCard />
<FeatureGrid />
<About />
<Process />
<Testimonials />
<Newsletter />
<Footer />
