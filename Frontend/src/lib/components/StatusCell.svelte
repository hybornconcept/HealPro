<script lang="ts">
	import { Check, AlertCircle, X } from '@lucide/svelte';

	interface Props {
		status: string;
	}

	let { status }: Props = $props();
</script>

{#if status === 'Confirmed' || status === 'Success' || status === 'Completed'}
	<span
		class="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800"
	>
		{status}
		<Check class="ml-1 size-4 text-green-600" />
	</span>
{:else if status === 'Pending'}
	<span
		class="inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-xs font-semibold text-orange-800"
	>
		{status}
		<AlertCircle class="ml-1 size-4 text-orange-500" />
	</span>
{:else if status === 'Cancelled'}
	<span
		class="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold text-red-800"
	>
		{status}
		<X class="ml-1 size-4 text-red-500" />
	</span>
{:else}
	<span>{status}</span>
{/if}
