<script lang="ts">
	import { cn } from '$lib/utils';
	import { Loader2 } from 'lucide-svelte';

	let { class: className = undefined, size = 40, ...restProps } = $props();
</script>

<Loader2 class={cn('animate-spin text-blue-600', className)} {size} {...restProps} />
