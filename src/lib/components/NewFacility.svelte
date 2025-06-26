<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	// Form data using Svelte 5 runes
	let formData = $state({
		facilityName: '',
		facilityType: 'Hospital',
		licenseNumber: '',
		taxId: '',
		yearEstablished: '',
		address: {
			street: '',
			city: '',
			state: '',
			zipCode: '',
			country: ''
		},
		contact: {
			primaryPhone: '',
			alternatePhone: '',
			email: '',
			website: ''
		},
		representative: {
			name: '',
			position: '',
			phone: '',
			email: ''
		},
		services: {
			emergency: false,
			inpatient: false,
			outpatient: false,
			surgery: false,
			laboratory: false,
			radiology: false,
			pharmacy: false,
			specialtyCare: false
		},
		specialties: '',
		bedCount: '',
		staffCount: '',
		acceptedInsurance: '',
		certifications: '',
		consents: {
			terms: false,
			dataSharing: false,
			verification: false
		}
	});

	// Computed validation state
	let isValid = $derived(
		formData.facilityName &&
			formData.licenseNumber &&
			formData.contact.email &&
			formData.contact.primaryPhone &&
			formData.representative.name &&
			formData.consents.verification
	);

	function handleSubmit() {
		if (!isValid) return;

		console.log('Facility registration submitted:', formData);
		// API call would go here
		alert('Facility registration successful!');
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
		Register Your Facility <span class="text-2xl">🏥</span>
	</h1>
	<p class="mb-8 text-gray-500">Join our network of healthcare providers</p>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<!-- Facility Information -->
		<h2 class="mt-4 mb-4 text-xl font-semibold text-gray-900">Facility Information</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="facilityName">Facility Name</Label>
				<Input
					id="facilityName"
					bind:value={formData.facilityName}
					placeholder="ex: Memorial Hospital"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="facilityType">Facility Type</Label>
				<select
					id="facilityType"
					bind:value={formData.facilityType}
					class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
				>
					<option>Hospital</option>
					<option>Clinic</option>
					<option>Urgent Care</option>
					<option>Specialty Center</option>
					<option>Rehabilitation Center</option>
					<option>Other</option>
				</select>
			</div>
			<div>
				<Label for="licenseNumber">License Number</Label>
				<Input
					id="licenseNumber"
					bind:value={formData.licenseNumber}
					placeholder="ex: HC12345678"
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
				<Label for="street">Street Address</Label>
				<Input
					id="street"
					bind:value={formData.address.street}
					placeholder="ex: 123 Medical Center Drive"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="city">City</Label>
				<Input
					id="city"
					bind:value={formData.address.city}
					placeholder="ex: Chicago"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="state">State/Province</Label>
				<Input
					id="state"
					bind:value={formData.address.state}
					placeholder="ex: Illinois"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="zipCode">Zip/Postal Code</Label>
				<Input
					id="zipCode"
					bind:value={formData.address.zipCode}
					placeholder="ex: 60601"
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
					placeholder="ex: (312) 555-1234"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="alternatePhone">Alternate Phone</Label>
				<Input
					id="alternatePhone"
					bind:value={formData.contact.alternatePhone}
					placeholder="ex: (312) 555-5678"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="email">Email Address</Label>
				<Input
					id="email"
					bind:value={formData.contact.email}
					placeholder="ex: info@memorialhospital.org"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="website">Website</Label>
				<Input
					id="website"
					bind:value={formData.contact.website}
					placeholder="ex: www.memorialhospital.org"
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
					placeholder="ex: Dr. Jane Smith"
					class="mt-1"
					required
				/>
			</div>
			<div>
				<Label for="repPosition">Position/Title</Label>
				<Input
					id="repPosition"
					bind:value={formData.representative.position}
					placeholder="ex: Chief Medical Officer"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="repPhone">Phone</Label>
				<Input
					id="repPhone"
					bind:value={formData.representative.phone}
					placeholder="ex: (312) 555-9876"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="repEmail">Email</Label>
				<Input
					id="repEmail"
					bind:value={formData.representative.email}
					placeholder="ex: jsmith@memorialhospital.org"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Services and Capacity -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Services and Capacity</h2>
		<div class="mb-6">
			<Label class="mb-2 block">Services Offered</Label>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-3">
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.services.emergency}
							class="accent-blue-500"
						/>
						<span>Emergency Care</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.services.inpatient}
							class="accent-blue-500"
						/>
						<span>Inpatient Care</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.services.outpatient}
							class="accent-blue-500"
						/>
						<span>Outpatient Care</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.services.surgery}
							class="accent-blue-500"
						/>
						<span>Surgery</span>
					</label>
				</div>

				<div class="space-y-3">
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.services.laboratory}
							class="accent-blue-500"
						/>
						<span>Laboratory</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.services.radiology}
							class="accent-blue-500"
						/>
						<span>Radiology</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.services.pharmacy}
							class="accent-blue-500"
						/>
						<span>Pharmacy</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={formData.services.specialtyCare}
							class="accent-blue-500"
						/>
						<span>Specialty Care</span>
					</label>
				</div>
			</div>

			<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label for="specialties">Specialties/Departments</Label>
					<Input
						id="specialties"
						bind:value={formData.specialties}
						placeholder="ex: Cardiology, Oncology, Pediatrics"
						class="mt-1"
					/>
				</div>
				<div>
					<Label for="bedCount">Number of Beds</Label>
					<Input id="bedCount" bind:value={formData.bedCount} placeholder="ex: 250" class="mt-1" />
				</div>
				<div>
					<Label for="staffCount">Number of Staff</Label>
					<Input
						id="staffCount"
						bind:value={formData.staffCount}
						placeholder="ex: 1200"
						class="mt-1"
					/>
				</div>
				<div>
					<Label for="acceptedInsurance">Accepted Insurance</Label>
					<Input
						id="acceptedInsurance"
						bind:value={formData.acceptedInsurance}
						placeholder="ex: BlueCross, Aetna, Medicare"
						class="mt-1"
					/>
				</div>
				<div class="md:col-span-2">
					<Label for="certifications">Certifications/Accreditations</Label>
					<Input
						id="certifications"
						bind:value={formData.certifications}
						placeholder="ex: Joint Commission, NCQA"
						class="mt-1"
					/>
				</div>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Documentation Upload -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Documentation</h2>
		<div class="mb-6 space-y-4">
			<div>
				<Label for="licenseUpload">Facility License</Label>
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
				<Label for="accreditationUpload">Accreditation Certificates</Label>
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
				<span>I consent to share facility data with authorized partners on the platform.</span>
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
			Register Facility
		</Button>
	</form>
</div>
