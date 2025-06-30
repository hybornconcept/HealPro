<script lang="ts">
	import {
		ChevronLeft,
		ChevronRight,
		Copy,
		CreditCard,
		File,
		House,
		ChartLine,
		ListFilter,
		EllipsisVertical,
		Package,
		Package2,
		PanelLeft,
		Search,
		Settings,
		ShoppingCart,
		Truck,
		Activity,
		Calendar,
		Clock,
		MapPin,
		XCircle,
		Pencil,
		Pill,
		Stethoscope
	} from '@lucide/svelte';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
</script>

<div class="bg-muted/40 flex min-h-screen w-full flex-col">
	<div class="flex flex-col sm:gap-4 sm:py-4">
		<main class="flex flex-1 items-start gap-8 p-8 sm:px-12 sm:py-0">
			<div class="flex-col">
				<div class="flex w-full gap-4">
					<!-- Appointments Card -->
					<Card.Root class="w-[35%] max-w-sm min-w-[320px] flex-shrink-0 ">
						<Card.Header class="flex h-[35px] min-h-0 items-center justify-between border-b pb-1.5">
							<h2 class="text-lg font-semibold">Appointments</h2>
							<Calendar class="ml-1 h-5 w-5 text-gray-400" />
						</Card.Header>
						<Card.Content class="px-6 py-2">
							<div class="mb-4 flex items-center gap-3">
								<img
									src="https://randomuser.me/api/portraits/men/32.jpg"
									alt="Dr Ramadi Entersiliokaz"
									class="h-11 w-11 rounded-full border object-cover"
								/>
								<div>
									<div class="text-base leading-tight font-semibold">Dr Ramadi Entersiliokaz</div>
									<div class="text-xs text-gray-500">Gastroenterologist</div>
								</div>
							</div>
							<div class="mb-2 grid grid-cols-2 gap-2">
								<div>
									<div class="mb-0.5 text-xs text-gray-500">Date</div>
									<div class="text-sm font-medium">Friday 17 May, 2020</div>
								</div>
								<div>
									<div class="mb-0.5 text-xs text-gray-500">Time</div>
									<div class="flex items-center gap-2">
										<span class="text-sm font-medium">9:30am - 10:00am</span>
										<span class="flex items-center gap-1 text-xs font-medium text-blue-600">
											<Clock class="h-3.5 w-3.5" />
											30mins
										</span>
									</div>
								</div>
							</div>
							<div class="mb-2 grid grid-cols-2 gap-2">
								<div>
									<div class="mb-0.5 text-xs text-gray-500">Address</div>
									<div class="text-sm leading-snug">
										Suite 405, Level 4/188<br />
										Edward St, Sydney<br />
										NSW
									</div>
								</div>
								<div>
									<div class="mb-0.5 text-xs text-gray-500">Areas of Interest</div>
									<ul class="list-inside list-disc space-y-0.5 text-sm text-gray-700">
										<li>Mens health</li>
										<li>Travel medicine</li>
										<li>Travel advice</li>
										<li>General practice</li>
									</ul>
								</div>
							</div>
							<div class="mt-5 flex items-center gap-6">
								<button class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
									<XCircle class="h-4 w-4" />
									<span>Cancel Booking</span>
								</button>
								<button class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
									<Pencil class="h-4 w-4" />
									<span>Reschedule</span>
								</button>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Recent Activity Card -->
					<Card.Root class="w-[65%]">
						<Card.Header
							class="flex h-[35px]  min-h-0 items-center justify-between border-b pb-1.5"
						>
							<h2 class="text-lg font-semibold">Recent Activity</h2>
							<Activity class="ml-1 h-5 w-5 text-gray-400" />
						</Card.Header>
						<Card.Content class="p-6">
							<div class="space-y-6">
								<!-- Activity 1 -->
								<div class="flex items-start gap-4 border-b pb-4 last:border-b-0">
									<img
										src="https://randomuser.me/api/portraits/men/32.jpg"
										alt="Dr Entersiliokaz"
										class="h-10 w-10 rounded-full object-cover"
									/>
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<span class="text-base font-medium">Dr Entersiliokaz</span>
											<span class="text-xs text-gray-400">03 May, 2020</span>
										</div>
										<div class="mt-1 text-sm text-gray-700">
											Dr Ramadi Entersiliokaz added two new conditons to your health record on the
											09 May regarding your symptoms
										</div>
									</div>
								</div>
								<!-- Activity 2 -->
								<div class="flex items-start gap-4 border-b pb-4 last:border-b-0">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
										<span class="text-lg font-bold text-green-600">m</span>
									</div>
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<span class="text-base font-medium">Medicare</span>
											<span class="text-xs text-gray-400">24 Apr, 2020</span>
										</div>
										<div class="mt-1 text-sm text-gray-700">
											Medicare has sent a benefit of $132.44 for item
											<span
												class="ml-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
											>
												3566
											</span>
										</div>
									</div>
								</div>
								<!-- Activity 3 -->
								<div class="flex items-start gap-4">
									<img
										src="https://randomuser.me/api/portraits/men/33.jpg"
										alt="Dr Kalish"
										class="h-10 w-10 rounded-full object-cover"
									/>
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<span class="text-base font-medium">Dr Kalish</span>
											<span class="text-xs text-gray-400">17 Apr, 2020</span>
										</div>
										<div class="mt-1 text-sm text-gray-700">
											Dr Kalish has updated the prescription of
											<span
												class="mx-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
											>
												Alfousin
											</span>
											from 8mg to 10mg
										</div>
										<div class="mt-2 rounded border bg-gray-50 px-3 py-2 text-xs text-gray-500">
											Note: "This increase should help manage some of the pain as well as the
											inflammation. Be sure to take with food and try and avoid direct sun exposure
											if possible."
										</div>
									</div>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
				<div class="mt-6 grid grid-cols-3 gap-6">
					<!-- Medications Card -->
					<Card.Root>
						<Card.Header class="flex h-[35px] min-h-0 items-center justify-between border-b pb-1.5">
							<h2 class="text-lg font-semibold">Medications</h2>
							<Pill class="ml-1 h-5 w-5 text-gray-400" />
						</Card.Header>
						<Card.Content class="px-6 py-0">
							<div class="space-y-3">
								<div class="relative flex flex-col gap-1 rounded-xl border bg-white p-4 shadow-sm">
									<div class="text-base font-semibold">Fenofibrate (48mq)</div>
									<div class="text-sm text-gray-500">Take with food every morning.</div>
									<a href="#" class="mt-1 text-xs font-medium text-blue-600"
										>Last Refil 27 Apr, 2020</a
									>
									<button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
										<EllipsisVertical class="h-5 w-5" />
									</button>
								</div>
								<div class="relative flex flex-col gap-1 rounded-xl border bg-white p-4 shadow-sm">
									<div class="text-base font-semibold">Alfuzosin (10mg)</div>
									<div class="text-sm text-gray-500">
										Take 1 with food twice a day, and avoid drinking alcohol for 2 hours after
									</div>
									<a href="#" class="mt-1 text-xs font-medium text-blue-600"
										>Last Refil 27 Apr, 2020</a
									>
									<button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
										<EllipsisVertical class="h-5 w-5" />
									</button>
								</div>
								<div class="relative flex flex-col gap-1 rounded-xl border bg-white p-4 shadow-sm">
									<div class="text-base font-semibold">Dexamethasone (4mg)</div>
									<div class="text-sm text-gray-500">Take 3 tablets, 3 times a day for 7 days</div>
									<a href="#" class="mt-1 text-xs font-medium text-blue-600"
										>Last Refil 27 Apr, 2020</a
									>
									<button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
										<EllipsisVertical class="h-5 w-5" />
									</button>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
					<!-- Current Conditions Card -->
					<Card.Root>
						<Card.Header class="flex h-[35px] min-h-0 items-center justify-between border-b pb-1.5">
							<h2 class="text-lg font-semibold">Current Conditions</h2>
							<Stethoscope class="ml-1 h-5 w-5 text-gray-400" />
						</Card.Header>
						<Card.Content class="px-6 py-0">
							<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
								<EllipsisVertical class="h-5 w-5" />
							</button>
							<span
								class="mb-2 inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700"
							>
								Moderate
							</span>
							<div class="mb-1 text-2xl font-semibold">Sinusitis</div>
							<div class="mb-4 text-sm text-gray-500">
								A condition in which the cavities around the nasal passages become inflamed
							</div>
							<div class="mb-4 grid grid-cols-2 gap-4">
								<div>
									<div class="mb-0.5 text-xs text-gray-500">Primary</div>
									<div class="flex items-center gap-2">
										<img
											src="https://randomuser.me/api/portraits/men/33.jpg"
											alt="Dr Steven Kalish"
											class="h-7 w-7 rounded-full object-cover"
										/>
										<span class="text-sm font-medium">Dr Steven Kalish</span>
									</div>
								</div>
								<div>
									<div class="mb-0.5 text-xs text-gray-500">Last seen</div>
									<div class="text-sm font-medium">05 Mar, 2020</div>
								</div>
							</div>
							<div class="grid grid-cols-2 items-end gap-4">
								<div>
									<div class="mb-0.5 text-xs text-gray-500">Treatment</div>
									<div class="text-sm font-medium">Nasonex Aerosol</div>
									<div class="text-xs text-gray-500">Mometasone furate 50mcg/spray</div>
								</div>
								<div class="flex justify-end">
									<button
										class="rounded-lg border px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
									>
										Schedule
									</button>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
					<!-- Recent Bills Card -->
					<Card.Root>
						<Card.Header class="flex h-[35px] min-h-0 items-center justify-between border-b pb-1.5">
							<h2 class="text-lg font-semibold">Recent Bills</h2>
							<CreditCard class="ml-1 h-5 w-5 text-gray-400" />
						</Card.Header>
						<Card.Content class="px-6 py-0">
							<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
								<EllipsisVertical class="h-5 w-5" />
							</button>
							<div class="mb-2 flex items-center gap-8">
								<div>
									<div class="text-xs text-gray-500">Your payment</div>
									<div class="text-2xl font-semibold">$110.00</div>
								</div>
								<div>
									<div class="text-xs text-gray-500">Medicare</div>
									<div class="text-lg font-semibold">$124.00</div>
								</div>
							</div>
							<div class="mb-2 flex items-center gap-8">
								<div class="text-xs text-gray-500">
									Paid on the 27 april, 2020 to
									<span class="font-medium text-blue-600">Dorian Med Pty Ltd</span>
								</div>
								<div class="text-xs text-gray-500">
									Total
									<span class="ml-1 text-base font-semibold text-gray-900">$234.00</span>
								</div>
							</div>
							<div class="mt-3 flex items-center gap-3">
								<img
									src="https://randomuser.me/api/portraits/men/32.jpg"
									alt="Dr Perry Alkanzas Dorian"
									class="h-8 w-8 rounded-full object-cover"
								/>
								<div>
									<div class="text-sm font-medium">Dr Perry Alkanzas Dorian</div>
									<div class="text-xs text-gray-500">Otolaryngologist</div>
								</div>
							</div>
							<div class="mt-2 flex items-center gap-2">
								<MapPin class="h-4 w-4 text-gray-400" />
								<span class="text-xs text-gray-500"
									>Suite 206/203-233 New King James Rd, Edgecliff NSW 2027</span
								>
							</div>
							<a href="#" class="mt-2 block text-xs text-blue-600 underline"
								>Standard ENT Consult.pdf</a
							>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</main>
	</div>
</div>
