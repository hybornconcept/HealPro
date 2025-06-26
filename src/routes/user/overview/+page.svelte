<script lang="ts">
	import {
		FileText,
		Plus,
		Clock,
		Trash2,
		ChevronRight,
		Phone,
		Mail,
		Edit,
		MapPin
	} from '@lucide/svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	// Patient information
	const patient = {
		policy: 'A28475095',
		category: 'Group Membership',
		source: 'Cigna Health',
		sourceType: 'Mail',
		claimsHandler: 'Nick Bortich',
		firstName: 'Peter',
		lastName: 'Morgan',
		ssn: '468 95 5642',
		countryOfBirth: 'United States',
		gender: 'Male',
		maritalStatus: 'Married',
		region: 'USA',
		driversLicense: '',
		dob: 'Jul 10, 1982',
		age: '38 Years 2 Months',
		occupation: 'Architecture',
		smoker: 'No',
		address: {
			line1: '15 Grand Valecrest Crescent',
			line2: '',
			city: 'South Beach',
			state: 'California',
			zipCode: '60210'
		},
		contact: {
			workEmail: 'peter@docounts.com',
			personalEmail: 'peter@gmail.com',
			mobile: '',
			phoneNumber: '(949) 883 0862',
			emergencyNumber: '(949) 883 0866'
		}
	};

	// Status timeline
	const statusTimeline = [
		{ status: 'Claim Received', date: 'Apr 18, 2020, 10:30 AM', completed: true, current: false },
		{
			status: 'Initial Review',
			date: 'Apr 21, 2020, 10:30 AM',
			completed: true,
			current: false,
			subtext: 'Assigned to Katherine',
			notes: '3 fields marked by Lena Glasco'
		},
		{
			status: 'Evidence Gathering',
			date: 'Apr 28, 2020, 4:27 PM',
			completed: true,
			current: true,
			subtext: 'Send C&P Exam Notice',
			notes: 'John Added Note\nJohn Added Discharge Summary\nMore Updates'
		},
		{ status: 'Provider Review', date: '', completed: false, current: false },
		{ status: 'Entitlement Review', date: '', completed: false, current: false },
		{ status: 'Preparation for Decision Notification', date: '', completed: false, current: false },
		{
			status: 'Payment Processing',
			date: 'Estimated Date Sep 12, 2020',
			completed: false,
			current: false
		}
	];

	// Active tab
	let activeTab = 'demographics';
</script>

