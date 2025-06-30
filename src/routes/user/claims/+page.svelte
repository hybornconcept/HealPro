<script lang="ts">
	import {
		CreditCard,
		FileText,
		User,
		ClipboardList,
		FolderOpen,
		NotebookTabs,
		Info,
		CheckCircle,
		Loader2,
		Calendar
	} from '@lucide/svelte';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import * as Table from '$lib/components/ui/table/index.js';
	import { cn } from '$lib/utils';

	const claimTabs = [
		{ label: 'Demographics', icon: User },
		{ label: 'Claim Info', icon: FileText },
		{ label: 'Payment', icon: CreditCard },
		{ label: 'Diagnosis & Procedure', icon: ClipboardList },
		{ label: 'Documents', icon: FolderOpen }
	];

	const statusSteps = [
		{
			title: 'Claim Received',
			desc: 'Notification sent to Client & Provider',
			time: 'Jun 19, 2020 10:30 AM',
			active: true,
			icon: CheckCircle
		},
		{
			title: 'Initial Review',
			desc: 'Assigned to Reviewers',
			time: 'Jun 21, 2020 10:30 AM',
			active: true,
			icon: CheckCircle,
			todos: [
				{ text: '3 Todo created by Lera Grace', time: 'Jun 21, 2020 12:44 PM' },
				{ text: 'Moved to Evidence Gathering. Review by Lera Grace', time: 'Jun 23, 2020 8:30 AM' }
			]
		},
		{
			title: 'Evidence Gathering',
			desc: '',
			time: '',
			active: true,
			icon: Info,
			updates: [
				{ text: 'John Added 3 Medical Bills', time: 'Jun 26, 2020 4:30 PM' },
				{ text: 'John Added Note', time: 'Jun 28, 2020 4:42 PM' },
				{ text: 'John Added Discharge Summary', time: 'Jun 28, 2020 5:12 PM' }
			]
		}
	];

	const nextSteps = [
		'Provider Review',
		'Settlement Review',
		'Preparation for Decision Notification',
		'Payment Processing'
	];

	const serviceCodes = [
		{
			date: '08/09/2020',
			code: '0250',
			details: 'Pharmacy - General',
			unit: 1,
			amount: '$62',
			total: '$62'
		},
		{
			date: '08/09/2020',
			code: '0450',
			details: 'Emergency Room',
			unit: 1,
			amount: '$1974',
			total: '$1974'
		},
		{
			date: '08/09/2020',
			code: '0554T',
			details: 'Bone Strength and Fracture Risk Assessment',
			unit: 1,
			amount: '$282',
			total: '$282'
		},
		{
			date: '08/09/2020',
			code: '76000',
			details: 'Other Diagnostic Radiology',
			unit: 3,
			amount: '$123.33',
			total: '$370'
		},
		{
			date: '08/09/2020',
			code: '0278',
			details: 'Implant',
			unit: 1,
			amount: '$9000',
			total: '$9000'
		}
	];

	const totalAmount = '$11,688';

	const primaryInsurance = {
		payer: 'Blue Cross Blue Shield',
		group: '66',
		id: 'A284755015',
		address: '1310 G Street, NW Washington, DC 20005',
		phone: '(888) 630 2547'
	};

	// Create a combined array for all policy information
	const policyInfo = [
		{ label: 'Policy', value: primaryInsurance.id },
		{ label: 'Category', value: 'Group Membership' },
		{ label: 'Source', value: 'Cigna Health' },
		{ label: 'Source Type', value: 'Mail' },
		{ label: 'Claims Handler', value: 'Nick Barich' },
		{ label: 'Payer Name', value: primaryInsurance.payer },
		{ label: 'Address', value: primaryInsurance.address },
		{ label: 'Group', value: primaryInsurance.group },
		{ label: 'Phone', value: primaryInsurance.phone }
	];
</script>

