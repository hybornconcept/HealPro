<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		MoreHorizontal,
		Monitor,
		Share2,
		ChevronDown,
		Minus,
		Filter,
		Crosshair,
		TrendingUp,
		Plus,
		Activity,
		DollarSign,
		PieChart as PieChartIcon,
		BarChart3
	} from 'lucide-svelte';
	import { AreaChart, Area, ChartClipPath } from 'layerchart';
	import { scaleBand, scaleLinear, scaleUtc } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import { cubicInOut } from 'svelte/easing';
	import InsightBarChart from '$lib/components/InsightBarChart.svelte';
	import PieChartComponent from '$lib/components/PieChartComponent.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Leaflet imports
	let L: any;
	let mapElement: HTMLElement;
	let map: any;

	const colors = {
		blue: '#2563eb',
		emerald: '#10b981',
		orange: '#f59e0b',
		sky: '#0ea5e9',
		gray: '#f1f5f9'
	};

	const chartConfig = {
		percentage: { label: 'Percentage' },
		infectious: { label: 'Infectious', color: colors.blue },
		chronic: { label: 'Chronic', color: colors.emerald },
		maternal: { label: 'Maternal', color: colors.orange }
	} satisfies Chart.ChartConfig;

	onMount(async () => {
		const leaflet = await import('leaflet');
		import('leaflet/dist/leaflet.css');
		L = leaflet.default;

		if (mapElement) {
			map = L.map(mapElement, {
				center: [9.082, 8.6753],
				zoom: 6,
				zoomControl: false,
				attributionControl: false
			});

			L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
				maxZoom: 19,
				opacity: 1
			}).addTo(map);

			// Add faint labels on top
			L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
				maxZoom: 19,
				opacity: 0.3,
				pane: 'shadowPane' // Ensure labels are above the base but can be controlled
			}).addTo(map);

			// Add Nigeria GeoJSON
			try {
				const response = await fetch(
					'https://raw.githubusercontent.com/codeforgermany/click_that_hood/master/public/data/nigeria.geojson'
				);
				const geoData = await response.json();

				L.geoJSON(geoData, {
					style: {
						fillColor: '#fcfcfc',
						weight: 1.5,
						opacity: 1,
						color: '#64748b',
						fillOpacity: 0.3
					}
				}).addTo(map);
			} catch (e) {
				console.error('Failed to load GeoJSON', e);
			}

			// Initialize marker layer
			markerLayer = L.layerGroup().addTo(map);

			// Initial render
			renderMarkers();
		}
	});

	function zoomIn() {
		if (map) map.zoomIn();
	}
	function zoomOut() {
		if (map) map.zoomOut();
	}
	function centerMap() {
		if (map) map.setView([9.082, 8.6753], 6);
	}

	// Filter state
	let currentFilter = $state('all'); // 'all', 'high', 'critical'
	let markerLayer: any;

	const highCostDataForChart = $derived(
		data.highCostData.map((d) => ({ ...d, disease: d.cluster }))
	);

	function renderMarkers() {
		if (!map || !L) return;

		// Initialize layer if needed
		if (!markerLayer) {
			markerLayer = L.layerGroup().addTo(map);
		} else {
			markerLayer.clearLayers();
		}

		const filtered = data.mapMarkers.filter((m) => {
			if (currentFilter === 'high') return m.intensity > 50;
			if (currentFilter === 'critical') return m.intensity > 80;
			return true;
		});

		filtered.forEach((marker) => {
			const diamondIcon = L.divIcon({
				className: 'custom-div-icon',
				html: `<div style="background-color: ${marker.color}; width: ${marker.size}px; height: ${marker.size}px; transform: rotate(45deg); border: 1.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.15);"></div>`,
				iconSize: [marker.size, marker.size],
				iconAnchor: [marker.size / 2, marker.size / 2]
			});

			L.marker([marker.lat, marker.lng], { icon: diamondIcon })
				.bindTooltip(
					`<div class="text-xs font-bold font-sans">Cluster #${marker.id}<br><span class="text-gray-500 font-medium">Burden: ${marker.intensity}%</span></div>`,
					{
						direction: 'top',
						offset: [0, -10],
						opacity: 0.9,
						className: 'custom-tooltip'
					}
				)
				.addTo(markerLayer);
		});
	}

	// Watch filter changes
	$effect(() => {
		if (map && L && currentFilter) {
			renderMarkers();
		}
	});
</script>

