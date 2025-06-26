<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Activity, ArrowRight, Check } from '@lucide/svelte';
	import OptimizedImage from './OptimizedImage.svelte';

	// Typing effect variables
	const phrases = [
		'at your<br />Convenience.',
		'at your<br />Schedule.',
		'One Click<br />Away.',
		'Claims<br />Made Simple.',
		'Skip the<br />Wait.'
	];

	let currentPhraseIndex = $state(0);
	let displayText = $state('');
	let isDeleting = $state(false);
	let isWaiting = $state(false);
	let typingSpeed = $state(100); // milliseconds per character
	let deletingSpeed = $state(50); // faster deletion
	let pauseDelay = $state(2000); // pause at complete phrase
	let cursorVisible = $state(true);

	// Cursor blinking effect
	$effect(() => {
		const cursorInterval = setInterval(() => {
			cursorVisible = !cursorVisible;
		}, 500);

		return () => clearInterval(cursorInterval);
	});

	// Typing effect function
	$effect(() => {
		if (isWaiting) return;

		const currentPhrase = phrases[currentPhraseIndex];
		const currentLength = displayText.length;

		if (!isDeleting && displayText === currentPhrase) {
			// Finished typing current phrase, pause before deleting
			isWaiting = true;
			setTimeout(() => {
				isDeleting = true;
				isWaiting = false;
			}, pauseDelay);
			return;
		}

		if (isDeleting && displayText === '') {
			// Finished deleting, move to next phrase
			isDeleting = false;
			currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
			return;
		}

		// Set timeout for next character
		const timeout = setTimeout(
			() => {
				if (isDeleting) {
					// Delete character
					displayText = displayText.substring(0, currentLength - 1);
				} else {
					// Add character
					displayText = currentPhrase.substring(0, currentLength + 1);
				}
			},
			isDeleting ? deletingSpeed : typingSpeed
		);

		return () => clearTimeout(timeout);
	});
</script>

<!-- Hero Section -->
<section class="mx-auto my-20 max-w-6xl pt-15">
	<div class="flex flex-col items-center gap-12 md:flex-row">
		<!-- Left side with doctor image and floating elements -->
		<div class="relative w-full md:w-1/2">
			<div class="relative">
				<!-- Doctor image -->
				<OptimizedImage
					src="heroimage.png"
					alt="Doctor with clipboard"
					class="relative z-10 h-auto w-full max-w-md rounded-lg"
					width={400}
					height={500}
					priority={true}
					sizes="(max-width: 768px) 100vw, 400px"
				/>

				<!-- Floating service badge -->
				<div
					class="absolute top-1/2 -left-10 z-20 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg"
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
						<Activity size={16} class="text-white" />
					</div>
					<span class="font-medium">24/7 Service</span>
				</div>

				<!-- Floating checkup badge -->
				<div
					class="absolute top-12 right-16 z-20 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg"
				>
					<div class="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500">
						<Check class="h-4 w-4 text-white" />
					</div>
					<span class="font-medium">Regular Checkup</span>
				</div>

				<!-- Floating meet doctor card -->
				<!-- <div class="absolute -bottom-10 left-0 z-20 w-[300px] rounded-lg bg-white p-4 shadow-lg">
					<div class="flex items-center justify-between">
						<button
							class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white"
						>
							<span class="text-lg font-bold">+</span>
						</button>
					</div>
				</div> -->

				<!-- Floating stats card -->
				<div
					class="absolute right-[30%] -bottom-5 z-20 w-[150px] rounded-lg bg-white p-3 shadow-sm"
				>
					<div class="flex items-start gap-1">
						<!-- Blue bar -->
						<div class="h-16 w-3 rounded-sm bg-blue-700"></div>
						<div class="h-8 w-3 rounded-sm bg-blue-400"></div>

						<!-- Stats content -->
						<div class="flex flex-col">
							<div class="mb-2">
								<div class="flex items-center">
									<span class="text-sm font-bold text-blue-700">1048+</span>
								</div>
								<p class="text-[10px] text-gray-500">Professional Doctor</p>
							</div>
							<div>
								<div class="flex items-center">
									<span class="text-sm font-bold text-blue-400">900+</span>
								</div>
								<p class="text-[10px] text-gray-500">New Patient</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right side with text content -->
		<div class="w-full md:w-1/2">
			<p
				class="my-2 flex w-[35%] items-center rounded-full border border-blue-600 px-4 py-1 text-sm font-normal"
			>
				Welcome to HealPro
				<span class="ml-2 text-blue-600"><ArrowRight class="h-5 w-5" /></span>
			</p>

			<h1
				class="min-h-[8rem] bg-gradient-to-b from-blue-400 to-blue-800 bg-clip-text text-4xl font-extrabold text-balance text-pretty text-transparent transition-all duration-300 md:min-h-[12rem] md:text-6xl xl:min-h-[14rem] xl:text-7xl"
			>
				Your health<br />{@html displayText}<span
					class={cursorVisible ? 'opacity-100' : 'opacity-0'}>|</span
				>
			</h1>

			<div class="mt-4 flex flex-col gap-4">
				<p class=" text-gray-600">
					Connecting patients with medical professionals seamlessly. Browse, book, and receive care
					on your terms
				</p>

				<Button
					href="/schedule"
					class="w-1/2 rounded-full bg-blue-600 p-6 text-base hover:bg-blue-700"
				>
					Book Appointment
				</Button>
			</div>
		</div>
	</div>
</section>
