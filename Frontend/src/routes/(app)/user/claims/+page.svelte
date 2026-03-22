<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Trash2, Plus, ReceiptText, List } from '@lucide/svelte';
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

	let { data }: { data: PageData } = $props();

	let showPreview = $state(true);

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// Dynamic data from server
	let states = $state(data.states || []);
	let facilities = $state(data.facilities || {});
	let providerName = $state('');
	let providerDetails = $state<Facility | null>(null);

	let items = $state([...defaultItems]);

	let total = $derived(items.reduce((sum, item) => sum + item.qty * item.price, 0));

	function addItem() {
		items.push({
			name: '',
			qty: 1,
			price: 0
		});
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
	$effect(() => {
		if (selectedState) {
			selectedFacility = '';
		}
	});

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

<div class="min-h-screen p-6">
	<div class="mx-auto flex max-w-7xl flex-col items-center">
		<!-- Header -->
		<div class="mb-6 flex w-full items-center justify-between">
			<h1 class="text-2xl font-semibold">Health Service Invoice</h1>
			<div class="flex items-center gap-4">
				<div class="flex items-center space-x-2">
					<Switch
						id="show-preview"
						checked={showPreview}
						onCheckedChange={(v) => (showPreview = v)}
					/>
					<Label for="show-preview">Show Preview</Label>
				</div>

				<Button class="bg-blue-600 hover:bg-blue-700" onclick={handleSubmit}
					>Submit to Insurance</Button
				>
				<Button class="bg-gray-700 hover:bg-gray-800" onclick={generateInvoice}
					>Generate Invoice</Button
				>
			</div>
		</div>

		<div class="flex w-full gap-6 transition-all duration-500 ease-in-out">
			<!-- Left Panel - Form -->
			<div class="transition-all duration-500 ease-in-out {showPreview ? 'w-[40%]' : 'w-[80%]'}">
				<div class="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
					<!-- Invoice Details -->
					<div class="space-y-4">
						<h2 class="flex items-center gap-2 text-lg font-semibold">
							<ReceiptText class="h-5 w-5" /> Invoice details
						</h2>
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
							<div class="rounded-md bg-gray-100 px-3 py-2 font-medium">
								{currentPatient?.label || 'Patient name from backend'}
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label>Location</Label>
								<Select.Root
									type="single"
									name="state"
									value={selectedState}
									onValueChange={(v) => (selectedState = v)}
								>
									<Select.Trigger class="w-full">
										{states.find((s) => s.value === selectedState)?.label || 'Select state'}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Label>States</Select.Label>
											{#each states as state (state.value)}
												<Select.Item value={state.value} label={state.label}>
													{state.label}
												</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							</div>

							<div class="space-y-2">
								<Label>Provider</Label>
								<Select.Root
									type="single"
									name="facility"
									value={selectedFacility}
									onValueChange={(v) => (selectedFacility = v)}
									disabled={!selectedState}
								>
									<Select.Trigger class="w-full">
										<span class="block truncate">
											{currentFacilities.find((f: Facility) => f.value === selectedFacility)
												?.label || 'Select provider'}
										</span>
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Label>Facilities</Select.Label>
											{#each currentFacilities as facility (facility.value)}
												<Select.Item value={facility.value} label={facility.label}>
													{facility.label}
												</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							</div>
						</div>
					</div>

					<!-- Service Items -->
					<div class="space-y-3">
						<h2 class="flex items-center gap-2 text-lg font-semibold">
							<List class="h-5 w-5" /> Service Items
						</h2>
						<Separator class="-mt-1 bg-gray-300" />
						<div class="space-y-3">
							<div class="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600">
								<div class="col-span-6">Service</div>
								<div class="col-span-2">QTY</div>
								<div class="col-span-2">Price</div>
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
										<Input
											value={item.price}
											type="number"
											oninput={(e) => (item.price = parseFloat(e.currentTarget.value) || 0)}
											class="flex-1"
										/>
										<Button
											variant="ghost"
											size="xs"
											onclick={() => removeItem(index)}
											class="rounded-full p-1"
										>
											<Trash2 size={16} />
										</Button>
									</div>
								</div>
							{/each}

							<Button onclick={addItem} class="w-fit rounded-full">
								<Plus size={16} class="mr-2" />
								Add Service
							</Button>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Panel - Preview -->
			{#if showPreview}
				<div
					id="invoice-preview"
					class="w-[60%] rounded-lg bg-white p-8 shadow-sm transition-all duration-500 ease-in-out"
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
