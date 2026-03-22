<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Search, User, ChevronRight, Plus, MoreHorizontal, CheckCircle } from '@lucide/svelte';

	// Sample data matching the image
	const products = [
		{
			id: 1,
			name: 'MacBook (13-inch, Mid 2010)',
			brand: 'Apple',
			condition: 'Grade B',
			conditionColor: 'bg-yellow-500',
			functional: 'Working',
			graphics: 'WXGA',
			keyboard: 'SWE',
			boxed: 'Unboxed',
			quantity: '0 / 15',
			price: '185 €',
			os: 'MacOS',
			color: 'White',
			cpu: 'Core 2 Duo P8600',
			battery: '11-200',
			faultDescription: 'minor LCD fault (wear marks)',
			additionalFault: 'port not working (HDMI)',
			priority: 'High'
		},
		{
			id: 2,
			name: 'MacBook (13-inch, Mid 2010)',
			brand: 'Apple',
			condition: 'Grade C',
			conditionColor: 'bg-red-500',
			functional: 'Working',
			graphics: 'WXGA',
			keyboard: 'SWE',
			boxed: 'Unboxed',
			quantity: '0 / 15',
			price: '185 €',
			os: 'MacOS',
			color: 'White',
			cpu: 'Core 2 Duo P8600',
			battery: '11-200',
			faultDescription: 'minor LCD fault (wear marks)',
			additionalFault: 'port not working (HDMI)',
			priority: 'Medium'
		},
		{
			id: 3,
			name: 'MacBook (13-inch, Mid 2010)',
			brand: 'Apple',
			condition: 'Grade A',
			conditionColor: 'bg-yellow-500',
			functional: 'Working',
			graphics: 'WXGA',
			keyboard: 'SWE',
			boxed: 'Unboxed',
			quantity: '0 / 15',
			price: '185 €',
			os: 'MacOS',
			color: 'White',
			cpu: 'Core 2 Duo P8600',
			battery: '11-200',
			faultDescription: 'minor LCD fault (wear marks)',
			additionalFault: 'port not working (HDMI)',
			priority: 'Low'
		},
		{
			id: 4,
			name: 'MacBook (13-inch, Mid 2010)',
			brand: 'Apple',
			condition: 'Grade A',
			conditionColor: 'bg-green-500',
			functional: 'Working',
			graphics: 'WXGA',
			keyboard: 'SWE',
			boxed: 'Unboxed',
			quantity: '0 / 15',
			price: '185 €',
			os: 'MacOS',
			color: 'White',
			cpu: 'Core 2 Duo P8600',
			battery: '11-200',
			faultDescription: 'minor LCD fault (wear marks)',
			additionalFault: 'port not working (HDMI)',
			priority: 'High'
		},
		{
			id: 5,
			name: 'MacBook (13-inch, Mid 2010)',
			brand: 'Apple',
			condition: 'Grade A',
			conditionColor: 'bg-green-500',
			functional: 'Working',
			graphics: 'WXGA',
			keyboard: 'SWE',
			boxed: 'Unboxed',
			quantity: '0 / 15',
			price: '185 €',
			os: 'MacOS',
			color: 'White',
			cpu: 'Core 2 Duo P8600',
			battery: '11-200',
			faultDescription: 'minor LCD fault (wear marks)',
			additionalFault: 'port not working (HDMI)',
			priority: 'Medium'
		}
	];

	// Filter state
	let selectedPriority = 'All';

	// Filtered products based on priority
	const filteredProducts = $derived(
		selectedPriority === 'All'
			? products
			: products.filter((product) => product.priority === selectedPriority)
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Main Content -->
	<div class="px-8 py-6">
		<!-- Action Bar -->
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="relative">
					<Search
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
					/>
					<Input
						placeholder="Search for product name"
						class="w-80 border-gray-200 bg-white pl-10"
					/>
				</div>
				<Button class="bg-[#4ECDC4] text-white hover:bg-[#45B7B8]">Sales order lines</Button>
			</div>
			<div class="flex items-center gap-4">
				<Button variant="outline" class="text-gray-600">All items</Button>
				<Button variant="outline" class="text-gray-400">Approved</Button>
				<Button variant="outline" class="text-gray-600">
					Actions
					<MoreHorizontal class="ml-2 h-4 w-4" />
				</Button>
				<Button class="bg-[#4ECDC4] text-white hover:bg-[#45B7B8]">Send order</Button>
			</div>
		</div>

		<!-- Products Table -->
		<div class="rounded-lg border bg-white">
			<Table.Root>
				<Table.Body>
					{#each products as product}
						<Table.Row class="border-b">
							<Table.Cell class="py-2">
								<Checkbox />
							</Table.Cell>
							<Table.Cell class="py-2">
								<div>
									<div class="mb-1 text-sm font-medium text-gray-900">{product.name}</div>
									<div class="space-y-0.5 text-xs text-gray-500">
										<div>
											<span class="text-gray-400">OS:</span>
											<span class="ml-1">{product.os}</span>
											<span class="ml-4 text-gray-400">Color:</span>
											<span class="ml-1">{product.color}</span>
										</div>
										<div>
											<span class="text-gray-400">CPU:</span>
											<span class="ml-1">{product.cpu}</span>
										</div>
										<div>
											<span class="text-gray-400">Battery cycles:</span>
											<span class="ml-1">{product.battery}</span>
										</div>
										<div>
											<span class="text-gray-400">PC Fault Descriptions:</span>
											<span class="ml-1">{product.faultDescription}</span>
										</div>
										<div>
											<span class="text-gray-400">PC Additional Fault:</span>
											<span class="ml-1">{product.additionalFault}</span>
										</div>
									</div>
								</div>
							</Table.Cell>
							<Table.Cell class="py-2">
								<Badge class="{product.conditionColor} rounded-md px-2 py-1 text-xs text-white">
									{product.condition}
								</Badge>
							</Table.Cell>
							<Table.Cell class="py-2">
								<div class="flex items-center gap-1">
									<CheckCircle class="h-4 w-4 text-green-500" />
									<span class="text-sm">{product.functional}</span>
								</div>
							</Table.Cell>
							<Table.Cell class="py-2 text-sm">{product.graphics}</Table.Cell>
							<Table.Cell class="py-2 text-sm">{product.keyboard}</Table.Cell>
							<Table.Cell class="py-2 text-sm">{product.boxed}</Table.Cell>
							<Table.Cell class="py-2">
								<div class="flex items-center gap-2">
									<span class="text-sm">{product.quantity}</span>
									<Plus class="h-4 w-4 text-gray-400" />
								</div>
							</Table.Cell>
							<Table.Cell class="py-2 font-medium">{product.price}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Pagination -->
		<div class="mt-6 flex items-center justify-between">
			<div class="flex items-center gap-2 text-sm text-gray-600">
				<span>Viewing</span>
				<select class="rounded border px-2 py-1 text-sm">
					<option>10</option>
					<option>25</option>
					<option>50</option>
				</select>
				<span>entries per page</span>
			</div>
			<div class="flex items-center gap-1">
				<Button
					variant="outline"
					size="sm"
					class="h-8 w-8 border-[#4ECDC4] bg-[#4ECDC4] text-white"
				>
					1
				</Button>
				<Button variant="outline" size="sm" class="h-8 w-8">2</Button>
				<Button variant="outline" size="sm" class="h-8 w-8">3</Button>
				<Button variant="outline" size="sm" class="h-8 w-8">4</Button>
				<Button variant="outline" size="sm" class="h-8 w-8">5</Button>
				<Button variant="outline" size="sm" class="h-8 w-8">
					<ChevronRight class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
</div>
