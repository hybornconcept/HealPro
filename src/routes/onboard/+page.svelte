<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Eye, EyeOff, Hash, Mail, Lock, User, Phone } from 'lucide-svelte';

	let showPassword = $state(false);
	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};
</script>

<div class="flex min-h-screen w-full items-center justify-center p-[2%]">
	<Card.Root class="w-full max-w-6xl">
		<Card.Content class="p-2">
			<div class="w-full lg:grid lg:min-h-[500px] lg:grid-cols-2 xl:min-h-[800px]">
				<div class="flex items-center justify-center py-10">
					<div class="mx-auto w-[350px] space-y-5">
						<!-- Header -->
						<div class="space-y-2">
							<h1 class="text-3xl font-bold text-gray-800">Hi there, ....</h1>
							<p class="text-sm text-gray-600">Get Started with Appointments.</p>
						</div>

						<!-- Form -->
						<form class="mt-5 space-y-4">
							<div class="space-y-1">
								<Label for="id" class="mb-1 block text-sm text-gray-600">Enrollee ID</Label>
								<div
									class="flex items-center rounded-md border px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600"
								>
									<Hash size={18} class="text-gray-400" />
									<Input
										id="id"
										type="text"
										placeholder="e.g. NHIS-12345678"
										class="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
										required
									/>
								</div>
							</div>

							<div class="space-y-1">
								<Label for="email" class="mb-1 block text-sm text-gray-600">Email address</Label>
								<div
									class="flex items-center rounded-md border px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600"
								>
									<Mail size={18} class="text-gray-400" />
									<Input
										id="email"
										type="email"
										placeholder="e.g. oluwaseun@example.com"
										class="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
										required
									/>
								</div>
							</div>

							<div class="space-y-1">
								<Label for="phone" class="mb-1 block text-sm text-gray-600">Phone number</Label>
								<div
									class="flex items-center rounded-md border px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600"
								>
									<Phone size={18} class="text-gray-400" />
									<Input
										id="phone"
										type="tel"
										placeholder="e.g. +234 803 123 4567"
										class="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
										required
									/>
								</div>
							</div>

							<Button type="submit" class="mt-4 h-11 w-full bg-green-500 hover:bg-green-600"
								>Get Started</Button
							>
						</form>
					</div>
				</div>
				<div class="bg-muted hidden lg:block">
					<img
						src="https://img.freepik.com/free-photo/stethoscope-copy-space_23-2147652347.jpg"
						alt="Stethoscope on medical background"
						width="1920"
						height="1080"
						class="h-full w-full object-cover"
					/>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
