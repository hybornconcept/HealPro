<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Eye, EyeOff, Activity } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	import { login } from '$lib/api';
	import { scale } from 'svelte/transition';

	let { open = $bindable(true) } = $props();

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let isLoading = $state(false);
	let errors = $state({ email: '', password: '' });

	function validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validateForm(): boolean {
		let isValid = true;
		errors = { email: '', password: '' };

		if (!email) {
			errors.email = 'Email is required';
			isValid = false;
		} else if (!validateEmail(email)) {
			errors.email = 'Please enter a valid email';
			isValid = false;
		}

		if (!password) {
			errors.password = 'Password is required';
			isValid = false;
		} else if (password.length < 8) {
			errors.password = 'Password must be at least 8 characters';
			isValid = false;
		}

		return isValid;
	}

	async function handleLogin() {
		if (!validateForm()) {
			toast.error('Please fix the errors in the form');
			return;
		}

		isLoading = true;
		errors = { email: '', password: '' };

		try {
			await login(email, password);
			toast.success('Login successful!');
			open = false;
			window.location.reload();
		} catch (error: any) {
			console.error('Login error:', error);
			const errorMessage =
				error?.body?.message || error?.body?.error || 'Invalid email or password';
			errors.password = errorMessage;
			toast.error(errorMessage);
		} finally {
			isLoading = false;
		}
	}

	function handleRegister() {
		goto('/register');
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="border-none bg-transparent p-0 shadow-none data-[state=closed]:animate-none data-[state=open]:animate-none sm:max-w-[380px]"
		showCloseButton={false}
		onInteractOutside={(e) => e.preventDefault()}
		onEscapeKeyDown={(e) => e.preventDefault()}
	>
		<div
			transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
			class="relative h-full w-full rounded-3xl bg-white p-6 shadow-lg"
		>
			<!-- Custom Red Close Button -->
			<button
				onclick={() => (open = false)}
				class="absolute right-4 top-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>

			<Dialog.Header class="space-y-2">
				<Dialog.Title class="text-md -mb-1 ml-2 text-left font-normal text-gray-500"
					>Sign in to continue</Dialog.Title
				>
				<div class="flex items-center gap-2">
					<div class="rounded-full border-2 border-gray-200 p-1.5">
						<div
							class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600"
						>
							<Activity class="h-4 w-4 text-white" />
						</div>
					</div>
					<div class="flex items-center justify-between">
						<h1 class="text-3xl font-bold text-gray-900">
							Heal<span class="text-blue-500">Pro.</span>
						</h1>
						<div class="flex items-center gap-2">
							<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
								Clients only
							</span>
						</div>
					</div>
				</div>
			</Dialog.Header>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleLogin();
				}}
				class="mt-3 space-y-2.5"
			>
				<div class="space-y-0.5">
					<Label for="email" class="text-[11px] font-medium text-gray-700">Email</Label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						placeholder="Enter your email"
						class="h-10 rounded-full text-sm {errors.email
							? 'border-red-500 focus-visible:ring-red-500'
							: ''}"
						disabled={isLoading}
					/>
					{#if errors.email}
						<p class="text-[10px] text-red-500">{errors.email}</p>
					{/if}
				</div>

				<div class="space-y-0.5">
					<Label for="password" class="text-[11px] font-medium text-gray-700">Password</Label>
					<div class="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="Enter your password"
							class="h-10 rounded-full pr-10 text-sm {errors.password
								? 'border-red-500 focus-visible:ring-red-500'
								: ''}"
							disabled={isLoading}
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							class="absolute right-0 top-0 h-10 rounded-full px-3 hover:bg-transparent"
							onclick={() => (showPassword = !showPassword)}
							disabled={isLoading}
						>
							{#if showPassword}
								<EyeOff class="h-3 w-3 text-gray-400" />
							{:else}
								<Eye class="h-3 w-3 text-gray-400" />
							{/if}
						</Button>
					</div>
					{#if errors.password}
						<p class="text-[10px] text-red-500">{errors.password}</p>
					{/if}
				</div>

				<div class="flex items-center justify-end pt-0">
					<a href="/forgot-password" class="text-[11px] text-blue-600 hover:underline">
						Forgot password?
					</a>
				</div>

				<!-- Horizontal separator -->
				<div class="-mx-6 border-t border-gray-300"></div>

				<Button
					type="submit"
					class="h-10 w-full rounded-full bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
					disabled={isLoading}
				>
					{isLoading ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>

			<div class="mt-2 text-center text-sm text-gray-600">
				Don't have an account?
				<button onclick={handleRegister} class="font-medium text-blue-600 hover:underline">
					Create one here
				</button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
