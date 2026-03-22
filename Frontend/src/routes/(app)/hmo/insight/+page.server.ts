import type { PageServerLoad } from './$types';

export const load = (async () => {
	// 1. Disease Prevalence Data
	const prevalenceData = [
		{ disease: 'Malaria', percentage: 85, cases: '450k', color: '#2563eb' },
		{ disease: 'Hypertension', percentage: 62, cases: '320k', color: '#10b981' },
		{ disease: 'Diabetes', percentage: 45, cases: '240k', color: '#f59e0b' },
		{ disease: 'Respiratory', percentage: 35, cases: '180k', color: '#0ea5e9' },
		{ disease: 'Cholera', percentage: 22, cases: '110k', color: '#ef4444' },
		{ disease: 'Typhoid', percentage: 15, cases: '75k', color: '#8b5cf6' }
	];

	// 2. High-Cost Clusters Data
	const highCostData = [
		{ cluster: 'Cancer Treatment', avgCost: '$15k', cases: '12k', percentage: 60, color: '#2563eb' },
		{ cluster: 'Cardiac Procedures', avgCost: '$12k', cases: '18k', percentage: 75, color: '#10b981' },
		{ cluster: 'Dialysis & Kidney Care', avgCost: '$8k', cases: '25k', percentage: 90, color: '#f59e0b' },
		{ cluster: 'Specialized Surgery', avgCost: '$5k', cases: '40k', percentage: 100, color: '#0ea5e9' }
	];

	// 3. Health Trends Data
	const healthTrendsData = [
		{ date: new Date('2024-01-01'), infectious: 70, chronic: 25, maternal: 30 },
		{ date: new Date('2024-02-01'), infectious: 40, chronic: 30, maternal: 12 },
		{ date: new Date('2024-03-01'), infectious: 75, chronic: 48, maternal: 25 },
		{ date: new Date('2024-04-01'), infectious: 80, chronic: 55, maternal: 10 },
		{ date: new Date('2024-05-01'), infectious: 65, chronic: 60, maternal: 15 },
		{ date: new Date('2024-06-01'), infectious: 90, chronic: 45, maternal: 20 }
	];

	// 4. Disease Distribution Data
	const distributionData = [
		{ label: 'Age <18', value: 25, color: '#0ea5e9' },
		{ label: 'Age 18-45', value: 40, color: '#2563eb' },
		{ label: 'Age 46-65', value: 25, color: '#10b981' },
		{ label: 'Age >65', value: 10, color: '#f59e0b' }
	];

	// 5. Map Markers (Strictly within Nigeria)
	const colors = ['#2563eb', '#10b981', '#f59e0b', '#0ea5e9'];
	const mapMarkers = Array.from({ length: 60 }, (_, i) => {
		// Strictly within Nigeria bounds (Safe zone: Lat 6.5-11.5, Lng 4.5-11.5)
		const lat = 6.5 + Math.random() * 5.0; 
		const lng = 4.5 + Math.random() * 7.0;
		
		return {
			id: i,
			lat,
			lng,
			color: colors[Math.floor(Math.random() * colors.length)],
			size: 5 + Math.random() * 10,
			intensity: Math.floor(Math.random() * 100)
		};
	});

	return {
		prevalenceData,
		highCostData,
		healthTrendsData,
		distributionData,
		mapMarkers
	};
}) satisfies PageServerLoad;