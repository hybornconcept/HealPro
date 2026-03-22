<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar/index.js';
	import {
		MapPin,
		Mail,
		Phone,
		Star,
		Facebook,
		Instagram,
		Twitter,
		MessageCircle,
		MessageSquare,
		Linkedin,
		Calendar,
		Users,
		ArrowRight
	} from '@lucide/svelte';
</script>

<Card.Root class="mx-auto max-w-7xl border border-gray-200 bg-white p-6">
	<Card.Content class="p-0">
		<!-- Header Section -->
		<div class="mb-6 flex items-start gap-4">
			<!-- Doctor Avatar -->
			<div class="relative">
				<Avatar class="h-16 w-16">
					<AvatarImage src="https://via.placeholder.com/64/64" alt="Dr. Iqbal Chowdhury" />
					<AvatarFallback class="bg-blue-500 font-semibold text-white">IC</AvatarFallback>
				</Avatar>
				<div class="absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-1">
					<div class="flex h-3 w-3 items-center justify-center rounded-full bg-white">
						<span class="text-xs font-bold text-blue-500">✓</span>
					</div>
				</div>
			</div>

			<!-- Doctor Info -->
			<div class="flex-1">
				<h1 class="mb-1 text-xl font-bold text-gray-900">Dr. Iqbal Chowdhury</h1>
				<p class="mb-3 text-sm text-gray-600">Cardiology Specialist</p>

				<!-- Contact Info -->
				<div class="space-y-1 text-sm text-gray-600">
					<div class="flex items-center gap-2">
						<MapPin class="h-4 w-4" />
						<span>Eastern crown Cottage area 457, New York</span>
					</div>
					<div class="flex items-center gap-2">
						<Mail class="h-4 w-4" />
						<span>iqbalchowdhury628@gmail.com</span>
					</div>
					<div class="flex items-center gap-2">
						<Phone class="h-4 w-4" />
						<span>(807) 555-0101</span>
					</div>
				</div>

				<!-- Rating -->
				<div class="mt-2 flex items-center gap-1">
					{#each Array(5) as _, i}
						<Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
					{/each}
				</div>
			</div>

			<!-- Social Media -->
			<div class="flex-shrink-0">
				<h3 class="mb-3 text-sm font-semibold text-gray-900">Social Media</h3>
				<div class="flex gap-2">
					<Button variant="outline" size="sm" class="h-8 w-8 p-2">
						<Facebook class="h-4 w-4 text-blue-600" />
					</Button>
					<Button variant="outline" size="sm" class="h-8 w-8 p-2">
						<Instagram class="h-4 w-4 text-pink-600" />
					</Button>
					<Button variant="outline" size="sm" class="h-8 w-8 p-2">
						<Twitter class="h-4 w-4 text-blue-400" />
					</Button>
					<Button variant="outline" size="sm" class="h-8 w-8 p-2">
						<MessageCircle class="h-4 w-4 text-blue-500" />
					</Button>
					<Button variant="outline" size="sm" class="h-8 w-8 p-2">
						<MessageSquare class="h-4 w-4 text-green-500" />
					</Button>
					<Button variant="outline" size="sm" class="h-8 w-8 p-2">
						<Linkedin class="h-4 w-4 text-blue-700" />
					</Button>
				</div>
			</div>
		</div>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Left Column -->
			<div class="space-y-6">
				<!-- Short Bio -->
				<div>
					<h2 class="mb-3 text-lg font-semibold text-gray-900">Short Bio</h2>
					<ul class="space-y-2 text-sm text-gray-600">
						<li class="flex items-start gap-2">
							<span class="mt-1 text-gray-400">•</span>
							<span
								>Positive Feedback: "Dr. [Doctor's Name] was excellent at explaining my condition in
								simple terms, which helped me understand my treatment options better."</span
							>
						</li>
						<li class="flex items-start gap-2">
							<span class="mt-1 text-gray-400">•</span>
							<span
								>Constructive Feedback: "I found it a bit challenging to reach out to Dr. [Doctor's
								Name] with questions between appointments. It would be helpful if there were more
								accessible communication channels or a nurse hotline."</span
							>
						</li>
					</ul>
					<Button variant="link" class="mt-2 h-auto p-0 text-sm text-blue-600">Read more</Button>
				</div>

				<!-- Services and Price List -->
				<div>
					<div class="mb-4 flex items-center gap-2">
						<div class="rounded-full bg-green-100 p-1">
							<span class="text-xs text-green-600">$</span>
						</div>
						<h2 class="text-lg font-semibold text-gray-900">Services and price list</h2>
					</div>

					<div class="space-y-3">
						<div class="flex items-center justify-between border-b border-gray-200 py-2">
							<span class="text-sm text-gray-700">Orthopedic consultation</span>
							<span class="font-semibold text-gray-900">$550</span>
						</div>
						<div class="flex items-center justify-between border-b border-gray-200 py-2">
							<span class="text-sm text-gray-700">Delivery blocks</span>
							<span class="font-semibold text-gray-900">$460</span>
						</div>
						<div class="flex items-center justify-between border-b border-gray-200 py-2">
							<span class="text-sm text-gray-700">Ultrasound injection</span>
							<span class="font-semibold text-gray-900">$460</span>
						</div>
					</div>

					<Button variant="link" class="mt-3 h-auto p-0 text-sm text-blue-600">Read more</Button>
				</div>
			</div>

			<!-- Right Column -->
			<div class="space-y-6">
				<!-- About the Doctor -->
				<div>
					<h2 class="mb-4 text-lg font-semibold text-gray-900">About the doctor</h2>

					<div class="space-y-4">
						<!-- Experience -->
						<div class="flex items-start gap-3">
							<div class="rounded-full bg-gray-100 p-2">
								<Calendar class="h-4 w-4 text-gray-600" />
							</div>
							<div>
								<h3 class="text-sm font-semibold text-gray-900">10 years of experience</h3>
								<p class="text-xs text-gray-600">
									At oral surgery mg USA and oral surgery clinics New York
								</p>
							</div>
						</div>

						<!-- Recommendations -->
						<div class="flex items-start gap-3">
							<div class="rounded-full bg-gray-100 p-2">
								<Users class="h-4 w-4 text-gray-600" />
							</div>
							<div>
								<h3 class="text-sm font-semibold text-gray-900">85% Recommend</h3>
								<p class="text-xs text-gray-600">
									358 patients world recommend this doctor to their friends and family
								</p>
							</div>
						</div>

						<!-- Online Consultations -->
						<div class="flex items-start gap-3">
							<div class="rounded-full bg-gray-100 p-2">
								<MessageCircle class="h-4 w-4 text-gray-600" />
							</div>
							<div>
								<h3 class="text-sm font-semibold text-gray-900">Online consultations</h3>
								<p class="text-xs text-gray-600">The consultation is possible on site and online</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Book Appointment Button -->
				<Button class="w-full bg-blue-600 text-white hover:bg-blue-700">
					Book an appointment now
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	</Card.Content>
</Card.Root>
