<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import * as Sheet from '$lib/components/ui/sheet';
	import Download from '@lucide/svelte/icons/download';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Search from '@lucide/svelte/icons/search';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import Filter from '@lucide/svelte/icons/filter';
	import Users from '@lucide/svelte/icons/users';
	import User from '@lucide/svelte/icons/user';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import Clock from '@lucide/svelte/icons/clock';
	import ChevronsRight from '@lucide/svelte/icons/chevrons-right';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Phone from '@lucide/svelte/icons/phone';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Activity from '@lucide/svelte/icons/activity';
	import Ban from '@lucide/svelte/icons/ban';
	import Hourglass from '@lucide/svelte/icons/hourglass';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import IdCard from '@lucide/svelte/icons/id-card';
	import Shield from '@lucide/svelte/icons/shield';
	import Building2 from '@lucide/svelte/icons/building-2';

	import Users2 from '@lucide/svelte/icons/users-2';
	import Calendar from '@lucide/svelte/icons/calendar';

	let { data }: { data: PageData } = $props();
	let searchTerm = $state('');
	let showFilter = $state(false);
	let selectedCustomer = $state(null as any);
	let openAccordions = $state(new Set<string>());

	// Virtual scrolling for better performance
	let visibleCustomers = $state(data.customers.slice(0, 20)); // Show first 20
	let isLoading = $state(false);

	const loadMoreCustomers = () => {
		if (isLoading || visibleCustomers.length >= data.customers.length) return;

		isLoading = true;
		setTimeout(() => {
			const nextBatch = data.customers.slice(visibleCustomers.length, visibleCustomers.length + 20);
			visibleCustomers = [...visibleCustomers, ...nextBatch];
			isLoading = false;
		}, 100);
	};

	// Intersection observer for infinite scroll
	let scrollContainer: HTMLElement;

	onMount(() => {
		if (!scrollContainer) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMoreCustomers();
				}
			},
			{ threshold: 0.1 }
		);

		const sentinel = scrollContainer.querySelector('.scroll-sentinel');
		if (sentinel) observer.observe(sentinel);

		return () => observer.disconnect();
	});

	function toggleAccordion(id: string) {
		if (openAccordions.has(id)) {
			openAccordions.delete(id);
		} else {
			openAccordions.add(id);
		}
		openAccordions = new Set(openAccordions);
	}

	// Sample claim data for the selected customer
	const claimData = {
		personalInfo: {
			fullName: 'Adunni Adebayo',
			dateOfBirth: '1985-03-22',
			gender: 'Female',
			phone: '+234 803 123 4567',
			address: '15 Adeniyi Jones Avenue, Ikeja, Lagos State',
			email: 'adunni.adebayo@gmail.com'
		},
		identificationDetails: {
			patientId: 'PAT-2024-0001',
			nationalId: 'NIN-12345678901',
			insurancePolicyNumber: 'POL-789456123',
			memberHealthPlanId: 'HP-456789'
		},
		insuranceDetails: {
			companyName: 'AIICO Insurance Plc',
			groupNumber: 'GRP-001234',
			policyholderName: 'Adunni Adebayo',
			relationshipToPolicyholder: 'Self'
		},
		medicalProviderDetails: {
			providerName: 'Lagos University Teaching Hospital (LUTH)',
			providerAddress: 'Idi-Araba, Surulere, Lagos State',
			physicianName: 'Dr. Chinedu Okwu',
			physicianLicense: 'MDCN-NG-123456',
			facilityProviderNumber: 'FAC-789123'
		},
		visitDetails: {
			serviceDate: '2024-01-10',
			visitType: 'Outpatient',
			reasonForVisit: 'Chest pain and shortness of breath'
		},
		diagnosisAndTreatment: {
			icd10Codes: ['I25.9', 'R06.02'],
			diagnosisDescription: 'Chronic ischemic heart disease, Shortness of breath',
			cptCodes: ['99213', '93000', '71020'],
			procedureDates: ['2024-01-10'],
			medicationsPrescribed: ['Metoprolol 50mg', 'Atorvastatin 20mg']
		},
		authorizationInfo: {
			referralNumber: 'REF-2024-001',
			preAuthNumber: 'AUTH-456789',
			referringDoctor: 'Dr. Lisa Park'
		},
		billingInfo: {
			totalCost: '₦485,000.00',
			procedureCosts: [
				{ description: 'Consultation - Cardiology', cost: '₦50,000.00' },
				{ description: 'ECG', cost: '₦30,000.00' },
				{ description: 'Chest X-Ray', cost: '₦40,000.00' },
				{ description: 'Laboratory Tests', cost: '₦60,000.00' }
			],
			copay: '₦10,000.00',
			deductible: '₦100,000.00',
			patientPaidAmount: '₦110,000.00'
		},
		medicalHistory: {
			allergies: ['Penicillin', 'Shellfish'],
			chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Chronic Ischemic Heart Disease'],
			previousSurgeries: ['Appendectomy (2010)', 'Gallbladder removal (2018)'],
			currentMedications: [
				'Metformin 500mg twice daily',
				'Lisinopril 10mg daily',
				'Aspirin 81mg daily'
			]
		},
		supportingDocuments: [
			'Medical Report - Dr. Okwu',
			'ECG Results',
			'Chest X-Ray Report',
			'Lab Results - Complete Blood Panel',
			'Prescription Details'
		],
		dependents: [
			{
				name: 'Kemi Adebayo',
				clientId: 'CL10002A',
				relationship: 'Spouse',
				status: 'Active'
			},
			{
				name: 'Tunde Adebayo',
				clientId: 'CL10003A',
				relationship: 'Son',
				status: 'Active'
			},
			{
				name: 'Funmi Adebayo',
				clientId: 'CL10004A',
				relationship: 'Daughter',
				status: 'Active'
			}
		]
	};

	// Company badge colors mapping
	const companyColors: Record<string, string> = {
		Starlink: 'bg-purple-100 text-purple-800 border-purple-200',
		Marvel: 'bg-red-100 text-red-800 border-red-200',
		BMW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		MBM: 'bg-blue-100 text-blue-800 border-blue-200',
		KFC: 'bg-gray-100 text-gray-800 border-gray-200',
		TATA: 'bg-red-100 text-red-800 border-red-200',
		Saltbox: 'bg-blue-100 text-blue-800 border-blue-200',
		TOYOTA: 'bg-red-100 text-red-800 border-red-200'
	};

	// Stats data for easy mapping
	const stats = [
		{
			title: 'Total Customers',
			value: data.stats.totalCustomersDisplay,
			icon: Users,
			color: 'blue'
		},
		{
			title: 'Active Customers',
			value: data.stats.activeCustomersDisplay,
			icon: User,
			color: 'blue'
		},
		{
			title: 'Inactive Customers',
			value: data.stats.inactiveCustomersDisplay,
			icon: UserPlus,
			color: 'green'
		},
		{
			title: 'Contacts Log In Today',
			value: data.stats.contactsLogInTodayDisplay,
			icon: Clock,
			color: 'orange'
		}
	];
