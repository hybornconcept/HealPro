<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import {
		Calendar as CalendarIcon,
		Clock as ClockIcon,
		FileText,
		Save,
		Upload,
		ChevronDown,
		ChevronUp,
		MoreVertical,
		Check
	} from 'lucide-svelte';
	import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { slide } from 'svelte/transition';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';

	let { data }: { data: PageData } = $props();

	// Clinical Encounter Form State using Svelte 5 runes
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let patientId = $state('');
	let providerName = $state('');
	let encounterDate = $state<DateValue | undefined>();
	let encounterTime = $state('');
	let appointmentType = $state('');
	let chiefComplaint = $state('');
	let historyPresentIllness = $state('');
	let pastMedicalHistory = $state('');
	let familyHistory = $state('');
	let socialHistory = $state('');
	let medications = $state('');
	let allergies = $state('');

	// Vital Signs
	let bloodPressure = $state('');
	let heartRate = $state('');
	let temperature = $state('');
	let respiratoryRate = $state('');
	let oxygenSaturation = $state('');
	let weight = $state('');
	let height = $state('');

	// Physical Examination
	let generalAppearance = $state('');
	let cardiovascularExam = $state('');
	let respiratoryExam = $state('');
	let abdominalExam = $state('');
	let neurologicalExam = $state('');
	let musculoskeletalExam = $state('');

	// Clinical Assessment
	let primaryDiagnosis = $state('');
	let secondaryDiagnoses = $state(['']);
	let icdCodes = $state(['']);
	let severity = $state('');
	let urgency = $state('');

	// Treatment Plan
	let treatmentPlan = $state('');
	let prescribedMedications = $state([{ name: '', billable: true }]);
	let proceduresPerformed = $state([{ name: '', billable: true }]);
	let labTestsOrdered = $state([{ name: '', billable: true }]);

	// Clinical Notes & Follow-up
	let clinicalNotes = $state('');
	let followUpInstructions = $state('');
	let followUpDate = $state('');
	let referrals = $state('');
	let scheduleFollowUp = $state(false);

	// Attachments
	let attachments = $state<File[]>([]);

	function addSecondaryDiagnosis() {
		secondaryDiagnoses = [...secondaryDiagnoses, ''];
	}

	function addIcdCode() {
		icdCodes = [...icdCodes, ''];
	}

	function addMedication() {
		prescribedMedications = [...prescribedMedications, { name: '', billable: true }];
	}

	function addProcedure() {
		proceduresPerformed = [...proceduresPerformed, { name: '', billable: true }];
	}

	function addLabTest() {
		labTestsOrdered = [...labTestsOrdered, { name: '', billable: true }];
	}

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			attachments = [...attachments, ...Array.from(target.files)];
		}
	}

	function removeAttachment(index: number) {
		attachments = attachments.filter((_, i) => i !== index);
	}
</script>

