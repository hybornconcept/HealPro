<script lang="ts">
	import CheckIcon from 'lucide-svelte/icons/check';
	import AlertCircleIcon from 'lucide-svelte/icons/alert-circle';
	import XIcon from 'lucide-svelte/icons/x';

	export let status: string;
</script>

{#if status === 'Confirmed' || status === 'Success' || status === 'Completed'}
	<span
		class="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800"
	>
		{status}
		<CheckIcon class="ml-1 size-4 text-green-600" />
	</span>
{:else if status === 'Pending'}
	<span
		class="inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-xs font-semibold text-orange-800"
	>
		{status}
		<AlertCircleIcon class="ml-1 size-4 text-orange-500" />
	</span>
{:else if status === 'Cancelled'}
	<span
		class="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold text-red-800"
	>
		{status}
		<XIcon class="ml-1 size-4 text-red-500" />
	</span>
{:else}
	<span>{status}</span>
{/if}
