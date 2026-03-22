<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import { navigating } from '$app/stores';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	// let { children }: Props = $props();
	let { children } = $props<Props>();
</script>

{#if $navigating}
	<LoadingOverlay />
{/if}

{@render children()}
<Toaster position="top-center" />
