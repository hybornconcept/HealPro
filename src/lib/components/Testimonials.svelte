<script lang="ts">
	import { ChevronLeft, ChevronRight, Star } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	// Define testimonials data with ONLY external images
	const testimonials = [
		{
			name: 'Sarah Johnson',
			text: 'The care I received was exceptional. The doctors took the time to listen and develop a treatment plan that worked for me.',
			rating: 4.8,
			image: 'https://randomuser.me/api/portraits/women/44.jpg',
			fallbackImage:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='40' r='25' fill='%23e2e8f0'/%3E%3Cpath d='M25,85 C25,65 75,65 75,85' fill='%23e2e8f0'/%3E%3C/svg%3E"
		},
		{
			name: 'Michael Chen',
			text: "I've never felt more comfortable at a medical facility. The staff is friendly and the doctors are knowledgeable and caring.",
			rating: 5.0,
			image: 'https://randomuser.me/api/portraits/men/32.jpg',
			fallbackImage:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='40' r='25' fill='%23e2e8f0'/%3E%3Cpath d='M25,85 C25,65 75,65 75,85' fill='%23e2e8f0'/%3E%3C/svg%3E"
		},
		{
			name: 'Emily Rodriguez',
			text: 'From scheduling to treatment, everything was seamless. I appreciate the modern approach to healthcare.',
			rating: 4.5,
			image: 'https://randomuser.me/api/portraits/women/68.jpg',
			fallbackImage:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='40' r='25' fill='%23e2e8f0'/%3E%3Cpath d='M25,85 C25,65 75,65 75,85' fill='%23e2e8f0'/%3E%3C/svg%3E"
		}
	];

	// Use Svelte 5 runes for state
	let currentTestimonialIndex = $state(0);
	let isLoaded = $state<Record<number, boolean>>({});
	let autoplayInterval = $state<number | null>(null);
	let isPaused = $state(false);

	// Auto-slide interval (in milliseconds)
	const slideInterval = 5000;

	// Start autoplay
	function startAutoplay() {
		if (browser && !autoplayInterval) {
			autoplayInterval = window.setInterval(() => {
				if (!isPaused) {
					handleNavClick('next');
				}
			}, slideInterval);
		}
	}

	// Stop autoplay
	function stopAutoplay() {
		if (browser && autoplayInterval) {
			window.clearInterval(autoplayInterval);
			autoplayInterval = null;
		}
	}

	// Pause on hover
	function handleMouseEnter() {
		isPaused = true;
	}

	function handleMouseLeave() {
		isPaused = false;
	}

	// Handle image error
	function handleImageError(e: Event) {
		const target = e.currentTarget as HTMLImageElement;
		target.src = testimonials[currentTestimonialIndex].fallbackImage;
	}

	// Preload only visible and next image
	$effect(() => {
		if (browser) {
			// Preload current image
			const img = new Image();
			img.src = testimonials[currentTestimonialIndex].image;
			img.onload = () => {
				isLoaded[currentTestimonialIndex] = true;
			};
			img.onerror = () => {
				// If image fails to load, mark as loaded anyway and use fallback
				isLoaded[currentTestimonialIndex] = true;
			};

			// Preload next image
			const nextIndex = (currentTestimonialIndex + 1) % testimonials.length;
			const nextImg = new Image();
			nextImg.src = testimonials[nextIndex].image;
		}
	});

	// Handle navigation with Svelte 5 syntax
	function handleNavClick(direction: 'next' | 'prev') {
		if (direction === 'next') {
			currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
		} else {
			currentTestimonialIndex =
				(currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
		}
	}

	// Start autoplay on mount and clean up on destroy
	onMount(() => {
		startAutoplay();
	});

	onDestroy(() => {
		stopAutoplay();
	});
</script>

<!-- Testimonial Section -->
<section id="testimonials" class="w-full bg-gray-50 px-6 py-20">
	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
		<!-- Left Column: Heading and Text -->
		<div class="flex flex-col">
			<span class="text-blue-600">Testimonial</span>
			<h2 class="mt-2 text-4xl font-bold text-gray-900">
				What Our Patients<br />Say About Us?
			</h2>
			<p class="mt-4 text-gray-600">
				Real feedback from real people moment of care that made difference<br />
				we're proud to be part of your journey your words inspire us every day
			</p>

			<a
				href="javascript:void(0)"
				class="mt-8 flex w-fit items-center rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
			>
				<span>View More</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="ml-2 h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 12h14"></path>
					<path d="m12 5 7 7-7 7"></path>
				</svg>
			</a>
		</div>

		<!-- Right Column: Testimonial -->
		<div
			class="flex flex-col justify-between"
			role="region"
			aria-label="Testimonial Carousel"
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
		>
			<!-- Testimonial content with transition -->
			<div class="relative h-[200px]">
				{#each testimonials as testimonial, i}
					<div
						class="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out"
						style="opacity: {i === currentTestimonialIndex ? '1' : '0'}; pointer-events: {i ===
						currentTestimonialIndex
							? 'auto'
							: 'none'}"
					>
						<p class="px-4 text-center text-lg text-gray-700">
							"{testimonial.text}"
						</p>
					</div>
				{/each}
			</div>

			<!-- Centered author info -->
			<div class="mt-2 flex justify-center">
				{#each testimonials as testimonial, i}
					<div
						class="flex flex-col items-center text-center transition-opacity duration-500 ease-in-out"
						style="opacity: {i === currentTestimonialIndex ? '1' : '0'}; display: {i ===
						currentTestimonialIndex
							? 'flex'
							: 'none'}"
					>
						<img
							src={testimonial.image}
							alt={testimonial.name}
							class="h-12 w-12 rounded-full object-cover"
							onerror={(e) => (e.currentTarget.src = testimonial.fallbackImage)}
						/>
						<div class="mt-2">
							<h4 class="font-semibold text-gray-900">{testimonial.name}</h4>
							<div class="flex items-center justify-center">
								{#each Array(5) as _, j}
									<Star
										class="h-4 w-4 {j < Math.floor(testimonial.rating)
											? 'fill-current text-yellow-400'
											: 'text-gray-300'}"
										filled={j < Math.floor(testimonial.rating)}
									/>
								{/each}
								<span class="ml-1 text-sm text-gray-600">{testimonial.rating}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Navigation buttons -->
			<div class="mt-6 flex justify-center gap-2">
				<button
					onclick={() => handleNavClick('prev')}
					class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
					aria-label="Previous testimonial"
				>
					<ChevronLeft class="h-5 w-5" />
				</button>
				<button
					onclick={() => handleNavClick('next')}
					class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
					aria-label="Next testimonial"
				>
					<ChevronRight class="h-5 w-5" />
				</button>
			</div>
		</div>
	</div>
</section>
