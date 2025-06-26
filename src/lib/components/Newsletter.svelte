<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
</script>

<div class="relative mx-auto my-10 max-w-6xl overflow-hidden rounded-lg bg-blue-500 px-6 py-12">
	<!-- Background pattern lines -->
	<div class="absolute inset-0 opacity-10">
		<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
			<pattern id="wave-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
				<path
					d="M0,100 C40,80 60,120 100,100 C140,80 160,120 200,100"
					fill="none"
					stroke="white"
					stroke-width="1"
				/>
				<path
					d="M0,50 C40,30 60,70 100,50 C140,30 160,70 200,50"
					fill="none"
					stroke="white"
					stroke-width="1"
				/>
				<path
					d="M0,150 C40,130 60,170 100,150 C140,130 160,170 200,150"
					fill="none"
					stroke="white"
					stroke-width="1"
				/>
			</pattern>
			<rect width="100%" height="100%" fill="url(#wave-pattern)" />
		</svg>
	</div>

	<!-- Content -->
	<div class="relative z-10 mx-auto max-w-2xl text-center">
		<h2 class="text-3xl font-bold text-white sm:text-4xl">Keep Up with Us</h2>
		<h3 class="mt-2 text-2xl font-medium text-white sm:text-3xl">Subscribe for More Update</h3>

		<p class="mx-auto mt-4 max-w-md text-center text-white/90">
			Don't miss out on the latest news trends tips and exclusive views we bring updates straight to
			you fresh content ideas and something new stay informed with just one click Subscribe now
		</p>

		<!-- Email input form -->
		<div class="mx-auto mt-8 flex w-full max-w-md items-center rounded-full bg-white p-1">
			<Input
				type="email"
				placeholder="Enter your email.."
				class="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
			/>
			<Button class="rounded-full bg-blue-600 hover:bg-blue-700">Subscribe</Button>
		</div>
	</div>
</div>
