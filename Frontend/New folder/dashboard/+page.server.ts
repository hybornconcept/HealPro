// Force dynamic rendering for HMO dashboard page

export async function load() {
	// Mock data for filters
	const filterOptions = {
		status: [
			{ value: 'active', label: 'Active', count: 120 },
			{ value: 'inactive', label: 'Inactive', count: 43 },
			{ value: 'pending', label: 'Pending', count: 28 }
		],
		priority: [
			{ value: 'low', label: 'Low', count: 56 },
			{ value: 'medium', label: 'Medium', count: 83 },
			{ value: 'high', label: 'High', count: 52 }
		]
	};

	// Critical HMO KPIs
	const criticalKPIs = [
		{
			title: 'Claims Denial Rate',
			value: '3.2%',
			change: '-0.8% Last 7 days',
			trend: 'down',
			icon: 'FileText',
			status: 'good',
			target: '<5%'
		},
		{
			title: 'Claims Processing Time',
			value: '12.4 days',
			change: '-2.1 days Last 7 days',
			trend: 'down',
			icon: 'Clock',
			status: 'good',
			target: '<15 days'
		},
		{
			title: 'Prior Auth Approval Rate',
			value: '94.2%',
			change: '+1.5% Last 7 days',
			trend: 'up',
			icon: 'CheckCircle',
			status: 'good',
			target: '>90%'
		}
	];

	const qualityMetrics = [
		{
			title: '30-Day Readmission Rate',
			value: '8.7%',
			change: '-1.2% Last 30 days',
			trend: 'down',
			icon: 'Users',
			status: 'good',
			target: '<12%'
		},
		{
			title: 'Patient Satisfaction',
			value: '87.3%',
			change: '+3.1% Last 30 days',
			trend: 'up',
			icon: 'TrendingUp',
			status: 'good',
			target: '>75%'
		},
		{
			title: 'Hospital-Acquired Infections',
			value: '1.4/1000',
			change: '-0.3 Last 30 days',
			trend: 'down',
			icon: 'AlertTriangle',
			status: 'good',
			target: '<2/1000'
		}
	];

	// Top performing facilities
	const topFacilities = [
		{
			name: 'Lagos University Teaching Hospital',
			claimsAcceptanceRate: 96.8,
			avgProcessingTime: '11.2 days',
			patientSatisfaction: 92.1,
			status: 'excellent'
		},
		{
			name: 'National Hospital Abuja',
			claimsAcceptanceRate: 94.5,
			avgProcessingTime: '13.1 days',
			patientSatisfaction: 89.7,
			status: 'good'
		},
		{
			name: 'University College Hospital',
			claimsAcceptanceRate: 93.2,
			avgProcessingTime: '14.8 days',
			patientSatisfaction: 87.3,
			status: 'good'
		},
		{
			name: 'Federal Medical Centre Kano',
			claimsAcceptanceRate: 91.8,
			avgProcessingTime: '16.2 days',
			patientSatisfaction: 85.9,
			status: 'warning'
		},
		{
			name: 'Obafemi Awolowo University Teaching Hospital',
			claimsAcceptanceRate: 90.4,
			avgProcessingTime: '17.5 days',
			patientSatisfaction: 84.2,
			status: 'warning'
		}
	];

	// Financial metrics for payable chart
	const financialBreakdown = [
		{ vendor: 'Primary Care', amount: 45, color: 'var(--color-primary)' },
		{ vendor: 'Specialist Care', amount: 30, color: 'var(--color-specialist)' },
		{ vendor: 'Emergency Services', amount: 25, color: 'var(--color-emergency)' }
	];

	return {
		filterOptions,
		criticalKPIs,
		qualityMetrics,
		topFacilities,
		financialBreakdown
	};
}
