<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Props
	interface Props {
		src: string;
		alt: string;
		width?: number;
		height?: number;
		class?: string;
		loading?: 'lazy' | 'eager';
		placeholder?: string;
		fallback?: string;
		sizes?: string;
		priority?: boolean;
	}

	let {
		src,
		alt,
		width,
		height,
		class: className = '',
		loading = 'lazy',
		placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
		fallback = '/images/placeholder.jpg',
		sizes,
		priority = false
	}: Props = $props();

	// State
	let isLoaded = $state(false);
	let hasError = $state(false);
	let imgElement = $state<HTMLElement>();
	let isIntersecting = $state(false);

	// Generate responsive image sources (disabled for now since responsive images don't exist)
	const generateSrcSet = (_baseSrc: string): string => {
		// Return empty string to disable srcset until responsive images are available
		return '';
	};

	// Intersection Observer for lazy loading
	onMount(() => {
		if (!browser || priority) {
			isIntersecting = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isIntersecting = true;
						observer.unobserve(entry.target);
					}
				});
			},
			{
				rootMargin: '50px'
			}
		);

		if (imgElement) {
			observer.observe(imgElement);
		}

		return () => {
			observer.disconnect();
		};
	});

	// Handle image load
	function handleLoad() {
		isLoaded = true;
	}

	// Handle image error
	function handleError() {
		hasError = true;
	}

	// Preload critical images
	$effect(() => {
		if (priority && browser) {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = src;
			if (sizes) link.setAttribute('imagesizes', sizes);
			document.head.appendChild(link);
		}
	});

	// Computed values
	const shouldLoad = $derived(priority || isIntersecting);
	const currentSrc = $derived(hasError ? fallback : src);
	const srcSet = $derived(generateSrcSet(currentSrc));
</script>

<div class="relative overflow-hidden {className}">
	<!-- Placeholder while loading -->
	{#if !isLoaded && !hasError}
		<img
			src={placeholder}
			{alt}
			{width}
			{height}
			class="absolute inset-0 h-full w-full object-cover blur-sm transition-opacity duration-300"
			aria-hidden="true"
		/>
	{/if}

	<!-- Main image -->
	{#if shouldLoad}
		<img
			bind:this={imgElement}
			src={currentSrc}
			srcset={srcSet}
			{sizes}
			{alt}
			{width}
			{height}
			{loading}
			class="h-full w-full object-cover transition-opacity duration-300 {isLoaded ? 'opacity-100' : 'opacity-0'}"
			onload={handleLoad}
			onerror={handleError}
			decoding="async"
		/>
	{:else}
		<!-- Placeholder element for intersection observer -->
		<div
			bind:this={imgElement}
			class="h-full w-full bg-gray-200"
			style="aspect-ratio: {width && height ? `${width}/${height}` : 'auto'}"
		></div>
	{/if}

	<!-- Loading indicator -->
	{#if !isLoaded && !hasError && shouldLoad}
		<div class="absolute inset-0 flex items-center justify-center bg-gray-100">
			<div class="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
		</div>
	{/if}

	<!-- Error state -->
	{#if hasError}
		<div class="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
			<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
		</div>
	{/if}
</div>
