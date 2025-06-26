<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	// Form data using Svelte 5 runes
	let formData = $state({
		companyName: '',
		registrationNumber: '',
		taxId: '',
		yearEstablished: '',
		address: {
			headquarters: '',
			city: '',
			state: '',
			zipCode: '',
			country: ''
		},
		contact: {
			primaryPhone: '',
			customerService: '',
			email: '',
			website: ''
		},
		representative: {
			name: '',
			position: '',
			phone: '',
			email: ''
		},
		coverage: {
			states: '',
			memberCount: '',
			networkSize: '',
			planTypes: {
				hmo: false,
				ppo: false,
				epo: false,
				pos: false,
				indemnity: false,
				medicare: false,
				medicaid: false
			}
		},
		financials: {
			annualRevenue: '',
			claimsProcessed: '',
			averageProcessingTime: ''
		},
		partnerships: {
			hospitals: '',
			pharmacies: '',
			laboratories: '',
			specialists: ''
		},
		consents: {
			terms: false,
			dataSharing: false,
			verification: false
		}
	});

	// Computed validation state
	let isValid = $derived(
		formData.companyName &&
			formData.registrationNumber &&
			formData.contact.email &&
			formData.contact.primaryPhone &&
			formData.representative.name &&
			formData.consents.verification
	);

	function handleSubmit() {
		if (!isValid) return;

		console.log('HMO registration submitted:', formData);
		// API call would go here
		alert('HMO registration successful!');
	}
</script>