<div class="flex h-[calc(100vh-64px)] overflow-hidden bg-white font-sans">
	<!-- Left Sidebar (Overview) - 32% width -->
	<div class="z-10 flex w-[32%] min-w-[340px] flex-col border-r border-gray-100 bg-white shadow-sm">
		<div class="flex items-center justify-between border-b border-gray-50 px-4 py-2">
			<h2 class="text-sm font-bold text-gray-900">HMO Analytics</h2>
			<div class="flex gap-1">
				<Button variant="ghost" size="icon" class="h-6 w-6 text-gray-400">
					<Filter class="h-3 w-3" />
				</Button>
				<Button variant="ghost" size="icon" class="h-6 w-6 text-gray-400">
					<Plus class="h-3 w-3" />
				</Button>
			</div>
		</div>

		<ScrollArea class="h-full bg-gray-50/30">
			<div class="space-y-2 px-4 py-2 pb-12">
				<!-- 1. Disease Prevalence -->
				<Card.Root class="overflow-hidden border bg-white px-4 py-1.5 shadow-sm">
					<Card.Header class="mb-0 px-0 py-1 pb-0.5">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-1">
								<Activity class="h-3 w-3 text-gray-500" />
								<Card.Title class="text-[12px] font-bold text-gray-900"
									>Disease Prevalence</Card.Title
								>
							</div>
							<Button variant="ghost" size="icon" class="h-4 w-4">
								<MoreHorizontal class="h-2.5 w-2.5 text-gray-400" />
							</Button>
						</div>
					</Card.Header>
					<InsightBarChart
						data={data.prevalenceData}
						{chartConfig}
						orientation="horizontal"
						height="h-40"
					/>
					<Card.Footer class="-mt-2 flex items-center justify-between border-t px-0 pb-1 pt-0.5">
						<div class="flex items-center gap-1">
							<span class="text-xs text-gray-500">Total: 1.2M</span>
							<Badge
								variant="secondary"
								class="h-3 bg-green-50 px-1 text-xs font-bold text-green-600"
							>
								+4.2%
							</Badge>
						</div>
						<div class="flex items-center gap-1">
							<span class="text-xs text-gray-500">Avg: 28.5%</span>
						</div>
					</Card.Footer>
				</Card.Root>
				<!-- 2. High-Cost Clusters -->

				<Card.Root class="overflow-hidden border bg-white px-4 py-1.5 shadow-sm">
					<Card.Header class="mb-0 px-0 py-1 pb-0.5">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-1">
								<Activity class="h-3 w-3 text-gray-500" />
								<Card.Title class="text-[12px] font-bold text-gray-900"
									>High-Cost Clusters</Card.Title
								>
							</div>
							<Button variant="ghost" size="icon" class="h-4 w-4">
								<MoreHorizontal class="h-2.5 w-2.5 text-gray-400" />
							</Button>
						</div>
					</Card.Header>
					<InsightBarChart
						data={highCostDataForChart}
						{chartConfig}
						orientation="vertical"
						height="h-48"
					/>
					<Card.Footer class="-mt-2 flex items-center justify-between border-t px-0 pb-1 pt-0.5">
						<div class="flex items-center gap-1">
							<span class="text-xs text-gray-500">Total: 1.2M</span>
							<Badge
								variant="secondary"
								class="h-3 bg-green-50 px-1 text-xs font-bold text-green-600"
							>
								+4.2%
							</Badge>
						</div>
						<div class="flex items-center gap-1">
							<span class="text-xs text-gray-500">Avg: 28.5%</span>
						</div>
					</Card.Footer>
				</Card.Root>

				<!-- 3. Health Trends -->
				<Card.Root class="overflow-hidden border bg-white px-4 py-1.5 shadow-sm">
					<Card.Header class="px-3 py-1 pb-0.5">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-1">
								<BarChart3 class="h-3 w-3 text-gray-500" />
								<Card.Title class="text-[12px] font-bold text-gray-900">Health Trends</Card.Title>
							</div>
							<Badge
								variant="outline"
								class="h-3.5 bg-gray-50 text-[7px] font-medium text-gray-500"
							>
								+3.1%
							</Badge>
						</div>
					</Card.Header>
					<Card.Content class="px-3 py-1 pt-0">
						<div class="h-32 w-full">
							<Chart.Container {chartConfig} class="aspect-auto h-full w-full">
								<AreaChart
									data={data.healthTrendsData}
									x="date"
									xScale={scaleUtc()}
									series={[
										{ key: 'infectious', label: 'Infectious', color: colors.blue },
										{ key: 'chronic', label: 'Chronic', color: colors.emerald },
										{ key: 'maternal', label: 'Maternal', color: colors.orange }
									]}
									seriesLayout="stack"
									props={{
										area: {
											curve: curveNatural,
											'fill-opacity': 0.4,
											line: { class: 'stroke-1' },
											motion: 'tween'
										},
										xAxis: {
											format: (v) =>
												v.toLocaleDateString('en-US', {
													month: 'short'
												}),
											tickLabelProps: { class: 'text-[7px] fill-gray-400' },
											grid: false,
											rule: false
										},
										yAxis: {
											format: () => '',
											grid: false,
											rule: false
										}
									}}
								>
									{#snippet marks({ series, getAreaProps })}
										<defs>
											<linearGradient id="fillInfectious" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stop-color={colors.blue} stop-opacity={0.8} />
												<stop offset="95%" stop-color={colors.blue} stop-opacity={0.1} />
											</linearGradient>
											<linearGradient id="fillChronic" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stop-color={colors.emerald} stop-opacity={0.8} />
												<stop offset="95%" stop-color={colors.emerald} stop-opacity={0.1} />
											</linearGradient>
											<linearGradient id="fillMaternal" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stop-color={colors.orange} stop-opacity={0.8} />
												<stop offset="95%" stop-color={colors.orange} stop-opacity={0.1} />
											</linearGradient>
										</defs>
										<ChartClipPath
											initialWidth={0}
											motion={{
												width: { type: 'tween', duration: 1000, easing: cubicInOut }
											}}
										>
											{#each series as s, i (s.key)}
												<Area
													{...getAreaProps(s, i)}
													fill={s.key === 'infectious'
														? 'url(#fillInfectious)'
														: s.key === 'chronic'
															? 'url(#fillChronic)'
															: 'url(#fillMaternal)'}
												/>
											{/each}
										</ChartClipPath>
									{/snippet}
									{#snippet tooltip()}
										<Chart.Tooltip indicator="line" />
									{/snippet}
								</AreaChart>
							</Chart.Container>
						</div>
						<div class="mt-1 flex flex-wrap justify-center gap-2">
							{#each [{ color: colors.blue, label: 'Infectious' }, { color: colors.emerald, label: 'Chronic' }, { color: colors.orange, label: 'Maternal' }] as item}
								<div class="flex items-center gap-1">
									<div
										class="h-1.5 w-1.5 rounded-full"
										style="background-color: {item.color}"
									></div>
									<span class="text-[7px] font-bold text-gray-600">{item.label}</span>
								</div>
							{/each}
						</div>
					</Card.Content>
					<Card.Footer class="-mt-2 flex items-center justify-between border-t px-0 pb-1 pt-0.5">
						<div class="flex items-center gap-1">
							<span class="text-xs text-gray-500">Total: 1.2M</span>
							<Badge
								variant="secondary"
								class="h-3 bg-green-50 px-1 text-xs font-bold text-green-600"
							>
								+3.1%
							</Badge>
						</div>
						<div class="flex items-center gap-1">
							<span class="text-xs text-gray-500">Avg: 28.5%</span>
						</div>
					</Card.Footer>
				</Card.Root>

				<!-- 4. Disease Distribution -->
				<Card.Root class="overflow-hidden border bg-white px-4 py-1.5 shadow-sm">
					<Card.Header class="px-3 py-1 pb-0.5">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-1">
								<PieChartIcon class="h-3 w-3 text-gray-500" />
								<Card.Title class="text-[12px] font-bold text-gray-900"
									>Disease Distribution</Card.Title
								>
							</div>
							<Button variant="ghost" size="icon" class="h-4 w-4">
								<MoreHorizontal class="h-2.5 w-2.5 text-gray-400" />
							</Button>
						</div>
					</Card.Header>
					<Card.Content class="px-3 py-1 pt-0">
						<div class="mx-auto h-60 w-full py-2">
							<PieChartComponent chartData={data.distributionData} showLegend={false} />
						</div>
					</Card.Content>
					<Card.Footer class="-mt-2 flex items-center justify-between border-t px-0 pb-1 pt-0.5">
						<div class="flex items-center gap-1">
							<span class="text-xs text-gray-500">Total: 1.2M</span>
							<Badge
								variant="secondary"
								class="h-3 bg-green-50 px-1 text-xs font-bold text-green-600"
							>
								+4.2%
							</Badge>
						</div>
						<div class="flex items-center gap-1">
							<span class="text-xs text-gray-500">Avg: 28.5%</span>
						</div>
					</Card.Footer>
				</Card.Root>
			</div>
		</ScrollArea>
	</div>
	<!-- Main Map Area - 68% width -->
	<div class="flex flex-1 flex-col bg-[#f8fafc]">
		<!-- Filter & Header Bar (Top 5% approx + styling) -->
		<div
			class="relative z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm"
		>
			<div class="flex items-center gap-4">
				<h3 class="text-sm font-bold text-gray-800">Geospatial Analysis</h3>
				<div class="flex items-center rounded-lg bg-gray-100 p-1">
					<button
						class:bg-white={currentFilter === 'all'}
						class:shadow-sm={currentFilter === 'all'}
						class="rounded-md px-3 py-1 text-[10px] font-bold text-gray-600 transition-all hover:text-gray-900"
						onclick={() => (currentFilter = 'all')}
					>
						All Clusters
					</button>
					<button
						class:bg-white={currentFilter === 'high'}
						class:shadow-sm={currentFilter === 'high'}
						class="rounded-md px-3 py-1 text-[10px] font-bold text-gray-600 transition-all hover:text-gray-900"
						onclick={() => (currentFilter = 'high')}
					>
						High Burden (>50%)
					</button>
					<button
						class:bg-white={currentFilter === 'critical'}
						class:shadow-sm={currentFilter === 'critical'}
						class="rounded-md px-3 py-1 text-[10px] font-bold text-red-600 transition-all hover:text-red-700"
						onclick={() => (currentFilter = 'critical')}
					>
						Critical (>80%)
					</button>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					class="h-8 rounded-lg border-gray-200 bg-white text-[10px] font-bold shadow-sm"
				>
					<Monitor class="mr-1.5 h-3 w-3" />
					View Snapshot
				</Button>
				<Button
					variant="outline"
					size="icon"
					class="h-8 w-8 rounded-lg border-gray-200 bg-white shadow-sm"
				>
					<Share2 class="h-3 w-3" />
				</Button>
			</div>
		</div>

		<!-- Map Container (Remaining) -->
		<div class="relative flex-1">
			<div bind:this={mapElement} class="z-10 h-full w-full"></div>

			<!-- Map Controls -->
			<div class="z-1000 absolute bottom-6 left-6 flex flex-col gap-2">
				<div
					class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white/90 shadow-xl backdrop-blur-md"
				>
					<button
						onclick={zoomIn}
						class="border-b border-gray-100 p-2.5 transition-colors hover:bg-gray-50"
					>
						<Plus class="h-4 w-4 text-gray-600" />
					</button>
					<button onclick={zoomOut} class="p-2.5 transition-colors hover:bg-gray-50">
						<Minus class="h-4 w-4  text-gray-600" />
					</button>
				</div>
			</div>

			<!-- Legend Card -->
			<div class="z-1000 absolute bottom-6 right-6 w-48">
				<Card.Root
					class="overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur-md"
				>
					<Card.Content class="p-3">
						<div class="mb-4 flex items-center justify-between">
							<span class="text-[10px] font-bold uppercase tracking-widest text-gray-900"
								>Map Legend</span
							>
							<ChevronDown class="h-3 w-3 text-gray-400" />
						</div>

						<div class="space-y-4">
							<div class="space-y-2">
								<div
									class="flex justify-between text-[8px] font-bold uppercase tracking-tighter text-gray-400"
								>
									<span>Marker Size: Disease Burden / Cost Intensity</span>
								</div>
								<div class="flex items-center gap-4 pt-1">
									<div class="h-2 w-2 rounded-full bg-gray-300"></div>
									<div class="h-3 w-3 rounded-full bg-gray-300"></div>
									<div class="h-4 w-4 rounded-full bg-gray-300"></div>
									<span class="text-[8px] text-gray-400">Low → High</span>
								</div>
							</div>

							<div class="space-y-2 pt-1">
								<p class="text-[8px] font-bold uppercase tracking-widest text-gray-400">
									Disease Categories
								</p>
								<div class="grid grid-cols-1 gap-2">
									{#each [{ color: colors.blue, label: 'Infectious Diseases / High Prevalence' }, { color: colors.emerald, label: 'Chronic Conditions / High Cost' }, { color: colors.orange, label: 'Maternal & Child Health / Emerging Trends' }] as item}
										<div class="flex items-center gap-2.5">
											<div
												class="h-2 w-2 rotate-45 border border-white shadow-sm"
												style="background-color: {item.color}"
											></div>
											<span class="text-[9px] font-semibold text-gray-600">{item.label}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.leaflet-container) {
		background: #f8fafc !important;
		font-family: inherit;
	}
	:global(.custom-div-icon) {
		background: transparent !important;
		border: none !important;
	}
	/* Ensure scrollbar is visible in the sidebar */
	:global([data-radix-scroll-area-viewport]) {
		scrollbar-width: thin;
		scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
	}
	:global([data-chart] .lc-grid-line) {
		display: none !important;
	}
	:global(.custom-tooltip) {
		background: white !important;
		border: 1px solid #e2e8f0 !important;
		border-radius: 8px !important;
		padding: 4px 8px !important;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
	}
</style>
