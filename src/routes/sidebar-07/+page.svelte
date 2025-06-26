<script lang="ts">
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#">Patient</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Patient Details</Breadcrumb.Page>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Mrs. Maria Waston</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
			<div class="ml-auto flex items-center gap-2 px-4">
				<Button variant="ghost" size="icon" class="rounded-full">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
				</Button>
				<Button variant="ghost" size="icon" class="rounded-full">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
				</Button>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-6 p-6 pt-0">
			<!-- Patient Profile Section -->
			<div class="bg-white rounded-xl shadow-sm">
				<div class="flex">
					<div class="w-[240px] p-6 border-r">
						<img src="https://randomuser.me/api/portraits/women/79.jpg" alt="Maria Waston" class="h-24 w-24 rounded-full object-cover mx-auto" />
						<h2 class="text-2xl font-medium text-center mt-4">Mrs. Maria Waston</h2>
						<p class="text-gray-500 text-center mt-1">mariawaston2022@gmail.com</p>
						<div class="mt-4 flex justify-center">
							<button class="rounded-full px-4 py-2 h-8 text-xs border border-gray-200 hover:bg-gray-50">Edit Profile</button>
						</div>
					</div>
					<div class="flex-1 p-6">
						<div class="grid grid-cols-3 gap-y-6">
							<div>
								<p class="text-sm text-gray-500">Sex</p>
								<p class="font-medium">Female</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Age</p>
								<p class="font-medium">28</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Blood</p>
								<p class="font-medium">A+</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Status</p>
								<p class="font-medium">Active</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Department</p>
								<p class="font-medium">Cardiology</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Registered Date</p>
								<p class="font-medium">20 Jan, 2023</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Appointment</p>
								<p class="font-medium">35</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Bed Number</p>
								<p class="font-medium">#0365</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Vitals Section -->
			<div class="space-y-4">
				<h3 class="text-lg font-medium">Patient Current Vitals</h3>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div class="bg-white rounded-xl p-4 shadow-sm">
						<p class="text-sm text-gray-500">Blood Pressure</p>
						<div class="flex items-baseline mt-1">
							<span class="text-2xl font-bold">120/89</span>
							<span class="text-xs ml-1 text-gray-500">mm/hg</span>
						</div>
						<p class="text-xs text-green-500 mt-1">In the norm</p>
					</div>
					<div class="bg-white rounded-xl p-4 shadow-sm">
						<p class="text-sm text-gray-500">Heart rate</p>
						<div class="flex items-baseline mt-1">
							<span class="text-2xl font-bold">120</span>
							<span class="text-xs ml-1 text-gray-500">BPM</span>
						</div>
						<p class="text-xs text-red-500 mt-1">Above the norm</p>
					</div>
					<div class="bg-white rounded-xl p-4 shadow-sm">
						<p class="text-sm text-gray-500">Glucose</p>
						<div class="flex items-baseline mt-1">
							<span class="text-2xl font-bold">97</span>
							<span class="text-xs ml-1 text-gray-500">mg/dl</span>
						</div>
						<p class="text-xs text-green-500 mt-1">In the norm</p>
					</div>
					<div class="bg-white rounded-xl p-4 shadow-sm">
						<p class="text-sm text-gray-500">Cholesterol</p>
						<div class="flex items-baseline mt-1">
							<span class="text-2xl font-bold">85</span>
							<span class="text-xs ml-1 text-gray-500">mg/dl</span>
						</div>
						<p class="text-xs text-green-500 mt-1">In the norm</p>
					</div>
				</div>
			</div>
			
			<!-- Patient History Section -->
			<div class="mt-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-medium">Patient History</h3>
					<p class="text-sm text-gray-500">Total 35 Visits</p>
				</div>
				<div class="bg-white rounded-xl shadow-sm">
					<div class="px-6 py-6">
						<div class="overflow-x-auto">
							<table class="w-full border-collapse">
								<thead>
									<tr class="border-b text-left text-sm text-gray-500">
										<th class="pb-3 pt-1 font-medium">Date Of Visit</th>
										<th class="pb-3 pt-1 font-medium">Diagnosis</th>
										<th class="pb-3 pt-1 font-medium">Severity</th>
										<th class="pb-3 pt-1 font-medium">Total Visits</th>
										<th class="pb-3 pt-1 font-medium">Status</th>
										<th class="pb-3 pt-1 font-medium">Documents</th>
									</tr>
								</thead>
							<tbody>
								<tr class="border-b">
									<td class="py-3 text-sm">20 Jan, 2023</td>
									<td class="py-3 text-sm">Malaria</td>
									<td class="py-3 text-sm">
										<div class="flex items-center">
											<div class="h-5 w-1 rounded-full bg-red-500 mr-2"></div>
											<span class="text-red-500">High</span>
										</div>
									</td>
									<td class="py-3 text-sm">2</td>
									<td class="py-3 text-sm">
										<span class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Under Treatment</span>
									</td>
									<td class="py-3 text-sm">
										<button class="inline-flex items-center text-gray-600 hover:text-gray-900">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
											Download
										</button>
									</td>
								</tr>
								<tr class="border-b">
									<td class="py-3 text-sm">12 Jan, 2022</td>
									<td class="py-3 text-sm">Viral Fever</td>
									<td class="py-3 text-sm">
										<div class="flex items-center">
											<div class="h-5 w-1 rounded-full bg-green-500 mr-2"></div>
											<span class="text-green-500">Low</span>
										</div>
									</td>
									<td class="py-3 text-sm">1</td>
									<td class="py-3 text-sm">
										<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Cured</span>
									</td>
									<td class="py-3 text-sm">
										<button class="inline-flex items-center text-gray-600 hover:text-gray-900">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
											Download
										</button>
									</td>
								</tr>
								<tr class="border-b">
									<td class="py-3 text-sm">20 Jan, 2021</td>
									<td class="py-3 text-sm">Covid 19</td>
									<td class="py-3 text-sm">
										<div class="flex items-center">
											<div class="h-5 w-1 rounded-full bg-red-500 mr-2"></div>
											<span class="text-red-500">High</span>
										</div>
									</td>
									<td class="py-3 text-sm">6</td>
									<td class="py-3 text-sm">
										<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Cured</span>
									</td>
									<td class="py-3 text-sm">
										<button class="inline-flex items-center text-gray-600 hover:text-gray-900">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
											Download
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
