<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Feather, Rss, ChevronRight, Calendar, Send, Pencil } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import SlideButton from '$lib/components/SlideButton.svelte';
	import { FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import {
		UserDashboardState,
		abbreviateHospital,
		getCoveragePercentage,
		getAverage,
		getTextColorByValue,
		getRatingColor
	} from '$lib/utils/user-dashboard.svelte.js';

	let { data } = $props();

	const dashboardState = new UserDashboardState(data);

	$effect(() => {
		dashboardState.data = data;
		if (data?.sliders) {
			dashboardState.sliderValues = data.sliders.map(() => [0]);
		}
	});
</script>

<div class="header-poppins flex min-h-screen w-full items-start justify-center gap-8 p-6">
	<div class="flex w-full flex-col gap-6">
		<!-- Two-column layout -->
		<div class="grid grid-cols-4 gap-6">
			<!-- Column 1: Main content (75% width) -->
			<div class="col-span-3 flex flex-col gap-6">
				<!-- Main profile card -->
				<Card.Root class="rounded-2xl bg-white p-0 shadow-md">
					<div class="flex w-full flex-col md:flex-row">
						<!-- Left: Profile and stats -->
						<div class="flex w-full flex-col items-center p-8 md:w-1/3">
							<img
								src={data.user?.image || '/placeholder-avatar-1.svg'}
								alt={data.user?.name}
								class="mb-4 h-20 w-20 rounded-full object-cover"
							/>
							<div class="w-full text-center">
								<h2 class="text-lg font-bold text-gray-800">{data.user?.name || 'User Name'}</h2>
								<div class="mb-4 text-sm text-gray-500">
									{data.user?.phoneNumber || data.userProfile?.phone || 'No phone number'}
								</div>
								<div class="mb-4 text-sm text-gray-500">
									{data.userProfile?.address || 'No address'}
								</div>
							</div>
							<div class="flex w-full flex-col items-center">
								<div class="mb-2 font-semibold text-gray-800">Appointments</div>
								<div class="flex w-full items-center justify-center">
									<div class="flex flex-1 flex-col items-center">
										<span class="text-2xl font-bold text-gray-800"
											>{data.userProfile?.stats?.past ?? 0}</span
										>
										<span class="text-sm text-gray-500">Past</span>
									</div>
									<div class="mx-4 h-10 w-px bg-gray-200"></div>
									<div class="flex flex-1 flex-col items-center">
										<span class="text-2xl font-bold text-gray-800"
											>{data.userProfile?.stats?.upcoming ?? 0}</span
										>
										<span class="text-sm text-gray-500">Upcoming</span>
									</div>
								</div>
							</div>

							<Button
								href="/register"
								class="mt-4 flex w-[90%] items-center justify-center rounded-full bg-blue-600 py-6 text-base font-bold text-white transition-all duration-300 hover:bg-blue-700"
							>
								Edit Profile
								<Pencil class="ml-2 h-4 w-4" />
							</Button>
						</div>
						<!-- Vertical divider -->
						<div class="my-8 hidden w-px bg-gray-200 md:block"></div>
						<!-- Right: Details with horizontal lines -->
						<div class="flex-1 px-8 py-6 text-sm">
							<!-- Tab Navigation -->
							<div class="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
								<button
									class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {dashboardState.activeDetailsTab ===
									'personal'
										? 'bg-white text-gray-900 shadow-sm'
										: 'text-gray-500 hover:text-gray-700'}"
									onclick={() => (dashboardState.activeDetailsTab = 'personal')}
								>
									Personal Details
								</button>
								<button
									class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {dashboardState.activeDetailsTab ===
									'medical'
										? 'bg-white text-gray-900 shadow-sm'
										: 'text-gray-500 hover:text-gray-700'}"
									onclick={() => (dashboardState.activeDetailsTab = 'medical')}
								>
									Medical Details
								</button>
								<button
									class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {dashboardState.activeDetailsTab ===
									'dependents'
										? 'bg-white text-gray-900 shadow-sm'
										: 'text-gray-500 hover:text-gray-700'}"
									onclick={() => (dashboardState.activeDetailsTab = 'dependents')}
								>
									Dependent Details
								</button>
							</div>

							<!-- Tab Content -->
							{#if dashboardState.activeDetailsTab === 'personal'}
								<!-- Personal Details Header -->
								<div class="col-span-4 mb-4 flex justify-between">
									<h2 class="mb-2 text-base font-bold tracking-wide text-gray-700">
										Personal Details
									</h2>

									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger class="rounded-full bg-blue-100 p-2 hover:bg-blue-300">
												<a href="/schedule">
													<Pencil
														class="h-4 w-4 cursor-pointer text-blue-500 hover:text-gray-700"
													/>
												</a>
											</Tooltip.Trigger>
											<Tooltip.Content>
												<p>Edit Profile</p>
											</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
								</div>
								<div class="grid grid-cols-4 gap-x-8 gap-y-2">
									{#each data?.userProfile?.personalDetails || [] as detail}
										<div>
											<div class="text-gray-400">{detail.label}</div>
											<div class="font-medium text-gray-800">{detail.value}</div>
											<hr class="my-2 border-gray-200" />
										</div>
									{/each}
								</div>
							{:else if dashboardState.activeDetailsTab === 'medical'}
								<!-- Medical Details Header -->
								<div class="col-span-4 mb-4 flex justify-between">
									<h2 class="mb-2 text-base font-bold tracking-wide text-gray-700">
										Medical Details
									</h2>

									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger class="rounded-full bg-blue-100 p-2 hover:bg-blue-300">
												<a href="/schedule">
													<Pencil
														class="h-4 w-4 cursor-pointer text-blue-500 hover:text-gray-700"
													/>
												</a>
											</Tooltip.Trigger>
											<Tooltip.Content>
												<p>Edit Profile</p>
											</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
								</div>
								<div class="grid grid-cols-4 gap-x-8 gap-y-2">
									{#each data?.userProfile?.medicalDetails || [] as detail}
										<div>
											<div class="text-gray-400">{detail.label}</div>
											<div class="font-medium text-gray-800">{detail.value}</div>
											<hr class="my-2 border-gray-200" />
										</div>
									{/each}
								</div>
								{#if !data?.userProfile?.medicalDetails || data.userProfile.medicalDetails.length === 0}
									<div class="text-gray-500">No medical details available</div>
								{/if}
							{:else if dashboardState.activeDetailsTab === 'dependents'}
								<!-- Dependent Details Header -->
								<div class="col-span-4 mb-4 flex justify-between">
									<h2 class="mb-2 text-base font-bold tracking-wide text-gray-700">
										Dependent Details
									</h2>

									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger class="rounded-full bg-blue-100 p-2 hover:bg-blue-300">
												<a href="/schedule">
													<Pencil
														class="h-4 w-4 cursor-pointer text-blue-500 hover:text-gray-700"
													/>
												</a>
											</Tooltip.Trigger>
											<Tooltip.Content>
												<p>Edit Profile</p>
											</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
								</div>
								<div class="grid grid-cols-4 gap-x-8 gap-y-2">
									{#each data?.userProfile?.dependentDetails || [] as detail}
										<div>
											<div class="text-gray-400">{detail.label}</div>
											<div class="font-medium text-gray-800">{detail.value}</div>
											<hr class="my-2 border-gray-200" />
										</div>
									{/each}
								</div>
								{#if !data?.userProfile?.dependentDetails || data.userProfile.dependentDetails.length === 0}
									<div class="text-gray-500">No dependent details available</div>
								{/if}
							{/if}
						</div>
					</div>
				</Card.Root>

				<!-- Appointment Table -->
				<Card.Root class="w-full rounded-2xl bg-white p-6 shadow-md">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="header-poppins text-lg font-bold text-gray-800">Appointment</h2>
						<div class="flex items-center gap-2">
							<Input
								placeholder="Filter the table..."
								value={(dashboardState.table.getColumn('facility')?.getFilterValue() as string) ??
									''}
								oninput={(e) =>
									dashboardState.table.getColumn('facility')?.setFilterValue(e.currentTarget.value)}
								class="h-8 max-w-sm"
							/>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="outline" size="sm" class="ml-auto h-8">
											Columns <ChevronDownIcon class="ml-2 h-4 w-4" />
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									{#each dashboardState.table
										.getAllColumns()
										.filter((col) => col.getCanHide()) as column (column.id)}
										<DropdownMenu.CheckboxItem
											class="capitalize"
											bind:checked={
												() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)
											}
										>
											{column.id}
										</DropdownMenu.CheckboxItem>
									{/each}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger class="rounded-full bg-blue-100 p-2 hover:bg-blue-300">
										<a href="/schedule">
											<Calendar class="h-4 w-4 cursor-pointer text-blue-500 hover:text-gray-700" />
										</a>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<a href="/user/appointments">Add appointment</a>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</div>
					</div>

					<div class="rounded-md border">
						<Table.Root>
							<Table.Header>
								{#each dashboardState.table.getHeaderGroups() as headerGroup (headerGroup.id)}
									<Table.Row>
										{#each headerGroup.headers as header (header.id)}
											<Table.Head class="[&:has([role=checkbox])]:pl-3">
												{#if !header.isPlaceholder}
													<FlexRender
														content={header.column.columnDef.header}
														context={header.getContext()}
													/>
												{/if}
											</Table.Head>
										{/each}
									</Table.Row>
								{/each}
							</Table.Header>
							<Table.Body>
								{#each dashboardState.table.getRowModel().rows as row (row.id)}
									<Table.Row data-state={row.getIsSelected() && 'selected'}>
										{#each row.getVisibleCells() as cell (cell.id)}
											<Table.Cell>
												<FlexRender
													content={cell.column.columnDef.cell}
													context={cell.getContext()}
												/>
											</Table.Cell>
										{/each}
									</Table.Row>
								{:else}
									<Table.Row>
										<Table.Cell
											colspan={dashboardState.table.getAllColumns().length}
											class="h-24 text-center"
										>
											No results.
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				</Card.Root>

				<Sheet.Root bind:open={dashboardState.sheetOpen}>
					<Sheet.Content
						class="fixed right-0 top-0 z-50 h-full w-[50vw] max-w-none overflow-y-auto bg-white shadow-lg sm:w-[50vw]"
					>
						<Sheet.Header class="border-b px-6 py-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div class="relative">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500"
										>
											<span class="text-sm font-medium text-white">
												{dashboardState.selectedAppointment
													? abbreviateHospital(dashboardState.selectedAppointment.facility).slice(
															0,
															2
														)
													: 'GH'}
											</span>
										</div>
										<div
											class="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500"
										>
											<span class="text-xs">🏥</span>
										</div>
									</div>
									<div>
										<h3 class="text-nowrap font-semibold text-gray-900">
											{dashboardState.selectedAppointment
												? dashboardState.selectedAppointment.facility
												: 'General Hospital Lagos'}
										</h3>
										<p class="text-xs text-gray-500">
											{dashboardState.selectedAppointment
												? `${dashboardState.selectedAppointment.date} • ${dashboardState.selectedAppointment.time}`
												: 'Victoria Island, Lagos State'}
										</p>
										<div class="mt-1 flex items-center space-x-4">
											<div class="flex items-center space-x-1">
												<div class="h-4 w-4 rounded-full bg-blue-400"></div>
												<span class="text-nowrap text-xs text-gray-700">
													{dashboardState.selectedAppointment
														? dashboardState.selectedAppointment.unit
														: 'Cardiology'}
												</span>
											</div>
											<div class="flex items-center space-x-1">
												<span class="text-nowrap text-xs text-gray-700">
													{dashboardState.selectedAppointment
														? dashboardState.selectedAppointment.type
														: 'Regular checkup'}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Sheet.Header>
						<!-- rating hospital service -->
						<div class="grid flex-1 auto-rows-min gap-6 px-4">
							<div class="grid gap-3">
								<Card.Root class="overflow-hidden">
									<Card.Header
										class="-mb-4 flex h-[20px] min-h-0 items-center justify-between border-b "
									>
										<h2 class="text-lg font-semibold">Rate Hospital Services</h2>
										<Rss class="ml-1 h-5 w-5 text-gray-400" />
									</Card.Header>
									<Card.Content>
										{#each data.sliders as slider, index}
											<div class="px-0">
												<h3 class=" mb-2 text-sm font-medium text-gray-700">
													{slider.title}
												</h3>
												<div class="mb-1 flex items-center justify-between">
													<span class="text-sm font-semibold text-gray-900">
														{dashboardState.sliderValues[index][0]}/10
													</span>
													<span
														class={`text-xs font-semibold ${getTextColorByValue(dashboardState.sliderValues[index][0])}`}
													>
														Average: {getAverage(dashboardState.sliderValues[index][0])}
													</span>
												</div>
												<div class="  py-2">
													<Slider
														type="single"
														bind:value={dashboardState.sliderValues[index]}
														min={0}
														max={10}
														step={1}
														thayzeRatingColor={dashboardState.sliderValues[index][0]}
														thayzeGetRatingColor={getRatingColor}
														class="w-full"
													/>
												</div>
											</div>
											{#if index < data.sliders.length - 1}
												<div class="mx-0 my-4 -ml-6 -mr-6">
													<Separator orientation="horizontal" class="w-full" />
												</div>
											{/if}
										{/each}
									</Card.Content>
								</Card.Root>

								<Card.Root class="p-3">
									<div class="flex items-center justify-between">
										<h3 class="text-base font-medium text-gray-700">Additional Information</h3>
										<Switch bind:checked={dashboardState.showFeedback} />
									</div>
									{#if dashboardState.showFeedback}
										<textarea
											class=" h-34 w-full resize-none rounded-md border border-gray-300 p-2 text-sm"
											placeholder="Please share your feedback about the services..."
										></textarea>
									{/if}
								</Card.Root>
							</div>
						</div>
						<Sheet.Footer class="border-t bg-gray-50 px-6 py-4">
							<Sheet.Close
								class="w-full cursor-pointer rounded-full bg-blue-600 py-3 text-white hover:bg-blue-700"
								>Submit your feedback</Sheet.Close
							>
						</Sheet.Footer>
					</Sheet.Content>
				</Sheet.Root>
			</div>
			<!-- Column 2: Sidebar content (25% width) -->
			<div class="col-span-1 flex flex-col gap-6">
				<!-- Assurance Card -->
				<Card.Root
					class="relative w-full rounded-2xl p-5 shadow-md"
					style="background: linear-gradient(135deg, #1e3cff 0%, #2d6aff 100%); min-height: 140px;"
				>
					<!-- Top Row: Logo and Check -->
					<div class="mb-2 flex items-start justify-between">
						<h2 class="flex items-center gap-2 text-lg font-semibold text-white">
							<Feather class="h-5 w-5" />
							<span>{data.userProfile?.insuranceCard?.provider || 'Provider'}</span>
						</h2>
						<span class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
							<svg
								class="h-4 w-4 text-white"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</span>
					</div>
					<!-- Card Number -->
					<div class="mb-4 mt-2">
						<div class="mb-1 text-xs font-medium text-white/80">Enrolee ID</div>
						<div class="flex items-center gap-2">
							<span class="text-lg font-semibold tracking-widest text-white md:text-xl"
								>{data.userProfile?.insuranceCard?.enrolleeId || '0000 0000 0000'}</span
							>
							<svg
								class="h-4 w-4 text-white/70"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<rect x="9" y="9" width="13" height="13" rx="2" />
								<rect x="3" y="3" width="13" height="13" rx="2" />
							</svg>
						</div>
					</div>
					<!-- Expiry, CVC, Mastercard -->
					<div class="mt-2 flex items-end justify-between">
						<div>
							<div class="text-xs text-white/80">Exp Date</div>
							<div class="flex items-center gap-2">
								<span class="text-sm font-semibold text-white"
									>{data.userProfile?.insuranceCard?.expiryDate || 'MM/YY'}</span
								>
								<svg
									class="h-4 w-4 text-white/70"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
								>
									<rect x="9" y="9" width="13" height="13" rx="2" />
									<rect x="3" y="3" width="13" height="13" rx="2" />
								</svg>
							</div>
						</div>
						<div>
							<div class="text-xs text-white/80">CVC</div>
							<div class="flex items-center gap-2"></div>
						</div>
						<div class="flex flex-col items-end">
							<div class="flex items-center gap-1">
								<!-- Mastercard logo -->
								<span class="inline-block h-7 w-7 rounded-full bg-[#ff5f00]"></span>
								<span class="-ml-3 inline-block h-7 w-7 rounded-full bg-[#f9bc15]"></span>
							</div>
							<span class="mt-1 text-xs text-white/80"
								>{data.userProfile?.insuranceCard?.planTier || 'Tier'}</span
							>
						</div>
					</div>
				</Card.Root>

				<!-- Medications Card -->
				<Card.Root>
					<Card.Header class="flex h-[35px] min-h-0 items-center justify-between border-b pb-1.5">
						<h2 class="text-lg font-semibold">Service Timeline</h2>
						<ChevronRight class="ml-1 h-5 w-5 text-gray-400" />
					</Card.Header>
					<Card.Content class="px-4 py-0">
						<div class="relative">
							<!-- Vertical Timeline Line -->
							<div class="absolute bottom-0 left-4 top-0 w-px bg-gray-200"></div>

							<div class="space-y-0">
								{#each data.serviceTimeline as service}
									<div class="relative flex items-center gap-3 py-3 hover:bg-gray-50">
										<div
											class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full {service.status ===
											'completed'
												? 'bg-blue-100'
												: 'border-2 border-gray-300 bg-white'}"
										>
											<div
												class="h-2 w-2 rounded-full {service.status === 'completed'
													? 'bg-blue-500'
													: 'bg-gray-400'}"
											></div>
										</div>
										<div class="flex-1">
											<div class="text-sm font-medium text-gray-900">{service.title}</div>
											<div class="mt-0.5 text-xs text-gray-400">{service.details}</div>
											<div class="text-xs text-gray-500">{service.date}</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>
