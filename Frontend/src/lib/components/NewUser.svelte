<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Loader2, FileText, Image, Activity, X, Eye, EyeOff } from 'lucide-svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { ChevronDown } from 'lucide-svelte';

	import {
		UserFormState,
		idTypes,
		relationships,
		hmoProviders,
		planTiers,
		bloodGroups,
		genotypes,
		gender
	} from '$lib/utils/user-form.svelte.js';

	const formState = new UserFormState();

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
	let states = $state<{ name: string; id: number }[]>([]);
	const API_KEY = 'y6y1j1PVKYaZ9JLMTkf3zOIpriail931';

	onMount(() => {
		const headers = new Headers();
		headers.append('X-Api-Key', API_KEY);

		fetch('https://naija-places.toneflix.com.ng/api/v1/states', {
			method: 'GET',
			headers: headers
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.data && Array.isArray(result.data)) {
					states = result.data.map((s: any) => ({ name: s.name, id: s.id }));
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
		const acceptedCount = formState.addFiles(Array.from(files));

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
				description: `Your account has been created successfully.\n${formatTimestamp()}`
			});

			// Wait 3 seconds before navigating to let user see the toast
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
			Get <span class="font-normal italic text-blue-600 underline-offset-4 decoration-blue-200 underline"> Started </span> in Minutes!
		</h2>
		<p class="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base md:text-lg">
			Join HealPro Today. Connect with verified specialists and take control of your health with ease.
		</p>
	</div>
	<form
		onsubmit={(e: SubmitEvent) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-8"
	>
		<!-- 1. Personal Information -->
		<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label for="fullname" class={formState.errors.fullname ? 'text-red-500' : ''}>
							Full Name *
						</Label>
						<Input
							id="fullname"
							bind:value={formState.formData.fullname}
							placeholder="John Doe"
							class="mt-1"
							aria-invalid={!!formState.errors.fullname}
						/>
						{#if formState.errors.fullname}
							<p class="mt-1 text-sm text-red-500">{formState.errors.fullname}</p>
						{/if}
					</div>

					<div>
						<Label for="email" class={formState.errors.email ? 'text-red-500' : ''}>
							Email Address *
						</Label>
						<Input
							id="email"
							type="email"
							bind:value={formState.formData.email}
							placeholder="johndoe@email.com"
							class="mt-1"
						/>
						{#if formState.errors.email}
							<p class="mt-1 text-sm text-red-500">{formState.errors.email}</p>
						{/if}
					</div>

					<div>
						<Label for="password" class={formState.errors.password ? 'text-red-500' : ''}>
							Password *
						</Label>
						<div class="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								bind:value={formState.formData.password}
								placeholder="••••••••"
								class="mt-1 pr-10"
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
						>
							Confirm Password *
						</Label>
						<div class="relative">
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={formState.formData.confirmPassword}
								placeholder="••••••••"
								class="mt-1 pr-10 {formState.errors.confirmPassword
									? 'border-red-500 focus-visible:ring-red-500'
									: ''}"
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

					<div>
						<Label for="phone" class={formState.errors.phone ? 'text-red-500' : ''}>
							Phone Number *
						</Label>
						<Input
							id="phone"
							type="tel"
							bind:value={formState.formData.phone}
							placeholder="+234..."
							class="mt-1 {formState.errors.phone
								? 'border-red-500 focus-visible:ring-red-500'
								: ''}"
						/>
						{#if formState.errors.phone}
							<p class="mt-1 text-sm text-red-500">{formState.errors.phone}</p>
						{/if}
					</div>

					<div>
						<Label for="dob" class={formState.errors.dob ? 'text-red-500' : ''}
							>Date of Birth *</Label
						>
						<Input
							id="dob"
							bind:value={formState.formData.dob}
							type="date"
							class="mt-1 {formState.errors.dob ? 'border-red-500 focus-visible:ring-red-500' : ''}"
						/>
						{#if formState.errors.dob}
							<p class="mt-1 text-sm text-red-500">{formState.errors.dob}</p>
						{/if}
					</div>

					<div>
						<Label class={formState.errors.gender ? 'text-red-500' : ''}>Gender *</Label>
						<Select.Root type="single" bind:value={formState.formData.gender}>
							<Select.Trigger
								class="mt-1 w-full {formState.errors.gender
									? 'border-red-500 focus-visible:ring-red-500'
									: ''}"
							>
								{formState.formData.gender || 'Select...'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="" disabled>Select...</Select.Item>
								{#each gender as gen}
									<Select.Item value={gen}>{gen}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.gender}
							<p class="mt-1 text-sm text-red-500">{formState.errors.gender}</p>
						{/if}
					</div>
					<div>
						<Label class={formState.errors.stateOfResidence ? 'text-red-500' : ''}
							>State of residence</Label
						>
						<Select.Root type="single" bind:value={formState.formData.stateOfResidence}>
							<Select.Trigger
								class="mt-1 w-full {formState.errors.stateOfResidence
									? 'border-red-500 focus-visible:ring-red-500'
									: ''}"
							>
								{formState.formData.stateOfResidence || 'Select State'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="" disabled>Select State</Select.Item>
								{#each states as state}
									<Select.Item value={state.name}>{state.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.stateOfResidence}
							<p class="mt-1 text-sm text-red-500">{formState.errors.stateOfResidence}</p>
						{/if}
					</div>

					<!-- Identification -->
					<div>
						<Label>ID Type</Label>
						<Select.Root type="single" bind:value={formState.formData.idType}>
							<Select.Trigger class="mt-1 w-full">
								{formState.formData.idType || 'Select ID Type'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="" disabled>Select ID Type</Select.Item>
								{#each idTypes as type}
									<Select.Item value={type}>{type}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<div>
						<Label for="idNumber">ID Number</Label>
						<Input
							id="idNumber"
							bind:value={formState.formData.idNumber}
							placeholder="ID Number"
							class="mt-1"
						/>
					</div>
					<div class="mt-2 md:col-span-2">
						<Label for="address" class={formState.errors.address ? 'text-red-500' : ''}>
							Home Address *
						</Label>
						<Textarea
							id="address"
							bind:value={formState.formData.address}
							placeholder="Full residential address"
							class="mt-1 {formState.errors.address
								? 'border-red-500 focus-visible:ring-red-500'
								: ''}"
						/>
						{#if formState.errors.address}
							<p class="mt-1 text-sm text-red-500">{formState.errors.address}</p>
						{/if}
					</div>
					<!-- File Upload Section -->
					<div class="mt-1 md:col-span-2">
						<Label>Upload relevant documents and Avatar (Max 5MB)</Label>
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
						{#if formState.formData.idFiles.length > 0}
							<div class="mt-4 space-y-2">
								{#each formState.formData.idFiles as file, i}
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

		<!-- Next of Kin Sub-section -->
		<div class="overflow-hidden rounded-xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<h3 class="text-lg font-semibold text-gray-900">Emergency Contact</h3>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label for="nokName" class={formState.errors.nokName ? 'text-red-500' : ''}
							>Next of Kin Name *</Label
						>
						<Input
							id="nokName"
							bind:value={formState.formData.nokName}
							placeholder="Full Name"
							class="mt-1 {formState.errors.nokName
								? 'border-red-500 focus-visible:ring-red-500'
								: ''}"
						/>
						{#if formState.errors.nokName}
							<p class="mt-1 text-sm text-red-500">{formState.errors.nokName}</p>
						{/if}
					</div>
					<div>
						<Label class={formState.errors.nokRelation ? 'text-red-500' : ''}>Relationship *</Label>
						<Select.Root type="single" bind:value={formState.formData.nokRelation}>
							<Select.Trigger
								class="mt-1 w-full {formState.errors.nokRelation
									? 'border-red-500 focus-visible:ring-red-500'
									: ''}"
							>
								{formState.formData.nokRelation || 'Select...'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="" disabled>Select...</Select.Item>
								{#each relationships as rel}
									<Select.Item value={rel}>{rel}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.nokRelation}
							<p class="mt-1 text-sm text-red-500">{formState.errors.nokRelation}</p>
						{/if}
					</div>
					<div class="md:col-span-2">
						<Label for="nokPhone" class={formState.errors.nokPhone ? 'text-red-500' : ''}
							>Next of Kin Phone *</Label
						>
						<Input
							id="nokPhone"
							type="tel"
							bind:value={formState.formData.nokPhone}
							placeholder="Phone Number"
							class="mt-1 {formState.errors.nokPhone
								? 'border-red-500 focus-visible:ring-red-500'
								: ''}"
						/>
						{#if formState.errors.nokPhone}
							<p class="mt-1 text-sm text-red-500">{formState.errors.nokPhone}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<!-- 2. Insurance & Dependents -->
		<div class="overflow-hidden rounded-xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-900">Insurance Coverage</h3>
					<p class="text-sm text-gray-500">Link your HMO plan to verify eligibility.</p>
				</div>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="space-y-6">
					<!-- NEW: Policy Role Toggle -->
					<div class="rounded-lg border bg-slate-50 p-4">
						<Label class="mb-3 block text-base font-medium"
							>Are you the Primary Policy Holder?</Label
						>
						<RadioGroup.Root
							bind:value={formState.formData.policyRole}
							class="flex flex-col gap-3 sm:flex-row"
						>
							<div
								class="flex w-full items-center space-x-2 rounded-md border bg-white p-3 shadow-sm transition-colors hover:border-blue-400"
							>
								<RadioGroup.Item value="principal" id="role-principal" />
								<Label for="role-principal" class="w-full cursor-pointer font-normal">
									Yes, I am the Principal
									<span class="block text-xs text-gray-500"
										>I pay for the insurance / It's my work benefit</span
									>
								</Label>
							</div>
							<div
								class="flex w-full items-center space-x-2 rounded-md border bg-white p-3 shadow-sm transition-colors hover:border-blue-400"
							>
								<RadioGroup.Item value="dependent" id="role-dependent" />
								<Label for="role-dependent" class="w-full cursor-pointer font-normal">
									No, I am a Dependent
									<span class="block text-xs text-gray-500"
										>I am a Spouse or Child of the holder</span
									>
								</Label>
							</div>
						</RadioGroup.Root>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<!-- HMO Provider (Same for both) -->
						<div class="md:col-span-2">
							<Label class={formState.errors.hmoProvider ? 'text-red-500' : ''}
								>HMO Provider *</Label
							>
							<Select.Root type="single" bind:value={formState.formData.hmoProvider}>
								<Select.Trigger
									class="mt-1 w-full {formState.errors.hmoProvider
										? 'border-red-500 focus-visible:ring-red-500'
										: ''}"
								>
									{formState.formData.hmoProvider || 'Select Provider (e.g. AXA, Hygeia)...'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="" disabled>Select Provider...</Select.Item>
									{#each hmoProviders as provider}
										<Select.Item value={provider}>{provider}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if formState.errors.hmoProvider}
								<p class="mt-1 text-sm text-red-500">{formState.errors.hmoProvider}</p>
							{/if}
						</div>

						<!-- Dynamic ID Field based on Role -->
						<div>
							<Label for="policyId" class={formState.errors.policyId ? 'text-red-500' : ''}>
								{#if formState.formData.policyRole === 'dependent'}
									Your Dependent ID / Member No. *
								{:else}
									Policy / Member ID *
								{/if}
							</Label>
							<Input
								id="policyId"
								bind:value={formState.formData.policyId}
								placeholder={formState.formData.policyRole === 'dependent'
									? 'e.g. AXA/12345/01'
									: 'e.g. AXA/12345/00'}
								class="mt-1 font-mono uppercase {formState.errors.policyId
									? 'border-red-500 focus-visible:ring-red-500'
									: ''}"
							/>
							<p class="mt-1 text-[11px] text-gray-500">Found on the front of your HMO card.</p>
							{#if formState.errors.policyId}
								<p class="mt-1 text-sm text-red-500">{formState.errors.policyId}</p>
							{/if}
						</div>

						<!-- Logic: If Dependent, ask for Sponsor ID and Relationship -->
						{#if formState.formData.policyRole === 'dependent'}
							<div>
								<Label
									for="sponsorId"
									class={formState.errors.sponsorId ? 'text-red-500' : 'text-blue-600'}
									>Principal's (Sponsor) ID *</Label
								>
								<Input
									id="sponsorId"
									bind:value={formState.formData.sponsorId}
									placeholder="The Main Policy Holder's ID"
									class="mt-1 border-blue-200 bg-blue-50 font-mono uppercase {formState.errors
										.sponsorId
										? 'border-red-500 focus-visible:ring-red-500'
										: ''}"
								/>
								{#if formState.errors.sponsorId}
									<p class="mt-1 text-sm text-red-500">{formState.errors.sponsorId}</p>
								{/if}
							</div>
							<div>
								<Label
									class={formState.errors.policyRelationship ? 'text-red-500' : 'text-blue-600'}
									>Relationship to Holder *</Label
								>
								<Select.Root type="single" bind:value={formState.formData.policyRelationship}>
									<Select.Trigger
										class="mt-1 w-full border-blue-200 bg-blue-50 {formState.errors
											.policyRelationship
											? 'border-red-500 focus-visible:ring-red-500'
											: ''}"
									>
										{formState.formData.policyRelationship || 'Select Relationship...'}
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="" disabled>Select Relationship...</Select.Item>
										<Select.Item value="Spouse">Spouse (Wife/Husband)</Select.Item>
										<Select.Item value="Child">Child</Select.Item>
									</Select.Content>
								</Select.Root>
								{#if formState.errors.policyRelationship}
									<p class="mt-1 text-sm text-red-500">{formState.errors.policyRelationship}</p>
								{/if}
							</div>
						{/if}

						<div>
							<Label class={formState.errors.planTier ? 'text-red-500' : ''}>Plan Tier *</Label>
							<Select.Root type="single" bind:value={formState.formData.planTier}>
								<Select.Trigger
									class="mt-1 w-full {formState.errors.planTier
										? 'border-red-500 focus-visible:ring-red-500'
										: ''}"
								>
									{formState.formData.planTier || 'Select Tier...'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="" disabled>Select Tier...</Select.Item>
									{#each planTiers as tier}
										<Select.Item value={tier}>{tier}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if formState.errors.planTier}
								<p class="mt-1 text-sm text-red-500">{formState.errors.planTier}</p>
							{/if}
						</div>

						<!-- Corporate Code (Only show if Principal, usually Dependents don't know this) -->
						{#if formState.formData.policyRole !== 'dependent'}
							<div>
								<Label for="corpCode">Corporate / Company Code</Label>
								<Input
									id="corpCode"
									bind:value={formState.formData.corpCode}
									placeholder="Optional (Ask HR)"
									class="mt-1"
								/>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- 3. Medical Profile -->
		<div class="overflow-hidden rounded-xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<h3 class="text-lg font-semibold text-gray-900">Medical Profile</h3>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<!-- FIXED: Blood Group and Genotype are now separate -->
					<div>
						<Label class={formState.errors.bloodGroup ? 'text-red-500' : ''}>Blood Group *</Label>
						<Select.Root type="single" bind:value={formState.formData.bloodGroup}>
							<Select.Trigger
								class="mt-1 w-full {formState.errors.bloodGroup
									? 'border-red-500 focus-visible:ring-red-500'
									: ''}"
							>
								{formState.formData.bloodGroup || 'Select...'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="" disabled>Select...</Select.Item>
								{#each bloodGroups as bg}
									<Select.Item value={bg}>{bg}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.bloodGroup}
							<p class="mt-1 text-sm text-red-500">{formState.errors.bloodGroup}</p>
						{/if}
					</div>

					<div>
						<Label class={formState.errors.genotype ? 'text-red-500' : ''}>Genotype *</Label>
						<Select.Root type="single" bind:value={formState.formData.genotype}>
							<Select.Trigger
								class="mt-1 w-full {formState.errors.genotype
									? 'border-red-500 focus-visible:ring-red-500'
									: ''}"
							>
								{formState.formData.genotype || 'Select...'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="" disabled>Select...</Select.Item>
								{#each genotypes as gt}
									<Select.Item value={gt}>{gt}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.genotype}
							<p class="mt-1 text-sm text-red-500">{formState.errors.genotype}</p>
						{/if}
					</div>

					<div>
						<Label for="height" class={formState.errors.height ? 'text-red-500' : ''}
							>Height (cm) *</Label
						>
						<Input
							id="height"
							type="number"
							bind:value={formState.formData.height}
							placeholder="175"
							class="mt-1 {formState.errors.height
								? 'border-red-500 focus-visible:ring-red-500'
								: ''}"
						/>
						{#if formState.errors.height}
							<p class="mt-1 text-sm text-red-500">{formState.errors.height}</p>
						{/if}
					</div>

					<div>
						<Label for="weight" class={formState.errors.weight ? 'text-red-500' : ''}
							>Weight (kg) *</Label
						>
						<Input
							id="weight"
							type="number"
							bind:value={formState.formData.weight}
							placeholder="70"
							class="mt-1 {formState.errors.weight
								? 'border-red-500 focus-visible:ring-red-500'
								: ''}"
						/>
						{#if formState.errors.weight}
							<p class="mt-1 text-sm text-red-500">{formState.errors.weight}</p>
						{/if}
					</div>

					<div class="md:col-span-2">
						<Label for="allergies">Allergies</Label>
						<Input
							id="allergies"
							bind:value={formState.formData.allergies}
							placeholder="e.g. Peanuts, Penicillin (comma separated)"
							class="mt-1"
						/>
					</div>

					<div class="md:col-span-2">
						<Label for="conditions">Pre-existing Conditions</Label>
						<Input
							id="conditions"
							bind:value={formState.formData.conditions}
							placeholder="e.g. Diabetes, Asthma (comma separated)"
							class="mt-1"
						/>
					</div>

					<div>
						<Label for="physician">Primary Care Physician</Label>
						<Input
							id="physician"
							bind:value={formState.formData.physician}
							placeholder="Dr. Name"
							class="mt-1"
						/>
					</div>
					<div>
						<Label for="physician_phone">Physician Phone No</Label>
						<Input
							id="physician_phone"
							type="tel"
							bind:value={formState.formData.physician_phone}
							placeholder="+234..."
							class="mt-1"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Terms and Submit -->
		<div class="space-y-4 pt-4">
			<div class="flex items-start gap-3">
				<Checkbox
					id="terms"
					bind:checked={formState.formData.consents.privacy}
					class="mt-1 h-4 w-4 border-gray-500"
				/>

				<div class="flex-1 pt-0.5">
					<label for="terms" class="cursor-pointer text-sm font-medium leading-relaxed text-gray-600 block">
						By signing up you agree to our
						<a href="/terms" class="text-blue-600 font-bold hover:underline">Terms and conditions</a>
						and
						<a href="/privacy" class="text-blue-600 font-bold hover:underline">Privacy policy</a>.
					</label>

					{#if formState.errors.privacy}
						<p class="mt-1 text-sm text-red-500">{formState.errors.privacy}</p>
					{/if}
				</div>
			</div>

			<Button
				type="submit"
				class="text-base h-auto min-h-0 w-full rounded-xl py-3.5 sm:py-4 px-6 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 font-bold active:scale-[0.98] md:text-lg"
				disabled={!formState.formData.consents.privacy || formState.isLoading}
			>
				{#if formState.isLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Processing...
				{:else}
					Submit Registration
				{/if}
			</Button>
		</div>
	</form>
</div>
