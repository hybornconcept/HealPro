<script lang="ts">
	import { LoadingSpinner, LoadingOverlay } from '$lib';
	import { onMount } from 'svelte';

	let showOverlay = $state(false);
	let isLoading = $state(false);

	function simulateLoading() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}

	function toggleOverlay() {
		showOverlay = !showOverlay;
		if (showOverlay) {
			setTimeout(() => {
				showOverlay = false;
			}, 3000);
		}
	}
</script>

<svelte:head>
	<title>Loading Demo</title>
</svelte:head>

<div class="container">
	<h1>Loading Components Demo</h1>
	
	<div class="demo-section">
		<h2>Loading Spinner</h2>
		<div class="spinner-examples">
			<div class="example">
				<h3>Default</h3>
				<LoadingSpinner />
			</div>
			
			<div class="example">
				<h3>Large Blue</h3>
				<LoadingSpinner size={60} color="#3b82f6" />
			</div>
			
			<div class="example">
				<h3>Small Green</h3>
				<LoadingSpinner size={24} color="#10b981" strokeWidth={3} />
			</div>
		</div>
	</div>

	<div class="demo-section">
		<h2>Loading Overlay</h2>
		<div class="button-group">
			<button onclick={toggleOverlay} class="btn">
				Show Loading Overlay
			</button>
			
			<button onclick={simulateLoading} class="btn">
				Simulate Loading Process
			</button>
		</div>
		
		{#if isLoading}
			<div class="inline-loading">
				<LoadingSpinner size={20} />
				<span>Processing...</span>
			</div>
		{/if}
	</div>

	<LoadingOverlay 
		show={showOverlay} 
		message="Loading content..." 
		spinnerSize={60}
	/>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.demo-section {
		margin-bottom: 3rem;
		padding: 1.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
	}

	.spinner-examples {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.example {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		min-width: 120px;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.5rem 1rem;
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.2s;
	}

	.btn:hover {
		background-color: #2563eb;
	}

	.inline-loading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background-color: #f3f4f6;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	h1 {
		color: #1f2937;
		margin-bottom: 2rem;
	}

	h2 {
		color: #374151;
		margin-bottom: 1rem;
	}

	h3 {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0;
	}
</style>
