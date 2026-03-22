<script lang="ts">
	// Svelte component
</script>

<section class="relative mx-auto w-full max-w-6xl bg-white px-10 py-16 md:px-8 font-sans overflow-hidden">
	<!-- Subtle dot pattern background -->
	<div class="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-40"></div>

	<div class="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
		
		<!-- Left Column (Text on top, Step 1 at bottom) -->
		<div class="flex flex-col gap-6">
			<!-- Header Text -->
			<div class="flex flex-col items-start">
				<div class="mb-4 inline-flex items-center rounded bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 border border-blue-100 shadow-sm transition-all hover:bg-blue-100">
					<span class="mr-1 text-blue-500">~</span> How It Works
				</div>
				<h2 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
					Simple Steps to Follow
				</h2>
				<p class="text-base leading-relaxed text-gray-500">
					Our process is designed to be simple and stress-free with easy steps to follow. Just a clear path to getting the care you deserve.
				</p>
			</div>

			<div class="hidden md:block h-6 w-full"></div>

			<!-- Step 1 Card -->
			<div class="group relative overflow-hidden rounded-b-xl border border-gray-100 border-t-[3px] border-t-blue-600 bg-white p-5 md:p-6 shadow-md transition-all duration-500 hover:-translate-y-1">
				<!-- Hover Slide Background -->
				<div class="absolute inset-0 -z-10 -translate-y-full bg-blue-600 transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>
				
				<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100/50 bg-blue-50 text-lg font-black text-blue-600 shadow-sm transition-colors duration-500 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white md:h-12 md:w-12 md:text-xl">
					1
				</div>
				<h3 class="mb-2 text-lg font-bold text-gray-900 transition-colors duration-500 group-hover:text-white">Search for Health Provider</h3>
				<p class="text-[0.85rem] leading-relaxed text-gray-500 transition-colors duration-500 group-hover:text-blue-50">
					Search by need, location, or expertise. Find thousands of trusted professionals, personalized care at your fingertips. Book in minutes and be seen on time.
				</p>
			</div>
			
			<div class="hidden md:block h-24 w-full rounded-2xl bg-linear-to-b from-gray-50/50 to-gray-100/30"></div>
		</div>

		<!-- Middle Column -->
		<div class="flex flex-col gap-6 pt-8 md:pt-28 md:pl-2">
			<!-- Step 2 Card -->
			<div class="group relative overflow-hidden rounded-b-xl border border-gray-100 border-t-[3px] border-t-blue-600 bg-white p-5 md:p-6 shadow-md transition-all duration-500 hover:-translate-y-1">
				<!-- Hover Slide Background -->
				<div class="absolute inset-0 -z-10 -translate-y-full bg-blue-600 transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>

				<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100/50 bg-blue-50 text-lg font-black text-blue-600 shadow-sm transition-colors duration-500 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white md:h-12 md:w-12 md:text-xl">
					2
				</div>
				<h3 class="mb-2 text-lg font-bold text-gray-900 transition-colors duration-500 group-hover:text-white">Check Provider's Profile</h3>
				<p class="text-[0.85rem] leading-relaxed text-gray-500 transition-colors duration-500 group-hover:text-blue-50">
					Explore our trusted doctors' profiles to learn more about their expertise, experience, and commitment to providing exceptional care. Make an informed choice for your health.
				</p>
			</div>

			<!-- Large Placeholder Box -->
			<div class="hidden md:block h-72 w-full rounded-2xl bg-linear-to-b from-gray-50/80 to-gray-100/30"></div>
		</div>

		<!-- Right Column -->
		<div class="flex flex-col gap-6 md:pr-2">
			<!-- Step 3 Card -->
			<div class="group relative overflow-hidden rounded-b-xl border border-gray-100 border-t-[3px] border-t-blue-600 bg-white p-5 md:p-6 shadow-md transition-all duration-500 hover:-translate-y-1">
				<!-- Hover Slide Background -->
				<div class="absolute inset-0 -z-10 -translate-y-full bg-blue-600 transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>

				<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100/50 bg-blue-50 text-lg font-black text-blue-600 shadow-sm transition-colors duration-500 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white md:h-12 md:w-12 md:text-xl">
					3
				</div>
				<h3 class="mb-2 text-lg font-bold text-gray-900 transition-colors duration-500 group-hover:text-white">Schedule Appointments</h3>
				<p class="text-[0.85rem] leading-relaxed text-gray-500 transition-colors duration-500 group-hover:text-blue-50">
					Schedule appointments in just a few taps. Choose your doctor, date, and time. No long waits, no stress. Enjoy instant confirmations with real-time slot availability.
				</p>
			</div>
			
			<div class="hidden md:block h-64 w-full rounded-2xl bg-linear-to-b from-gray-50/80 to-gray-100/30"></div>
		</div>

	</div>
</section>
