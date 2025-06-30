<script lang="ts">
	interface Patient {
		firstName: string;
		lastName: string;
		dob: string;
		age: string;
		gender: string;
		maritalStatus: string;
		occupation: string;
		smoker: string;
		address: {
			line1: string;
			line2: string;
			city: string;
			state: string;
			zipCode: string;
		};
		contact: {
			workEmail: string;
			personalEmail: string;
			mobile: string;
			phoneNumber: string;
			emergencyNumber: string;
		};
	}

	interface Props {
		patient: Patient;
	}

	let { patient }: Props = $props();

	// Memoized computed values for better performance
	const displayMobile = $derived(patient.contact.mobile || '-');
	const displayAddressLine2 = $derived(patient.address.line2 || '-');
</script>

<div class="mb-6">
	<h2 class="mb-4 text-lg font-medium text-gray-700">Personal Info</h2>
	<div class="grid grid-cols-4 gap-6 rounded-md bg-white p-6 shadow-sm">
		<!-- Photo and basic info -->
		<div class="col-span-1">
			<img
				src="https://randomuser.me/api/portraits/men/32.jpg"
				alt="Patient profile"
				class="mb-2 h-32 w-32 rounded-md object-cover"
			/>
			<div class="text-sm text-gray-500">DOB</div>
			<div class="font-medium">{patient.dob}</div>
		</div>

		<!-- Personal details grid -->
		<div class="col-span-3 grid grid-cols-4 gap-4">
			<div class="col-span-1">
				<div class="text-sm text-gray-500">First Name</div>
				<div class="font-medium">{patient.firstName}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Last Name</div>
				<div class="font-medium">{patient.lastName}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Age</div>
				<div class="font-medium">{patient.age}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Gender</div>
				<div class="font-medium">{patient.gender}</div>
			</div>

			<div class="col-span-1">
				<div class="text-sm text-gray-500">Marital Status</div>
				<div class="font-medium">{patient.maritalStatus}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Occupation</div>
				<div class="font-medium">{patient.occupation}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Smoker</div>
				<div class="font-medium">{patient.smoker}</div>
			</div>
			<div class="col-span-1"></div>

			<div class="col-span-1">
				<div class="text-sm text-gray-500">Address Line 1</div>
				<div class="font-medium">{patient.address.line1}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Address Line 2</div>
				<div class="font-medium">{displayAddressLine2}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Work Email</div>
				<div class="font-medium">{patient.contact.workEmail}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Personal Email</div>
				<div class="font-medium">{patient.contact.personalEmail}</div>
			</div>

			<div class="col-span-1">
				<div class="text-sm text-gray-500">City</div>
				<div class="font-medium">{patient.address.city}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Province/State</div>
				<div class="font-medium">{patient.address.state}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Mobile</div>
				<div class="font-medium">{displayMobile}</div>
			</div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Phone Number</div>
				<div class="font-medium">{patient.contact.phoneNumber}</div>
			</div>

			<div class="col-span-1">
				<div class="text-sm text-gray-500">Postal Code</div>
				<div class="font-medium">{patient.address.zipCode}</div>
			</div>
			<div class="col-span-1"></div>
			<div class="col-span-1">
				<div class="text-sm text-gray-500">Emergency Number</div>
				<div class="font-medium">{patient.contact.emergencyNumber}</div>
			</div>
		</div>
	</div>
</div>
