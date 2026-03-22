<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Calendar,
		Users,
		Activity,
		TrendingUp,
		Clock,
		Stethoscope,
		FileText
	} from '@lucide/svelte';

	// Quick stats for facility dashboard
	const quickStats = [
		{
			title: "Today's Appointments",
			value: '24',
			icon: Calendar,
			color: 'blue',
			trend: '+3 from yesterday'
		},
		{
			title: 'Active Patients',
			value: '156',
			icon: Users,
			color: 'green',
			trend: '+12 this week'
		},
		{
			title: 'Procedures Today',
			value: '8',
			icon: Activity,
			color: 'purple',
			trend: '2 pending'
		},
		{
			title: 'Revenue Today',
			value: '₦245,000',
			icon: TrendingUp,
			color: 'orange',
			trend: '+15% from yesterday'
		}
	];

	// Recent appointments
	const recentAppointments = [
		{
			id: 1,
			patient: 'John Doe',
			time: '09:00 AM',
			type: 'Consultation',
			status: 'confirmed'
		},
		{
			id: 2,
			patient: 'Jane Smith',
			time: '10:30 AM',
			type: 'Follow-up',
			status: 'waiting'
		},
		{
			id: 3,
			patient: 'Mike Johnson',
			time: '11:15 AM',
			type: 'Emergency',
			status: 'urgent'
		}
	];

	// Quick actions
	const quickActions = [
		{
			title: 'New Appointment',
			icon: Calendar,
			action: () => console.log('New appointment')
		},
		{
			title: 'Patient Records',
			icon: FileText,
			action: () => console.log('Patient records')
		},
		{
			title: 'Clinical Notes',
			icon: Stethoscope,
			action: () => console.log('Clinical notes')
		}
	];
</script>

<div class="space-y-6 p-6">
	<!-- Quick Stats Grid -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each quickStats as stat}
			<Card.Root>
				<CardContent class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">{stat.title}</p>
							<p class="text-2xl font-bold text-gray-900">{stat.value}</p>
							<p class="mt-1 text-xs text-gray-500">{stat.trend}</p>
						</div>
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-{stat.color}-100">
							<stat.icon class="h-6 w-6 text-{stat.color}-600" />
						</div>
					</div>
				</CardContent>
			</Card.Root>
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Recent Appointments -->
		<div class="lg:col-span-2">
			<Card.Root>
				<CardHeader>
					<CardTitle class="flex items-center justify-between">
						<span>Today's Appointments</span>
						<Button variant="outline" size="sm">View All</Button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						{#each recentAppointments as appointment}
							<div
								class="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
							>
								<div class="flex items-center space-x-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
										<Users class="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<p class="font-medium text-gray-900">{appointment.patient}</p>
										<p class="text-sm text-gray-500">{appointment.type}</p>
									</div>
								</div>
								<div class="text-right">
									<p class="text-sm font-medium text-gray-900">{appointment.time}</p>
									<Badge
										variant={appointment.status === 'confirmed'
											? 'default'
											: appointment.status === 'urgent'
												? 'destructive'
												: 'secondary'}
									>
										{appointment.status}
									</Badge>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card.Root>
		</div>

		<!-- Quick Actions -->
		<div>
			<Card.Root>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						{#each quickActions as action}
							<Button variant="outline" class="w-full justify-start" onclick={action.action}>
								<action.icon class="mr-2 h-4 w-4" />
								{action.title}
							</Button>
						{/each}
					</div>
				</CardContent>
			</Card.Root>

			<!-- System Status -->
			<Card.Root class="mt-6">
				<CardHeader>
					<CardTitle>System Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Server Status</span>
							<Badge variant="default">Online</Badge>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Last Backup</span>
							<span class="text-sm text-gray-900">2 hours ago</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Storage Used</span>
							<span class="text-sm text-gray-900">68%</span>
						</div>
					</div>
				</CardContent>
			</Card.Root>
		</div>
	</div>
</div>
