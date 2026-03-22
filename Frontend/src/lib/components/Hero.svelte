<script lang="ts">
	import { onMount } from 'svelte';

	import { ArrowRight, Calendar, Check, Activity } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

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
	let typingSpeed = $state(100);
	let deletingSpeed = $state(50);
	let pauseDelay = $state(2000);
	let cursorVisible = $state(true);

	let cursorInterval: number;
	let typingTimeout: number;

	function typeText() {
		if (isWaiting) {
			typingTimeout = setTimeout(typeText, 100);
			return;
		}

		const currentPhrase = phrases[currentPhraseIndex];
		const currentLength = displayText.length;

		if (!isDeleting && displayText === currentPhrase) {
			isWaiting = true;
			typingTimeout = setTimeout(() => {
				isDeleting = true;
				isWaiting = false;
				typeText();
			}, pauseDelay);
			return;
		}

		if (isDeleting && displayText === '') {
			isDeleting = false;
			currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
			typingTimeout = setTimeout(typeText, typingSpeed);
			return;
		}

		if (isDeleting) {
			if (displayText.endsWith('>')) {
				const tagStartIndex = displayText.lastIndexOf('<');
				if (tagStartIndex !== -1) {
					displayText = displayText.substring(0, tagStartIndex);
				} else {
					displayText = displayText.substring(0, currentLength - 1);
				}
			} else {
				displayText = displayText.substring(0, currentLength - 1);
			}
		} else {
			const nextChar = currentPhrase[currentLength];
			if (nextChar === '<') {
				const tagEndIndex = currentPhrase.indexOf('>', currentLength);
				if (tagEndIndex !== -1) {
					displayText = currentPhrase.substring(0, tagEndIndex + 1);
				} else {
					displayText = currentPhrase.substring(0, currentLength + 1);
				}
			} else {
				displayText = currentPhrase.substring(0, currentLength + 1);
			}
		}

		typingTimeout = setTimeout(typeText, isDeleting ? deletingSpeed : typingSpeed);
	}

	onMount(() => {
		console.log('Hero component mounted');

		// Start cursor blinking
		cursorInterval = setInterval(() => {
			cursorVisible = !cursorVisible;
		}, 500);

		// Start the typing animation immediately
		setTimeout(() => {
			console.log('Starting typing animation');
			typeText();
		}, 100);

		// Cleanup function
		return () => {
			clearInterval(cursorInterval);
			clearTimeout(typingTimeout);
		};
	});
</script>

<!-- Hero Section -->
<section class="relative mx-auto my-10 flex max-w-6xl items-center px-4 py-10 md:my-20 md:min-h-[75vh] md:px-6">
	<!-- Mobile Background Image with Light Blue Overlay -->
	<div class="absolute inset-0 z-0 overflow-hidden rounded-3xl mt-10 flex items-center justify-center md:hidden">
		<img src="heroimage.png" alt="background" loading="lazy" class="h-full w-full object-cover object-center opacity-30" />
	</div>

	<div class="relative z-10 flex flex-col-reverse items-center gap-12 md:flex-row">
		<!-- Left side with doctor image and floating elements -->
		<div class="relative mx-auto w-[85%] sm:w-[70%] md:mx-0 md:w-1/2 hidden md:block">
			<div class="relative">
				<!-- Doctor image -->
				<img
					src="heroimage.png"
					alt="Doctor with clipboard"
					class="relative z-10 h-auto w-full max-w-sm rounded-lg mx-auto md:max-w-md md:mx-0"
					width="400"
					height="500"
					loading="lazy"
				/>

				<!-- Floating service badge -->
				<div
					class="absolute left-[-10px] top-1/2 z-20 flex scale-75 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg sm:scale-90 md:-left-10 md:scale-100 md:px-4 md:py-2"
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
						<Activity size={16} class="text-white" />
					</div>
					<span class="font-medium">24/7 Service</span>
				</div>

				<!-- Floating checkup badge -->
				<div
					class="absolute right-0 top-8 z-20 flex scale-75 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg sm:scale-90 md:right-16 md:top-12 md:scale-100 md:px-4 md:py-2"
				>
					<div class="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500">
						<Check class="h-4 w-4 text-white" />
					</div>
					<span class="font-medium">Regular Checkup</span>
				</div>

			
				<div
					class="absolute -bottom-5 right-[-10px] z-20 w-[120px] rounded-lg bg-white p-2 shadow-sm md:right-[30%] md:w-[150px] md:p-3"
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
		<div
			class="mt-8 flex w-full flex-col items-center justify-center text-center md:mt-0 md:w-1/2 md:items-start md:text-left"
		>
			
				<div class="mb-4 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1  text-sm font-semibold text-blue-700 border border-blue-100 shadow-sm transition-all hover:bg-blue-100">
					<span class="text-xs mr-1"> Welcome to HealPro</span>  <ArrowRight class="h-4 w-4" />
				</div>

			<h1
				class="min-h-56 text-pretty bg-linear-to-b from-blue-400 to-blue-800 bg-clip-text text-6xl font-black text-transparent transition-all duration-300 md:min-h-64 md:text-6xl xl:min-h-72 xl:text-7xl"
				style="font-family: 'Inter', sans-serif; font-weight: 900;"
			>
				<span>Your health</span><br />{@html displayText}<span
					class={cursorVisible ? 'opacity-100' : 'opacity-0'}>|</span
				>
			</h1>

			<div class="mt-4 flex flex-col items-center gap-4 md:items-start lg:mt-2.5">
				<p class="font-nunito text-gray-600">
					Connecting patients with medical professionals seamlessly. Browse, book, and receive care
					on your terms
				</p>

				<Button
					href="/appointments"
					class="group mt-4 flex w-70 mx-auto md:mx-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 active:scale-95 sm:w-2/3 md:w-1/2 md:gap-3 md:px-8 md:py-6 md:text-base"
				>
					Book Appointment
					<Calendar class="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-125" />
				</Button>
			</div>
		</div>
	</div>
</section>
