<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { HmoFormState, licenseTypes, planTypesList } from '$lib/utils/hmo-form.svelte.js';
	import { Eye, EyeOff, FileText, Image, X, ChevronDown, Activity } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	const formState = new HmoFormState();

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	const fileTypes = [
		{ icon: Image, label: 'IMAGE' },
		{ icon: FileText, label: 'DOCX' }
	];

	// Format timestamp dynamically
	function formatTimestamp(): string {
		const now = new Date();
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: '2-digit',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		};
		return now.toLocaleString('en-US', options).replace(',', '').replace(',', ' at');
	}

	// States fetching logic
	let states = $state<{ name: string }[]>([]);

	onMount(() => {
		fetch('https://temikeezy.github.io/nigeria-geojson-data/data/states.json')
			.then((response) => response.json())
			.then((result) => {
				if (Array.isArray(result)) {
					states = result.map((s: string) => ({ name: s }));
				}
			})
			.catch((error) => {
				console.error('Error fetching states:', error);
				toast.error('Failed to load states');
			});
	});

	// File handling helpers
	let fileInput = $state<HTMLInputElement | null>(null);

	function openFilePicker() {
		fileInput?.click();
	}

	function handleFileChange(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (!files) return;
		const acceptedCount = formState.addFiles(Array.from(files), 'logo');

		if (acceptedCount < files.length) {
			toast.warning('Some Files Rejected', {
				description: 'Max 5MB, PDF/DOCX/Image only.'
			});
		} else if (acceptedCount > 0) {
			toast.success('Files Added Successfully', {
				description: `${acceptedCount} file(s) uploaded.`
			});
		}

		// Reset input so same file can be selected again if needed
		(e.target as HTMLInputElement).value = '';
	}

	function removeFile(index: number) {
		formState.removeFile(index);
	}

	async function handleSubmit() {
		const result = await formState.handleSubmit();

		if (result.success) {
			toast.success('Registration Successful', {
				description: `Your HMO account has been created successfully.\n${formatTimestamp()}`
			});

			setTimeout(() => {
				goto('/login');
			}, 3000);
		} else {
			let msg = 'An unexpected error occurred. Please try again.';
			if (result.error) {
				if (typeof result.error === 'object' && result.error.body?.message) {
					msg = result.error.body.message;
				} else if (typeof result.error === 'string') {
					msg = result.error;
				} else if (result.error.message) {
					msg = result.error.message;
				}
			}
			toast.error('Registration Failed', {
				description: msg
			});
		}
	}
</script>

<div
	class="mx-auto flex w-full flex-col bg-linear-to-b from-blue-200/80 via-white/10 via-20% to-white to-70% px-4 py-8 sm:px-10 lg:px-20"
