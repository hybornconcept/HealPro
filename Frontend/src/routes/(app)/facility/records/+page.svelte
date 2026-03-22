<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Search,
		User,
		FileText,
		Activity,
		Pill,
		AlertCircle,
		Share2,
		Printer,
		Edit,
		Plus,
		Calendar,
		MapPin,
		Phone,
		Mail,
		ArrowRight,
		Filter,
		MoreHorizontal,
		Star,
		Eye,
		ChevronRight
	} from 'lucide-svelte';
	import { fade, slide, fly } from 'svelte/transition';

	let { data } = $props();

	// State
	let patients = $state(data.patients.map((p) => ({ ...p, isFavorite: false })));
	let searchQuery = $state('');
	let selectedHmo = $state('');
	let selectedPatientId = $state(data.patients[0]?.id);
	let isTransferModalOpen = $state(false);
	let activeFilter = $state('All');

	// Derived
	let filteredPatients = $derived(
		patients.filter((p) => {
			const matchesSearch =
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.enrolleeId.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesHmo = selectedHmo && selectedHmo !== 'All' ? p.hmo === selectedHmo : true;
			const matchesTab = activeFilter === 'Favorites' ? p.isFavorite : true;
			return matchesSearch && matchesHmo && matchesTab;
		})
	);

	let selectedPatient = $derived(data.patients.find((p) => p.id === selectedPatientId));

	// Helper
	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.substring(0, 2)
			.toUpperCase();
	}

	const filters = ['All', 'Admitted', 'Outpatient', 'Discharged'];
</script>

