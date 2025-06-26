<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import {
		TrendingUp,
		Users,
		Calendar,
		Bed,
		ChevronLeft,
		ChevronRight,
		ChevronDown,
		MoreHorizontal,
		ArrowUp,
		ArrowDown
	} from '@lucide/svelte';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { scaleUtc } from 'd3-scale';
	import { BarChart, type ChartContextValue, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	// import { scaleUtc } from 'layerchart';

	let { data }: { data: PageData } = $props();

	// Calendar state
	let currentWeek = $state(0);

	// Calendar days for the week view
	const calendarDays = [
		{ day: 'SAT', date: 13, isToday: false },
		{ day: 'SUN', date: 14, isToday: false },
		{ day: 'MON', date: 15, isToday: false },
		{ day: 'TUE', date: 16, isToday: false },
		{ day: 'WED', date: 17, isToday: false },
		{ day: 'THU', date: 18, isToday: false },
		{ day: 'FRI', date: 19, isToday: false },
		{ day: 'SAT', date: 20, isToday: true },
		{ day: 'SUN', date: 22, isToday: false },
		{ day: 'MON', date: 23, isToday: false },
		{ day: 'TUE', date: 24, isToday: false }
	];

	// Chart data and configuration
	const chartData = [
		{ date: new Date('2024-04-01'), desktop: 222, mobile: 150 },
		{ date: new Date('2024-04-02'), desktop: 97, mobile: 180 },
		{ date: new Date('2024-04-03'), desktop: 167, mobile: 120 },
		{ date: new Date('2024-04-04'), desktop: 242, mobile: 260 },
		{ date: new Date('2024-04-05'), desktop: 373, mobile: 290 },
		{ date: new Date('2024-04-06'), desktop: 301, mobile: 340 },
		{ date: new Date('2024-04-07'), desktop: 245, mobile: 180 },
		{ date: new Date('2024-04-08'), desktop: 409, mobile: 320 },
		{ date: new Date('2024-04-09'), desktop: 59, mobile: 110 },
		{ date: new Date('2024-04-10'), desktop: 261, mobile: 190 },
		{ date: new Date('2024-04-11'), desktop: 327, mobile: 350 },
		{ date: new Date('2024-04-12'), desktop: 292, mobile: 210 },
		{ date: new Date('2024-04-13'), desktop: 342, mobile: 380 },
		{ date: new Date('2024-04-14'), desktop: 137, mobile: 220 },
		{ date: new Date('2024-04-15'), desktop: 120, mobile: 170 },
		{ date: new Date('2024-04-16'), desktop: 138, mobile: 190 },
		{ date: new Date('2024-04-17'), desktop: 446, mobile: 360 },
		{ date: new Date('2024-04-18'), desktop: 364, mobile: 410 },
		{ date: new Date('2024-04-19'), desktop: 243, mobile: 180 },
		{ date: new Date('2024-04-20'), desktop: 89, mobile: 150 },
		{ date: new Date('2024-04-21'), desktop: 137, mobile: 200 },
		{ date: new Date('2024-04-22'), desktop: 224, mobile: 170 },
		{ date: new Date('2024-04-23'), desktop: 138, mobile: 230 },
		{ date: new Date('2024-04-24'), desktop: 387, mobile: 290 },
		{ date: new Date('2024-04-25'), desktop: 215, mobile: 250 },
		{ date: new Date('2024-04-26'), desktop: 75, mobile: 130 },
		{ date: new Date('2024-04-27'), desktop: 383, mobile: 420 },
		{ date: new Date('2024-04-28'), desktop: 122, mobile: 180 },
		{ date: new Date('2024-04-29'), desktop: 315, mobile: 240 },
		{ date: new Date('2024-04-30'), desktop: 454, mobile: 380 },
		{ date: new Date('2024-05-01'), desktop: 165, mobile: 220 },
		{ date: new Date('2024-05-02'), desktop: 293, mobile: 310 },
		{ date: new Date('2024-05-03'), desktop: 247, mobile: 190 },
		{ date: new Date('2024-05-04'), desktop: 385, mobile: 420 },
		{ date: new Date('2024-05-05'), desktop: 481, mobile: 390 },
		{ date: new Date('2024-05-06'), desktop: 498, mobile: 520 },
		{ date: new Date('2024-05-07'), desktop: 388, mobile: 300 },
		{ date: new Date('2024-05-08'), desktop: 149, mobile: 210 },
		{ date: new Date('2024-05-09'), desktop: 227, mobile: 180 },
		{ date: new Date('2024-05-10'), desktop: 293, mobile: 330 },
		{ date: new Date('2024-05-11'), desktop: 335, mobile: 270 },
		{ date: new Date('2024-05-12'), desktop: 197, mobile: 240 },
		{ date: new Date('2024-05-13'), desktop: 197, mobile: 160 },
		{ date: new Date('2024-05-14'), desktop: 448, mobile: 490 },
		{ date: new Date('2024-05-15'), desktop: 473, mobile: 380 },
		{ date: new Date('2024-05-16'), desktop: 338, mobile: 400 },
		{ date: new Date('2024-05-17'), desktop: 499, mobile: 420 },
		{ date: new Date('2024-05-18'), desktop: 315, mobile: 350 },
		{ date: new Date('2024-05-19'), desktop: 235, mobile: 180 },
		{ date: new Date('2024-05-20'), desktop: 177, mobile: 230 },
		{ date: new Date('2024-05-21'), desktop: 82, mobile: 140 },
		{ date: new Date('2024-05-22'), desktop: 81, mobile: 120 },
		{ date: new Date('2024-05-23'), desktop: 252, mobile: 290 },
		{ date: new Date('2024-05-24'), desktop: 294, mobile: 220 },
		{ date: new Date('2024-05-25'), desktop: 201, mobile: 250 },
		{ date: new Date('2024-05-26'), desktop: 213, mobile: 170 },
		{ date: new Date('2024-05-27'), desktop: 420, mobile: 460 },
		{ date: new Date('2024-05-28'), desktop: 233, mobile: 190 },
		{ date: new Date('2024-05-29'), desktop: 78, mobile: 130 },
		{ date: new Date('2024-05-30'), desktop: 340, mobile: 280 },
		{ date: new Date('2024-05-31'), desktop: 178, mobile: 230 },
		{ date: new Date('2024-06-01'), desktop: 178, mobile: 200 },
		{ date: new Date('2024-06-02'), desktop: 470, mobile: 410 },
		{ date: new Date('2024-06-03'), desktop: 103, mobile: 160 },
		{ date: new Date('2024-06-04'), desktop: 439, mobile: 380 },
		{ date: new Date('2024-06-05'), desktop: 88, mobile: 140 },
		{ date: new Date('2024-06-06'), desktop: 294, mobile: 250 },
		{ date: new Date('2024-06-07'), desktop: 323, mobile: 370 },
		{ date: new Date('2024-06-08'), desktop: 385, mobile: 320 },
		{ date: new Date('2024-06-09'), desktop: 438, mobile: 480 },
		{ date: new Date('2024-06-10'), desktop: 155, mobile: 200 },
		{ date: new Date('2024-06-11'), desktop: 92, mobile: 150 },
		{ date: new Date('2024-06-12'), desktop: 492, mobile: 420 },
		{ date: new Date('2024-06-13'), desktop: 81, mobile: 130 },
		{ date: new Date('2024-06-14'), desktop: 426, mobile: 380 },
		{ date: new Date('2024-06-15'), desktop: 307, mobile: 350 },
		{ date: new Date('2024-06-16'), desktop: 371, mobile: 310 },
		{ date: new Date('2024-06-17'), desktop: 475, mobile: 520 },
		{ date: new Date('2024-06-18'), desktop: 107, mobile: 170 },
		{ date: new Date('2024-06-19'), desktop: 341, mobile: 290 },
		{ date: new Date('2024-06-20'), desktop: 408, mobile: 450 },
		{ date: new Date('2024-06-21'), desktop: 169, mobile: 210 },
		{ date: new Date('2024-06-22'), desktop: 317, mobile: 270 },
		{ date: new Date('2024-06-23'), desktop: 480, mobile: 530 },
		{ date: new Date('2024-06-24'), desktop: 132, mobile: 180 },
		{ date: new Date('2024-06-25'), desktop: 141, mobile: 190 },
		{ date: new Date('2024-06-26'), desktop: 434, mobile: 380 },
		{ date: new Date('2024-06-27'), desktop: 448, mobile: 490 },
		{ date: new Date('2024-06-28'), desktop: 149, mobile: 200 },
		{ date: new Date('2024-06-29'), desktop: 103, mobile: 160 },
		{ date: new Date('2024-06-30'), desktop: 446, mobile: 400 }
	];

	const chartConfig = {
		views: { label: 'Page Views', color: '' },
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;

	let context = $state<ChartContextValue>();
	let activeChart = $state<keyof typeof chartConfig>('desktop');

	const total = $derived({
		desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
		mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0)
	});

	const activeSeries = $derived([
		{
			key: activeChart,
			label: chartConfig[activeChart].label,
			color: chartConfig[activeChart].color
		}
	]);
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl">
		<!-- Main Content -->
		<main class="p-6">
			<div class="flex gap-4">
				<!-- Main Dashboard Content -->
				<div class="flex-1">
					<!-- Stats Cards Row -->
					<div class="mb-6 flex gap-2">
						<!-- Interactive Chart Card (50%) -->
						<div class="w-2/3">
							<Card.Root>
								<Card.Header class="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
									<div
										class="flex flex-1 flex-col justify-center gap-1 px-6 py-[10px] sm:py-[12px]"
									>
										<Card.Title>Bar Chart - Interactive</Card.Title>
										<Card.Description>Showing total visitors for the last 3 months</Card.Description
										>
									</div>
									<div class="flex">
										{#each ['desktop', 'mobile'] as key (key)}
											{@const chart = key as keyof typeof chartConfig}
											<button
												data-active={activeChart === chart}
												class="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-[8px] text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-[12px]"
												onclick={() => (activeChart = chart)}
											>
												<span class="text-muted-foreground text-xs">
													{chartConfig[chart].label}
												</span>
												<span class="text-lg leading-none font-bold sm:text-2xl">
													{total[key as keyof typeof total].toLocaleString()}
												</span>
											</button>
										{/each}
									</div>
								</Card.Header>
								<Card.Content class="px-2 sm:p-6">
									<Chart.Container config={chartConfig} class="aspect-auto h-[120px] w-full">
										<BarChart
											bind:context
											data={chartData}
											x="date"
											axis="x"
											series={activeSeries}
											props={{
												bars: {
													stroke: 'none',
													rounded: 'none',
													// use the height of the chart to animate the bars
													initialY: context?.height,
													initialHeight: 0,
													motion: {
														y: { type: 'tween', duration: 500, easing: cubicInOut },
														height: { type: 'tween', duration: 500, easing: cubicInOut }
													}
												},
												highlight: { area: { fill: 'none' } },
												xAxis: {
													format: (d: Date) => {
														return d.toLocaleDateString('en-US', {
															month: 'short',
															day: '2-digit'
														});
													},
													ticks: (scale) => {
														// Ensure we get a reasonable number of ticks
														return scale?.ticks?.(5) || [];
													},
													show: true,
													gridlines: true,
													axisLine: true,
													tickSize: 5,
													labelOffset: 8,
													labelPadding: 4,
													labelRotation: -45,
													labelClass: 'text-xs font-medium'
												}
											}}
										>
											{#snippet belowMarks()}
												<Highlight area={{ class: 'fill-muted' }} />
											{/snippet}
											{#snippet tooltip()}
												<Chart.Tooltip
													nameKey="views"
													labelFormatter={(v: Date) => {
														return v.toLocaleDateString('en-US', {
															month: 'short',
															day: 'numeric',
															year: 'numeric'
														});
													}}
												/>
											{/snippet}
										</BarChart>
									</Chart.Container>
								</Card.Content>
								<Card.Footer>
									<div class="flex w-full items-start gap-2 text-xs">
										<div class="grid gap-2">
											<div class="flex items-center gap-2 leading-none font-medium">
												Trending up by 5.2% this month <TrendingUpIcon class="size-3.5" />
											</div>
											<div class="text-muted-foreground flex items-center gap-2 leading-none">
												Showing total visitors for the last 6 months
											</div>
										</div>
									</div>
								</Card.Footer>
							</Card.Root>
						</div>
						<!-- Other Cards (50%) -->
						<div class="grid w-1/3 grid-cols-2 grid-rows-2 gap-2">
							<!-- Overall Visitors Card -->
							<Card.Root class="flex flex-col justify-between p-3">
								<Card.Content class="flex h-full flex-col p-0">
									<div class="mb-1 flex items-center justify-between">
										<h3 class="text-xs font-medium text-gray-600">Overall visitors</h3>
										<Button variant="ghost" size="icon" class="h-5 w-5">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>
									<div class="mb-1 flex items-center gap-2">
										<span class="text-lg font-bold"
											>{data.stats.overallVisitors.toLocaleString()}</span
										>
										<span
											class="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600"
										>
											<ArrowUp class="h-3 w-3" />
											{data.stats.visitorsIncrease}%
										</span>
									</div>
									<div class="text-[11px] text-gray-500">Obtaining data for 1 month</div>
									<div class="mt-1 flex justify-end">
										<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
											<ArrowUp class="h-4 w-4 text-white" />
										</div>
									</div>
								</Card.Content>
							</Card.Root>
							<!-- Book Appointment Card -->
							<Card.Root class="flex flex-col justify-between p-3">
								<Card.Content class="flex h-full flex-col p-0">
									<div class="mb-1 flex items-center justify-between">
										<h3 class="text-xs font-medium text-gray-600">Book appointment</h3>
										<Button variant="ghost" size="icon" class="h-5 w-5">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>
									<div class="mb-1 text-lg font-bold">{data.stats.bookAppointments}</div>
									<div class="text-[11px] text-gray-500">Data per 16 Jan 2024</div>
									<div class="mt-1 flex justify-end">
										<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
											<ArrowUp class="h-4 w-4 text-white" />
										</div>
									</div>
								</Card.Content>
							</Card.Root>
							<!-- Total Patients Card -->
							<Card.Root class="flex flex-col justify-between p-3">
								<Card.Content class="flex h-full flex-col p-0">
									<div class="mb-1 flex items-center justify-between">
										<h3 class="text-xs font-medium text-gray-600">Total patients</h3>
										<Button variant="ghost" size="icon" class="h-5 w-5">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>
									<div class="mb-1 text-lg font-bold">{data.stats.totalPatients}</div>
									<div class="text-[11px] text-gray-500">Data per 16 Jan 2024</div>
									<div class="mt-1 flex justify-end">
										<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
											<ArrowUp class="h-4 w-4 text-white" />
										</div>
									</div>
								</Card.Content>
							</Card.Root>
							<!-- Room Availability Card -->
							<Card.Root class="flex flex-col justify-between p-3">
								<Card.Content class="flex h-full flex-col p-0">
									<div class="mb-1 flex items-center justify-between">
										<h3 class="text-xs font-medium text-gray-600">Room availability</h3>
										<Button variant="ghost" size="icon" class="h-5 w-5">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>
									<div class="mb-1 text-lg font-bold">
										{data.stats.roomAvailability.available}
										<span class="font-normal text-gray-400"
											>/{data.stats.roomAvailability.total}</span
										>
									</div>
									<div class="text-[11px] text-gray-500">Data per 16 Jan 2024</div>
									<div class="mt-1 flex justify-end">
										<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
											<ArrowUp class="h-4 w-4 text-white" />
										</div>
									</div>
								</Card.Content>
							</Card.Root>
							<Card.Root class="flex flex-col justify-between p-3">
								<Card.Content class="flex h-full flex-col p-0">
									<div class="mb-1 flex items-center justify-between">
										<h3 class="text-xs font-medium text-gray-600">Total patients</h3>
										<Button variant="ghost" size="icon" class="h-5 w-5">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>
									<div class="mb-1 text-lg font-bold">{data.stats.totalPatients}</div>
									<div class="text-[11px] text-gray-500">Data per 16 Jan 2024</div>
									<div class="mt-1 flex justify-end">
										<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
											<ArrowUp class="h-4 w-4 text-white" />
										</div>
									</div>
								</Card.Content>
							</Card.Root>
							<!-- Room Availability Card -->
							<Card.Root class="flex flex-col justify-between p-3">
								<Card.Content class="flex h-full flex-col p-0">
									<div class="mb-1 flex items-center justify-between">
										<h3 class="text-xs font-medium text-gray-600">Room availability</h3>
										<Button variant="ghost" size="icon" class="h-5 w-5">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>
									<div class="mb-1 text-lg font-bold">
										{data.stats.roomAvailability.available}
										<span class="font-normal text-gray-400"
											>/{data.stats.roomAvailability.total}</span
										>
									</div>
									<div class="text-[11px] text-gray-500">Data per 16 Jan 2024</div>
									<div class="mt-1 flex justify-end">
										<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
											<ArrowUp class="h-4 w-4 text-white" />
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						</div>
					</div>

					<!-- Bottom Section - Appointments and Doctor Schedule -->
					<div class="mb-4 flex gap-2">
						<!-- Patient's Appointment -->
						<div class="w-2/3">
							<Card.Root class="p-6">
								<Card.Header class="mb-4 p-0">
									<div class="flex items-center justify-between">
										<h3 class="text-lg font-semibold">Patient's Appointment</h3>
										<Button variant="ghost" size="icon" class="h-6 w-6">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>
								</Card.Header>

								<Card.Content class="p-0">
									<!-- Appointments Table -->
									<div class="space-y-2">
										<div
											class="grid grid-cols-5 gap-4 border-b pb-2 text-xs font-medium text-gray-500"
										>
											<span>List of appointment</span>
											<span>Date of birth</span>
											<span>Age</span>
											<span>Date of birth</span>
											<span>Insurance</span>
										</div>

										{#each data.appointments as appointment}
											<div
												class="grid grid-cols-5 items-center gap-4 border-b border-gray-100 py-3"
											>
												<div class="flex items-center gap-2">
													<img
														src={appointment.avatar}
														alt={appointment.patientName}
														class="h-8 w-8 rounded-full"
													/>
													<div>
														<div class="text-sm font-medium">{appointment.patientName}</div>
														<div class="text-xs text-gray-500">{appointment.patientId}</div>
													</div>
												</div>
												<div class="text-sm">
													<div>{appointment.appointmentDate}</div>
													<div class="text-xs text-gray-500">{appointment.appointmentTime}</div>
												</div>
												<div class="text-sm">{appointment.age}</div>
												<div class="text-sm">{appointment.dateOfBirth}</div>
												<div class="text-sm">{appointment.insurance}</div>
											</div>
										{/each}
									</div>
								</Card.Content>
							</Card.Root>
						</div>

						<!-- Doctor's Schedule -->
						<div class="w-1/3">
							<Card.Root class="p-4">
								<Card.Header class=" p-0">
									<div class="flex items-center justify-between">
										<h3 class="text-base font-semibold">Doctor's schedule</h3>
										<Button variant="ghost" size="icon" class="h-6 w-6">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>

									<!-- Doctor Status Summary -->
									<div
										class="mt-4 flex justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3"
									>
										<div class="flex-1 text-center">
											<div class="text-lg font-bold text-gray-900">
												{data.stats.doctorSchedule.available}
											</div>
											<div class="text-sm text-gray-600">Available</div>
											<div class="text-xs text-gray-400">Total</div>
										</div>
										<div class="flex-1 text-center">
											<div class="text-lg font-bold text-gray-900">
												{data.stats.doctorSchedule.unavailable}
											</div>
											<div class="text-sm text-gray-600">Unavailable</div>
											<div class="text-xs text-gray-400">Total</div>
										</div>
										<div class="flex-1 text-center">
											<div class="text-lg font-bold text-gray-900">
												{data.stats.doctorSchedule.leave}
											</div>
											<div class="text-sm text-gray-600">Leave</div>
											<div class="text-xs text-gray-400">Total</div>
										</div>
									</div>
								</Card.Header>

								<Card.Content class="p-0">
									<!-- Doctors List -->
									<div class="pt-2">
										<div
											class="flex items-center gap-2 border-b pb-2 text-sm font-medium text-gray-500"
										>
											List of Doctor
											<ChevronDown class="h-4 w-4 text-gray-400" />
										</div>
										{#each data.doctors as doctor}
											<div class="flex items-center justify-between border-b py-3 last:border-b-0">
												<div class="flex items-center gap-3">
													<img
														src={doctor.avatar}
														alt={doctor.name}
														class="h-10 w-10 rounded-full object-cover"
													/>
													<div>
														<div class="text-[15px] font-semibold text-gray-900">{doctor.name}</div>
														<div class="text-xs text-gray-500">{doctor.specialty}</div>
													</div>
												</div>
												<Badge
													class={`rounded-full px-3 py-1 text-xs font-semibold
														${
															doctor.status === 'Available'
																? 'border border-green-200 bg-green-100 text-green-700'
																: 'border border-red-200 bg-red-100 text-red-700'
														}`}
												>
													{doctor.status}
												</Badge>
											</div>
										{/each}
									</div>
								</Card.Content>
							</Card.Root>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