</script>

<div class="font-open-sans min-h-screen bg-gray-50 p-6">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Customer</h1>
		<div class="flex gap-3">
			<Button variant="outline" class="gap-2">
				<Download class="h-4 w-4" />
				Import Customers
			</Button>
			<Button class="gap-2">
				<Plus class="h-4 w-4" />
				New Customer
			</Button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="mb-6 grid grid-cols-4 gap-6">
		{#each stats as stat, index}
			{@const isFirst = index === 0}
			{@const bgClass = isFirst ? 'bg-green-800' : 'bg-white'}
			{@const textClass = isFirst ? 'text-white' : 'text-black'}

			<Card class="overflow-hidden px-4 py-3 {bgClass}">
				<CardContent class="p-0">
					<div class="p-2">
						<div class="flex items-center justify-between">
							<h3 class="text-sm font-medium {textClass} {isFirst ? 'font-nunito' : ''}">
								{stat.title}
							</h3>
							<div class="flex h-4 w-4 items-center justify-center rounded-full border">
								<ExternalLink class="h-2 w-2 {textClass}" />
							</div>
						</div>
						<p class="mt-1 text-3xl font-bold {textClass} {isFirst ? 'font-nunito' : ''}">
							{stat.value}
						</p>

						<div class="mt-2 flex items-center gap-1">
							<div
								class="flex h-3 w-3 items-center justify-center rounded-full {isFirst
									? 'bg-green-700'
									: 'bg-green-100'}"
							>
								<TrendingUp class="h-2 w-2 {isFirst ? 'text-green-300' : 'text-green-600'}" />
							</div>
							<span class="text-xs {isFirst ? 'font-nunito text-green-300' : 'text-green-600'}">
								{index === 3 ? 'On Discuss' : 'Increased from last month'}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>

	<!-- Actions Bar -->
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button variant="outline" class="gap-2">
				<Download class="h-4 w-4" />
				Export
			</Button>
			<Button variant="outline" class="gap-2">
				<MoreHorizontal class="h-4 w-4" />
				Bulk Actions
			</Button>
			<Button variant="outline" size="icon" aria-label="Refresh">
				<RefreshCw class="h-4 w-4" />
			</Button>
		</div>

		<div class="flex items-center gap-4">
			<div class="relative">
				<Input
					type="text"
					placeholder="Search Customer"
					bind:value={searchTerm}
					class="w-64 pl-10"
				/>
				<Search class="absolute top-3 left-3 h-4 w-4 text-gray-400" />
				<span class="absolute top-2.5 right-3 text-xs text-gray-400">⌘T</span>
			</div>
			<Button variant="outline" class="gap-2" onclick={() => (showFilter = !showFilter)}>
				<Filter class="h-4 w-4" />
				Filter
			</Button>
			<Button variant="outline" size="icon" aria-label="More options">
				<MoreHorizontal class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<!-- Customer Cards Grid -->
	<div bind:this={scrollContainer} class="grid grid-cols-4 gap-6">
		{#each visibleCustomers as customer, index}
			<Card
				class={` py-3 transition-shadow hover:shadow-md ${
					customer.status === 'Active'
						? 'border-b-4 border-b-green-500'
						: customer.status === 'Inactive'
							? 'border-b-4 border-b-red-500 opacity-60 grayscale'
							: 'border-b-4 border-b-yellow-500'
				}`}
			>
				<CardContent class="px-4">
					<!-- Customer Header -->
					<div class="mb-2 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<Avatar class="h-8 w-8">
								{#if customer.avatar}
									<AvatarImage src={customer.avatar} alt={customer.name} loading="lazy" />
								{/if}
								<AvatarFallback class="text-xs"
									>{customer.name
										.split(' ')
										.map((n) => n[0])
										.join('')}</AvatarFallback
								>
							</Avatar>
							<div>
								<h3 class="text-sm font-semibold text-gray-900">{customer.name}</h3>
								<p class="text-xs text-gray-500">
									#{customer.clientId || `CL${String(10000 + index).padStart(5, '0')}A`}
								</p>
							</div>
						</div>

						<span
							class="inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-medium"
						>
							{#if customer.status === 'Active'}
								<Activity class="ml-1 h-3 w-3 text-green-500" />
							{:else if customer.status === 'Inactive'}
								<Ban class="ml-1 h-3 w-3 text-red-500" />
							{:else}
								<Hourglass class="ml-1 h-3 w-3 text-yellow-500" />
							{/if}
							{customer.status}
						</span>
					</div>

					<!-- Divider -->
					<hr class="mb-2 border-gray-200" />

					<!-- Contact Info -->
					<div class="mb-2 space-y-1">
						<div class="flex justify-between">
							<span class="text-xs text-gray-600">Mobile</span>
							<span class="text-xs text-gray-600">Email</span>
						</div>
						<div class="flex justify-between">
							<span class="text-xs font-medium text-gray-900">{customer.mobile}</span>
							<span class="text-xs font-medium text-gray-900">{customer.email}</span>
						</div>
					</div>

					<div class="mb-2 space-y-1">
						<div class="flex justify-between">
							<span class="text-xs text-gray-600">Sex</span>
							<span class="text-xs text-gray-600">Date Enrolled</span>
						</div>
						<div class="flex justify-between">
							<span class="text-xs font-medium text-gray-900">{customer.sex || 'Male'}</span>
							<span class="text-xs font-medium text-gray-900"
								>{customer.dateEnrolled || 'Jan 15, 2023'}</span
							>
						</div>
					</div>

					<!-- Status and Company -->
					<div class="flex items-center justify-between">
						<div>
							<Badge
								variant="outline"
								class={`text-xs ${
									customer.company === 'Starlink' ||
									customer.company === 'BMW' ||
									customer.company === 'TATA'
										? 'border-yellow-400 bg-yellow-50 text-yellow-700'
										: customer.company === 'Marvel' ||
											  customer.company === 'KFC' ||
											  customer.company === 'Saltbox'
											? 'border-gray-400 bg-gray-50 text-gray-700'
											: 'border-purple-400 bg-purple-50 text-purple-700'
								}`}
							>
								{customer.company === 'Starlink' ||
								customer.company === 'BMW' ||
								customer.company === 'TATA'
									? 'Gold'
									: customer.company === 'Marvel' ||
										  customer.company === 'KFC' ||
										  customer.company === 'Saltbox'
										? 'Silver'
										: 'Platinum'}
							</Badge>
						</div>
						<!-- Details Button -->
						<div class="mt-1">
							<Button
								variant="default"
								class={`flex aspect-square w-12 items-center justify-center rounded-full text-white ${
									customer.status === 'Active'
										? 'bg-green-500 hover:bg-green-600'
										: customer.status === 'Unconfirmed'
											? 'bg-yellow-500 hover:bg-yellow-600'
											: 'bg-gray-500 hover:bg-gray-600'
								}`}
								onclick={() => (selectedCustomer = customer)}
							>
								<ChevronsRight class="h-6 w-6" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		{/each}

		<!-- Scroll sentinel for infinite loading -->
		{#if visibleCustomers.length < data.customers.length}
			<div class="scroll-sentinel col-span-4 flex justify-center py-4">
				{#if isLoading}
					<div class="flex items-center gap-2 text-gray-500">
						<RefreshCw class="h-4 w-4 animate-spin" />
						<span class="text-sm">Loading more customers...</span>
					</div>
				{:else}
					<div class="h-4"></div>
				{/if}
			</div>
		{/if}P
	</div>
</div>

<!-- Customer Details Sheet -->
<Sheet.Root
	open={selectedCustomer !== null}
	onOpenChange={(open) => !open && (selectedCustomer = null)}
>
	<Sheet.Content side="right" class="w-full max-w-sm overflow-y-auto bg-white p-0">
		{#if selectedCustomer}
			<!-- Profile Card Header -->
			<div class="relative">
				<!-- Background Image -->
				<div class="relative h-32 overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800">
					<div class="absolute inset-0 bg-black/20"></div>
					<div class="absolute top-4 right-4">
						<button
							class="rounded-full bg-white/20 p-2 hover:bg-white/30"
							onclick={() => (selectedCustomer = null)}
						>
							<svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Profile Card -->
				<div class="relative mx-4 -mt-16">
					<div class="overflow-hidden rounded-2xl bg-white shadow-lg">
						<div class="flex h-40">
							<!-- Profile Image - 40% width, full height -->
							<div class="relative w-2/5 flex-shrink-0">
								<div class="h-full w-full overflow-hidden">
									{#if selectedCustomer.avatar}
										<img
											src={selectedCustomer.avatar}
											alt={selectedCustomer.name}
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center bg-gray-200">
											<span class="text-2xl font-medium text-gray-600">
												{selectedCustomer.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</span>
										</div>
									{/if}
								</div>
							</div>

							<!-- Info Section - 60% width -->
							<div class="relative flex-1 p-4">
								<!-- Edit Icon -->
								<div class="absolute top-3 right-3">
									<div class="rounded-full bg-gray-100 p-1.5 hover:bg-gray-200">
										<Pencil class="h-3 w-3 text-gray-600" />
									</div>
								</div>

								<div class="flex flex-col gap-2">
									<!-- Customer Name -->
									<h2 class="text-lg font-bold text-gray-900">{selectedCustomer.name}</h2>
									<div class="flex items-center gap-3">
										<!-- Client ID -->
										<div class="flex items-center gap-1">
											<IdCard class="h-3 w-3 flex-shrink-0 text-gray-500" />
											<span class="text-xs text-gray-600">
												#{selectedCustomer.clientId ||
													`CL${String(10000 + selectedCustomer.id).padStart(5, '0')}A`}
											</span>
										</div>

										<!-- Status -->
										<Badge
											class={`text-xs ${
												selectedCustomer.status === 'Active'
													? 'border-green-200 bg-green-100 text-green-800'
													: selectedCustomer.status === 'Pending'
														? 'border-yellow-200 bg-yellow-100 text-yellow-800'
														: 'border-gray-200 bg-gray-100 text-gray-800'
											}`}
										>
											• {selectedCustomer.status}
										</Badge>
									</div>
									<!-- Email -->
									<div class="flex items-center gap-1">
										<Mail class="h-3 w-3 flex-shrink-0 text-gray-500" />
										<span class="truncate text-xs text-gray-600">{selectedCustomer.email}</span>
									</div>

									<!-- Phone Number -->
									<div class="flex items-center gap-1">
										<Phone class="h-3 w-3 flex-shrink-0 text-gray-500" />
										<span class="text-xs text-gray-600">{selectedCustomer.mobile}</span>
									</div>

									<!-- Date Enrolled -->
									<div class="flex items-center gap-1">
										<Calendar class="h-3 w-3 flex-shrink-0 text-gray-500" />
										<span class="text-xs text-gray-600">
											Enrolled: {new Date(
												2024,
												Math.floor(Math.random() * 12),
												Math.floor(Math.random() * 28) + 1
											).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Progress Bar -->
						<div class="border-t bg-gray-50 px-4 py-3">
							<div class="mb-1 flex items-center justify-between text-xs">
								<span class="text-gray-600">Claims Progress</span>
								<span class="font-medium text-gray-900">3 of 5 processed</span>
							</div>
							<div class="h-2 w-full rounded-full bg-gray-200">
								<div class="h-2 w-3/5 rounded-full bg-blue-500"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Content Section -->
			<div class="px-4 py-6">
				<!-- Giant Card Container -->
				<div class="rounded-lg bg-white shadow-sm">
					<!-- Personal Information Accordion -->
					<div>
						<button
							class="flex w-full items-center justify-between p-4 hover:bg-gray-50"
							onclick={() => toggleAccordion('personal')}
						>
							<div class="flex items-center gap-3">
								<User class="h-5 w-5 text-gray-600" />
								<span class="text-sm font-medium text-gray-900">Personal Information</span>
							</div>
							{#if openAccordions.has('personal')}
								<ChevronDown class="h-4 w-4 text-gray-400" />
							{:else}
								<ChevronRight class="h-4 w-4 text-gray-400" />
							{/if}
						</button>
						{#if openAccordions.has('personal')}
							<div class="border-t bg-gray-50 p-4">
								<div class="space-y-3">
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Full Name:</span>
										<span class="text-sm font-medium">{claimData.personalInfo.fullName}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Date of Birth:</span>
										<span class="text-sm font-medium">{claimData.personalInfo.dateOfBirth}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Gender:</span>
										<span class="text-sm font-medium">{claimData.personalInfo.gender}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Phone:</span>
										<span class="text-sm font-medium">{claimData.personalInfo.phone}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Email:</span>
										<span class="text-sm font-medium">{claimData.personalInfo.email}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Address:</span>
										<span class="text-right text-sm font-medium"
											>{claimData.personalInfo.address}</span
										>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Divider -->
					<div class="border-t border-gray-200"></div>

					<!-- Identification Details Accordion -->
					<div>
						<button
							class="flex w-full items-center justify-between p-4 hover:bg-gray-50"
							onclick={() => toggleAccordion('identification')}
						>
							<div class="flex items-center gap-3">
								<IdCard class="h-5 w-5 text-gray-600" />
								<span class="text-sm font-medium text-gray-900">Identification Details</span>
							</div>
							{#if openAccordions.has('identification')}
								<ChevronDown class="h-4 w-4 text-gray-400" />
							{:else}
								<ChevronRight class="h-4 w-4 text-gray-400" />
							{/if}
						</button>
						{#if openAccordions.has('identification')}
							<div class="border-t bg-gray-50 p-4">
								<div class="space-y-3">
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Patient ID:</span>
										<span class="text-sm font-medium"
											>{claimData.identificationDetails.patientId}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">National ID:</span>
										<span class="text-sm font-medium"
											>{claimData.identificationDetails.nationalId}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Insurance Policy:</span>
										<span class="text-sm font-medium"
											>{claimData.identificationDetails.insurancePolicyNumber}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Health Plan ID:</span>
										<span class="text-sm font-medium"
											>{claimData.identificationDetails.memberHealthPlanId}</span
										>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Divider -->
					<div class="border-t border-gray-200"></div>

					<!-- Insurance Details Accordion -->
					<div>
						<button
							class="flex w-full items-center justify-between p-4 hover:bg-gray-50"
							onclick={() => toggleAccordion('insurance')}
						>
							<div class="flex items-center gap-3">
								<Shield class="h-5 w-5 text-gray-600" />
								<span class="text-sm font-medium text-gray-900">Insurance Details</span>
							</div>
							{#if openAccordions.has('insurance')}
								<ChevronDown class="h-4 w-4 text-gray-400" />
							{:else}
								<ChevronRight class="h-4 w-4 text-gray-400" />
							{/if}
						</button>
						{#if openAccordions.has('insurance')}
							<div class="border-t bg-gray-50 p-4">
								<div class="space-y-3">
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Company:</span>
										<span class="text-sm font-medium">{claimData.insuranceDetails.companyName}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Group Number:</span>
										<span class="text-sm font-medium">{claimData.insuranceDetails.groupNumber}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Policyholder:</span>
										<span class="text-sm font-medium"
											>{claimData.insuranceDetails.policyholderName}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Relationship:</span>
										<span class="text-sm font-medium"
											>{claimData.insuranceDetails.relationshipToPolicyholder}</span
										>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Divider -->
					<div class="border-t border-gray-200"></div>

					<!-- Medical Provider Accordion -->
					<div>
						<button
							class="flex w-full items-center justify-between p-4 hover:bg-gray-50"
							onclick={() => toggleAccordion('provider')}
						>
							<div class="flex items-center gap-3">
								<Building2 class="h-5 w-5 text-gray-600" />
								<span class="text-sm font-medium text-gray-900">Medical Provider</span>
							</div>
							{#if openAccordions.has('provider')}
								<ChevronDown class="h-4 w-4 text-gray-400" />
							{:else}
								<ChevronRight class="h-4 w-4 text-gray-400" />
							{/if}
						</button>
						{#if openAccordions.has('provider')}
							<div class="border-t bg-gray-50 p-4">
								<div class="space-y-3">
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Provider:</span>
										<span class="text-right text-sm font-medium"
											>{claimData.medicalProviderDetails.providerName}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Address:</span>
										<span class="text-right text-sm font-medium"
											>{claimData.medicalProviderDetails.providerAddress}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">Physician:</span>
										<span class="text-sm font-medium"
											>{claimData.medicalProviderDetails.physicianName}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-sm text-gray-600">License:</span>
										<span class="text-sm font-medium"
											>{claimData.medicalProviderDetails.physicianLicense}</span
										>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Divider -->
					<div class="border-t border-gray-200"></div>

					<!-- Dependents Accordion -->
					<div>
						<button
							class="flex w-full items-center justify-between p-4 hover:bg-gray-50"
							onclick={() => toggleAccordion('dependents')}
						>
							<div class="flex items-center gap-3">
								<Users2 class="h-5 w-5 text-gray-600" />
								<span class="text-sm font-medium text-gray-900">Dependents</span>
							</div>
							{#if openAccordions.has('dependents')}
								<ChevronDown class="h-4 w-4 text-gray-400" />
							{:else}
								<ChevronRight class="h-4 w-4 text-gray-400" />
							{/if}
						</button>
						{#if openAccordions.has('dependents')}
							<div class="border-t bg-gray-50 p-4">
								<div class="space-y-3">
									{#each claimData.dependents as dependent}
										<div
											class="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
										>
											<div class="flex items-center gap-3">
												<div
													class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100"
												>
													<User class="h-4 w-4 text-blue-600" />
												</div>
												<div>
													<p class="text-sm font-medium text-gray-900">{dependent.name}</p>
													<p class="text-xs text-gray-500">
														#{dependent.clientId} • {dependent.relationship}
													</p>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<Badge
													class={`text-xs ${
														dependent.status === 'Active'
															? 'border-green-200 bg-green-100 text-green-800'
															: 'border-gray-200 bg-gray-100 text-gray-800'
													}`}
												>
													{dependent.status}
												</Badge>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>
