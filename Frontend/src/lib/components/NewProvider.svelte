<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { X, FileText, Image, Eye, EyeOff, Activity, ChevronDown } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import {
		FacilityFormState,
		facilityTypes,
		facilityTiers,
		specialtyGroups,
		equipmentList,
		operatingHours
	} from '$lib/utils/facility-form.svelte.js';

	const formState = new FacilityFormState();

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

	// LGA/City fetching logic
	let states = $state<{ name: string }[]>([]);
	let allLGAs = $state<Record<string, string[]>>({});
	let cities = $state<string[]>([]);
	let loadingCities = $state(false);

	// Fetch States and LGAs on mount
	onMount(async () => {
		try {
			const [statesRes, lgasRes] = await Promise.all([
				fetch('https://temikeezy.github.io/nigeria-geojson-data/data/states.json'),
				fetch('https://temikeezy.github.io/nigeria-geojson-data/data/lgas.json')
			]);
			const statesData = await statesRes.json();
			const lgasData = await lgasRes.json();
			
			if (Array.isArray(statesData)) {
				states = statesData.map((s: string) => ({ name: s }));
			}
			if (lgasData && typeof lgasData === 'object') {
				allLGAs = lgasData;
			}
		} catch (error) {
			console.error('Error fetching locations:', error);
			toast.error('Failed to load locations');
		}
	});

	// Fetch LGAs when state changes
	$effect(() => {
		if (!browser) return;
		const selectedStateName = formState.formData.state;

		if (selectedStateName && allLGAs[selectedStateName]) {
			cities = allLGAs[selectedStateName];
		} else {
			cities = [];
		}
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

		// Reset input
		(e.target as HTMLInputElement).value = '';
	}

	function removeFile(index: number) {
		formState.removeFile(index);
	}

	async function handleSubmit() {
		const result = await formState.handleSubmit();

		if (result.success) {
			toast.success('Registration Successful', {
				description: `Your facility has been registered successfully.\n${formatTimestamp()}`
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
			Ready to <span class="font-normal italic text-blue-600 underline-offset-4 decoration-blue-200 underline"> Expand </span> Your Reach!
		</h2>
		<p class="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base md:text-lg">
			Connect your patients to improved service delivery and better access across the platform.
		</p>
	</div>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-8"
	>
		<!-- 1. Facility Identity & Admin Auth -->
		<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<h3 class="text-lg font-semibold text-gray-900">Facility Identity & Admin Auth</h3>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label for="facilityName" class={formState.errors.facilityName ? 'text-red-500' : ''}
							>Facility Name *</Label
						>
						<Input
							id="facilityName"
							bind:value={formState.formData.facilityName}
							placeholder="Memorial Hospital"
							class="mt-1"
							aria-invalid={!!formState.errors.facilityName}
						/>
						{#if formState.errors.facilityName}
							<p class="mt-1 text-sm text-red-500">{formState.errors.facilityName}</p>
						{/if}
					</div>

					<div>
						<Label for="facilityType" class={formState.errors.facilityType ? 'text-red-500' : ''}
							>Facility Type *</Label
						>
						<Select.Root type="single" bind:value={formState.formData.facilityType}>
							<Select.Trigger class="mt-1 w-full">
								{formState.formData.facilityType || 'Select Type'}
							</Select.Trigger>
							<Select.Content>
								{#each facilityTypes as type}
									<Select.Item value={type}>{type}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.facilityType}
							<p class="mt-1 text-sm text-red-500">{formState.errors.facilityType}</p>
						{/if}
					</div>

					<div>
						<Label for="facilityTier" class={formState.errors.facilityTier ? 'text-red-500' : ''}
							>Facility Tier *</Label
						>
						<Select.Root type="single" bind:value={formState.formData.facilityTier}>
							<Select.Trigger class="mt-1 w-full">
								{formState.formData.facilityTier || 'Select Tier'}
							</Select.Trigger>
							<Select.Content>
								{#each facilityTiers as tier}
									<Select.Item value={tier}>{tier}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.facilityTier}
							<p class="mt-1 text-sm text-red-500">{formState.errors.facilityTier}</p>
						{/if}
					</div>

					<div>
						<Label for="email" class={formState.errors.email ? 'text-red-500' : ''}
							>Official Email *</Label
						>
						<Input
							id="email"
							type="email"
							bind:value={formState.formData.email}
							placeholder="admin@hospital.com"
							class="mt-1"
						/>
						{#if formState.errors.email}
							<p class="mt-1 text-sm text-red-500">{formState.errors.email}</p>
						{/if}
					</div>

					<div>
						<Label for="phone" class={formState.errors.phone ? 'text-red-500' : ''}
							>Facility Phone *</Label
						>
						<Input
							id="phone"
							type="tel"
							bind:value={formState.formData.phone}
							placeholder="+234..."
							class="mt-1"
						/>
						{#if formState.errors.phone}
							<p class="mt-1 text-sm text-red-500">{formState.errors.phone}</p>
						{/if}
					</div>
					<div>
						<Label for="contactPerson" class={formState.errors.contactPerson ? 'text-red-500' : ''}
							>Name of Contact Person *</Label
						>
						<Input
							id="contactPerson"
							bind:value={formState.formData.contactPerson}
							placeholder="Memorial Hospital"
							class="mt-1"
							aria-invalid={!!formState.errors.contactPerson}
						/>
						{#if formState.errors.contactPerson}
							<p class="mt-1 text-sm text-red-500">{formState.errors.contactPerson}</p>
						{/if}
					</div>
					<div>
						<Label for="password" class={formState.errors.password ? 'text-red-500' : ''}
							>Admin Password *</Label
						>
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
							>Confirm Password *</Label
						>
						<div class="relative">
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={formState.formData.confirmPassword}
								placeholder="••••••••"
								class="mt-1 pr-10"
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
						<Label for="bedCapacity" class={formState.errors.bedCapacity ? 'text-red-500' : ''}
							>Number of Beds</Label
						>
						<Input
							id="bedCapacity"
							type="number"
							bind:value={formState.formData.bedCapacity}
							placeholder="250"
							class="mt-1 max-w-xs"
						/>
						{#if formState.errors.bedCapacity}
							<p class="mt-1 text-sm text-red-500">{formState.errors.bedCapacity}</p>
						{/if}
					</div>
					<div>
						<Label for="website">Website (Optional)</Label>
						<Input
							id="website"
							type="url"
							bind:value={formState.formData.website}
							placeholder="https://..."
							class="mt-1"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- 2. Location & Operations -->
		<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<h3 class="text-lg font-semibold text-gray-900">Location & Operations</h3>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="md:col-span-2">
						<Label for="address" class={formState.errors.address ? 'text-red-500' : ''}
							>Street Address *</Label
						>
						<Textarea
							id="address"
							bind:value={formState.formData.address}
							placeholder="123 Medical Center Dr"
							class="mt-1"
							rows={2}
						/>
						{#if formState.errors.address}
							<p class="mt-1 text-sm text-red-500">{formState.errors.address}</p>
						{/if}
					</div>

					<div>
						<Label for="state" class={formState.errors.state ? 'text-red-500' : ''}>State *</Label>
						<Select.Root type="single" bind:value={formState.formData.state}>
							<Select.Trigger class="mt-1 w-full">
								{formState.formData.state || 'Select State'}
							</Select.Trigger>
							<Select.Content class="max-h-[300px]">
								{#each states as state}
									<Select.Item value={state.name}>{state.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.state}
							<p class="mt-1 text-sm text-red-500">{formState.errors.state}</p>
						{/if}
					</div>

					<div>
						<Label for="city">City / LGA</Label>
						<Select.Root
							type="single"
							bind:value={formState.formData.city}
							disabled={!formState.formData.state || loadingCities}
						>
							<Select.Trigger class="mt-1 w-full">
								{#if loadingCities}
									Loading cities...
								{:else if !formState.formData.state}
									Select a state first
								{:else if formState.formData.city}
									{formState.formData.city}
								{:else}
									Select City / LGA
								{/if}
							</Select.Trigger>
							<Select.Content class="max-h-[300px]">
								{#if cities.length > 0}
									{#each cities as city}
										<Select.Item value={city}>{city}</Select.Item>
									{/each}
								{:else}
									<Select.Item value="" disabled>No cities available</Select.Item>
								{/if}
							</Select.Content>
						</Select.Root>
						{#if !formState.formData.state}
							<p class="mt-1 text-xs text-gray-500">Please select a state to load cities</p>
						{/if}
					</div>

					<div>
						<Label
							for="operatingHours"
							class={formState.errors.operatingHours ? 'text-red-500' : ''}>Operating Hours *</Label
						>
						<Select.Root type="single" bind:value={formState.formData.operatingHours}>
							<Select.Trigger class="mt-1 w-full">
								{formState.formData.operatingHours || 'Select Time'}
							</Select.Trigger>
							<Select.Content class="max-h-[300px]">
								{#each operatingHours as time}
									<Select.Item value={time}>{time}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if formState.errors.operatingHours}
							<p class="mt-1 text-sm text-red-500">{formState.errors.operatingHours}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- 3. Compliance & Accreditation -->
		<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<h3 class="text-lg font-semibold text-gray-900">Compliance & Accreditation</h3>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label for="licenseNumber" class={formState.errors.licenseNumber ? 'text-red-500' : ''}
							>License / Reg No. *</Label
						>
						<Input
							id="licenseNumber"
							bind:value={formState.formData.licenseNumber}
							placeholder="HEFAMAA/12345"
							class="mt-1 font-mono"
						/>
						{#if formState.errors.licenseNumber}
							<p class="mt-1 text-sm text-red-500">{formState.errors.licenseNumber}</p>
						{/if}
					</div>

					<div>
						<Label for="taxId" class={formState.errors.taxId ? 'text-red-500' : ''}
							>Tax ID (TIN) *</Label
						>
						<Input
							id="taxId"
							bind:value={formState.formData.taxId}
							placeholder="12345678-0001"
							class="mt-1"
						/>
						{#if formState.errors.taxId}
							<p class="mt-1 text-sm text-red-500">{formState.errors.taxId}</p>
						{/if}
					</div>

					<div>
						<Label for="cmdName" class={formState.errors.cmdName ? 'text-red-500' : ''}
							>Chief Medical Director *</Label
						>
						<Input
							id="cmdName"
							bind:value={formState.formData.cmdName}
							placeholder="Dr. John Doe"
							class="mt-1"
						/>
						{#if formState.errors.cmdName}
							<p class="mt-1 text-sm text-red-500">{formState.errors.cmdName}</p>
						{/if}
					</div>

					<div>
						<Label for="cmdFolio" class={formState.errors.cmdFolio ? 'text-red-500' : ''}
							>CMD Folio Number *</Label
						>
						<Input
							id="cmdFolio"
							bind:value={formState.formData.cmdFolio}
							placeholder="MDCN/..."
							class="mt-1"
						/>
						{#if formState.errors.cmdFolio}
							<p class="mt-1 text-sm text-red-500">{formState.errors.cmdFolio}</p>
						{/if}
					</div>

					<!-- File Upload Section -->
					<div class="mt-1 md:col-span-2">
						<Label>Upload Identification Document (Max 5MB)</Label>
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
						{#if formState.formData.licenseFiles.length > 0}
							<div class="mt-4 space-y-2">
								{#each formState.formData.licenseFiles as file, i}
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

		<!-- 4. Services & Specialties -->
		<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<h3 class="text-lg font-semibold text-gray-900">Specialties & Equipments</h3>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="space-y-6">
					<div>
						<Label class={formState.errors.specialties ? 'text-red-500' : ''}
							>Clinical Specialties *</Label
						>
						{#if formState.errors.specialties}
							<p class="mb-2 text-sm text-red-500">{formState.errors.specialties}</p>
						{/if}

						<div class="mt-2 text-sm text-gray-500">
							<p class="mb-2">Enter specialties related to the provider.</p>
							
							<div class="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-[0.35rem] focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-1">
								<Input
									type="text"
									id="specialty-input"
									placeholder="e.g. General Practice, Antenatal..."
									class="h-8 border-none bg-transparent shadow-none focus-visible:ring-0"
									onkeydown={(e) => {
										// Press Enter or Comma to add tag
										if (e.key === 'Enter' || e.key === ',') {
											e.preventDefault();
											const val = (e.target as HTMLInputElement).value.trim();
											if (val && !formState.formData.specialties.includes(val)) {
												formState.formData.specialties = [...formState.formData.specialties, val];
												(e.target as HTMLInputElement).value = '';
											}
										}
									}}
								/>
								<Button 
									type="button" 
									size="sm" 
									class="bg-blue-600 hover:bg-blue-700 h-8"
									onclick={() => {
										const input = document.getElementById('specialty-input') as HTMLInputElement;
										const val = input.value.trim();
										if (val && !formState.formData.specialties.includes(val)) {
											formState.formData.specialties = [...formState.formData.specialties, val];
											input.value = '';
										}
									}}
								>
									Add Specialty
								</Button>
							</div>
						</div>

						<!-- Selected Tags (Pills) -->
						<div class="mt-4 flex flex-wrap gap-2">
							{#if formState.formData.specialties.length > 0}
								<!-- Tag header removed as requested, just showing recent tags styling -->
								<div class="w-full text-xs font-semibold text-gray-600 mb-1">Recent tags:</div>
							{/if}

							{#each formState.formData.specialties as specialty}
								<span class="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-100/80">
									{specialty}
									<button
										type="button"
										class="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-500 hover:bg-blue-200 hover:text-blue-900 focus:outline-none"
										onclick={() => {
											formState.formData.specialties = formState.formData.specialties.filter((s) => s !== specialty);
										}}
									>
										<span class="sr-only">Remove {specialty}</span>
										<X class="h-3 w-3" />
									</button>
								</span>
							{/each}
						</div>
					</div>

					<div>
						<Label>Facility Equipment</Label>
						<div class="mt-2 text-sm text-gray-500">
							<p class="mb-2">Enter available  Equipment.</p>
							
							<div class="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-[0.35rem] focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-1">
								<Input
									type="text"
									id="equipment-input"
									placeholder="e.g. MRI, ICU Beds, Ventilators..."
									class="h-8 border-none bg-transparent shadow-none focus-visible:ring-0"
									onkeydown={(e) => {
										// Press Enter or Comma to add tag
										if (e.key === 'Enter' || e.key === ',') {
											e.preventDefault();
											const val = (e.target as HTMLInputElement).value.trim();
											if (val && !formState.formData.equipment.includes(val)) {
												formState.formData.equipment = [...formState.formData.equipment, val];
												(e.target as HTMLInputElement).value = '';
											}
										}
									}}
								/>
								<Button 
									type="button" 
									size="sm" 
									class="bg-blue-600 hover:bg-blue-700 h-8"
									onclick={() => {
										const input = document.getElementById('equipment-input') as HTMLInputElement;
										const val = input.value.trim();
										if (val && !formState.formData.equipment.includes(val)) {
											formState.formData.equipment = [...formState.formData.equipment, val];
											input.value = '';
										}
									}}
								>
									Add Equipment
								</Button>
							</div>
						</div>

						<!-- Selected Tags (Pills) -->
						<div class="mt-4 flex flex-wrap gap-2">
							{#if formState.formData.equipment.length > 0}
								<div class="w-full text-xs font-semibold text-gray-600 mb-1">Recent tags:</div>
							{/if}

							{#each formState.formData.equipment as item}
								<span class="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-100/80">
									{item}
									<button
										type="button"
										class="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-500 hover:bg-blue-200 hover:text-blue-900 focus:outline-none"
										onclick={() => {
											formState.formData.equipment = formState.formData.equipment.filter((i) => i !== item);
										}}
									>
										<span class="sr-only">Remove {item}</span>
										<X class="h-3 w-3" />
									</button>
								</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 5. Financial Settlement -->
		<div class="overflow-hidden rounded-2xl border bg-white shadow-sm">
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3 sm:px-6">
				<h3 class="text-lg font-semibold text-gray-900">Financial Settlement</h3>
				<div class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500">
					<ChevronDown class="h-4 w-4" />
				</div>
			</div>
			<div class="p-4 sm:p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label for="bankName" class={formState.errors.bankName ? 'text-red-500' : ''}
							>Bank Name *</Label
						>
						<Input
							id="bankName"
							bind:value={formState.formData.bankName}
							placeholder="Select Bank"
							class="mt-1"
						/>
						{#if formState.errors.bankName}
							<p class="mt-1 text-sm text-red-500">{formState.errors.bankName}</p>
						{/if}
					</div>

					<div>
						<Label for="accountNumber" class={formState.errors.accountNumber ? 'text-red-500' : ''}
							>Account Number *</Label
						>
						<Input
							id="accountNumber"
							bind:value={formState.formData.accountNumber}
							placeholder="0123456789"
							class="mt-1"
							maxlength={10}
						/>
						{#if formState.errors.accountNumber}
							<p class="mt-1 text-sm text-red-500">{formState.errors.accountNumber}</p>
						{/if}
					</div>

					<div class="md:col-span-2">
						<Label for="accountName">Account Name</Label>
						<Input
							id="accountName"
							bind:value={formState.formData.accountName}
							placeholder="John Doe"
							class="mt-1"
							maxlength={10}
						/>
						<p class="mt-1 text-xs text-gray-500">Account name will be verified before payment.</p>
						{#if formState.errors.accountName}
							<p class="mt-1 text-sm text-red-500">{formState.errors.accountName}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="space-y-3 pt-6">
			<div class="flex items-center gap-3">
				<Checkbox
					id="terms"
					bind:checked={formState.formData.consents.privacy}
					class="mt-0.5 h-4 w-4 border-gray-500"
					aria-describedby={formState.errors.privacy ? 'privacy-error' : undefined}
				/>

				<div class="flex-1 pt-0.5">
					<label for="terms" class="cursor-pointer text-sm font-medium leading-relaxed text-gray-600 block">
						By signing up you agree to our
						<a href="/terms" class="text-blue-600 font-bold hover:underline">Terms and conditions</a>
						and
						<a href="/privacy" class="text-blue-600 font-bold hover:underline">Privacy policy</a>.
					</label>

					{#if formState.errors.privacy}
						<p id="privacy-error" class="mt-1 text-sm text-red-500">{formState.errors.privacy}</p>
					{/if}
				</div>
			</div>

			<Button
				type="submit"
				class="text-base h-auto min-h-0 w-full rounded-xl py-3.5 sm:py-4 px-6 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 font-bold active:scale-[0.98] md:text-lg"
				disabled={!formState.formData.consents.privacy || formState.isLoading}
			>
				{#if formState.isLoading}
					<Spinner class="mr-2" />
					Processing...
				{:else}
					Submit Registration
				{/if}
			</Button>
		</div>
	</form>
</div>
