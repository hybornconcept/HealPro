<script lang="ts">
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { fade } from 'svelte/transition';
</script>

<div
	class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm"
	transition:fade={{ duration: 200 }}
>
	<div class="flex flex-col items-center gap-4">
		<LoadingSpinner size={48} />
		<p class="animate-pulse text-sm font-medium text-gray-500">Loading...</p>
	</div>
</div>
