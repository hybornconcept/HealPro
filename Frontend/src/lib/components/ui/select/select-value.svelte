<script lang="ts">
	import { cn } from '$lib/utils';

	let { ref = $bindable(null), class: className, placeholder, ...restProps } = $props();
</script>

<span
	bind:this={ref}
	data-slot="select-value"
	class={cn('pointer-events-none', className)}
	{...restProps}
>
	{#if restProps.children}
		{@render restProps.children()}
	{:else}
		{placeholder}
	{/if}
</span>
