<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';
	import { mode } from 'mode-watcher';

	let { ...restProps } = $props();
</script>

<Sonner theme={mode.current} class="toaster group" {...restProps} />

<style>
	/* Base toast styles */
	:global([data-sonner-toast]) {
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
		border-radius: 0.75rem !important;
		padding: 1rem !important;
		border: none !important;
		border-bottom: 4px solid !important;
	}

	/* Success - Green */
	:global([data-sonner-toast][data-type='success']) {
		background: linear-gradient(to bottom, white 0%, rgb(240 253 244) 100%) !important;
		border-bottom-color: #22c55e !important;
	}

	:global([data-sonner-toast][data-type='success'] [data-icon]) {
		color: #22c55e !important;
	}

	/* Error - Red */
	:global([data-sonner-toast][data-type='error']) {
		background: linear-gradient(to bottom, white 0%, rgb(254 242 242) 100%) !important;
		border-bottom-color: #ef4444 !important;
	}

	:global([data-sonner-toast][data-type='error'] [data-icon]) {
		color: #ef4444 !important;
	}

	/* Warning - Orange (optional) */
	:global([data-sonner-toast][data-type='warning']) {
		background: linear-gradient(to bottom, white 0%, rgb(255 247 237) 100%) !important;
		border-bottom-color: #f97316 !important;
	}

	:global([data-sonner-toast][data-type='warning'] [data-icon]) {
		color: #f97316 !important;
	}

	/* Info - Blue (optional) */
	:global([data-sonner-toast][data-type='info']) {
		background: linear-gradient(to bottom, white 0%, rgb(239 246 255) 100%) !important;
		border-bottom-color: #3b82f6 !important;
	}

	:global([data-sonner-toast][data-type='info'] [data-icon]) {
		color: #3b82f6 !important;
	}

	/* Default/Loading - Gray */
	:global([data-sonner-toast][data-type='loading']),
	:global([data-sonner-toast]:not([data-type])) {
		background: linear-gradient(to bottom, white 0%, rgb(249 250 251) 100%) !important;
		border-bottom-color: #6b7280 !important;
	}

	:global([data-sonner-toast][data-type='loading'] [data-icon]),
	:global([data-sonner-toast]:not([data-type]) [data-icon]) {
		color: #6b7280 !important;
	}

	/* Icon styles */
	:global([data-sonner-toast] [data-icon]) {
		width: 1.25rem !important;
		height: 1.25rem !important;
		margin-right: 0.75rem !important;
	}

	/* Title styles */
	:global([data-sonner-toast] [data-title]) {
		font-size: 0.875rem !important;
		font-weight: 600 !important;
		margin-bottom: 0.25rem !important;
		color: #111827 !important;
	}

	/* Description styles */
	:global([data-sonner-toast] [data-description]) {
		font-size: 0.75rem !important;
		color: #6b7280 !important;
		font-weight: 400 !important;
	}

	/* Close button styles */
	:global([data-sonner-toast] [data-close-button]) {
		background: transparent !important;
		border: none !important;
		color: #9ca3af !important;
		transition: all 0.2s !important;
	}

	:global([data-sonner-toast] [data-close-button]:hover) {
		background: rgba(0, 0, 0, 0.05) !important;
		color: #6b7280 !important;
	}
</style>
