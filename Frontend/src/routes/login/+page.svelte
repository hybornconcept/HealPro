<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Eye, EyeOff, Activity } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	// Props from server
	let { form }: { form: ActionData } = $props();

	// Svelte 5 runes for local reactive state
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let isSubmitting = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	// Show error toast if form has error
	$effect(() => {
		if (form?.error) {
			toast.error('Login Failed', {
				description: form.error
			});
		}
	});
</script>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>

<div class="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-white px-4 lg:h-screen lg:overflow-hidden lg:justify-end lg:px-0 lg:pr-[10%]">
	<!-- Background Image -->
	<div class="absolute inset-0 z-0 hidden overflow-hidden bg-white md:block">
		<img
			src="erasebg.png"
			alt="Background"
			loading="lazy"
			class="h-full w-full object-contain object-left opacity-100 transition-opacity duration-700"
		/>
		<div class="absolute inset-0 bg-black/20"></div>
	</div>

	<!-- Login Card -->
	<Card.Root
		class="no-scrollbar relative z-10 w-full max-w-md border-0 bg-white/80 px-4 py-10 shadow-2xl backdrop-blur-md lg:bg-gradient-to-b lg:from-blue-50/80 lg:to-white/95"
	>
		<Card.Header>
			<div class="flex flex-col gap-4">
			<div class="flex items-center gap-1">
				<div class="rounded-full border border-blue-500 p-1.5">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
						<Activity class="h-4 w-4 text-white" />
					</div>
				</div>
				<div>
					<h1 class="p-2 text-3xl font-bold text-gray-900">
						Heal<span class="text-blue-500">Pro.</span>
					</h1>
				</div>
			</div>
				<div>
					<h1 class="text-xl font-light text-gray-900">Login into your Account!</h1>
				</div>
			</div>
		</Card.Header>

		<Card.Content class="space-y-6">
			<form
				method="POST"
				class="space-y-6"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						if (result.type === 'redirect') {
							toast.success('Login Successful', {
								description: 'Welcome back to HealPro'
							});
						}
						await update();
						isSubmitting = false;
					};
				}}
			>
				<!-- Email input -->
				<div class="space-y-2">
					<label for="email" class="text-sm font-medium text-gray-700">Email Address</label>
					<div class="relative">
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="Email"
							bind:value={email}
							class="h-12 w-full rounded-lg border-gray-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
							disabled={isSubmitting}
							required
						/>
					</div>
				</div>

				<!-- Password input -->
				<div class="space-y-2">
					<label for="password" class="text-sm font-medium text-gray-700">Password</label>
					<div class="relative">
						<Input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Password"
							bind:value={password}
							class="h-12 w-full rounded-lg border-gray-200 bg-white px-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
							disabled={isSubmitting}
							required
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
							onclick={togglePasswordVisibility}
							tabindex="-1"
							disabled={isSubmitting}
						>
							{#if showPassword}
								<Eye class="h-5 w-5" />
							{:else}
								<EyeOff class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>

				<div class="flex justify-start">
					<a href="/forgot-password" class="text-sm font-normal text-blue-600 hover:underline"
						>Forgot Password?</a
					>
				</div>

				<!-- Login button -->
				<Button
					type="submit"
					class="h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<div class="flex items-center justify-center gap-2">
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
							Signing in...
						</div>
					{:else}
						Login
					{/if}
				</Button>

				<div class="text-left text-sm text-gray-500">
					Don't have an account?
					<a href="/register" class="font-medium text-blue-600 hover:underline">Sign up</a>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
