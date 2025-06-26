<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Phone, Mail, MoreVertical } from '@lucide/svelte';
</script>

<div class="grid grid-cols-4 gap-6">
	{#each Array(15) as _, i}
		<Card.Root class="w-full rounded-2xl border border-gray-200 bg-white p-0 shadow-md">
			<Card.Content class="p-6 pb-4">
				<div class="flex items-start justify-between">
					<img
						src="https://randomuser.me/api/portraits/men/{32 + (i % 30)}.jpg"
						alt="Dr. Abdul Haque"
						class="h-16 w-16 rounded-full object-cover"
					/>
					<button class="text-gray-500 hover:text-gray-700">
						<MoreVertical class="h-5 w-5" />
					</button>
				</div>
				<div class="mt-2">
					<h2 class="text-xl font-semibold text-gray-900">Dr. Abdul Haque</h2>
					<p class="mt-0.5 text-base text-gray-400">Radiologist</p>
				</div>
				<div class="mt-4 flex items-center justify-between">
					<span class="text-base font-medium text-gray-900">Contact</span>
					<div class="flex gap-3">
						<button class="rounded-full p-1.5 hover:bg-gray-100">
							<Phone class="h-5 w-5 text-gray-700" />
						</button>
						<button class="rounded-full p-1.5 hover:bg-gray-100">
							<Mail class="h-5 w-5 text-gray-700" />
						</button>
					</div>
				</div>
				<hr class="my-4 border-gray-100" />
				<div>
					<span class="text-base font-medium text-gray-900">Patients</span>
					<div class="mt-3 flex items-center gap-3">
						<img
							src="https://randomuser.me/api/portraits/women/{44 + (i % 30)}.jpg"
							alt="Muellermann, Max"
							class="h-8 w-8 rounded-full object-cover"
						/>
						<div>
							<span class="text-sm font-semibold text-gray-900">Muellermann, Max</span>
							<div class="text-xs text-gray-500">02 June 2023 9.00AM</div>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
