<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	// Props for customization
	interface Props {
		title?: string;
		subtitle?: string;
		onSubmit?: (data: any) => void;
	}

	let {
		title = 'Welcome',
		subtitle = 'Let us know more about you',
		onSubmit = () => {}
	}: Props = $props();

	// Form data
	let formData = $state({
		fullname: '',
		phone: '',
		email: '',
		dob: '',
		gender: '',
		occupation: '',
		address: '',
		emergencyName: '',
		emergencyPhone: '',
		physician: '',
		insurance: '',
		policy: '',
		allergies: '',
		medications: '',
		familyHistory: '',
		pastHistory: '',
		idType: 'National ID',
		idNumber: '',
		consents: {
			treatment: true,
			disclosure: false,
			privacy: true
		}
	});

	function handleSubmit() {
		onSubmit(formData);
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
		{title} <span class="text-2xl">👋</span>
	</h1>
	<p class="mb-8 text-gray-500">{subtitle}</p>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<!-- Personal Information -->
		<h2 class="mt-4 mb-4 text-xl font-semibold text-gray-900">Personal Information</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="fullname">Full name</Label>
				<Input id="fullname" bind:value={formData.fullname} placeholder="ex: Adam" class="mt-1" />
			</div>
			<div>
				<Label for="phone">Phone number</Label>
				<Input id="phone" bind:value={formData.phone} placeholder="+00 0342 0453 34" class="mt-1" />
			</div>
			<div>
				<Label for="email">Email address</Label>
				<Input
					id="email"
					bind:value={formData.email}
					placeholder="adrian@jsmastery.pro"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="dob">Date of birth</Label>
				<Input id="dob" bind:value={formData.dob} type="date" class="mt-1" />
			</div>
			<div>
				<Label for="gender">Gender</Label>
				<div class="mt-1 flex gap-4">
					<label class="flex items-center gap-1">
						<input
							type="radio"
							name="gender"
							value="male"
							bind:group={formData.gender}
							class="accent-blue-500"
						/>
						Male
					</label>
					<label class="flex items-center gap-1">
						<input
							type="radio"
							name="gender"
							value="female"
							bind:group={formData.gender}
							class="accent-blue-500"
						/>
						Female
					</label>
					<label class="flex items-center gap-1">
						<input
							type="radio"
							name="gender"
							value="other"
							bind:group={formData.gender}
							class="accent-blue-500"
						/>
						Other
					</label>
				</div>
			</div>
			<div>
				<Label for="occupation">Occupation</Label>
				<Input
					id="occupation"
					bind:value={formData.occupation}
					placeholder="Software Engineer"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="address">Address</Label>
				<Input
					id="address"
					bind:value={formData.address}
					placeholder="ex: 14 street, New York, NY - 5101"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="emergencyName">Emergency contact name</Label>
				<Input
					id="emergencyName"
					bind:value={formData.emergencyName}
					placeholder="Guardian's name"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="emergencyPhone">Emergency Phone number</Label>
				<Input
					id="emergencyPhone"
					bind:value={formData.emergencyPhone}
					placeholder="ex: +1 (868) 579-9831"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Medical Information -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Medical Information</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="physician">Primary care physician</Label>
				<Input
					id="physician"
					bind:value={formData.physician}
					placeholder="Dr. Adam Smith"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="insurance">Insurance provider</Label>
				<Input
					id="insurance"
					bind:value={formData.insurance}
					placeholder="ex: BlueCross"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="policy">Insurance policy number</Label>
				<Input id="policy" bind:value={formData.policy} placeholder="ex: ABC1234567" class="mt-1" />
			</div>
			<div>
				<Label for="allergies">Allergies (if any)</Label>
				<Input
					id="allergies"
					bind:value={formData.allergies}
					placeholder="ex: Peanuts, Penicillin, Pollen"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="medications">Current medications</Label>
				<Input
					id="medications"
					bind:value={formData.medications}
					placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="familyHistory">Family medical history (if relevant)</Label>
				<Input
					id="familyHistory"
					bind:value={formData.familyHistory}
					placeholder="ex: Mother had breast cancer"
					class="mt-1"
				/>
			</div>
			<div>
				<Label for="pastHistory">Past medical history</Label>
				<Input
					id="pastHistory"
					bind:value={formData.pastHistory}
					placeholder="ex: Asthma diagnosis in childhood"
					class="mt-1"
				/>
			</div>
		</div>
		<Separator class="my-2" />

		<!-- Identification and Verification -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Identification and Verification</h2>
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label for="idType">Identification type</Label>
				<select
					id="idType"
					bind:value={formData.idType}
					class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
				>
					<option>Birth Certificate</option>
					<option>National ID</option>
					<option>Passport</option>
				</select>
			</div>
			<div>
				<Label for="idNumber">Identification Number</Label>
				<Input
					id="idNumber"
					bind:value={formData.idNumber}
					placeholder="ex: 1234567"
					class="mt-1"
				/>
			</div>
			<div class="md:col-span-2">
				<Label for="idUpload">Scanned Copy of Identification Document</Label>
				<div
					class="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center text-gray-400 transition hover:border-blue-500"
				>
					<span class="mb-2 block"
						>Click to upload <span class="text-blue-600">or drag and drop</span></span
					>
					<span class="text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</span>
				</div>
			</div>
		</div>

		<!-- Consent and Privacy -->
		<h2 class="mt-8 mb-4 text-xl font-semibold text-gray-900">Consent and Privacy</h2>
		<div class="mb-8 space-y-3">
			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={formData.consents.treatment} class="accent-blue-500" />
				<span>I consent to receive treatment for my health condition.</span>
			</label>
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={formData.consents.disclosure}
					class="accent-blue-500"
				/>
				<span
					>I consent to the use and disclosure of my health information for treatment purposes.</span
				>
			</label>
			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={formData.consents.privacy} class="accent-blue-500" />
				<span>I acknowledge that I have reviewed and agree to the privacy policy</span>
			</label>
		</div>

		<Button
			type="submit"
			class="w-full rounded-md bg-blue-500 py-3 text-base font-semibold text-white hover:bg-blue-600"
		>
			Submit and continue
		</Button>
	</form>
</div>
