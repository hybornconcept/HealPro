<script lang="ts">
	import SlideButton from '$lib/components/SlideButton.svelte';
	import Star from 'lucide-svelte/icons/star';

	let { appointment, onFeedback } = $props();

	let isDisabled = $derived(appointment.status !== 'completed');
</script>

<div
	class={isDisabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer'}
	onclick={() => !isDisabled && onFeedback(appointment)}
	onkeydown={(e) => !isDisabled && e.key === 'Enter' && onFeedback(appointment)}
	role="button"
	tabindex={isDisabled ? -1 : 0}
>
	<SlideButton title="Rate" icon={Star} rounded="full" width="w-full" class="px-2 py-1 text-xs" />
</div>