>
	<!-- Logo and Welcome -->
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-2">
			<div class="rounded-full border border-blue-500 p-1.5">
				<div class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500">
					<Activity class="h-4 w-4 text-white" />
				</div>
			</div>
			<div>
				<h1 class="text-3xl font-bold text-gray-900">
					Heal<span class="text-blue-500">Pro.</span>
				</h1>
			</div>
		</div>
	</div>
	<div class="my-6 md:my-10">
		<h2 class="max-w-md text-2xl font-extrabold text-slate-900 sm:text-3xl md:text-4xl">
			Elevate Your <span class="font-normal italic text-blue-600 underline-offset-4 decoration-blue-200 underline"> HMO </span> Services!
		</h2>
		<p class="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base md:text-lg">
			Get Started - Unlock a premium network of verified specialists and streamline member care.
		</p>
	</div>

	<form
		class="space-y-6"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<div class="space-y-6">
			<!-- 1. Corporate Profile & Identity -->
			<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
				<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
					<h3 class="text-lg font-semibold text-gray-900">Corporate Profile & Identity</h3>
					<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
						<ChevronDown class="h-4 w-4" />
					</div>
				</div>
				<div class="p-4 sm:p-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<Label for="companyName" class={formState.errors.companyName ? 'text-red-500' : ''}
								>Corporate Name *</Label
							>
							<Input
								id="companyName"
								bind:value={formState.formData.companyName}
								placeholder="ex: AXA Mansard"
								class="mt-1"
								aria-invalid={!!formState.errors.companyName}
								oninput={() => (formState.errors.companyName = '')}
							/>
							{#if formState.errors.companyName}
								<p class="mt-1 text-sm text-red-500">{formState.errors.companyName}</p>
							{/if}
						</div>

						<div>
							<Label for="website" class={formState.errors.website ? 'text-red-500' : ''}
								>Official Website</Label
							>
							<Input
								id="website"
								type="url"
								bind:value={formState.formData.website}
								placeholder="https://example.com"
								class="mt-1"
								aria-invalid={!!formState.errors.website}
								oninput={() => (formState.errors.website = '')}
							/>
							{#if formState.errors.website}
								<p class="mt-1 text-sm text-red-500">{formState.errors.website}</p>
							{/if}
						</div>

						<div>
							<Label for="contactName" class={formState.errors.contactName ? 'text-red-500' : ''}
								>Contact Person Name *</Label
							>
							<Input
								id="contactName"
								type="text"
								bind:value={formState.formData.contactName}
								placeholder="John Doe"
								class="mt-1"
								aria-invalid={!!formState.errors.contactName}
								oninput={() => (formState.errors.contactName = '')}
							/>
							{#if formState.errors.contactName}
								<p class="mt-1 text-sm text-red-500">{formState.errors.contactName}</p>
							{/if}
						</div>
						<div>
							<Label for="contactPhone" class={formState.errors.contactPhone ? 'text-red-500' : ''}
								>Contact Person Phone *</Label
							>
							<Input
								id="contactPhone"
								type="tel"
								bind:value={formState.formData.contactPhone}
								placeholder="(080) 1234-5678"
								class="mt-1"
								aria-invalid={!!formState.errors.contactPhone}
								oninput={() => (formState.errors.contactPhone = '')}
							/>
							{#if formState.errors.contactPhone}
								<p class="mt-1 text-sm text-red-500">{formState.errors.contactPhone}</p>
							{/if}
						</div>

						<div>
							<Label for="contactEmail" class={formState.errors.contactEmail ? 'text-red-500' : ''}
								>Contact Person Email *</Label
							>
							<Input
								id="contactEmail"
								type="email"
								bind:value={formState.formData.contactEmail}
								placeholder="claims@hmo.com"
								class="mt-1"
								aria-invalid={!!formState.errors.contactEmail}
								oninput={() => (formState.errors.contactEmail = '')}
							/>
							{#if formState.errors.contactEmail}
								<p class="mt-1 text-sm text-red-500">{formState.errors.contactEmail}</p>
							{/if}
						</div>

						<div>
							<Label class={formState.errors.licenseType ? 'text-red-500' : ''}
								>License Type *</Label
							>
							<Select.Root type="single" bind:value={formState.formData.licenseType}>
								<Select.Trigger class="mt-1 w-full">
									{licenseTypes.find((t) => t.value === formState.formData.licenseType)?.label ||
										'Select License Type'}
								</Select.Trigger>
								<Select.Content>
									{#each licenseTypes as type}
										<Select.Item value={type.value}>{type.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if formState.errors.licenseType}
								<p class="mt-1 text-sm text-red-500">{formState.errors.licenseType}</p>
							{/if}
						</div>
						<div class="md:col-span-2">
							<Label for="address" class={formState.errors.address ? 'text-red-500' : ''}
								>Head Office Address *</Label
							>
							<Textarea
								id="address"
								bind:value={formState.formData.address}
								placeholder="Full HQ Address"
								class="mt-1"
								rows={3}
								aria-invalid={!!formState.errors.address}
								oninput={() => (formState.errors.address = '')}
							/>
							{#if formState.errors.address}
								<p class="mt-1 text-sm text-red-500">{formState.errors.address}</p>
							{/if}
						</div>

						<!-- File Upload Section -->
						<div class="mt-1 md:col-span-2">
							<Label>Upload Company Documents (Max 5MB)</Label>
							<input
								type="file"
								class="hidden"
								multiple
								accept=".pdf,.docx,.png,.jpg,.jpeg"
								bind:this={fileInput}
								onchange={handleFileChange}
							/>
							<Card.Root
								class="hover:bg-muted/50 mt-1 flex cursor-pointer flex-col items-center justify-center border-dashed px-2 py-3 transition"
								onclick={openFilePicker}
							>
								<p class="text-sm font-medium">
									Drag & drop or <span class="underline">browse</span>
								</p>
								<div class="mt-1 flex gap-3">
									{#each fileTypes as type}
										<div class="flex flex-col items-center gap-1">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"
											>
												<type.icon class="h-4 w-4" />
											</div>
											<span class="text-[9px] font-semibold text-gray-500">{type.label}</span>
										</div>
									{/each}
								</div>
							</Card.Root>
							{#if formState.formData.logo.length > 0}
								<div class="mt-4 space-y-2">
									{#each formState.formData.logo as file, i}
										<div class="flex items-center justify-between rounded-md border p-2 text-sm">
											<span class="truncate">{file.name}</span>
											<Button
												variant="ghost"
												size="icon"
												onclick={() => removeFile(i)}
												class="h-6 w-6"
											>
												<X class="h-4 w-4" />
											</Button>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- 2. Coverage & Plan Configuration -->
			<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
				<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
					<h3 class="text-lg font-semibold text-gray-900">Coverage & Plan Configuration</h3>
					<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
						<ChevronDown class="h-4 w-4" />
					</div>
				</div>
				<div class="p-4 sm:p-6">
					<div class="space-y-4">
						<div>
							<Label class={formState.errors.coverageStates ? 'text-red-500' : ''}
								>Coverage Scope (State) *</Label
							>
							<Select.Root
								type="single"
								bind:value={formState.formData.coverageStates[0]}
								onValueChange={(value) => {
									if (value) {
										formState.formData.coverageStates = [value];
									}
								}}
							>
								<Select.Trigger
									class="mt-1 w-full {formState.errors.coverageStates ? 'border-red-500' : ''}"
								>
									{formState.formData.coverageStates[0] || 'Select State'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="" disabled>Select State</Select.Item>
									{#each states as state}
										<Select.Item value={state.name}>{state.name}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if formState.errors.coverageStates}
								<p class="mt-1 text-sm text-red-500">{formState.errors.coverageStates}</p>
							{/if}
						</div>

						<div>
							<Label class={formState.errors.planTypes ? 'text-red-500' : ''}
								>Plan Tiers Offered *</Label
							>
							<div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
								{#each planTypesList as plan}
									<div class="flex items-center space-x-2">
										<Checkbox
											id={`plan-${plan}`}
											checked={formState.formData.planTypes.includes(plan)}
											onCheckedChange={(checked) => {
												if (checked) {
													formState.formData.planTypes = [...formState.formData.planTypes, plan];
												} else {
													formState.formData.planTypes = formState.formData.planTypes.filter(
														(p) => p !== plan
													);
												}
											}}
										/>
										<Label for={`plan-${plan}`} class="font-normal">{plan}</Label>
									</div>
								{/each}
							</div>
							{#if formState.errors.planTypes}
								<p class="mt-1 text-sm text-red-500">{formState.errors.planTypes}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- 3. Admin Account -->
			<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
				<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
					<h3 class="text-lg font-semibold text-gray-900">Admin Account</h3>
					<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
						<ChevronDown class="h-4 w-4" />
					</div>
				</div>
				<div class="p-4 sm:p-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<Label
								for="adminFirstName"
								class={formState.errors.adminFirstName ? 'text-red-500' : ''}
								>Admin full Name *</Label
							>
							<Input
								id="adminFirstName"
								bind:value={formState.formData.adminFirstName}
								placeholder="John Doe"
								class="mt-1"
								aria-invalid={!!formState.errors.adminFirstName}
								oninput={() => (formState.errors.adminFirstName = '')}
							/>
							{#if formState.errors.adminFirstName}
								<p class="mt-1 text-sm text-red-500">{formState.errors.adminFirstName}</p>
							{/if}
						</div>

						<div>
							<Label for="adminEmail" class={formState.errors.adminEmail ? 'text-red-500' : ''}
								>Admin Email *</Label
							>
							<Input
								id="adminEmail"
								type="email"
								bind:value={formState.formData.adminEmail}
								placeholder="admin@hmo.com"
								class="mt-1"
								aria-invalid={!!formState.errors.adminEmail}
								oninput={() => (formState.errors.adminEmail = '')}
							/>
							{#if formState.errors.adminEmail}
								<p class="mt-1 text-sm text-red-500">{formState.errors.adminEmail}</p>
							{/if}
						</div>
						<div>
							<Label for="password" class={formState.errors.password ? 'text-red-500' : ''}
								>Password *</Label
							>
							<div class="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									bind:value={formState.formData.password}
									placeholder="••••••••"
									class="mt-1 pr-10"
									aria-invalid={!!formState.errors.password}
									oninput={() => (formState.errors.password = '')}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									class="absolute right-0 top-0 mt-1 h-full px-3 py-2 hover:bg-transparent"
									onclick={() => (showPassword = !showPassword)}
								>
									{#if showPassword}
										<EyeOff class="h-4 w-4 text-gray-500" />
									{:else}
										<Eye class="h-4 w-4 text-gray-500" />
									{/if}
								</Button>
							</div>
							{#if formState.errors.password}
								<p class="mt-1 text-sm text-red-500">{formState.errors.password}</p>
							{/if}
						</div>
						<div>
							<Label
								for="confirmPassword"
								class={formState.errors.confirmPassword ? 'text-red-500' : ''}
								>Confirm Password *</Label
							>
							<div class="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									bind:value={formState.formData.confirmPassword}
									placeholder="••••••••"
									class="mt-1 pr-10"
									aria-invalid={!!formState.errors.confirmPassword}
									oninput={() => (formState.errors.confirmPassword = '')}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									class="absolute right-0 top-0 mt-1 h-full px-3 py-2 hover:bg-transparent"
									onclick={() => (showConfirmPassword = !showConfirmPassword)}
								>
									{#if showConfirmPassword}
										<EyeOff class="h-4 w-4 text-gray-500" />
									{:else}
										<Eye class="h-4 w-4 text-gray-500" />
									{/if}
								</Button>
							</div>
							{#if formState.errors.confirmPassword}
								<p class="mt-1 text-sm text-red-500">{formState.errors.confirmPassword}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-3">
				<div class="flex items-center gap-3">
					<Checkbox
						id="terms"
						bind:checked={formState.formData.consents.terms}
						class="mt-0.5 h-4 w-4 border-gray-500"
						aria-describedby={formState.errors.terms ? 'terms-error' : undefined}
					/>

					<div class="flex-1 pt-0.5">
						<label for="terms" class="cursor-pointer text-sm font-medium leading-relaxed text-gray-600 block">
							By signing up you agree to our
							<a href="/terms" class="text-blue-600 font-bold hover:underline">Terms and conditions</a>
							and
							<a href="/privacy" class="text-blue-600 font-bold hover:underline">Privacy policy</a>.
						</label>

						{#if formState.errors.terms}
							<p id="terms-error" class="mt-1 text-sm text-red-500">
								{formState.errors.terms}
							</p>
						{/if}
					</div>
				</div>

				<Button
					type="submit"
					class="text-base h-auto min-h-0 w-full rounded-xl py-3.5 sm:py-4 px-6 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 font-bold active:scale-[0.98] md:text-lg"
					disabled={!formState.formData.consents.terms || formState.isLoading}
					aria-disabled={!formState.formData.consents.terms || formState.isLoading}
				>
					{#if formState.isLoading}
						<Spinner class="mr-2" />
						Processing...
					{:else}
						Register HMO
					{/if}
				</Button>
			</div>
		</div>
	</form>
</div>
