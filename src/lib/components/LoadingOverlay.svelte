<script lang="ts">
	import LoadingSpinner from './LoadingSpinner.svelte';

	interface Props {
		show?: boolean;
		message?: string;
		spinnerSize?: number;
		spinnerColor?: string;
		backgroundColor?: string;
		class?: string;
	}

	let { 
		show = true, 
		message = '', 
		spinnerSize = 50, 
		spinnerColor = '#3b82f6',
		backgroundColor = 'rgba(255, 255, 255, 0.9)',
		class: className = ''
	}: Props = $props();
</script>

{#if show}
	<div 
		class="loading-overlay {className}" 
		style="background-color: {backgroundColor};"
		role="status" 
		aria-label="Loading"
	>
		<div class="loading-content">
			<LoadingSpinner size={spinnerSize} color={spinnerColor} />
			{#if message}
				<p class="loading-message">{message}</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9998;
		backdrop-filter: blur(2px);
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.loading-message {
		margin: 0;
		font-size: 1rem;
		color: #374151;
		text-align: center;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.loading-overlay {
			background-color: rgba(15, 15, 15, 0.9);
		}
		
		.loading-message {
			color: #d1d5db;
		}
	}
</style>
