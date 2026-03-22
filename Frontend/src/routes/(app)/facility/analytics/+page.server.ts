export async function load() {
	const months = [
		{ value: 'feb2024', label: 'February 2024' },
		{ value: 'jan2024', label: 'January 2024' }
	];

	const platforms = [
		{ value: 'all', label: 'All Platforms' },
		{ value: 'web', label: 'Web' }
	];

	const dateRanges = [{ value: 'feb', label: '1 Feb, 2024 - 28 Feb, 2024' }];

	const sortOptions = [
		{ value: 'date', label: 'Date' },
		{ value: 'amount', label: 'Amount' }
	];

	const transactions = [
		{
			name: 'Jane Smith',
			id: '#TX987XY2654LMN',
			date: '02 Sept, 2024',
			time: '03:45:18 PM',
			type: 'Refund',
			amount: '₦120,000.00',
			status: 'Pending'
		},
		{
			name: 'Robert Johnson',
			id: '#TX68FRT321CVB',
			date: '10 Oct, 2024',
			time: '08:12:55 AM',
			type: 'Transfer',
			amount: '₦30,000.00',
			status: 'Failed'
		}
	];

	// Bar chart data
	const barChartData = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 }
	];

	// Area chart data
	const areaChartData = [
		{ date: new Date('2024-05-04'), claimsProcessed: 385, claimsDenied: 42 },
		{ date: new Date('2024-05-05'), claimsProcessed: 481, claimsDenied: 39 },
		{ date: new Date('2024-05-06'), claimsProcessed: 498, claimsDenied: 52 },
		{ date: new Date('2024-05-07'), claimsProcessed: 388, claimsDenied: 30 },
		{ date: new Date('2024-05-08'), claimsProcessed: 149, claimsDenied: 21 },
		{ date: new Date('2024-05-09'), claimsProcessed: 227, claimsDenied: 18 },
		{ date: new Date('2024-05-10'), claimsProcessed: 293, claimsDenied: 33 },
		{ date: new Date('2024-05-11'), claimsProcessed: 335, claimsDenied: 27 },
		{ date: new Date('2024-05-12'), claimsProcessed: 197, claimsDenied: 24 },
		{ date: new Date('2024-05-13'), claimsProcessed: 197, claimsDenied: 16 },
		{ date: new Date('2024-05-14'), claimsProcessed: 448, claimsDenied: 49 },
		{ date: new Date('2024-05-15'), claimsProcessed: 473, claimsDenied: 38 },
		{ date: new Date('2024-05-16'), claimsProcessed: 338, claimsDenied: 40 },
		{ date: new Date('2024-05-17'), claimsProcessed: 499, claimsDenied: 42 },
		{ date: new Date('2024-05-18'), claimsProcessed: 315, claimsDenied: 35 },
		{ date: new Date('2024-05-19'), claimsProcessed: 235, claimsDenied: 18 },
		{ date: new Date('2024-05-20'), claimsProcessed: 177, claimsDenied: 23 },
		{ date: new Date('2024-05-21'), claimsProcessed: 82, claimsDenied: 14 },
		{ date: new Date('2024-05-22'), claimsProcessed: 81, claimsDenied: 12 },
		{ date: new Date('2024-05-23'), claimsProcessed: 252, claimsDenied: 29 },
		{ date: new Date('2024-05-24'), claimsProcessed: 294, claimsDenied: 22 },
		{ date: new Date('2024-05-25'), claimsProcessed: 201, claimsDenied: 25 },
		{ date: new Date('2024-05-26'), claimsProcessed: 213, claimsDenied: 17 },
		{ date: new Date('2024-05-27'), claimsProcessed: 420, claimsDenied: 46 },
		{ date: new Date('2024-05-28'), claimsProcessed: 233, claimsDenied: 19 },
		{ date: new Date('2024-05-29'), claimsProcessed: 78, claimsDenied: 13 },
		{ date: new Date('2024-05-30'), claimsProcessed: 340, claimsDenied: 28 },
		{ date: new Date('2024-05-31'), claimsProcessed: 178, claimsDenied: 23 },
		{ date: new Date('2024-06-01'), claimsProcessed: 178, claimsDenied: 20 },
		{ date: new Date('2024-06-02'), claimsProcessed: 470, claimsDenied: 41 },
		{ date: new Date('2024-06-03'), claimsProcessed: 103, claimsDenied: 16 },
		{ date: new Date('2024-06-04'), claimsProcessed: 439, claimsDenied: 38 },
		{ date: new Date('2024-06-05'), claimsProcessed: 88, claimsDenied: 14 },
		{ date: new Date('2024-06-06'), claimsProcessed: 294, claimsDenied: 25 },
		{ date: new Date('2024-06-07'), claimsProcessed: 323, claimsDenied: 37 },
		{ date: new Date('2024-06-08'), claimsProcessed: 385, claimsDenied: 32 },
		{ date: new Date('2024-06-09'), claimsProcessed: 438, claimsDenied: 48 },
		{ date: new Date('2024-06-10'), claimsProcessed: 155, claimsDenied: 20 },
		{ date: new Date('2024-06-11'), claimsProcessed: 92, claimsDenied: 15 },
		{ date: new Date('2024-06-12'), claimsProcessed: 492, claimsDenied: 42 },
		{ date: new Date('2024-06-13'), claimsProcessed: 81, claimsDenied: 13 },
		{ date: new Date('2024-06-14'), claimsProcessed: 426, claimsDenied: 38 },
		{ date: new Date('2024-06-15'), claimsProcessed: 307, claimsDenied: 35 },
		{ date: new Date('2024-06-16'), claimsProcessed: 371, claimsDenied: 31 },
		{ date: new Date('2024-06-17'), claimsProcessed: 475, claimsDenied: 52 },
		{ date: new Date('2024-06-18'), claimsProcessed: 107, claimsDenied: 17 },
		{ date: new Date('2024-06-19'), claimsProcessed: 341, claimsDenied: 29 },
		{ date: new Date('2024-06-20'), claimsProcessed: 408, claimsDenied: 45 },
		{ date: new Date('2024-06-21'), claimsProcessed: 169, claimsDenied: 21 },
		{ date: new Date('2024-06-22'), claimsProcessed: 317, claimsDenied: 27 },
		{ date: new Date('2024-06-23'), claimsProcessed: 480, claimsDenied: 53 },
		{ date: new Date('2024-06-24'), claimsProcessed: 132, claimsDenied: 18 },
		{ date: new Date('2024-06-25'), claimsProcessed: 141, claimsDenied: 19 },
		{ date: new Date('2024-06-26'), claimsProcessed: 434, claimsDenied: 38 },
		{ date: new Date('2024-06-27'), claimsProcessed: 448, claimsDenied: 49 },
		{ date: new Date('2024-06-28'), claimsProcessed: 149, claimsDenied: 20 },
		{ date: new Date('2024-06-29'), claimsProcessed: 103, claimsDenied: 16 },
		{ date: new Date('2024-06-30'), claimsProcessed: 446, claimsDenied: 40 }
	];

	return {
		months,
		platforms,
		dateRanges,
		sortOptions,
		transactions,
		barChartData,
		areaChartData
	};
}
