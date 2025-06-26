<script lang="ts">
	import { BellIcon, ChevronLeft, Search, ChevronDown, Phone, Mail, User, MapPin, FileText, Calendar } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';


	
	const kpis = [
		{ 
			value: '22.4', 
			label: 'BMI', 
			change: { value: '10', direction: 'up', color: 'green' } 
		},
		{ 
			value: '92', 
			label: 'Weight', 
			unit: 'kg', 
			change: { value: '10 kg', direction: 'up', color: 'green' } 
		},
		{ 
			value: '175', 
			label: 'Height', 
			unit: 'Cm'
		},
		{ 
			value: '124/80', 
			label: 'Blood pressure', 
			change: { value: '10', direction: 'up', color: 'red' } 
		}
	];

	const patientInfo = [
		{ icon: User, text: 'Male' },
		{ icon: MapPin, text: 'Elsheikh zayed,Giza' },
		{ icon: FileText, text: 'Accountant' },
		{ icon: Calendar, text: '12 Dec 1992 (38 years)' }
	];
</script>

	<!-- Patient card -->
	<div class="bg-white border rounded-lg mx-4 my-3 shadow-sm">
		<div class="p-4">
			<div class="flex gap-6">
				<!-- Left side (70%) - Contains patient photo and info -->
				<div class="w-[70%] flex gap-6">
					<!-- Patient photo -->
					<div class="relative">
						<img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Ahmed Ali Hussain" class="w-42 h-42 rounded-md object-cover" />
						<div class="absolute bottom-1 left-1 flex gap-1">
							<div class="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">A</div>
							<div class="bg-orange-100 text-orange-800 text-xs rounded-full px-2 py-1">Smoker</div>
						</div>
					</div>
					
					<!-- Patient info -->
					<div class="flex-1">
						<div class="flex items-center gap-3">
							<h2 class="text-xl font-semibold">Ahmed Ali Hussain</h2>
							<button class="rounded-full p-1.5 border border-gray-200 bg-gray-100 ">
								<Phone class="h-4 w-4 text-gray-600" />
							</button>
							<button class="rounded-full p-1.5 border border-gray-200  bg-gray-100">
								<Mail class="h-4 w-4 text-gray-600" />
							</button>
						</div>
						
						<!-- Basic info -->
						<div class="flex gap-4 text-sm text-gray-500 mt-3">
							{#each patientInfo as info, i}
								<div class="flex items-center gap-2 ">
									<svelte:component this={info.icon} class="h-3.5 w-3.5 " stroke-width="2.5" />
									<span>{info.text}</span>
								</div>
								{#if i < patientInfo.length - 1}
									<div> | </div>
								{/if}
							{/each}
						</div>
						
						<!-- KPIs -->
						<div class="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-dashed">
							{#each kpis as kpi}
								<div class="flex flex-col border border-dashed rounded-lg p-3">
									<div class="text-xl font-bold text-gray-700">
										{kpi.value} 
										{#if kpi.unit}
											<span class="text-xs text-gray-400 font-normal">{kpi.unit}</span>
										{/if}
									</div>
									<div class="text-xs text-gray-400">
										{kpi.label} 
										{#if kpi.change}
											<span class="text-{kpi.change.color}-500">
												{kpi.change.direction === 'up' ? '↑' : '↓'} {kpi.change.value}
											</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
				
				<!-- Right side (30%) - diagnosis and health barriers -->
			<!-- Right side (30%) - diagnosis and health barriers -->
<div class="w-[30%] flex flex-col">
    <div class="flex justify-end">
        <Button variant="outline" size="sm" class="rounded-md px-3 py-1 h-8 gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            Edit
        </Button>
    </div>
    
    <div class="mt-6 text-right">
        <!-- Diagnosis -->
        <div class="mb-4">
            <div class="text-sm font-medium mb-2">Own diagnosis</div>
            <div class="flex flex-wrap gap-2 justify-end">
                <span class="bg-orange-100 text-orange-700 text-xs rounded-full px-3 py-1">Obesity</span>
                <span class="bg-orange-100 text-orange-700 text-xs rounded-full px-3 py-1">Uncontrolled Type 2</span>
            </div>
        </div>
        
        <!-- Health barriers -->
        <div>
            <div class="text-sm font-medium mb-2">Health barriers</div>
            <div class="flex flex-wrap gap-2 justify-end">
                <span class="bg-blue-100 text-blue-700 text-xs rounded-full px-3 py-1">Fear of medication</span>
                <span class="bg-blue-100 text-blue-700 text-xs rounded-full px-3 py-1">Fear of insulin</span>
            </div>
        </div>
    </div>
</div>
			</div>
		</div>
	</div>
