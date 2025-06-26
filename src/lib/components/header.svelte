<script lang="ts">
	import { page } from '$app/stores';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';

	import * as Chart from '$lib/components/ui/chart/index.js';
	import { PieChart, Text } from 'layerchart';
	import { Settings } from '@lucide/svelte';
	import PencilIcon from '@lucide/svelte/icons/pencil';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	import { Input } from '$lib/components/ui/input/index.js';

	import { BellIcon, Search, ChevronDown, Phone, Mail } from '@lucide/svelte';

	// Import patient data from lib/index.ts
	import {
		kpis,
		patientInfo,
		tabs,
		demographics,
		visitData,
		visitChartConfig,
		totalVisits
	} from '$lib/index';

	// Get the sidebar context
	const sidebar = useSidebar();
</script>

<header
	class="sticky top-0 flex flex-col items-center border-b bg-white shadow-sm"
	style="z-index: 1;"
>
	<div class="flex h-12 w-full items-center justify-between px-3 md:px-4">
		<!-- Search bar on left -->
		<div class="relative w-44">
			<Search class="text-muted-foreground absolute top-2 left-2 h-3.5 w-3.5" />
			<Input
				type="search"
				placeholder="Search for Anything"
				class="border-gray-100 bg-gray-50 py-1.5 pl-7 text-sm"
			/>
		</div>

		<!-- Right side with notifications and profile -->
		<div class="flex items-center gap-3">
			<button class="text-gray-500">
				<BellIcon class="h-4 w-4" />
			</button>
			<button class="text-gray-500">
				<Settings class="h-4 w-4" />
			</button>

			<!-- User profile -->
			<div class="flex items-center gap-1.5">
				<Avatar.Root class="h-7 w-7">
					<Avatar.Image src="https://github.com/shadcn.png" alt="User" class="bg-pink-500" />
					<Avatar.Fallback>DR</Avatar.Fallback>
				</Avatar.Root>
				<div class="hidden md:block">
					<div class="text-xs leading-tight font-medium">Dr. Mark James</div>
					<div class="text-[11px] leading-tight text-gray-500">Dentist</div>
				</div>
				<ChevronDown class="h-3.5 w-3.5 text-gray-500" />
			</div>
		</div>
	</div>

	<!-- Horizontal divider -->
	<div class="w-full border-t border-gray-200"></div>

	<!-- Patient card -->
	<div class="w-full bg-white">
		<div class="p-2.5">
			<div class="flex gap-4">
				<!-- Left side (70%) - Contains patient photo and info -->
				<div class="flex w-[70%] gap-4">
					<!-- Patient photo -->
					<div class="relative">
						<img
							src="https://randomuser.me/api/portraits/men/32.jpg"
							alt="Ahmed Ali Hussain"
							class="h-34 w-30 rounded-md object-cover"
						/>
					</div>

					<!-- Patient info -->
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<h2 class="text-lg font-semibold">Ahmed Ali Hussain</h2>
							<button class="rounded-full border border-gray-200 bg-gray-100 p-1">
								<Phone class="h-3 w-3 text-gray-600" />
							</button>
							<button class="rounded-full border border-gray-200 bg-gray-100 p-1">
								<Mail class="h-3 w-3 text-gray-600" />
							</button>
						</div>
						<div class="flex items-center gap-2">
							<p class="text-xs text-gray-500">
								Provider: <span class="font-bold">Axa Manxard</span>
							</p>
							<p class="text-gray-500">|</p>
							<p class="text-xs text-gray-500">ID: <span class="italic">234221</span></p>
							<p class="text-gray-500">|</p>
							<div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
							<p class="text-xs text-green-500">Active</p>
						</div>

						<!-- Basic info -->
						<div class="mt-1 flex gap-3 text-xs text-gray-500">
							{#each patientInfo as info, i}
								<div class="flex items-center gap-1.5">
									<svelte:component this={info.icon} class="h-3 w-3" stroke-width="2" />
									<span>{info.text}</span>
								</div>
								{#if i < patientInfo.length - 1}
									<div>|</div>
								{/if}
							{/each}
						</div>

						<!-- KPIs -->
						<div class="mt-2 grid grid-cols-4 gap-2 border-t border-dashed pt-1.5">
							{#each demographics as demo}
								<div class="flex flex-col rounded-lg border border-dashed p-2">
									<div class="flex items-center gap-1.5">
										<svelte:component this={demo.icon} class="h-2.5 w-2.5 text-blue-400" />
										<div class="text-[11px] text-gray-400">{demo.label}</div>
									</div>
									<div class="text-base font-light text-gray-700">{demo.value}</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Right side (30%) - diagnosis and health barriers -->
				<div class="flex w-[30%] flex-col">
					<div class="flex justify-end">
						<Button variant="outline" size="sm" class="h-7 gap-1 rounded-md px-2 py-1 text-xs">
							<PencilIcon class="h-3.5 w-3.5" />
							Edit
						</Button>
					</div>

					<div class="mt-3 text-right">
						<div class="flex flex-col items-end">
							<div class="flex w-full items-center justify-end gap-1.5">
								<div class="grid gap-2 text-right">
									<div>
										<div class="text-lg font-bold text-indigo-600">176</div>
										<p class="text-muted-foreground text-[11px]">Medical Checkup</p>
									</div>
									<div>
										<div class="text-lg font-bold text-red-500">64</div>
										<p class="text-muted-foreground text-[11px]">Emergency</p>
									</div>
								</div>
								<div class="flex justify-end">
									<Chart.Container
										config={visitChartConfig}
										class="aspect-square h-25"
										style="z-index: 0;"
									>
										<PieChart
											data={visitData}
											key="type"
											value="visits"
											c="color"
											innerRadius={20}
											padding={5}
											props={{ pie: { motion: 'tween' } }}
										>
											{#snippet aboveMarks()}
												<Text
													value={String(totalVisits)}
													textAnchor="middle"
													verticalAnchor="middle"
													class="fill-foreground text-base font-bold"
													dy={0}
												/>
												<Text
													value="Visits"
													textAnchor="middle"
													verticalAnchor="middle"
													class="fill-muted-foreground text-muted-foreground text-[10px]"
													dy={10}
												/>
											{/snippet}
											{#snippet tooltip()}
												<Chart.Tooltip hideLabel />
											{/snippet}
										</PieChart>
									</Chart.Container>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Horizontal divider -->
		<div class="w-full border-t border-gray-200"></div>
		<!-- TAB navigation  -->

		<!-- Tab navigation -->
		<div class="w-full border-b border-gray-200">
			<div class="flex h-9 w-full items-center overflow-x-auto px-3 md:px-4">
				<nav class="flex gap-0.5">
					{#each tabs as tab}
						<a
							href={tab.path}
							class={`relative px-3 py-2 text-xs font-medium transition-colors ${$page.url.pathname === tab.path ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
						>
							{tab.name}
						</a>
					{/each}
				</nav>
			</div>
		</div>
	</div>
</header>
