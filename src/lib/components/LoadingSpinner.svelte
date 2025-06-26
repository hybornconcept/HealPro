<script lang="ts">
	interface Props {
		size?: number;
		color?: string;
		strokeWidth?: number;
		class?: string;
	}

	let { size = 40, color = 'currentColor', strokeWidth = 4, class: className = '' }: Props = $props();
</script>

<div class="loading-spinner {className}" style="width: {size}px; height: {size}px;">
	<svg
		class="animate-spin"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle
			cx="12"
			cy="12"
			r="10"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-dasharray="32"
			stroke-dashoffset="32"
			opacity="0.3"
		/>
		<circle
			cx="12"
			cy="12"
			r="10"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-dasharray="32"
			stroke-dashoffset="24"
		/>
	</svg>
</div>

<style>
	.loading-spinner {
		display: inline-block;
	}

	.animate-spin {
		animation: spin 1s linear infinite;
		width: 100%;
		height: 100%;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
