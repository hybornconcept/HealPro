<script lang="ts">
	import { CheckCircle, Calendar, MonitorSmartphone } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<section id="about" class="w-full">
	<div class="mx-auto max-w-7xl px-10 py-16 sm:px-6 lg:px-8">
		<div class="flex flex-col gap-12 lg:flex-row lg:items-center">
			<!-- Left side: Image -->
			<div class="hidden lg:block lg:w-1/2">
				<div class="overflow-hidden rounded-full bg-transparent">
					<img
						src="brush.png"
						alt="Doctor caring for elderly patient"
						loading="lazy"
						class="h-auto w-full object-cover"
					/>
				</div>
			</div>

			<!-- Right side: Content -->
			<div class="lg:w-1/2">
				<div class="mb-6">
					<div class="mb-2 inline-flex items-center rounded-md bg-blue-50 border border-gray-100 px-3 py-1 text-[0.8rem] font-semibold text-blue-700 shadow-sm">
				<span class="mr-1.5 text-blue-500 font-bold ">-</span> About Us
			</div>
					<h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
						Personalized Medical Support for Your Family
					</h1>
					<p class="mt-6 text-base text-gray-600 md:text-lg">
						We're dedicated to providing compassion comfort every service crafted with their
						well-being in mind because their happiness and health your peace of mind
					</p>
				</div>

				<!-- Feature cards -->
				<div class="mt-8 space-y-4">
					<!-- Feature 1 -->
					<div class="group rounded-2xl border border-blue-50 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100/50 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white md:h-12 md:w-12"
							>
								<MonitorSmartphone class="h-5 w-5 md:h-6 md:w-6" />
							</div>
							<div class="flex-1 pt-1">
								<p class="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Advanced Modern Equipment</p>
								<p class="mt-1 text-sm text-gray-500 leading-relaxed">
									Designed for your comfort, built with precision and innovation to deliver the best care possible.
								</p>
							</div>
						</div>
					</div>

					<!-- Feature 2 -->
					<div class="group rounded-2xl border border-blue-50 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100/50 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white md:h-12 md:w-12"
							>
								<CheckCircle class="h-5 w-5 md:h-6 md:w-6" />
							</div>
							<div class="flex-1 pt-1">
								<p class="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Highest Standard of Care</p>
								<p class="mt-1 text-sm text-gray-500 leading-relaxed">
									Your well-being is our priority. We uphold the highest standards with safe, reliable care built on expertise.
								</p>
							</div>
						</div>
					</div>

					<!-- Feature 3 -->
					<div class="group rounded-2xl border border-blue-50 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100/50 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white md:h-12 md:w-12"
							>
								<Calendar class="h-5 w-5 md:h-6 md:w-6" />
							</div>
							<div class="flex-1 pt-1">
								<p class="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Simple & Fast Booking</p>
								<p class="mt-1 text-sm text-gray-500 leading-relaxed">
									Booking made simple and fast. No waiting, no stress—just a few clicks to choose your time.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
