<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { toast } from 'svelte-sonner';
	import { BACKEND_URL } from '$lib/config';
	import { jsPDF } from 'jspdf';
	import html2canvas from 'html2canvas';

	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { slide, fly } from 'svelte/transition';
	import { Trash2, Plus, ReceiptText, List, Clock, Send, FileText } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let showPreview = $state(false);

	// Toggle logic
	function togglePreview(v: boolean) {
		showPreview = v;
	}

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// Dynamic data from server
	let states = $state(data.states || []);
	let facilities = $state(data.facilities || {});
	let currentPatient = $state(data.currentPatient);
	let defaultItems = $state(data.defaultItems || []);
	let invoiceNumber = $state(data.invoiceNumber || '');
	let serviceDate = $state(data.serviceDate || '');
	let dueDate = $state(data.dueDate || '');

	// Form state
	let selectedState = $state('');
	let selectedFacility = $state('');
	let value = $state<DateValue | undefined>(undefined);

	// Derived state
	let currentFacilities = $derived(selectedState ? facilities[selectedState] || [] : []);

	let providerName = $state('');
	let providerDetails = $state<Facility | null>(null);

	interface InvoiceItem {
		name: string;
		qty: number;
		price: number;
	}

	let items = $state<InvoiceItem[]>([]);

	let total = $derived(items.reduce((sum, item) => sum + item.qty * item.price, 0));

	function addItem() {
		items.push({
			name: '',
			qty: 1,
			price: 0 // Allow manual entry (will be editable)
		});
	}

	// Mock "One Stone, Two Birds" Unbilled Queue
	let unbilledItems = $state([
		{
			id: 1,
			patient: 'John Doe',
			service: 'Malaria Test (RDT)',
			date: 'Today, 10:30 AM',
			provider: 'Dr. Smith'
		},
		{
			id: 2,
			patient: 'Jane Smith',
			service: 'General Consultation',
			date: 'Today, 09:15 AM',
			provider: 'Dr. Jones'
		},
		{
			id: 3,
			patient: 'Baby Doe',
			service: 'Vaccination (Polio)',
			date: 'Today, 08:45 AM',
			provider: 'Nurse Joy'
		}
	]);

	function addUnbilledItem(item: any) {
		const priceListItem = priceList.find((p) => p.name === item.service);
		const price = priceListItem ? priceListItem.price : 0;
		items.push({
			name: item.service,
			qty: 1,
			price: price
		});
		unbilledItems = unbilledItems.filter((i) => i.id !== item.id);
		toast.success('Service added to invoice');
	}

	function removeItem(index: number) {
		items.splice(index, 1);
	}

	// Update provider when facility changes
	$effect(() => {
		const facility = currentFacilities.find((f: Facility) => f.value === selectedFacility);
		if (facility) {
			providerName = facility.label;
			providerDetails = facility;
		}
	});

	// Reset facility when state changes
	// Mock Price List
	const priceList = [
		{ name: 'General Consultation', price: 5000, category: 'Consultation' },
		{ name: 'Specialist Consultation', price: 15000, category: 'Consultation' },
		{ name: 'Malaria Test (RDT)', price: 3000, category: 'Laboratory' },
		{ name: 'Widal Test', price: 4000, category: 'Laboratory' },
		{ name: 'Full Blood Count', price: 7500, category: 'Laboratory' },
		{ name: 'Paracetamol 500mg', price: 500, category: 'Pharmacy' },
		{ name: 'Artemether-Lumefantrine', price: 2500, category: 'Pharmacy' }
	];

	function addPriceListItem(item: any) {
		const existingItem = items.find((i) => i.name === item.name);
		if (existingItem) {
			existingItem.qty += 1;
			toast.success('Item quantity updated');
		} else {
			items.push({
				name: item.name,
				qty: 1,
				price: item.price
			});
			toast.success('Item added from Price List');
		}
	}

	$effect(() => {
		if (value) {
			serviceDate = df.format(value.toDate(getLocalTimeZone()));
		}
	});

	async function generateInvoice() {
		console.log('Starting invoice generation...');
		const element = document.getElementById('invoice-preview');
		if (!element) {
			console.error('Invoice preview element not found');
			toast.error('Preview not available');
			return;
		}

		const loadingToast = toast.loading('Generating Invoice...');

		try {
			// Ensure element is positioned
			const originalPosition = element.style.position;
			element.style.position = 'relative';

			console.log('Running html2canvas...');
			const canvas = await html2canvas(element, {
				scale: 2,
				useCORS: true,
				logging: true, // Enable html2canvas logging
				backgroundColor: '#ffffff'
			});

			// Reset position
			element.style.position = originalPosition;

			console.log('Creating PDF...');
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4'
			});

			const imgProps = pdf.getImageProperties(imgData);
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			pdf.save(`Invoice-${invoiceNumber}.pdf`);

			console.log('Invoice generated successfully');
			toast.success('Invoice generated successfully', { id: loadingToast });
		} catch (error) {
			console.error('Error generating invoice:', error);
			toast.error('Failed to generate invoice. Check console for details.', { id: loadingToast });
		}
	}

	async function handleSubmit() {
		if (!selectedState || !selectedFacility || !currentPatient) {
			toast.error('Please select a patient, state, and provider');
			return;
		}

		if (items.length === 0) {
			toast.error('Please add at least one service item');
			return;
		}

		// Validate items
		for (const item of items) {
			if (!item.name || item.price <= 0) {
				toast.error('Please ensure all items have a name and valid price');
				return;
			}
		}

		const loadingToast = toast.loading('Submitting claims...');

		try {
			const hospitalId = parseInt(selectedFacility);
			if (isNaN(hospitalId)) {
				toast.error('Invalid Facility ID selected');
				return;
			}

			// Prepare payload
			const payload = {
				invoiceNumber,
				serviceDate: value
					? value.toDate(getLocalTimeZone()).toISOString()
					: new Date().toISOString(),
				patientId: currentPatient.id, // Use numeric ID from server load
				hospitalId: hospitalId,
				policyNumber: currentPatient.policy, // Send policy number string
				items: items.map((item, index) => ({
					serviceName: item.name,
					serviceCode: `SVC-${index + 1}`, // Generate if not provided
					quantity: item.qty,
					unitPrice: item.price, // Assuming price is in correct unit
					amount: item.qty * item.price
				}))
			};

			console.log('Submitting Payload:', JSON.stringify(payload, null, 2));

			const res = await fetch(`${BACKEND_URL}/api/claims`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.message || 'Failed to submit claims');
			}

			toast.success('Claims have been submitted successfully', { id: loadingToast });

			// Optional: Reset form or redirect
			// items = [...defaultItems];
		} catch (error: any) {
			console.error('Submission error:', error);
			toast.error(error.message || 'An error occurred', { id: loadingToast });
		}
	}
