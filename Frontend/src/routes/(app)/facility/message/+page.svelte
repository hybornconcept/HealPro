<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { User, Phone, Mail, Briefcase } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	let selectedServices = $state(['Android App Development', 'Brand Identity', 'Marketing']);
	let selectedPosition = $state('');
</script>

<div class="min-h-screen p-6 px-12">
	<div class="mx-auto max-w-7xl">
		<div class="flex items-start justify-center gap-20">
			<!-- Left Section -->
			<div class="w-[30%] space-y-6">
				<Badge variant="secondary" class="w-fit">Contact Us</Badge>

				<div class="space-y-4">
					<h1 class="max-w-md text-5xl leading-tight font-bold text-gray-900">
						Let's Get In Touch.
					</h1>

					<p class="max-w-md text-lg leading-relaxed text-gray-600">
						Sagittis eu volutpat odio facilisis mauris sit amet massa. Urna et pharetra pharetra
						massa. Viverra accumsan in nisl nisl scelerisque eu.
					</p>
				</div>

				<div class="pt-8">
					<p class="mb-2 text-gray-600">Or just reach out manually to</p>
					<a href="mailto:hello@slothui.com" class="font-medium text-blue-600 hover:text-blue-700">
						hello@slothui.com
					</a>
				</div>
			</div>

			<!-- Right Section - Form -->
			<Card.Root class="w-[70%] p-6">
				<form class="space-y-6">
					<!-- Name and Email Row -->
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="fullName">Full Name</Label>
							<div class="relative">
								<User class="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<Input id="fullName" placeholder="Enter your full name..." class="pl-10" />
							</div>
						</div>

						<div class="space-y-2">
							<Label for="email">Email Address</Label>
							<div class="relative">
								<Mail class="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<Input
									id="email"
									type="email"
									placeholder="Enter your email address..."
									class="pl-10"
								/>
							</div>
						</div>
					</div>

					<!-- Phone and Position Row -->
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="phone">Phone Number</Label>
							<div class="relative">
								<Phone class="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<Input id="phone" placeholder="Enter your phone number..." class="pl-10" />
							</div>
						</div>

						<div class="space-y-2">
							<Label for="position">Job Position</Label>
							<Select.Root bind:value={selectedPosition}>
								<Select.Trigger class="w-full">
									<Briefcase class="mr-2 h-4 w-4 text-gray-400" />
									{selectedPosition
										? ['developer', 'designer', 'manager', 'other']
												.find((pos) => pos === selectedPosition)
												?.charAt(0)
												.toUpperCase() + selectedPosition.slice(1)
										: 'Select your job position...'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="developer">Developer</Select.Item>
									<Select.Item value="designer">Designer</Select.Item>
									<Select.Item value="manager">Manager</Select.Item>
									<Select.Item value="other">Other</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</div>

					<!-- Services Section -->
					<div class="space-y-3">
						<Label>Choose Our Services</Label>
						<div class="grid grid-cols-2 gap-3">
							{#each ['UI/UX Design', 'Web Development', 'Brand Identity', 'Marketing', 'Android App Development', 'iOS App Development', 'Other'] as service}
								<div class="flex items-center space-x-2">
									<Checkbox
										id={service}
										checked={selectedServices.includes(service)}
										onCheckedChange={(checked) => {
											if (checked) {
												selectedServices = [...selectedServices, service];
											} else {
												selectedServices = selectedServices.filter((s) => s !== service);
											}
										}}
									/>
									<Label for={service} class="text-sm font-normal">{service}</Label>
								</div>
							{/each}
						</div>
					</div>

					<!-- Message -->
					<div class="space-y-2">
						<Label for="message">Message</Label>
						<Textarea
							id="message"
							placeholder="Enter your main text here..."
							rows={5}
							class="resize-none"
						/>
						<div class="text-right text-sm text-gray-400">300/300</div>
					</div>

					<!-- Submit Button -->
					<Button class="w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
						Submit Form
						<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</Button>
				</form>
			</Card.Root>
		</div>
	</div>
</div>