<div class="min-h-screen bg-slate-50 p-8">
	<div class="mx-auto flex max-w-[1600px] flex-col gap-8 lg:flex-row">
		<!-- Main Form Section (80%) -->
		<div class="flex w-full flex-col gap-6 lg:w-[80%]">
			<!-- Page Header -->
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-2">
					<Badge variant="outline" class="border-indigo-200 bg-indigo-50 text-indigo-700">
						<FileText class="mr-1 h-3 w-3" />
						New Documentation
					</Badge>
					<span class="h-1 w-1 rounded-full bg-slate-300"></span>
					<span class="text-xs font-medium text-slate-500">
						{new Date().toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</span>
				</div>
				<div>
					<h1 class="text-5xl font-extrabold tracking-tight text-slate-900">
						Clinical <span
							class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
							>Encounter</span
						>
					</h1>
					<p class="text-md mt-2 text-slate-500">
						Comprehensive patient assessment and treatment documentation.
					</p>
				</div>
			</div>

			<!-- Form Card -->
			<div class="rounded-xl bg-white p-6 shadow-sm">
				<!-- Section Header -->
				<div class="mb-6 flex items-start justify-between border-b border-slate-100 pb-8">
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<span class="text-xs font-bold uppercase tracking-wider text-slate-400">
								PATIENT ENCOUNTER DETAILS
							</span>
						</div>
						<h2 class="text-3xl font-bold text-slate-900">
							Clinic <span class="font-normal italic text-indigo-600">Encounter</span> Details
						</h2>
						<p class="text-slate-500">
							Please ensure all mandatory fields marked with <span class="text-red-500">*</span> are
							completed accurately.
						</p>
					</div>
					<div class="flex gap-2">
						<Button variant="ghost" size="icon" class="text-slate-400 hover:text-slate-600">
							<ChevronUp class="h-5 w-5" />
						</Button>
						<Button variant="ghost" size="icon" class="text-slate-400 hover:text-slate-600">
							<ChevronDown class="h-5 w-5" />
						</Button>
						<Button variant="ghost" size="icon" class="text-slate-400 hover:text-slate-600">
							<MoreVertical class="h-5 w-5" />
						</Button>
					</div>
				</div>

				<!-- Form Grid -->
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
					<!-- Encounter Info -->
					<div class="space-y-2">
						<Label for="patient-id" class="text-sm font-semibold text-slate-900"
							>Patient ID <span class="text-red-500">*</span></Label
						>
						<Input
							id="patient-id"
							bind:value={patientId}
							placeholder="e.g. PAT-2024-001"
							class="bg-slate-50"
						/>
					</div>
					<div class="space-y-2">
						<Label for="provider-name" class="text-sm font-semibold text-slate-900"
							>Provider Name <span class="text-red-500">*</span></Label
						>
						<Input
							id="provider-name"
							bind:value={providerName}
							placeholder="Dr. Smith"
							class="bg-slate-50"
						/>
					</div>

					<div class="space-y-2">
						<Label for="encounter-date" class="text-sm font-semibold text-slate-900"
							>Encounter Date <span class="text-red-500">*</span></Label
						>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({
										variant: 'outline',
										class: 'w-full justify-start bg-slate-50 text-left font-normal'
									}),
									!encounterDate && 'text-muted-foreground'
								)}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{encounterDate
									? df.format(encounterDate.toDate(getLocalTimeZone()))
									: 'Pick a date'}
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0">
								<Calendar
									type="single"
									bind:value={encounterDate}
									minValue={today(getLocalTimeZone())}
								/>
							</Popover.Content>
						</Popover.Root>
					</div>
					<div class="space-y-2">
						<Label for="encounter-time" class="text-sm font-semibold text-slate-900"
							>Encounter Time <span class="text-red-500">*</span></Label
						>
						<div class="relative flex w-full items-center gap-2">
							<ClockIcon
								class="pointer-events-none absolute left-2.5 size-4 select-none text-slate-500"
							/>
							<Input
								id="encounter-time"
								type="time"
								step="1"
								bind:value={encounterTime}
								class="appearance-none bg-slate-50 pl-8"
								placeholder="09:00:00 AM"
							/>
						</div>
					</div>

					<div class="col-span-2 space-y-2">
						<Label for="appointment-type" class="text-sm font-semibold text-slate-900"
							>Appointment Type <span class="text-red-500">*</span></Label
						>
						<Select.Root bind:value={appointmentType}>
							<Select.Trigger class="w-full bg-slate-50">
								{appointmentType || 'Select type'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="consultation">Consultation</Select.Item>
								<Select.Item value="follow-up">Follow-up</Select.Item>
								<Select.Item value="emergency">Emergency</Select.Item>
								<Select.Item value="routine-checkup">Routine Checkup</Select.Item>
								<Select.Item value="specialist-referral">Specialist Referral</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<Separator class="col-span-2 my-4" />

					<!-- Patient History -->
					<div class="col-span-2 mb-2">
						<h3 class="text-xl font-bold text-slate-900">Patient History</h3>
					</div>

					<div class="col-span-2 space-y-2">
						<Label for="chief-complaint" class="text-sm font-semibold text-slate-900"
							>Chief Complaint <span class="text-red-500">*</span></Label
						>
						<Textarea
							id="chief-complaint"
							bind:value={chiefComplaint}
							placeholder="Patient's primary reason for visit..."
							rows={3}
							class="bg-slate-50"
						/>
					</div>

					<div class="col-span-2 space-y-2">
						<Label for="hpi" class="text-sm font-semibold text-slate-900"
							>History of Present Illness <span class="text-red-500">*</span></Label
						>
						<Textarea
							id="hpi"
							bind:value={historyPresentIllness}
							placeholder="Detailed description..."
							rows={4}
							class="bg-slate-50"
						/>
					</div>

					<div class="col-span-2 space-y-2">
						<Label for="past-medical-history" class="text-sm font-semibold text-slate-900"
							>Past Medical History</Label
						>
						<Textarea
							id="past-medical-history"
							bind:value={pastMedicalHistory}
							placeholder="Previous medical conditions..."
							rows={3}
							class="bg-slate-50"
						/>
					</div>

					<div class="space-y-2">
						<Label for="family-history" class="text-sm font-semibold text-slate-900"
							>Family Medical History</Label
						>
						<Textarea
							id="family-history"
							bind:value={familyHistory}
							placeholder="Hereditary conditions..."
							rows={3}
							class="bg-slate-50"
						/>
					</div>

					<div class="space-y-2">
						<Label for="social-history" class="text-sm font-semibold text-slate-900"
							>Social History</Label
						>
						<Textarea
							id="social-history"
							bind:value={socialHistory}
							placeholder="Smoking, alcohol, occupation..."
							rows={3}
							class="bg-slate-50"
						/>
					</div>

					<div class="space-y-2">
						<Label for="medications" class="text-sm font-semibold text-slate-900"
							>Current Medications</Label
						>
						<Textarea
							id="medications"
							bind:value={medications}
							placeholder="List medications..."
							rows={3}
							class="bg-slate-50"
						/>
					</div>
					<div class="space-y-2">
						<Label for="allergies" class="text-sm font-semibold text-slate-900"
							>Allergies <span class="text-red-500">*</span></Label
						>
						<Input
							id="allergies"
							bind:value={allergies}
							placeholder="NKDA if none"
							class="bg-slate-50"
						/>
					</div>

					<Separator class="col-span-2 my-4" />

					<!-- Vital Signs -->
					<div class="col-span-2 mb-2">
						<h3 class="text-xl font-bold text-slate-900">Vital Signs</h3>
					</div>

					<div class="space-y-2">
						<Label for="bp" class="text-sm font-semibold text-slate-900"
							>Blood Pressure <span class="text-red-500">*</span></Label
						>
						<Input id="bp" bind:value={bloodPressure} placeholder="120/80" class="bg-slate-50" />
					</div>
					<div class="space-y-2">
						<Label for="hr" class="text-sm font-semibold text-slate-900"
							>Heart Rate <span class="text-red-500">*</span></Label
						>
						<Input id="hr" bind:value={heartRate} placeholder="72 bpm" class="bg-slate-50" />
					</div>
					<div class="space-y-2">
						<Label for="temp" class="text-sm font-semibold text-slate-900"
							>Temperature <span class="text-red-500">*</span></Label
						>
						<Input id="temp" bind:value={temperature} placeholder="36.5°C" class="bg-slate-50" />
					</div>
					<div class="space-y-2">
						<Label for="weight" class="text-sm font-semibold text-slate-900">Weight</Label>
						<Input id="weight" bind:value={weight} placeholder="70 kg" class="bg-slate-50" />
					</div>
					<div class="space-y-2">
						<Label for="height" class="text-sm font-semibold text-slate-900">Height</Label>
						<Input id="height" bind:value={height} placeholder="170 cm" class="bg-slate-50" />
					</div>

					<Separator class="col-span-2 my-4" />

					<!-- Physical Examination -->
					<div class="col-span-2 mb-2">
						<h3 class="text-xl font-bold text-slate-900">Physical Examination</h3>
					</div>

					<div class="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="general-appearance" class="text-sm font-semibold text-slate-900"
								>General Appearance</Label
							>
							<Textarea
								id="general-appearance"
								bind:value={generalAppearance}
								rows={2}
								class="bg-slate-50"
							/>
						</div>
						<div class="space-y-2">
							<Label for="cardiovascular" class="text-sm font-semibold text-slate-900"
								>Cardiovascular</Label
							>
							<Textarea
								id="cardiovascular"
								bind:value={cardiovascularExam}
								rows={2}
								class="bg-slate-50"
							/>
						</div>
						<div class="space-y-2">
							<Label for="respiratory" class="text-sm font-semibold text-slate-900"
								>Respiratory</Label
							>
							<Textarea
								id="respiratory"
								bind:value={respiratoryExam}
								rows={2}
								class="bg-slate-50"
							/>
						</div>
						<div class="space-y-2">
							<Label for="abdominal" class="text-sm font-semibold text-slate-900">Abdominal</Label>
							<Textarea id="abdominal" bind:value={abdominalExam} rows={2} class="bg-slate-50" />
						</div>
						<div class="space-y-2">
							<Label for="neurological" class="text-sm font-semibold text-slate-900"
								>Neurological</Label
							>
							<Textarea
								id="neurological"
								bind:value={neurologicalExam}
								rows={2}
								class="bg-slate-50"
							/>
						</div>
						<div class="space-y-2">
							<Label for="musculoskeletal" class="text-sm font-semibold text-slate-900"
								>Musculoskeletal</Label
							>
							<Textarea
								id="musculoskeletal"
								bind:value={musculoskeletalExam}
								rows={2}
								class="bg-slate-50"
							/>
						</div>
					</div>

					<!-- Clinical Assessment -->
					<div class="col-span-2 mb-2">
						<h3 class="text-xl font-bold text-slate-900">Assessment & Plan</h3>
					</div>

					<div class="col-span-2 space-y-2">
						<Label for="diagnosis" class="text-sm font-semibold text-slate-900"
							>Primary Diagnosis <span class="text-red-500">*</span></Label
						>
						<Input
							id="diagnosis"
							bind:value={primaryDiagnosis}
							placeholder="ICD-10 Code / Description"
							class="bg-slate-50"
						/>
					</div>

					<div class="col-span-2 space-y-2">
						<div class="flex items-center justify-between">
							<Label class="text-sm font-semibold text-slate-900">Secondary Diagnoses</Label>
							<Button
								variant="ghost"
								size="sm"
								class="h-6 text-xs text-indigo-600"
								onclick={addSecondaryDiagnosis}
							>
								+ Add
							</Button>
						</div>
						{#each secondaryDiagnoses as _, i}
							<div transition:slide|local>
								<Input
									bind:value={secondaryDiagnoses[i]}
									placeholder="Secondary diagnosis..."
									class="mb-2 bg-slate-50"
								/>
							</div>
						{/each}
					</div>

					<div class="space-y-2">
						<Label for="severity" class="text-sm font-semibold text-slate-900"
							>Severity <span class="text-red-500">*</span></Label
						>
						<Select.Root bind:value={severity}>
							<Select.Trigger class="w-full bg-slate-50">
								{severity || 'Select severity'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="mild">Mild</Select.Item>
								<Select.Item value="moderate">Moderate</Select.Item>
								<Select.Item value="severe">Severe</Select.Item>
								<Select.Item value="critical">Critical</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2">
						<Label for="urgency" class="text-sm font-semibold text-slate-900"
							>Urgency <span class="text-red-500">*</span></Label
						>
						<Select.Root bind:value={urgency}>
							<Select.Trigger class="w-full bg-slate-50">
								{urgency || 'Select urgency'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="routine">Routine</Select.Item>
								<Select.Item value="urgent">Urgent</Select.Item>
								<Select.Item value="emergent">Emergent</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="col-span-2 space-y-2">
						<Label for="plan" class="text-sm font-semibold text-slate-900"
							>Treatment Plan <span class="text-red-500">*</span></Label
						>
						<Textarea
							id="plan"
							bind:value={treatmentPlan}
							placeholder="Detailed plan..."
							rows={4}
							class="bg-slate-50"
						/>
					</div>

					<div class="col-span-2 space-y-2">
						<div class="flex items-center justify-between">
							<Label class="text-sm font-semibold text-slate-900">Prescribed Medications</Label>
							<Button
								variant="ghost"
								size="sm"
								class="h-6 text-xs text-indigo-600"
								onclick={addMedication}
							>
								+ Add
							</Button>
						</div>
						{#each prescribedMedications as _, i}
							<div transition:slide|local class="mb-2 flex items-center gap-2">
								<div class="flex-1">
									<Input
										bind:value={prescribedMedications[i].name}
										placeholder="Medication name and dosage..."
										class="bg-slate-50"
									/>
								</div>
								<div
									class="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
								>
									<Checkbox
										id="med-billable-{i}"
										bind:checked={prescribedMedications[i].billable}
									/>
									<Label
										for="med-billable-{i}"
										class="cursor-pointer text-xs font-medium text-slate-600">Billable</Label
									>
								</div>
							</div>
						{/each}
					</div>

					<div class="col-span-2 space-y-2">
						<div class="flex items-center justify-between">
							<Label class="text-sm font-semibold text-slate-900">Procedures Performed</Label>
							<Button
								variant="ghost"
								size="sm"
								class="h-6 text-xs text-indigo-600"
								onclick={addProcedure}
							>
								+ Add
							</Button>
						</div>
						{#each proceduresPerformed as _, i}
							<div transition:slide|local class="mb-2 flex items-center gap-2">
								<div class="flex-1">
									<Input
										bind:value={proceduresPerformed[i].name}
										placeholder="Procedure description..."
										class="bg-slate-50"
									/>
								</div>
								<div
									class="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
								>
									<Checkbox id="proc-billable-{i}" bind:checked={proceduresPerformed[i].billable} />
									<Label
										for="proc-billable-{i}"
										class="cursor-pointer text-xs font-medium text-slate-600">Billable</Label
									>
								</div>
							</div>
						{/each}
					</div>

					<div class="col-span-2 space-y-2">
						<div class="flex items-center justify-between">
							<Label class="text-sm font-semibold text-slate-900">Lab Tests Ordered</Label>
							<Button
								variant="ghost"
								size="sm"
								class="h-6 text-xs text-indigo-600"
								onclick={addLabTest}
							>
								+ Add
							</Button>
						</div>
						{#each labTestsOrdered as _, i}
							<div transition:slide|local class="mb-2 flex items-center gap-2">
								<div class="flex-1">
									<Input
										bind:value={labTestsOrdered[i].name}
										placeholder="Lab test name..."
										class="bg-slate-50"
									/>
								</div>
								<div
									class="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
								>
									<Checkbox id="lab-billable-{i}" bind:checked={labTestsOrdered[i].billable} />
									<Label
										for="lab-billable-{i}"
										class="cursor-pointer text-xs font-medium text-slate-600">Billable</Label
									>
								</div>
							</div>
						{/each}
					</div>

					<div class="col-span-2 space-y-2">
						<Label for="clinical-notes" class="text-sm font-semibold text-slate-900"
							>Clinical Notes</Label
						>
						<Textarea
							id="clinical-notes"
							bind:value={clinicalNotes}
							placeholder="Additional observations..."
							rows={3}
							class="bg-slate-50"
						/>
					</div>

					<div class="col-span-2 space-y-2">
						<Label for="follow-up-instructions" class="text-sm font-semibold text-slate-900"
							>Follow-up Instructions</Label
						>
						<Textarea
							id="follow-up-instructions"
							bind:value={followUpInstructions}
							placeholder="Instructions for the patient..."
							rows={3}
							class="bg-slate-50"
						/>
					</div>
					<div class="col-span-2 space-y-2">
						<Label for="referrals" class="text-sm font-semibold text-slate-900">Referrals</Label>
						<Textarea
							id="referrals"
							bind:value={referrals}
							placeholder="Specialist referrals..."
							rows={2}
							class="bg-slate-50"
						/>
					</div>
					<div class="flex items-center space-x-2">
						<Checkbox id="follow-up" bind:checked={scheduleFollowUp} />
						<Label
							for="follow-up"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Schedule follow-up appointment
						</Label>
					</div>
					{#if scheduleFollowUp}
						<div
							transition:slide
							class="col-span-2 mt-4 flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
						>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div class="space-y-2">
									<Label for="follow-up-date" class="text-sm font-semibold text-slate-900"
										>Follow-up Date</Label
									>
									<Input
										id="follow-up-date"
										type="date"
										bind:value={followUpDate}
										class="bg-white"
									/>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex justify-end gap-4">
				<Button variant="outline" class="px-8">Cancel</Button>
				<Button class="bg-indigo-600 px-8 hover:bg-indigo-700">Save Encounter</Button>
			</div>
		</div>

		<!-- Right Sidebar Section (20%) -->
		<div class="flex w-full flex-col gap-6 lg:w-[20%]">
			<!-- Summary Card 1 -->
			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="font-bold text-slate-900">Encounter Status</h3>
				</div>
				<div class="space-y-6">
					<div>
						<p class="text-xs text-slate-500">Current Status</p>
						<p class="text-xl font-bold text-indigo-600">In Progress</p>
					</div>
					<Separator />
					<div>
						<p class="text-xs text-slate-500">Started At</p>
						<p class="font-medium text-slate-900">10:42 AM</p>
					</div>
					<div>
						<p class="text-xs text-slate-500">Provider</p>
						<p class="font-medium text-slate-900">Dr. Smith</p>
					</div>
					<Separator />
					<div>
						<p class="text-xs text-slate-500">Completion</p>
						<div class="mt-2 h-2 w-full rounded-full bg-slate-100">
							<div class="h-2 w-[45%] rounded-full bg-indigo-600"></div>
						</div>
						<p class="mt-1 text-right text-xs font-medium text-indigo-600">45%</p>
					</div>
				</div>
			</div>

			<!-- Summary Card 2 -->
			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="mb-4">
					<h3 class="font-bold text-slate-900">Patient Snapshot</h3>
				</div>
				<div class="space-y-4">
					<div>
						<p class="text-xs text-slate-500">Patient Name</p>
						<p class="font-medium text-slate-900">John Doe</p>
					</div>
					<div>
						<p class="text-xs text-slate-500">Gender</p>
						<p class="font-medium text-slate-900">Male</p>
					</div>
					<div>
						<p class="text-xs text-slate-500">Age</p>
						<p class="font-medium text-slate-900">34 Years</p>
					</div>
					<div>
						<p class="text-xs text-slate-500">Blood Type</p>
						<Badge variant="outline" class="mt-1">O+</Badge>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
