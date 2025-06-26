<script lang="ts">
	import Activity from 'lucide-svelte/icons/activity';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';
	import Menu from 'lucide-svelte/icons/menu';
	import Package2 from 'lucide-svelte/icons/package-2';
	import Search from 'lucide-svelte/icons/search';
	import Users from 'lucide-svelte/icons/users';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
</script>

<div class="flex min-h-screen w-full flex-col">
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		<div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
			<Card.Root class="xl:col-span-2">
				<Card.Header
					class="flex flex-col items-start gap-2 border-b pb-2 sm:flex-row sm:items-center sm:justify-between"
				>
					<div class="flex flex-col gap-1">
						<h2 class="text-lg font-semibold">Claims</h2>
						<span class="text-xs text-gray-500">
							Claims information is imported periodically and may not be accurate. Claims last
							imported <span class="font-semibold text-gray-700">27 July 2014</span>.
						</span>
					</div>
					<div class="mt-2 flex gap-2 sm:mt-0">
						<Button size="sm" variant="outline">Export to Excel</Button>
						<Button size="sm" variant="default">Add New Claim</Button>
					</div>
				</Card.Header>
				<Card.Content>
					<!-- Tabs -->
					<div class="mb-4 flex flex-wrap gap-2">
						<Button size="sm" variant="outline" class="rounded-full px-4 py-1.5">To-Do (14)</Button>
						<Button size="sm" variant="outline" class="rounded-full px-4 py-1.5">Pending (4)</Button
						>
						<Button size="sm" variant="outline" class="rounded-full px-4 py-1.5">Denied (2)</Button>
						<Button size="sm" variant="outline" class="rounded-full px-4 py-1.5">Resolved</Button>
						<Button size="sm" variant="default" class="rounded-full px-4 py-1.5">All</Button>
					</div>
					<!-- Claims List -->
					<div class="divide-y rounded-lg border bg-white">
						<!-- Row 1 -->
						<div class="flex flex-wrap items-center gap-2 px-4 py-3">
							<div class="min-w-[180px] flex-1">
								<div class="text-sm font-semibold">Southern Medical Center</div>
								<div class="text-xs text-gray-500">10010 &middot; 23 Sept 2014 &middot; Bobby</div>
							</div>
							<div class="flex min-w-[120px] flex-col gap-1">
								<span
									class="w-fit rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
									>Unpaid</span
								>
								<span class="w-fit rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
									>Docs Recommended</span
								>
							</div>
							<div class="flex min-w-[100px] flex-col items-end">
								<div class="text-xs text-gray-500">Billed</div>
								<div class="text-sm font-medium">$277.67</div>
							</div>
							<div class="flex min-w-[100px] flex-col items-end">
								<div class="text-xs text-gray-500">Unpaid</div>
								<div class="text-base font-semibold text-blue-700">$227.67</div>
							</div>
							<Button size="sm" variant="outline" class="ml-2">Details</Button>
						</div>
						<!-- Row 2 -->
						<div class="flex flex-wrap items-center gap-2 px-4 py-3">
							<div class="min-w-[180px] flex-1">
								<div class="text-sm font-semibold">Valley Emergency Room</div>
								<div class="text-xs text-gray-500">10006 &middot; 16 Sept 2014 &middot; Arnold</div>
							</div>
							<div class="flex min-w-[120px] flex-col gap-1">
								<span
									class="w-fit rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
									>Resolved</span
								>
							</div>
							<div class="flex min-w-[100px] flex-col items-end">
								<div class="text-xs text-gray-500">Billed</div>
								<div class="text-sm font-medium">$227.67</div>
							</div>
							<div class="flex min-w-[100px] flex-col items-end">
								<div class="text-xs text-gray-500">Unpaid</div>
								<div class="text-base font-semibold text-gray-700">$0</div>
							</div>
							<Button size="sm" variant="outline" class="ml-2">Details</Button>
						</div>
						<!-- Row 3 -->
						<div class="flex flex-wrap items-center gap-2 px-4 py-3">
							<div class="min-w-[180px] flex-1">
								<div class="text-sm font-semibold">Mountain Dentistry</div>
								<div class="text-xs text-gray-500">10009 &middot; 3 Sept 2014 &middot; Suzie</div>
							</div>
							<div class="flex min-w-[120px] flex-col gap-1">
								<span
									class="w-fit rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
									>Payment Pending</span
								>
							</div>
							<div class="flex min-w-[100px] flex-col items-end">
								<div class="text-xs text-gray-500">Billed</div>
								<div class="text-sm font-medium">$100.00</div>
							</div>
							<div class="flex min-w-[100px] flex-col items-end">
								<div class="text-xs text-gray-500">Unpaid</div>
								<div class="text-base font-semibold text-blue-700">$25.00</div>
							</div>
							<Button size="sm" variant="outline" class="ml-2">Details</Button>
						</div>
						<!-- Row 4 -->
						<div class="flex flex-wrap items-center gap-2 px-4 py-3">
							<div class="min-w-[180px] flex-1">
								<div class="text-sm font-semibold">River Pharmacy</div>
								<div class="text-xs text-gray-500">10008 &middot; 30 Aug 2014 &middot; Arnold</div>
							</div>
							<div class="flex min-w-[120px] flex-col gap-1">
								<span
									class="w-fit rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
									>Resolved</span
								>
								<span class="w-fit rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
									>Payment Details Recommended</span
								>
							</div>
							<div class="flex min-w-[100px] flex-col items-end">
								<div class="text-xs text-gray-500">Billed</div>
								<div class="text-sm font-medium">$24.67</div>
							</div>
							<div class="flex min-w-[100px] flex-col items-end">
								<div class="text-xs text-gray-500">Unpaid</div>
								<div class="text-base font-semibold text-gray-700">$0</div>
							</div>
							<Button size="sm" variant="outline" class="ml-2">Details</Button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Recent Sales</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-8">
					<div class="flex items-center gap-4">
						<Avatar.Root class="hidden h-9 w-9 sm:flex">
							<Avatar.Image src="/avatars/01.png" alt="Avatar" />
							<Avatar.Fallback>OM</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid gap-1">
							<p class="text-sm leading-none font-medium">Olivia Martin</p>
							<p class="text-muted-foreground text-sm">olivia.martin@email.com</p>
						</div>
						<div class="ml-auto font-medium">+$1,999.00</div>
					</div>
					<div class="flex items-center gap-4">
						<Avatar.Root class="hidden h-9 w-9 sm:flex">
							<Avatar.Image src="/avatars/02.png" alt="Avatar" />
							<Avatar.Fallback>JL</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid gap-1">
							<p class="text-sm leading-none font-medium">Jackson Lee</p>
							<p class="text-muted-foreground text-sm">jackson.lee@email.com</p>
						</div>
						<div class="ml-auto font-medium">+$39.00</div>
					</div>
					<div class="flex items-center gap-4">
						<Avatar.Root class="hidden h-9 w-9 sm:flex">
							<Avatar.Image src="/avatars/03.png" alt="Avatar" />
							<Avatar.Fallback>IN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid gap-1">
							<p class="text-sm leading-none font-medium">Isabella Nguyen</p>
							<p class="text-muted-foreground text-sm">isabella.nguyen@email.com</p>
						</div>
						<div class="ml-auto font-medium">+$299.00</div>
					</div>
					<div class="flex items-center gap-4">
						<Avatar.Root class="hidden h-9 w-9 sm:flex">
							<Avatar.Image src="/avatars/04.png" alt="Avatar" />
							<Avatar.Fallback>WK</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid gap-1">
							<p class="text-sm leading-none font-medium">William Kim</p>
							<p class="text-muted-foreground text-sm">will@email.com</p>
						</div>
						<div class="ml-auto font-medium">+$99.00</div>
					</div>
					<div class="flex items-center gap-4">
						<Avatar.Root class="hidden h-9 w-9 sm:flex">
							<Avatar.Image src="/avatars/05.png" alt="Avatar" />
							<Avatar.Fallback>SD</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid gap-1">
							<p class="text-sm leading-none font-medium">Sofia Davis</p>
							<p class="text-muted-foreground text-sm">sofia.davis@email.com</p>
						</div>
						<div class="ml-auto font-medium">+$39.00</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</main>
</div>