<div class="flex min-h-screen w-full flex-col bg-gray-50 p-6">
	<!-- Header section with policy info -->
	<div class="mb-4 grid grid-cols-5 gap-4 rounded-md bg-white p-4 shadow-sm">
		<div>
			<div class="text-xs text-gray-500">Policy</div>
			<div class="font-medium">{patient.policy}</div>
		</div>
		<div>
			<div class="text-xs text-gray-500">Category</div>
			<div class="font-medium">{patient.category}</div>
		</div>
		<div>
			<div class="text-xs text-gray-500">Source</div>
			<div class="font-medium">{patient.source}</div>
		</div>
		<div>
			<div class="text-xs text-gray-500">Source Type</div>
			<div class="font-medium">{patient.sourceType}</div>
		</div>
		<div>
			<div class="text-xs text-gray-500">Claims Handler</div>
			<div class="font-medium">{patient.claimsHandler}</div>
		</div>
	</div>

	<!-- Main content area -->
	<div class="grid grid-cols-4 gap-6">
		<!-- Left side (3/4 width) -->
		<div class="col-span-3">
			<!-- Tabs navigation -->
			<div class="mb-4 flex border-b">
				<Button
					variant="ghost"
					class={activeTab === 'demographics'
						? 'rounded-none border-b-2 border-blue-500'
						: 'rounded-none'}
					on:click={() => (activeTab = 'demographics')}
				>
					<div class="flex items-center gap-2">
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-500"
						>
							D
						</div>
						Demographics
					</div>
				</Button>
				<Button
					variant="ghost"
					class={activeTab === 'payment'
						? 'rounded-none border-b-2 border-blue-500'
						: 'rounded-none'}
					on:click={() => (activeTab = 'payment')}
				>
					<div class="flex items-center gap-2">
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-500"
						>
							P
						</div>
						Payment
					</div>
				</Button>
				<Button
					variant="ghost"
					class={activeTab === 'diagnosis'
						? 'rounded-none border-b-2 border-blue-500'
						: 'rounded-none'}
					on:click={() => (activeTab = 'diagnosis')}
				>
					<div class="flex items-center gap-2">
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-500"
						>
							D
						</div>
						Diagnosis & Procedure
					</div>
				</Button>
				<Button
					variant="ghost"
					class={activeTab === 'documents'
						? 'rounded-none border-b-2 border-blue-500'
						: 'rounded-none'}
					on:click={() => (activeTab = 'documents')}
				>
					<div class="flex items-center gap-2">
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-500"
						>
							D
						</div>
						Documents
					</div>
				</Button>
			</div>

			<!-- Personal Info Section -->
			<div class="mb-6">
				<h2 class="mb-4 text-lg font-medium text-gray-700">Personal Info</h2>
				<div class="grid grid-cols-4 gap-6 rounded-md bg-white p-6 shadow-sm">
					<!-- Photo and basic info -->
					<div class="col-span-1">
						<img
							src="https://randomuser.me/api/portraits/men/32.jpg"
							alt="Patient Photo"
							class="mb-2 h-32 w-32 rounded-md object-cover"
						/>
						<div class="text-sm text-gray-500">DOB</div>
						<div class="font-medium">{patient.dob}</div>
					</div>

					<!-- First column of details -->
					<div class="col-span-1 space-y-4">
						<div>
							<div class="text-sm text-gray-500">First Name</div>
							<div class="font-medium">{patient.firstName}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">Gender</div>
							<div class="font-medium">{patient.gender}</div>
						</div>
					</div>

					<!-- Second column of details -->
					<div class="col-span-1 space-y-4">
						<div>
							<div class="text-sm text-gray-500">Last Name</div>
							<div class="font-medium">{patient.lastName}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">Marital Status</div>
							<div class="font-medium">{patient.maritalStatus}</div>
						</div>
					</div>

					<!-- Third column of details -->
					<div class="col-span-1 space-y-4">
						<div>
							<div class="text-sm text-gray-500">SSN/ITIN</div>
							<div class="font-medium">{patient.ssn}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">Region</div>
							<div class="font-medium">{patient.region}</div>
						</div>
					</div>

					<!-- Edit button -->
					<div class="absolute top-[240px] right-8">
						<Button variant="ghost" size="icon" class="h-8 w-8">
							<Edit class="h-4 w-4" />
						</Button>
					</div>

					<!-- Additional details -->
					<div class="col-span-1">
						<div class="text-sm text-gray-500">Age</div>
						<div class="font-medium">{patient.age}</div>
					</div>
					<div class="col-span-1">
						<div class="text-sm text-gray-500">Occupation</div>
						<div class="font-medium">{patient.occupation}</div>
					</div>
					<div class="col-span-1">
						<div class="text-sm text-gray-500">Smoker</div>
						<div class="font-medium">{patient.smoker}</div>
					</div>
					<div class="col-span-1">
						<div class="text-sm text-gray-500">Country of Birth</div>
						<div class="font-medium">{patient.countryOfBirth}</div>
					</div>
				</div>
			</div>

			<!-- Address Section -->
			<div class="mb-6">
				<h2 class="mb-4 text-lg font-medium text-gray-700">Address</h2>
				<div class="grid grid-cols-4 gap-6 rounded-md bg-white p-6 shadow-sm">
					<div class="col-span-1">
						<div class="text-sm text-gray-500">Address Line 1</div>
						<div class="font-medium">{patient.address.line1}</div>
					</div>
					<div class="col-span-1">
						<div class="text-sm text-gray-500">Address Line 2</div>
						<div class="font-medium">{patient.address.line2 || '-'}</div>
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
						<div class="font-medium">{patient.contact.mobile || '-'}</div>
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

			<!-- Provider Section -->
			<div>
				<h2 class="mb-4 text-lg font-medium text-gray-700">Provider</h2>
				<div class="grid grid-cols-3 gap-6 rounded-md bg-white p-6 shadow-sm">
					<div>
						<div class="text-sm text-gray-500">Primary Care Physician</div>
						<div class="font-medium">-</div>
					</div>
					<div>
						<div class="text-sm text-gray-500">Referring Physician</div>
						<div class="font-medium">-</div>
					</div>
					<div>
						<div class="text-sm text-gray-500">Service Location</div>
						<div class="flex items-center gap-2">
							<div class="font-medium">Select</div>
							<Button variant="ghost" size="icon" class="h-6 w-6">
								<ChevronRight class="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon" class="h-6 w-6">
								<Plus class="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right side (1/4 width) - Status Timeline -->
		<div class="col-span-1">
			<div class="rounded-md bg-white p-4 shadow-sm">
				<!-- Status header with tabs -->
				<div class="mb-4 flex border-b">
					<Button variant="ghost" class="rounded-none border-b-2 border-blue-500 px-3 py-1 text-sm"
						>Status</Button
					>
					<Button variant="ghost" class="rounded-none px-3 py-1 text-sm">Notes 2</Button>
					<Button variant="ghost" class="rounded-none px-3 py-1 text-sm">Tasks 2</Button>
				</div>

				<!-- Status timeline -->
				<div class="space-y-6">
					{#each statusTimeline as item, index}
						<div class="relative pl-8">
							<!-- Status indicator -->
							<div
								class="absolute top-0 left-0 flex h-6 w-6 items-center justify-center rounded-full border-2 {item.completed
									? 'border-blue-500 bg-blue-500'
									: 'border-gray-300 bg-white'}"
							>
								{#if item.completed}
									<div class="h-2 w-2 rounded-full bg-white"></div>
								{/if}
							</div>

							<!-- Vertical line connecting status points -->
							{#if index < statusTimeline.length - 1}
								<div
									class="absolute top-6 left-3 h-[calc(100%+12px)] w-[2px] {statusTimeline[
										index + 1
									].completed
										? 'bg-blue-500'
										: 'bg-gray-300'}"
								></div>
							{/if}

							<!-- Status content -->
							<div class="mb-1 font-medium {item.current ? 'text-blue-500' : 'text-gray-800'}">
								{item.status}
							</div>

							{#if item.subtext}
								<div class="text-sm text-gray-500">{item.subtext}</div>
							{/if}

							{#if item.date}
								<div class="text-xs text-gray-400">{item.date}</div>
							{/if}

							{#if item.notes}
								<div class="mt-2 text-xs whitespace-pre-line text-gray-500">{item.notes}</div>
							{/if}
						</div>
					{/each}

					<!-- Last updated info -->
					<div class="mt-8 text-xs text-gray-400">Last updated 3 mins ago</div>
				</div>
			</div>
		</div>
	</div>
</div>