<div class="flex w-full gap-4 overflow-auto bg-[#F8F9FE] p-4 font-['Poppins']">
	<!-- Left Panel: Patient Directory (List Layout) -->
	<div class="flex w-[55%] flex-col gap-4 px-2">
		<!-- Header Section -->
		<!-- Header Section -->
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-2">
				<Badge variant="outline" class="border-violet-200 bg-violet-50 text-violet-700">
					<User class="mr-1 h-3 w-3" />
					Patient Directory
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
				<h1 class="text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
					Patient <span
						class="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
						>Records</span
					>
				</h1>
				<p class="mb-2 text-sm leading-relaxed text-slate-500">
					Manage and view all patient records and history based on real-time data.
				</p>
			</div>

			<div class="flex items-center justify-between gap-4">
				<!-- Left: Tabs -->
				<div class="flex items-center gap-2">
					{#each ['All', 'Favorites'] as tab}
						<button
							class="rounded-full px-6 py-2 text-xs font-bold transition-all {activeFilter === tab
								? 'bg-[#1e1b4b] text-white shadow-md'
								: 'bg-slate-100 text-slate-500 hover:bg-slate-200'}"
							onclick={() => (activeFilter = tab)}
						>
							{tab}
						</button>
					{/each}
				</div>

				<!-- Right: HMO & Search -->
				<div class="flex w-[60%] items-center justify-end gap-2">
					<div class="w-[30%]">
						<Select.Root type="single" bind:value={selectedHmo}>
							<Select.Trigger
								class="h-10 w-full rounded-full border-none bg-slate-100 px-4 text-xs font-bold text-slate-600 hover:bg-slate-200"
							>
								{selectedHmo || 'Select HMO'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="All">All</Select.Item>
								<Select.Item value="AXA Mansard">AXA Mansard</Select.Item>
								<Select.Item value="Reliance HMO">Reliance HMO</Select.Item>
								<Select.Item value="Hygeia HMO">Hygeia HMO</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="relative w-[70%]">
						<Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							type="text"
							placeholder="Search patients..."
							bind:value={searchQuery}
							class="h-10 w-full rounded-full border-none bg-white pl-10 text-xs font-medium shadow-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
						/>
					</div>
				</div>
			</div>
			<Separator class="mb-4 bg-slate-200" />
		</div>
		<!-- Patient List -->
		<ScrollArea class="-mr-4 flex-1 pr-4">
			<div class="flex flex-col gap-3 pb-4 pt-2">
				{#each filteredPatients as patient}
					<div
						class="group relative mx-4 flex cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-5 text-left transition-all hover:shadow-md {selectedPatientId ===
						patient.id
							? 'ring-2 ring-indigo-500 ring-offset-2'
							: 'border border-transparent hover:border-indigo-500'}"
						role="button"
						tabindex="0"
						onclick={() => (selectedPatientId = patient.id)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') selectedPatientId = patient.id;
						}}
					>
						<!-- 1. Avatar -->
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-normal text-slate-600 ring ring-slate-800"
						>
							{getInitials(patient.name)}
						</div>

						<!-- 2. Name & Enrollee ID -->
						<div class="flex w-[20%] flex-col gap-1">
							<h3 class="truncate text-sm font-normal text-slate-900">{patient.name}</h3>
							<p class="truncate text-xs font-normal text-slate-400">{patient.enrolleeId}</p>
						</div>

						<!-- 3. HMO & Status -->
						<div class="flex w-[20%] flex-col gap-1">
							<Badge
								variant="secondary"
								class="w-fit rounded-md px-2 py-0 text-[10px] font-bold {patient.status === 'Active'
									? 'bg-emerald-100 text-emerald-700'
									: 'bg-slate-100 text-slate-500'}"
							>
								{patient.status}
							</Badge>
							<h3 class="truncate text-sm font-normal text-slate-900">{patient.hmo}</h3>
						</div>

						<!-- 4. Plan -->
						<div class="flex w-[15%] flex-col gap-1">
							<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan</span
							>
							<h3 class="text-sm font-semibold text-slate-900">{patient.plan}</h3>
						</div>

						<!-- 5. Encounters -->
						<div class="flex w-[15%] flex-col gap-1">
							<h3 class="text-xl font-semibold text-slate-900">{patient.encounters}</h3>
							<p class="text-[10px] font-medium text-slate-400">admissions/visits</p>
						</div>

						<!-- 6. Actions -->
						<div class="flex items-center gap-4 text-slate-300">
							<button
								class="transition-colors hover:text-indigo-500 focus:outline-none"
								onclick={(e) => {
									e.stopPropagation();
									patient.isFavorite = !patient.isFavorite;
								}}
							>
								<Star
									class="h-5 w-5 {patient.isFavorite
										? 'fill-indigo-500 text-indigo-500'
										: 'text-slate-300'}"
								/>
							</button>
							<ChevronRight class="h-5 w-5 text-slate-200" />
						</div>
					</div>
				{/each}
				{#if filteredPatients.length === 0}
					<div class="flex flex-col items-center justify-center py-12 text-center">
						<User class="h-10 w-10 text-slate-300" />
						<p class="mt-2 text-sm text-slate-500">No patients found</p>
					</div>
				{/if}
			</div>
		</ScrollArea>
	</div>

	<!-- Right Panel: Patient Details -->
	{#if selectedPatient}
		<div
			class="flex w-[45%] flex-col gap-4 overflow-hidden rounded-3xl bg-white p-5 shadow-sm"
			in:fade={{ duration: 200 }}
		>
			<!-- Profile Header (Card Style with Gradient Shadow) -->
			<div class="relative overflow-hidden rounded-2xl bg-white p-4 shadow-lg">
				<!-- Gradient Bottom Border -->
				<div
					class="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 via-rose-300 to-violet-300"
				></div>

				<!-- Top Row: Avatar + Info + Experience Badge -->
				<div class="flex gap-4">
					<!-- Avatar with Orange Border -->
					<div
						class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-indigo-400 text-2xl font-normal text-indigo-700 ring ring-offset-2"
					>
						{getInitials(selectedPatient.name)}
					</div>

					<!-- Info -->
					<div class="flex-1">
						<div class="flex items-start justify-between">
							<div>
								<h2 class="text-lg font-bold text-slate-900">{selectedPatient.name}</h2>
								<p class="text-xs text-slate-500">
									{selectedPatient.enrolleeId} • {selectedPatient.hmo}
								</p>
							</div>
							<Badge
								variant="outline"
								class="shrink-0 border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600"
							>
								{selectedPatient.encounters}+ Encounters
							</Badge>
						</div>

						<!-- Rating -->
						<div class="mt-1.5 flex items-center gap-1">
							<Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
							<Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
							<Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
							<Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
							<Star class="h-3.5 w-3.5 fill-amber-200 text-amber-200" />
							<span class="ml-1 text-xs font-bold text-slate-900">4.8</span>
							<span class="text-[10px] text-slate-400">(23 reviews)</span>
						</div>
					</div>
				</div>

				<!-- Horizontal Info Row with Pipes -->
				<div class="mt-4 flex flex-wrap items-center gap-x-2 text-xs text-slate-600">
					<span class="font-medium text-slate-800">{selectedPatient.address}</span>
					<span class="text-slate-300">|</span>
					<span>
						<span class="font-semibold text-slate-800">Plan:</span>
						<span class="font-bold text-indigo-600">{selectedPatient.plan}</span>
					</span>
					<span class="text-slate-300">|</span>
					<span class="flex items-center gap-1.5">
						<span class="font-semibold text-slate-800">Alerts:</span>
						<span class="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600"
							>Hypertension</span
						>
						<span class="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-600"
							>Peptic Ulcer</span
						>
					</span>
				</div>

				<Separator class="my-3" />

				<!-- Footer: Last Visit + Action -->
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-1.5 text-xs">
						<Calendar class="h-3.5 w-3.5 text-indigo-500" />
						<span class="text-slate-500">Last Visit:</span>
						<span class="font-bold text-indigo-600">Today, 10:00 AM</span>
					</div>
					<Button
						size="sm"
						class="h-7 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700"
						onclick={() => (isTransferModalOpen = true)}
					>
						Transfer Record
						<ArrowRight class="ml-1.5 h-3 w-3" />
					</Button>
				</div>
			</div>

			<!-- Tabs -->
			<Tabs.Root value="timeline" class="flex flex-1 flex-col overflow-hidden">
				<div class="border-b border-slate-100">
					<Tabs.List class="w-full justify-start gap-6 bg-transparent p-0">
						{#each ['Timeline', 'Medications', 'Lab Profile', 'Documents'] as tab}
							<Tabs.Trigger
								value={tab.toLowerCase()}
								class="relative h-10 rounded-none bg-transparent px-0 pb-2 pt-2 text-sm font-medium text-slate-400 shadow-none transition-all hover:text-slate-600 data-[state=active]:border-b-2 data-[state=active]:border-b-violet-600 data-[state=active]:text-violet-600 data-[state=active]:shadow-none"
							>
								{tab}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</div>

				<div class="flex-1 overflow-hidden py-6">
					<Tabs.Content value="timeline" class="mt-0 h-full">
						<ScrollArea class="h-full pr-4">
							<div class="flex flex-col gap-0 px-2">
								<!-- Today Badge -->
								<div class="mb-6">
									<Badge
										class="rounded-md bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-200"
									>
										Today
									</Badge>
								</div>

								{#each data.medicalHistory.timeline as event}
									<div class="grid grid-cols-[80px_auto_1fr] gap-4">
										<!-- Time/Date -->
										<div class="pt-1 text-right">
											<p class="text-sm font-bold text-indigo-500">10:00 AM</p>
											<p class="text-[10px] font-medium text-slate-400">{event.date}</p>
										</div>

										<!-- Line & Dot -->
										<div class="relative flex justify-center">
											<div class="h-full w-px bg-indigo-100"></div>
											<div
												class="absolute top-1.5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white"
											></div>
										</div>

										<!-- Content -->
										<div class="pb-8">
											<h3 class="text-sm font-bold text-slate-900">
												<span class="text-indigo-500">{event.type}</span>
												{event.title}
											</h3>
											<p class="mt-1 text-sm leading-relaxed text-slate-500">
												{event.summary}
											</p>
											<div class="mt-2 flex items-center gap-2 text-xs text-slate-400">
												<span class="font-medium text-slate-600">{event.facility}</span>
												<span>•</span>
												<span>{event.doctor}</span>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</ScrollArea>
					</Tabs.Content>

					<Tabs.Content value="medications" class="mt-0 h-full">
						<div class="grid grid-cols-2 gap-4">
							{#each data.medicalHistory.medications as med}
								<div
									class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-violet-100 hover:shadow-md"
								>
									<div class="flex items-center gap-4">
										<div
											class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
										>
											<Pill class="h-6 w-6" />
										</div>
										<div>
											<h4 class="font-bold text-slate-900">{med.name}</h4>
											<p class="text-xs text-slate-500">{med.dosage} • {med.frequency}</p>
										</div>
									</div>
									<Badge
										variant={med.status === 'Active' ? 'default' : 'secondary'}
										class={med.status === 'Active'
											? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
											: 'bg-slate-100 text-slate-500'}
									>
										{med.status}
									</Badge>
								</div>
							{/each}
						</div>
					</Tabs.Content>

					<Tabs.Content value="allergies" class="mt-0 h-full">
						<div class="grid grid-cols-2 gap-4">
							{#each data.medicalHistory.allergies as allergy}
								<div class="rounded-2xl border border-rose-100 bg-rose-50/30 p-5">
									<div class="flex items-start gap-3">
										<div class="rounded-full bg-rose-100 p-2">
											<AlertCircle class="h-5 w-5 text-rose-600" />
										</div>
										<div>
											<h4 class="font-bold text-slate-900">{allergy.allergen}</h4>
											<p class="mt-1 text-sm text-slate-600">Reaction: {allergy.reaction}</p>
											<div class="mt-3 flex items-center gap-2">
												<span class="text-xs font-medium text-rose-600">Severity:</span>
												<span class="h-1.5 w-12 overflow-hidden rounded-full bg-rose-200">
													<span class="block h-full w-[80%] bg-rose-500"></span>
												</span>
												<span class="text-xs font-bold text-rose-700">{allergy.severity}</span>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</Tabs.Content>

					<Tabs.Content value="documents" class="mt-0 h-full">
						<div class="grid grid-cols-3 gap-4">
							{#each data.medicalHistory.documents as doc}
								<button
									class="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-6 text-center transition-all hover:border-violet-200 hover:shadow-md"
								>
									<div
										class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600"
									>
										<FileText class="h-7 w-7" />
									</div>
									<div>
										<h4 class="text-sm font-bold text-slate-900 group-hover:text-violet-700">
											{doc.name}
										</h4>
										<p class="mt-1 text-xs text-slate-500">{doc.type} • {doc.date}</p>
									</div>
								</button>
							{/each}
						</div>
					</Tabs.Content>
				</div>
			</Tabs.Root>
		</div>
	{:else}
		<div
			class="flex flex-1 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50"
		>
			<div class="text-center">
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
					<User class="h-8 w-8 text-slate-400" />
				</div>
				<h3 class="mt-4 text-lg font-bold text-slate-900">No patient selected</h3>
				<p class="mt-2 text-sm text-slate-500">
					Select a patient from the directory to view details.
				</p>
			</div>
		</div>
	{/if}
</div>

<!-- Transfer Record Modal (Updated Styling) -->
<Dialog.Root bind:open={isTransferModalOpen}>
	<Dialog.Content class="rounded-2xl sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold text-slate-900">Transfer Patient Record</Dialog.Title>
			<Dialog.Description class="text-slate-500">
				Share {selectedPatient?.name}'s medical history with another facility.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-5 py-4">
			<div class="grid gap-2">
				<Label for="facility" class="font-semibold text-slate-700">Destination Facility</Label>
				<Select.Root type="single">
					<Select.Trigger class="rounded-xl border-slate-200 bg-slate-50">
						<Select.Value placeholder="Select facility..." />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="lagoon">Lagoon Hospital, Ikoyi</Select.Item>
						<Select.Item value="redd">Reddington Hospital</Select.Item>
						<Select.Item value="luth">Lagos University Teaching Hospital</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-2">
				<Label for="reason" class="font-semibold text-slate-700">Reason for Transfer</Label>
				<Textarea
					id="reason"
					placeholder="e.g., Specialist consultation required..."
					class="rounded-xl border-slate-200 bg-slate-50"
				/>
			</div>
			<div class="grid gap-2">
				<Label class="font-semibold text-slate-700">Attachments</Label>
				<div class="rounded-xl border border-slate-200 p-4">
					<div class="flex items-center gap-3">
						<input
							type="checkbox"
							id="summary"
							checked
							disabled
							class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
						/>
						<label for="summary" class="text-sm font-medium text-slate-700"
							>Patient Medical Summary (Auto-generated)</label
						>
					</div>
					<div class="mt-3 flex items-center gap-3">
						<input
							type="checkbox"
							id="labs"
							class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
						/>
						<label for="labs" class="text-sm font-medium text-slate-700"
							>Recent Lab Results (Last 3 months)</label
						>
					</div>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button
				variant="outline"
				class="rounded-xl border-slate-200"
				onclick={() => (isTransferModalOpen = false)}>Cancel</Button
			>
			<Button
				class="rounded-xl bg-violet-600 hover:bg-violet-700"
				onclick={() => (isTransferModalOpen = false)}
			>
				Send Transfer Request
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
