<script lang="ts">
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Package from 'lucide-svelte/icons/package';
	import House from 'lucide-svelte/icons/house';
	import ShoppingCart from 'lucide-svelte/icons/shopping-cart';
	import Bell from 'lucide-svelte/icons/bell';
	import Menu from 'lucide-svelte/icons/menu';
	import Package2 from 'lucide-svelte/icons/package-2';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { buttonVariants, Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Search } from 'lucide-svelte';

	// Get the sidebar context
	// const sidebar = useSidebar();
</script>

<header class="flex items-center justify-between border-0 bg-white px-6 py-2 md:py-2">
	<!-- Back Arrow and Title -->
	<div class="flex items-center gap-3">
		<button
			class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100"
		>
			<ChevronLeft class="h-5 w-5 text-blue-500" />
		</button>
		<span class="text-xl font-semibold text-gray-900">Appointments View</span>
	</div>
	<!-- Search Box -->

	<div class="flex items-center gap-4">
		<!-- Notification Bell -->
		<button class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
			<Bell class="h-5 w-5 text-gray-400" />
		</button>
		<!-- Profile Card -->
		<div
			class="flex min-w-[170px] cursor-pointer items-center rounded-xl border bg-white px-3 py-2 shadow-xs"
		>
			<img
				src="https://randomuser.me/api/portraits/men/32.jpg"
				alt="Ahmed Kamal"
				class="h-9 w-9 rounded-full border object-cover"
			/>
			<div class="ml-3 flex flex-col">
				<span class="leading-5 font-semibold text-gray-900">Ahmed Kamal</span>
				<span class="text-xs leading-4 text-gray-500">Admin</span>
			</div>
			<svg
				class="ml-3 h-4 w-4 text-gray-400"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
	</div>
</header>

<!-- <Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Button variant="outline" size="icon" class="shrink-0 md:hidden">
			<Menu class="h-5 w-5" />
			<span class="sr-only">Toggle navigation menu</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="left" class="flex flex-col">
		<nav class="grid gap-2 text-lg font-medium">
			<a href="##" class="flex items-center gap-2 text-lg font-semibold">
				<Package2 class="h-6 w-6" />
				<span class="sr-only">Acme Inc</span>
			</a>
			<a
				href="##"
				class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
			>
				<House class="h-5 w-5" />
				Dashboard
			</a>
			<a
				href="##"
				class="bg-muted text-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
			>
				<ShoppingCart class="h-5 w-5" />
				Orders
				<Badge class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
					6
				</Badge>
			</a>
			<a
				href="##"
				class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
			>
				<Package class="h-5 w-5" />
				Products
			</a>
			<a
				href="##"
				class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
			>
				<Users class="h-5 w-5" />
				Customers
			</a>
			<a
				href="##"
				class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
			>
				<ChartLine class="h-5 w-5" />
				Analytics
			</a>
		</nav>
		<div class="mt-auto">
			<Card.Root>
				<Card.Header>
					<Card.Title>Upgrade to Pro</Card.Title>
					<Card.Description>
						Unlock all features and get unlimited access to our support team.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button size="sm" class="w-full">Upgrade</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</Sheet.Content>
</Sheet.Root>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Button variant="secondary" size="icon" class="rounded-full">
			<CircleUser class="h-5 w-5" />
			<span class="sr-only">Toggle user menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Label>My Account</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>Settings</DropdownMenu.Item>
		<DropdownMenu.Item>Support</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>Logout</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root> -->
