<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Lazy load icons for better performance
	let Mail: any = $state(null);
	let Eye: any = $state(null);
	let EyeOff: any = $state(null);

	// Form state using Svelte 5 runes
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let isLoading = $state(false);
	let isSubmitting = $state(false);

	// Load icons after component mounts
	onMount(async () => {
		if (!browser) return;

		try {
			const [mailModule, eyeModule, eyeOffModule] = await Promise.all([
				import('@lucide/svelte/icons/mail'),
				import('@lucide/svelte/icons/eye'),
				import('@lucide/svelte/icons/eye-off')
			]);

			Mail = mailModule.default;
			Eye = eyeModule.default;
			EyeOff = eyeOffModule.default;
		} catch (error) {
			console.error('Failed to load icons:', error);
		}
	});

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function navigateToUser() {
		goto('/user');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[#f1f5f9]">
	<div class="flex w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-md">
		<!-- Left: Login Form -->
		<div class="flex w-2/5 flex-col justify-between p-8">
			<div>
				<div class="mb-8 flex items-center justify-between">
					<h1 class=" border-blue-300 p-2 text-xl font-bold">
						Heal<span class="text-blue-500">Pro.</span>
					</h1>
				</div>

				<h2 class="mb-4 text-center text-2xl font-light">Welcome!</h2>
				<p class="mb-6 text-center text-xs text-gray-600">
					To connect to your account, please enter your email address and password.
				</p>

				<form class="space-y-4" onsubmit={(e) => e.preventDefault()}>
					<!-- Email input with mail icon -->
					<div class="relative">
						<Input
							type="email"
							placeholder="Your email address"
							bind:value={email}
							class="w-full rounded-md bg-gray-50 px-3 py-2 pr-10 text-sm"
							disabled={isSubmitting}
						/>
						<div
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
						>
							{#if Mail}
								<Mail class="h-4 w-4" />
							{:else}
								<div class="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
							{/if}
						</div>
					</div>
					<!-- Password input with eye/eye-off toggle -->
					<div class="relative">
						<Input
							type={showPassword ? 'text' : 'password'}
							placeholder="Your password"
							bind:value={password}
							class="w-full rounded-md bg-gray-50 px-3 py-2 pr-10 text-sm"
							disabled={isSubmitting}
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
							onclick={togglePasswordVisibility}
							tabindex="-1"
							disabled={isSubmitting}
						>
							{#if Eye && EyeOff}
								{#if showPassword}
									<Eye class="h-4 w-4" />
								{:else}
									<EyeOff class="h-4 w-4" />
								{/if}
							{:else}
								<div class="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
							{/if}
						</button>
					</div>
					<div class="text-left">
						<a href="/forgot-password" class="text-xs text-blue-500 hover:underline"
							>Forgot password?</a
						>
					</div>
					<!-- Login button -->
					<Button
						class="hidden w-full rounded-md bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
					>
						{#if isSubmitting}
							<div class="flex items-center justify-center gap-2">
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Signing in...
							</div>
						{:else}
							Login
						{/if}
					</Button>
				</form>
				<a
					href="/user"
					class="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Login
				</a>

				<div class="mt-6 text-center text-xs">
					<p class="text-gray-600">Don't hesitate to contact us</p>
					<a href="mailto:support@healpro.com" class="text-blue-500 hover:underline"
						>support@healpro.com</a
					>
				</div>
			</div>
		</div>

		<!-- Right: Image and Overlay -->
		<div class="relative w-3/5 overflow-hidden rounded-r-3xl bg-gray-100">
			<img src="steth.jpg" alt="Plant in wooden pot" class="h-full w-full object-cover" />
			<div class="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
			<div
				class="absolute top-1/2 left-1/2 w-[70%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black/20 p-6 backdrop-blur-sm"
			>
				<div class="justify-left mb-4 flex">
					<div
						class="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
				</div>
				<h3 class="mb-4 text-sm text-white">
					Without health insurance, getting sick or injured could mean going bankrupt, going without
					needed care, or even dying needlessly.
				</h3>
				<p class="text-xs leading-relaxed text-white/90">- Jan Schakowsky</p>
			</div>
		</div>
	</div>
</div>
