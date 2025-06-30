import type { PageServerLoad } from './$types';

// Enable faster loading with optimized settings
export const ssr = true;
export const prerender = false;

export const load = (async () => {
	// Example data for the dashboard
	const stats = [
		{
			label: 'Total Views',
			value: '5,094',
			change: '+432',
			changePositive: true,
			sub: 'From last 732 (last 7 days)'
		},
		{
			label: 'Visits',
			value: '2,412',
			change: '+345',
			changePositive: true,
			sub: 'From last 732 (last 7 days)'
		},
		{
			label: 'Orders',
			value: '1,234',
			change: '+345',
			changePositive: true,
			sub: 'From last 124 (last 7 days)'
		},
		{
			label: 'Conversion Rate',
			value: '85%',
			change: '-0.6%',
			changePositive: false,
			sub: 'From last 732 (last 7 days)'
		}
	];

	// Bar chart data (blue theme)
	const barData = [
		{ name: 'Jan', value: 320 },
		{ name: 'Feb', value: 410 },
		{ name: 'Mar', value: 300 },
		{ name: 'Apr', value: 320 },
		{ name: 'May', value: 350 },
		{ name: 'Jun', value: 370 },
		{ name: 'Jul', value: 380 },
		{ name: 'Aug', value: 390 },
		{ name: 'Sep', value: 400 },
		{ name: 'Oct', value: 420 },
		{ name: 'Nov', value: 390 },
		{ name: 'Dec', value: 370 }
	];

	const products = [
		{ label: 'Active listings', value: '6' },
		{ label: 'Expired', value: '2' },
		{ label: 'Sold out', value: '5' }
	];

	const revenue = {
		total: '$14,020,110',
		gained: '+$420.00',
		period: 'this month',
		currentValue: '$387.54',
		date: '24 Sep 2024',
		change: '+2.4%',
		changePositive: true
	};

	// Highly optimized chart data - minimal dataset for instant loading
	const generateChartData = () => {
		const data = [];
		const startDate = new Date('2024-04-01');
		const endDate = new Date('2024-06-30');

		// Generate data every 7 days for maximum performance (only ~13 data points)
		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
			data.push({
				date: d.toISOString().split('T')[0],
				desktop: Math.floor(Math.random() * 400) + 100,
				mobile: Math.floor(Math.random() * 300) + 150
			});
		}
		return data;
	};

	const chartData = generateChartData();

	// Use local placeholder avatars for faster loading
	const activities = [
		{
			name: 'David Elson',
			action: 'favorited your shop',
			time: '6 mins ago',
			avatar: '/placeholder-avatar-1.svg'
		},
		{
			name: 'Kurt Bates',
			action: 'purchased your product',
			time: '16 mins ago',
			avatar: '/placeholder-avatar-2.svg'
		},
		{
			name: 'Eddie Lake',
			action: 'favorited your shop',
			time: '20 mins ago',
			avatar: '/placeholder-avatar-3.svg'
		},
		{
			name: 'Patricia Sanders',
			action: 'purchased your product',
			time: '32 mins ago',
			avatar: '/placeholder-avatar-4.svg'
		}
	];

	return {
		stats,
		barData,
		activities,
		products,
		revenue,
		chartData
	};
}) satisfies PageServerLoad;
