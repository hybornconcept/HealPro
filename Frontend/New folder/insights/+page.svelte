<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { MoreHorizontal, ArrowUp, ArrowDown, Download, Share2, Camera, Map as MapIcon, RotateCcw } from 'lucide-svelte';
    import type { PageProps } from './$types';
    import NigeriaMap from '$lib/components/dashboard/NigeriaMap.svelte';
    
    // Shadcn / LayerChart imports
    import { ChartContainer, ChartTooltip } from '$lib/components/ui/chart';
    import { Chart, Svg, Group, Axis, Bar, Spline, Pie, Area, LinearGradient } from 'layerchart';
    import { scaleBand, scaleOrdinal } from 'd3-scale';

    let { data }: PageProps = $props();
    let metrics = $derived(data.metrics);
    let mapData = $derived(data.mapData);

    // Prepare chart data
    let salesChartData = $derived(metrics.sales.history.labels.map((label: string, i: number) => ({
        period: label,
        Revenue: metrics.sales.history.datasets[0].data[i],
        Target: metrics.sales.history.datasets[1].data[i],
        Expenses: metrics.sales.history.datasets[2].data[i]
    })));

    // Donut Data - Creating concentric rings effect by having multiple datasets isn't direct in LayerChart's simple setup
    // but we can simulate the "look" or at least make it clean.
    // Ideally we'd have nested Pie charts or a calculated dataset for rings.
    // For now, let's stick to a clean Donut that matches the color palette.
    let donutData = $derived(metrics.audience.breakdown);

    // Mini chart data conversion
    let sessionData = $derived(metrics.sessions.history.map((v: number, i: number) => ({ x: i, y: v })));
    let userData = $derived(metrics.users.history.map((v: number, i: number) => ({ x: i, y: v })));

    // Chart Configs
    const salesConfig = {
        Revenue: { label: "Revenue", color: "#0066CC" },
        Target: { label: "Target", color: "#10B981" },
        Expenses: { label: "Expenses", color: "#F59E0B" } // Changed red to amber/orange like image if possible, or keep red for error
    };

    const donutConfig = {
        Lagos: { label: "Lagos", color: "#0066CC" },
        Abuja: { label: "Abuja", color: "#3B82F6" },
        PortHarcourt: { label: "Port Harcourt", color: "#60A5FA" }
    };

    // Format currency
    const formatMoney = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(2)}K`;
        return `$${val}`;
    };

    // Format number
    const formatNumber = (val: number) => {
        return new Intl.NumberFormat('en-US').format(val);
    };
</script>

<div class="px-6 py-4 h-full flex flex-col gap-6" transition:fade>
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Real Time Overview</h1>
            <p class="text-sm text-gray-500">Monitor your business metrics across Nigeria</p>
        </div>
        <div class="flex items-center gap-3">
             <button class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium border border-gray-100">
                <Camera size={16} />
                <span class="hidden sm:inline">View user snapshot</span>
            </button>
            <button class="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium border border-gray-100">
                <MapIcon size={16} />
            </button>
            <button class="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium border border-gray-100">
                <Share2 size={16} />
            </button>
        </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-6">
        
        <!-- LEFT PANEL: Metric Cards -->
        <div class="col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            
            <!-- Top Row: Sessions & Users -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Sessions Card -->
                <div class="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-gray-800 text-lg">Sessions</span>
                        <MoreHorizontal size={20} class="text-gray-400 cursor-pointer" />
                    </div>
                     <div class="text-xs text-gray-400 mb-4">Today</div>
                    <div class="mb-4">
                        <div class="text-2xl font-bold text-gray-900 inline-block mr-2">{formatNumber(metrics.sessions.total)}</div>
                        <div class="text-xs font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded inline-flex items-center gap-1 align-middle">
                            <ArrowDown size={10} strokeWidth={3} />
                            {metrics.sessions.change}%
                        </div>
                    </div>
                    <!-- Barcode Style Chart -->
                     <div class="h-12 w-full mb-4">
                        <Chart data={sessionData} x="x" y="y" padding={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                            <Svg>
                                <Bar class="fill-[#2563eb]" radius={0} strokeWidth={0} />
                            </Svg>
                        </Chart>
                    </div>

                    <div class="space-y-3 mt-auto">
                        {#each metrics.sessions.breakdown as city}
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>{city.city}</span>
                                <span class="font-bold text-gray-700">{formatNumber(city.value)}</span>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Users Card -->
                <div class="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-gray-800 text-lg">Users</span>
                        <MoreHorizontal size={20} class="text-gray-400 cursor-pointer" />
                    </div>
                    <div class="text-xs text-gray-400 mb-4">Today</div>
                    <div class="mb-4">
                        <div class="text-2xl font-bold text-gray-900 inline-block mr-2">{formatNumber(metrics.users.total)}</div>
                        <div class="text-xs font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded inline-flex items-center gap-1 align-middle">
                            <ArrowUp size={10} strokeWidth={3} />
                            {metrics.users.change}%
                        </div>
                    </div>
                    <div class="text-xs text-gray-400 mb-2">Users per minutes</div>
                    <div class="h-32 w-full flex items-end">
                        <Chart data={userData} x="x" y="y" padding={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                             <Svg>
                                <Bar class="fill-[#0066CC]" radius={2} />
                             </Svg>
                        </Chart>
                    </div>
                </div>
            </div>

            <!-- Users by Audience -->
            <div class="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <div class="flex justify-between items-start mb-6">
                    <h3 class="font-bold text-gray-800 text-lg">Users by Audience</h3>
                    <MoreHorizontal size={20} class="text-gray-400 cursor-pointer" />
                </div>
                
                <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div class="flex flex-col gap-6 w-full sm:w-auto">
                        <div>
                            <div class="text-xs text-gray-400 mb-1">Weekly</div>
                            <div class="text-lg font-bold text-gray-900">{formatMoney(metrics.audience.weekly.value)}</div>
                            <div class="text-xs font-bold text-green-500 flex items-center gap-1 mt-1">
                                <ArrowUp size={10} strokeWidth={3} /> {metrics.audience.weekly.change}%
                            </div>
                        </div>
                        <div class="space-y-3">
                            {#each metrics.audience.breakdown as item}
                            <div class="flex items-center gap-2 text-xs">
                                <div class="w-2 h-2 rounded-full" style="background-color: {item.color}"></div>
                                <span class="font-medium text-gray-600">{item.label}</span>
                            </div>
                            {/each}
                        </div>
                    </div>

                    <div class="flex-shrink-0 h-40 w-40 relative mx-auto sm:mx-0">
                         <ChartContainer config={donutConfig} class="h-full w-full">
                            <Chart data={donutData} key="label" value="value" range={metrics.audience.breakdown.map(d => d.color)}>
                                <Svg>
                                    <Pie innerRadius={55} cornerRadius={4} padAngle={0.05} />
                                </Svg>
                            </Chart>
                         </ChartContainer>
                         <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span class="text-lg font-bold text-gray-800">343.32B</span>
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider">All Time</span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-6 w-full sm:w-auto text-right">
                        <div>
                            <div class="text-xs text-gray-400 mb-1">Monthly</div>
                            <div class="text-lg font-bold text-gray-900">{formatMoney(metrics.audience.monthly.value)}</div>
                            <div class="text-xs font-bold text-red-400 flex justify-end items-center gap-1 mt-1">
                                <ArrowDown size={10} strokeWidth={3} /> {Math.abs(metrics.audience.monthly.change)}%
                            </div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-400 mb-1">Yearly</div>
                            <div class="text-lg font-bold text-gray-900">{formatMoney(metrics.audience.yearly.value)}</div>
                            <div class="text-xs font-bold text-green-500 flex justify-end items-center gap-1 mt-1">
                                <ArrowUp size={10} strokeWidth={3} /> {metrics.audience.yearly.change}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sales Report -->
            <div class="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <div class="flex justify-between items-start mb-6">
                    <h3 class="font-bold text-gray-800 text-lg">Sales Report</h3>
                    <MoreHorizontal size={20} class="text-gray-400 cursor-pointer" />
                </div>
                
                <div class="flex justify-between gap-4 mb-8">
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Weekly</div>
                        <div class="text-xl font-bold text-gray-900">{formatMoney(metrics.sales.weekly.value)}</div>
                        <div class="text-xs font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded inline-block mt-1">{metrics.sales.weekly.change}%</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Monthly</div>
                        <div class="text-xl font-bold text-gray-900">{formatMoney(metrics.sales.monthly.value)}</div>
                        <div class="text-xs font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded inline-block mt-1">{metrics.sales.monthly.change}%</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Yearly</div>
                        <div class="text-xl font-bold text-gray-900">{formatMoney(metrics.sales.yearly.value)}</div>
                        <div class="text-xs font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded inline-block mt-1">+{metrics.sales.yearly.change}%</div>
                    </div>
                </div>

                <div class="h-32 w-full">
                    <ChartContainer config={salesConfig} class="h-full w-full">
                        <Chart data={salesChartData} x="period" xDomain={metrics.sales.history.labels} xScale={scaleBand().padding(0)} yDomain={[0, 100]} padding={{ left: 0, bottom: 0, right: 0, top: 0 }}>
                            <Svg>
                                <Spline key="Revenue" class="stroke-[#0066CC] stroke-[3px]" />
                                <Spline key="Target" class="stroke-[#10B981] stroke-[3px]" />
                                <Spline key="Expenses" class="stroke-[#38bdf8] stroke-[3px]" />
                            </Svg>
                        </Chart>
                    </ChartContainer>
                    <!-- Simple Y-axis labels mockup -->
                    <div class="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                        {#each metrics.sales.history.labels as label}
                            <span>{label}</span>
                        {/each}
                    </div>
                </div>
            </div>
            
        </div>

        <!-- RIGHT PANEL: Map -->
        <div class="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col h-full min-h-[600px]">
             <!-- Map Container -->
             <div class="bg-gray-50 rounded-3xl overflow-hidden h-full relative border border-gray-100 shadow-inner">
                <!-- Legend Widget -->
                <div class="absolute bottom-8 right-8 z-[400] bg-white p-4 rounded-xl shadow-lg w-64">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-bold text-sm text-gray-900">Legend</h4>
                    </div>
                    
                    <div class="bg-gray-100 p-1 rounded-lg flex text-xs mb-4">
                        <button class="flex-1 py-1.5 bg-white shadow rounded font-medium text-gray-900">State</button>
                        <button class="flex-1 py-1.5 text-gray-500 hover:text-gray-700">County</button>
                        <button class="flex-1 py-1.5 text-gray-500 hover:text-gray-700">Region</button>
                    </div>

                    <div class="space-y-1">
                        <div class="text-xs text-gray-400">Audience</div>
                        <div class="text-xl font-bold text-gray-900">$493.59M</div>
                        <div class="text-[10px] text-gray-400 text-right">Avg. per county</div>
                    </div>
                    
                    <div class="mt-2 text-xs">
                        <div class="h-2 w-full rounded-full bg-gradient-to-r from-teal-200 via-blue-500 to-indigo-900 mb-1"></div>
                        <div class="flex justify-between text-[10px] text-gray-400">
                            <span>0</span>
                            <span>100</span>
                            <span>200</span>
                            <span>300</span>
                            <span>400</span>
                            <span>500</span>
                        </div>
                    </div>
                </div>

                <div class="absolute inset-0 z-0">
                     <NigeriaMap locations={mapData.locations} />
                </div>
             </div>
        </div>

    </div>
</div>

<style>
    /* Add any localized styles if absolutely necessary that Tailwind can't handle (unlikely) */
</style>