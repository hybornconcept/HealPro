<script lang="ts">
	import { CheckCircle, Calendar, MonitorSmartphone } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<section id="about" class="w-full">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="flex flex-col gap-12 lg:flex-row lg:items-center">
			<!-- Left side: Image -->
			<div class="lg:w-1/2">
				<div class="overflow-hidden rounded-full bg-transparent">
					<img
						src="brush.png"
						alt="Doctor caring for elderly patient"
						class="h-auto w-full object-cover"
					/>
				</div>
			</div>

			<!-- Right side: Content -->
			<div class="lg:w-1/2">
				<div class="mb-6">
					<span class="text-lg font-medium text-blue-600">About Us</span>
					<h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
						Personalized Medical Support for Your Family
					</h1>
					<p class="mt-6 text-lg text-gray-600">
						We're dedicated to providing compassion comfort every service crafted with their
						well-being in mind because their happiness and health your peace of mind
					</p>
				</div>

				<!-- Feature cards -->
				<div class="mt-8 space-y-4">
					<!-- Feature 1 -->
					<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600"
							>
								<MonitorSmartphone class="h-5 w-5" />
							</div>
							<div>
								<p class="text-base font-medium text-gray-900">
									Advanced modern equipment designed for your comfort built with precision and
									innovation to deliver the best care
								</p>
							</div>
						</div>
					</div>

					<!-- Feature 2 -->
					<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600"
							>
								<CheckCircle class="h-5 w-5" />
							</div>
							<div>
								<p class="text-base font-medium text-gray-900">
									Your well-being is our priority we uphold the highest standard with safe, reliable
									care built on expertise and integrity
								</p>
							</div>
						</div>
					</div>

					<!-- Feature 3 -->
					<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600"
							>
								<Calendar class="h-5 w-5" />
							</div>
							<div>
								<p class="text-base font-medium text-gray-900">
									Booking made simple and fast no waiting no stress just a few clicks choose your
									time your health your schedule
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