</script>

<div class="min-h-screen p-4">
	<div class="mx-auto flex max-w-7xl flex-col items-center gap-8">
		<!-- Header Section (Matched to Appointments Page) -->
		<div class="flex w-full flex-col gap-6 lg:flex-row">
			<!-- Left Text Section (40%) -->
			<div class="flex w-full justify-center space-y-4 lg:w-[30%]">
				<div class="flex flex-col gap-2">
					<div class="flex items-center gap-2">
						<Badge variant="outline" class="border-indigo-200 bg-indigo-50 text-indigo-700">
							<ReceiptText class="mr-1 h-3 w-3" />
							Financial Records
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
							Health Service <span
								class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
								>Invoice</span
							>
						</h1>
						<p class=" text-sm leading-relaxed text-slate-500">
							Streamline your billing process with our integrated invoicing system.
						</p>
					</div>
				</div>
			</div>

			<!-- Right Actions Section (60%) -->
			<div class="flex w-full -translate-y-5 items-center justify-end gap-4 lg:w-[70%]">
				<div
					class="flex items-center gap-6 rounded-full border border-slate-200 bg-white px-6 py-2 shadow-sm"
				>
					<div class="flex items-center space-x-2">
						<Sheet.Root>
							<Sheet.Trigger
								class="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 focus:outline-none"
							>
								<List class="h-4 w-4" />
								Price List
							</Sheet.Trigger>
							<Sheet.Content side="right" class="w-[400px] overflow-y-auto px-3 sm:w-[540px]">
								<Sheet.Header class="mb-6 border-b border-indigo-100 pb-4 text-left">
									<Sheet.Title class="text-xl font-bold tracking-tight text-slate-900"
										>FACILITY PRICE LIST</Sheet.Title
									>
									<Sheet.Description>
										Click on any item below to add to the invoice.
									</Sheet.Description>
								</Sheet.Header>

								<div class="space-y-8 pb-8">
									{#each ['Consultation', 'Laboratory', 'Pharmacy'] as category}
										<div>
											<div class="mb-4 flex items-center gap-4">
												<h4 class="text-lg font-bold uppercase tracking-widest text-indigo-900">
													{category}
												</h4>
												<div class="h-px flex-1 bg-indigo-100"></div>
											</div>

											<div class="grid grid-cols-1 gap-2">
												{#each priceList.filter((i) => i.category === category) as item}
													<!-- "Tamanna Pharmacy" Card Style -->
													<button
														class="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-slate-100 bg-white p-3 text-left shadow-sm transition-all hover:scale-[1.01] hover:border-indigo-200 hover:shadow-md"
														onclick={() => addPriceListItem(item)}
													>
														<div class="relative z-10 flex-1">
															<h5
																class="text-md font-semibold text-slate-800 group-hover:text-indigo-700"
															>
																{item.name}
															</h5>
															<div class="mt-2 flex items-center gap-3">
																<div class="flex items-center gap-1.5 text-xs text-slate-500">
																	<Clock class="h-3 w-3 text-emerald-500" />
																	<span>Available</span>
																</div>
																<div class="h-3 w-px bg-slate-200"></div>
																<div class="text-xs text-slate-400">Standard Rate</div>
															</div>
														</div>
														<div class="relative z-10 text-right">
															<span class="text-md font-semibold text-indigo-600"
																>₦{item.price.toLocaleString()}</span
															>
															{#if item.price > 10000}
																<p class="mt-0.5 text-[10px] font-medium text-amber-500">Premium</p>
															{/if}
														</div>

														<!-- Hover Effect Background -->
														<div
															class="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-white opacity-0 transition-opacity group-hover:opacity-100"
														></div>
													</button>
												{/each}
											</div>
										</div>
									{/each}
								</div>
							</Sheet.Content>
						</Sheet.Root>
					</div>
					<div class="h-6 w-px bg-slate-200"></div>
					<div class="flex items-center space-x-2">
						<Switch id="show-preview" checked={showPreview} onCheckedChange={togglePreview} />
						<Label for="show-preview" class="font-medium text-slate-700">Invoice</Label>
					</div>
					<Button
						onclick={handleSubmit}
						class="h-10 rounded-full border-none bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all duration-300 hover:from-indigo-700 hover:to-violet-700"
					>
						Submit Invoice
						<Send class="ml-2 h-4 w-4" />
					</Button>
					<Button
						onclick={generateInvoice}
						class="h-10 rounded-full border-none bg-slate-700 px-6 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-slate-800"
					>
						Get Invoice
						<FileText class="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>

		<div class="flex w-full gap-6 transition-all duration-500 ease-in-out">
			<!-- Middle Panel - Form -->
			<div
				class="cubic-bezier(0.4, 0, 0.2, 1) transition-all duration-700 {showPreview
					? 'w-[35%]'
					: 'mx-auto w-[50%]'}"
			>
				<!-- Unbilled Queue Removed from here -->

				<div
					class="space-y-8 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl"
				>
					<!-- Invoice Details -->
					<div class="space-y-4">
						<h2 class="text-lg font-bold text-slate-800">Invoice Details</h2>
						<Separator class="-mt-1 bg-gray-300" />
						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label>Invoice Number</Label>
								<Input
									value={invoiceNumber}
									oninput={(e) => (invoiceNumber = e.currentTarget.value)}
								/>
							</div>
							<div class="space-y-2">
								<Label>Service Date</Label>
								<Popover.Root>
									<Popover.Trigger
										class={cn(
											buttonVariants({
												variant: 'outline',
												class: 'w-full justify-start text-left font-normal'
											}),
											!value && 'text-muted-foreground'
										)}
									>
										<CalendarIcon class="mr-2 h-4 w-4" />
										{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0">
										<Calendar type="single" {value} onValueChange={(v) => (value = v)} />
									</Popover.Content>
								</Popover.Root>
							</div>
						</div>

						<div class="space-y-2">
							<Label>Patient</Label>
							<div
								class="flex h-10 w-full items-center rounded-md border border-indigo-100 bg-indigo-50/50 px-3 text-sm font-medium text-indigo-900"
							>
								{currentPatient?.label || 'Select Patient'}
							</div>
						</div>

						<!-- Unbilled Queue Section (One Stone, Two Birds) - Moved Here -->
						{#if unbilledItems.length > 0}
							<div
								transition:slide
								class="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 p-5"
							>
								<div class="mb-4 flex items-center justify-between">
									<h3 class="flex items-center gap-2 text-sm font-bold text-indigo-900">
										<div
											class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
										>
											<Clock class="h-3.5 w-3.5" />
										</div>
										Ready for Billing
									</h3>
									<Badge class="bg-indigo-600 font-bold hover:bg-indigo-700"
										>{unbilledItems.length} Pending</Badge
									>
								</div>
								<div class="space-y-2.5">
									{#each unbilledItems as item (item.id)}
										<div
											transition:slide
											class="group flex items-center justify-between rounded-lg border border-indigo-100/50 bg-white p-3 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
										>
											<div>
												<p class="text-sm font-bold text-slate-800">
													{item.service}
												</p>
												<div class="flex items-center gap-2 text-xs text-slate-500">
													<span class="font-medium text-indigo-600">{item.patient}</span>
													<span>•</span>
													<span>{item.date}</span>
												</div>
											</div>
											<Button
												size="sm"
												class="h-8 bg-indigo-50 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
												onclick={() => addUnbilledItem(item)}
											>
												<Plus class="mr-1.5 h-3 w-3" /> Add
											</Button>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<!-- Invoice Items Table -->
					<div class="space-y-3">
						<h2 class="flex items-center gap-2 text-lg font-semibold">
							<List class="h-5 w-5" /> Invoice Items
						</h2>
						<Separator class="-mt-1 bg-gray-300" />
						<div class="space-y-3">
							<div
								class="grid grid-cols-12 gap-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500"
							>
								<div class="col-span-6 pl-2">Service Description</div>
								<div class="col-span-2 text-center">Qty</div>
								<div class="col-span-4 pl-2">Unit Price (₦)</div>
							</div>

							{#each items as item, index}
								<div class="grid grid-cols-12 items-center gap-2">
									<Input
										value={item.name}
										oninput={(e) => (item.name = e.currentTarget.value)}
										placeholder="Service name"
										class="col-span-6"
									/>
									<Input
										value={item.qty}
										type="number"
										oninput={(e) => (item.qty = parseInt(e.currentTarget.value) || 0)}
										class="col-span-2"
									/>
									<div class="col-span-4 flex items-center gap-1">
										<div class="relative flex-1">
											<span
												class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400"
												>₦</span
											>
											<Input
												value={item.price}
												type="number"
												readonly={item.price > 0}
												oninput={(e) => (item.price = parseFloat(e.currentTarget.value) || 0)}
												class="pl-7 focus-visible:ring-0 {item.price > 0
													? 'bg-slate-50 text-slate-500'
													: 'border-indigo-200 bg-white text-slate-900 ring-2 ring-indigo-50'}"
											/>
										</div>
										<Button
											variant="ghost"
											size="icon"
											onclick={() => removeItem(index)}
											class="h-8 w-8 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500"
										>
											<Trash2 size={14} />
										</Button>
									</div>
								</div>
							{/each}

							<Button
								onclick={addItem}
								class="mt-4 h-10 rounded-full bg-indigo-600 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-indigo-700"
							>
								Add Service
								<Plus class="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Panel - Preview -->
			{#if showPreview}
				<div
					transition:slide={{ axis: 'x', duration: 600 }}
					id="invoice-preview"
					class="flex-1 rounded-3xl border border-white/20 bg-white p-10 shadow-2xl ring-1 ring-black/5"
				>
					<!-- Header -->
					<div class="mb-2 flex items-start justify-between">
						<div>
							<h1 class="text-4xl font-bold text-[#111827]">Invoice</h1>
							<div class="mt-1 text-sm text-[#4b5563]">#{invoiceNumber}</div>
						</div>
						<div class="text-right">
							<h2 class="text-2xl font-bold text-[#111827]">{providerName}</h2>
							<div class="max-w-lg text-sm text-[#4b5563]">{providerDetails?.address}</div>
						</div>
					</div>
					<Separator class="mb-6 bg-[#1f2937]" />
					<!-- Service and Dates -->
					<div class="mb-8 grid grid-cols-2 gap-8">
						<div>
							<div class="mb-4">
								<div class="text-sm text-[#4b5563]">Service Date</div>
								<div class="font-medium text-[#111827]">{serviceDate}</div>
							</div>
						</div>
						<div class="text-right">
							<div>
								<div class="text-sm text-[#4b5563]">Due Date</div>
								<div class="font-medium text-[#111827]">{dueDate}</div>
							</div>
						</div>
					</div>

					<!-- Provider and Patient -->
					<div class="mb-8 grid grid-cols-2 gap-8">
						<div>
							<div class="mb-2 text-sm text-[#4b5563]">Provider</div>
							<div class="font-medium text-[#111827]">{providerName}</div>
							<div class="text-sm text-[#4b5563]">123 Health Street, Lagos</div>
							<div class="text-sm text-[#4b5563]">+234 701 234 5678</div>
							<div class="text-sm text-[#4b5563]">billing@medicare.com</div>
							<div class="text-sm text-[#4b5563]">License: MED-123456</div>
						</div>
						<div class="text-right">
							<div class="mb-2 text-sm text-[#4b5563]">Patient</div>
							<div class="font-medium text-[#111827]">
								{currentPatient?.label || 'Patient name from backend'}
							</div>
							<div class="text-sm text-[#4b5563]">Policy: {currentPatient?.policy || ''}</div>
							<div class="text-sm text-[#4b5563]">{currentPatient?.address || ''}</div>
							<div class="text-sm text-[#4b5563]">{currentPatient?.phone || ''}</div>
						</div>
					</div>
					<Separator class="mb-6 bg-[#1f2937]" />
					<!-- Services Table -->
					<div class="mb-8">
						<table class="w-full">
							<thead>
								<tr class="border-b border-[#e5e7eb] text-left text-sm text-[#4b5563]">
									<th class="w-[20%] pb-3 font-medium">Service</th>
									<th class="w-[15%] pb-3 font-medium">Service Code</th>
									<th class="w-[10%] pb-3 text-center font-medium">QTY</th>
									<th class="w-[15%] pb-3 text-center font-medium">Unit Price</th>
									<th class="w-[15%] pb-3 text-right font-medium">Amount</th>
								</tr>
							</thead>
							<tbody>
								{#each items as item, index}
									<tr class="border-b border-[#f3f4f6]">
										<td class="w-[20%] py-4 text-[#111827]">
											<div class="whitespace-normal break-words">{item.name}</div>
										</td>
										<td class="w-[15%] py-4 text-[#111827]">SVC-{index + 1}</td>
										<td class="w-[10%] py-4 text-center text-[#111827]">{item.qty}</td>
										<td class="w-[15%] py-4 text-center text-[#111827]">
											₦{item.price.toLocaleString()}
										</td>
										<td class="w-[15%] py-4 text-right text-[#111827]">
											₦{(item.qty * item.price).toLocaleString()}.00
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Total Amount -->
					<div class="mb-8 flex items-center justify-between border-t border-[#e5e7eb] pt-4">
						<div class="text-lg font-semibold text-[#111827]">Total Amount</div>
						<div class="text-xl font-bold text-[#111827]">
							₦{total.toLocaleString()}.00
						</div>
					</div>

					<!-- Note -->
					<div class="mb-8 text-sm text-[#4b5563]">
						<strong>Note:</strong> There will be a late payment fee of 0% per annum calculated daily
						for payments made after the due date.
					</div>

					<!-- Payment Method -->
					<div class="grid grid-cols-2 gap-8">
						<div>
							<div class="mb-4">
								<div class="mb-2 text-lg font-semibold text-[#111827]">Payment Method</div>
								<div class="space-y-1 text-sm text-[#4b5563]">
									<div>EFT Bank Transfer</div>
									<div>Account Name: Medicare Billing</div>
									<div>Bank: Zenith Bank</div>
									<div>Account Number: 1234567890</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