<div class="min-h-screen bg-[#f7fafd] p-4">
	<div class="flex flex-col gap-4 lg:flex-row">
		<!-- Main Content (70%) -->
		<div class="flex flex-1 flex-col gap-4 lg:basis-[70%]">
			<!-- Top Info Row -->
			<Card.Root>
				<Card.Header class="-mb-4 flex h-[20px] min-h-0 items-center justify-between border-b ">
					<h2 class="text-lg font-semibold">Claim Details</h2>
					<FileText class="ml-1 h-5 w-5 text-gray-400" />
				</Card.Header>
				<Card.Content class="flex flex-wrap items-center gap-4 p-4">
					{#each policyInfo as item}
						<div class="flex min-w-[180px] flex-col gap-1">
							<div class="text-xs text-gray-500">{item.label}</div>
							<div class="flex items-center gap-2 font-semibold">{item.value}</div>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
			<!-- Claims Info Card -->

			<Card.Root>
				<Card.Header class="mb-4 flex h-[20px] min-h-0 items-center justify-between border-b ">
					<h2 class="text-lg font-semibold">Claim Code Description</h2>
					<NotebookTabs class="ml-1 h-5 w-5 text-gray-400" />
				</Card.Header>
				<Card.Content class="space-y-4 pb-6">
					<div class="grid grid-cols-1 gap-4">
						<div class="flex flex-col gap-2">
							<div class="flex gap-8">
								<div>
									<div class="text-xs text-gray-500">Network</div>
									<div class="font-medium">First Health</div>
								</div>
								<div>
									<div class="text-xs text-gray-500">Claim Received Date</div>
									<div class="font-medium">Jun 19, 2020</div>
								</div>
								<div>
									<div class="text-xs text-gray-500">Incident</div>
									<div class="font-medium">Slipped from stairs and had knee injury</div>
								</div>
							</div>
						</div>
					</div>
					<div class="overflow-x-auto rounded-lg border">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Date</Table.Head>
									<Table.Head>Code</Table.Head>
									<Table.Head>Details</Table.Head>
									<Table.Head>Unit</Table.Head>
									<Table.Head>Amount</Table.Head>
									<Table.Head>Total</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each serviceCodes as row}
									<Table.Row>
										<Table.Cell>{row.date}</Table.Cell>
										<Table.Cell>{row.code}</Table.Cell>
										<Table.Cell>{row.details}</Table.Cell>
										<Table.Cell>{row.unit}</Table.Cell>
										<Table.Cell>{row.amount}</Table.Cell>
										<Table.Cell>{row.total}</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
						<div class="flex justify-end p-2 text-base font-semibold text-gray-700">
							Total Amount <span class="ml-4">{totalAmount}</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		<!-- Status/Notes/Tasks Sidebar (30%) -->
		<div class="w-full max-w-[400px] min-w-[320px] lg:w-[30%]">
			<Card.Root class="sticky top-4">
				<Card.Header class="-mb-4 flex h-[20px] min-h-0 items-center justify-between border-b ">
					<h2 class="text-lg font-semibold">Approval Status</h2>
					<Calendar class="ml-1 h-5 w-5 text-gray-400" />
				</Card.Header>

				<Card.Content class="p-4">
					<div class="space-y-4">
						<!-- Timeline -->
						{#each statusSteps as step, i}
							<div class="relative flex gap-3 pb-6 last:pb-0">
								<!-- Timeline line and icon -->
								<div class="relative flex flex-col items-center">
									<!-- Vertical line: before and after the icon, so lines connect -->
									{#if i !== 0}
										<div
											class="absolute top-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-gray-200"
										></div>
									{/if}
									<div class="relative z-10">
										{#if i === 0}
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white"
											>
												<step.icon class="h-5 w-5" />
											</div>
										{:else}
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-600"
											>
												<step.icon class="h-5 w-5" />
											</div>
										{/if}
									</div>
									{#if i < statusSteps.length - 1}
										<div
											class="absolute bottom-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-gray-200"
										></div>
									{/if}
								</div>

								<!-- Timeline content -->
								<div class="flex-1">
									<div class="font-semibold text-gray-800">{step.title}</div>
									{#if step.desc}
										<div class="text-xs text-gray-500">{step.desc}</div>
									{/if}
									{#if step.time}
										<div class="text-xs text-gray-400">{step.time}</div>
									{/if}
									{#if step.todos}
										{#each step.todos as todo}
											<div class="mt-1 text-xs text-gray-500">
												{todo.text} <span class="text-gray-400">{todo.time}</span>
											</div>
										{/each}
									{/if}
									{#if step.updates}
										{#each step.updates as update}
											<div class="mt-1 text-xs text-gray-500">
												{update.text} <span class="text-gray-400">{update.time}</span>
											</div>
										{/each}
										<Button variant="link" class="mt-1 h-auto px-0 py-0 text-xs text-blue-600">
											More Updates
										</Button>
									{/if}
								</div>
							</div>
						{/each}

						<!-- Next steps -->
						<div class="mt-2">
							{#each nextSteps as step}
								<div class="mb-1 flex items-center gap-2 text-sm text-gray-400">
									<Loader2 class="h-3 w-3 text-gray-300" />
									{step}
									{#if step === 'Payment Processing'}
										<span class="ml-auto text-xs text-gray-300 italic">
											Estimated Date Sep 12, 2020
										</span>
									{/if}
								</div>
							{/each}
						</div>
						<div class="mt-4 text-xs text-gray-400">Last updated 3 mins ago</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