<div class="flex w-full flex-col px-8 py-10 sm:px-12 md:w-3/5">
	<!-- Logo and Welcome -->
	<div class="mb-8 flex items-center gap-3">
		<h1 class="border-blue-300 p-2 text-xl font-bold">
			Heal<span class="text-blue-500">Pro.</span>
		</h1>
	</div>
	<h1 class="mb-1 flex items-center gap-2 text-3xl font-bold text-gray-900">
		Register Your HMO <span class="text-2xl">🏛️</span>
	</h1>
	<p class="mb-8 text-gray-500">Join our network of healthcare insurers</p>

	<form on:submit|preventDefault={handleSubmit}>
		<!-- Company Information -->
		<h2 class="mt-4 mb-4 text-xl font-semibold text-gray-900">Company Information</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="companyName">Company Name</Label>
				<Input
					id="companyName"
					bind:value={formData.companyName}
					placeholder="ex: BlueCross Insurance"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="registrationNumber">Registration Number</Label>
				<Input
					id="registrationNumber"
					bind:value={formData.registrationNumber}
					placeholder="ex: INS12345678"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="taxId">Tax ID / EIN</Label>
				<Input id="taxId" bind:value={formData.taxId} placeholder="ex: 12-3456789" class="mt-1" />
			</div>
			<div>
				<Label for="yearEstablished">Year Established</Label>
				<Input
					id="yearEstablished"
					bind:value={formData.yearEstablished}
					placeholder="ex: 1985"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Address Information -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Address Information</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="md:col-span-2">
				<Label for="headquarters">Headquarters Address</Label>
				<Input
					id="headquarters"
					bind:value={formData.address.headquarters}
					placeholder="ex: 123 Insurance Plaza"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="city">City</Label>
				<Input
					id="city"
					bind:value={formData.address.city}
					placeholder="ex: Hartford"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="state">State/Province</Label>
				<Input
					id="state"
					bind:value={formData.address.state}
					placeholder="ex: Connecticut"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="zipCode">Zip/Postal Code</Label>
				<Input
					id="zipCode"
					bind:value={formData.address.zipCode}
					placeholder="ex: 06103"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="country">Country</Label>
				<Input
					id="country"
					bind:value={formData.address.country}
					placeholder="ex: United States"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Contact Information -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Contact Information</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="primaryPhone">Primary Phone</Label>
				<Input
					id="primaryPhone"
					bind:value={formData.contact.primaryPhone}
					placeholder="ex: (860) 555-1234"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="customerService">Customer Service Line</Label>
				<Input
					id="customerService"
					bind:value={formData.contact.customerService}
					placeholder="ex: (800) 555-5678"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="email">Email Address</Label>
				<Input
					id="email"
					bind:value={formData.contact.email}
					placeholder="ex: info@bluecross.com"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="website">Website</Label>
				<Input
					id="website"
					bind:value={formData.contact.website}
					placeholder="ex: www.bluecross.com"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Representative Information -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Primary Representative</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="repName">Representative Name</Label>
				<Input
					id="repName"
					bind:value={formData.representative.name}
					placeholder="ex: John Johnson"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="repPosition">Position/Title</Label>
				<Input
					id="repPosition"
					bind:value={formData.representative.position}
					placeholder="ex: Director of Provider Relations"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="repPhone">Phone</Label>
				<Input
					id="repPhone"
					bind:value={formData.representative.phone}
					placeholder="ex: (860) 555-9876"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="repEmail">Email</Label>
				<Input
					id="repEmail"
					bind:value={formData.representative.email}
					placeholder="ex: jjohnson@bluecross.com"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Coverage Information -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Coverage Information</h2>
		<div class="mb-6">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label for="states">States/Regions Covered</Label>
					<Input
						id="states"
						bind:value={formData.coverage.states}
						placeholder="ex: CT, MA, NY, NJ"
						class="mt-1"
					/>
				</div>
				<div>
					<Label for="memberCount">Approximate Member Count</Label>
					<Input
						id="memberCount"
						bind:value={formData.coverage.memberCount}
						placeholder="ex: 1,500,000"
						class="mt-1"
					/>
				</div>
				<div>
					<Label for="networkSize">Provider Network Size</Label>
					<Input
						id="networkSize"
						bind:value={formData.coverage.networkSize}
						placeholder="ex: 25,000 providers"
						class="mt-1"
					/>
				</div>
			</div>

			<div class="mt-4">
				<Label class="mb-2 block">Plan Types Offered</Label>
				<div class="grid grid-cols-2 gap-2 md:grid-cols-4">
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.coverage.planTypes.hmo}
							class="accent-blue-500"
						/>
						<span>HMO</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.coverage.planTypes.ppo}
							class="accent-blue-500"
						/>
						<span>PPO</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.coverage.planTypes.epo}
							class="accent-blue-500"
						/>
						<span>EPO</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.coverage.planTypes.pos}
							class="accent-blue-500"
						/>
						<span>POS</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.coverage.planTypes.indemnity}
							class="accent-blue-500"
						/>
						<span>Indemnity</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.coverage.planTypes.medicare}
							class="accent-blue-500"
						/>
						<span>Medicare</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.coverage.planTypes.medicaid}
							class="accent-blue-500"
						/>
						<span>Medicaid</span>
					</label>
				</div>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Financial Information -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Financial Information</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="annualRevenue">Annual Revenue (Optional)</Label>
				<Input
					id="annualRevenue"
					bind:value={formData.financials.annualRevenue}
					placeholder="ex: $2.5 billion"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="claimsProcessed">Annual Claims Processed</Label>
				<Input
					id="claimsProcessed"
					bind:value={formData.financials.claimsProcessed}
					placeholder="ex: 5 million"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="averageProcessingTime">Average Claim Processing Time</Label>
				<Input
					id="averageProcessingTime"
					bind:value={formData.financials.averageProcessingTime}
					placeholder="ex: 14 days"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Partnership Information -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Network Partnerships</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="hospitals">Affiliated Hospitals</Label>
				<Input
					id="hospitals"
					bind:value={formData.partnerships.hospitals}
					placeholder="ex: 150 hospitals"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="pharmacies">Pharmacy Network</Label>
				<Input
					id="pharmacies"
					bind:value={formData.partnerships.pharmacies}
					placeholder="ex: 5,000 pharmacies"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="laboratories">Laboratory Partners</Label>
				<Input
					id="laboratories"
					bind:value={formData.partnerships.laboratories}
					placeholder="ex: LabCorp, Quest Diagnostics"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="specialists">Specialist Network</Label>
				<Input
					id="specialists"
					bind:value={formData.partnerships.specialists}
					placeholder="ex: 10,000 specialists"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Documentation Upload -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Documentation</h2>
		<div class="mb-6 space-y-4">
			<div>
				<Label for="licenseUpload">Insurance License</Label>
				<div
					class="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center text-gray-400 transition hover:border-blue-500"
				>
					<span class="mb-2 block"
						>Click to upload <span class="text-blue-600">or drag and drop</span></span
					>
					<span class="text-xs">PDF, JPG or PNG (max. 10MB)</span>
				</div>
			</div>
			<div>
				<Label for="financialUpload">Financial Statement</Label>
				<div
					class="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center text-gray-400 transition hover:border-blue-500"
				>
					<span class="mb-2 block"
						>Click to upload <span class="text-blue-600">or drag and drop</span></span
					>
					<span class="text-xs">PDF, JPG or PNG (max. 10MB)</span>
				</div>
			</div>
		</div>

		<!-- Consent and Terms -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Terms and Conditions</h2>
		<div class="mb-8 space-y-3">
			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={formData.consents.terms} class="accent-blue-500" />
				<span>I agree to the terms and conditions of the platform.</span>
			</label>
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={formData.consents.dataSharing}
					class="accent-blue-500"
				/>
				<span>I consent to share insurance data with authorized partners on the platform.</span>
			</label>
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={formData.consents.verification}
					class="accent-blue-500"
					required
				/>
				<span>I verify that all information provided is accurate and complete.</span>
			</label>
		</div>

		<Button
			type="submit"
			disabled={!isValid}
			class="w-full rounded-md bg-blue-500 py-3 text-base font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
		>
			Register HMO
		</Button>
	</form>
</div>
