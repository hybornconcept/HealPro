export const load = async () => {
	const analyticsBarData = [
		{ name: 'Mon', total: 450 },
		{ name: 'Tue', total: 320 },
		{ name: 'Wed', total: 550 },
		{ name: 'Thu', total: 400 },
		{ name: 'Fri', total: 380 },
		{ name: 'Sat', total: 200 },
		{ name: 'Sun', total: 150 }
	];

	const kpiCards = [
		{
			tag: 'Receipts',
			title: 'Total Claims',
			subtitle: 'All time processed',
			theme: 'white',
			stats: [{ value: '120,560.00', label: '+11.5%' }]
		},
		{
			tag: 'Pending',
			title: 'Pending Action',
			subtitle: 'Requires attention',
			theme: 'blue',
			stats: [{ value: '47', label: '-5.2%' }]
		},
		{
			tag: 'Contributions',
			title: 'Approved',
			subtitle: 'This month',
			theme: 'white',
			stats: [{ value: '37,272.00', label: '+4.5%' }]
		},
		{
			tag: 'Owes',
			title: 'Rejected',
			subtitle: 'This month',
			theme: 'blue',
			stats: [{ value: '9,230.00', label: '-20.5%' }]
		}
	];

	const claimsData = [
		{
			id: '#01',
			claimId: 'CLM-2024-001',
			enrolleeId: 'HMO-8832',
			fullName: 'Olivia Henson',
			providerName: 'Lagos University Teaching Hospital',
			providerState: 'Lagos',
			email: 'olivia.henson@atlantic.com',
			status: 'Pending',
			policyType: 'Gold',
			coverage: 85,
			phone: '(312) 555-0182',
			date: 'May 12th, 2025',
			totalAmount: 45000,
			services: [
				{ description: 'General Consultation', amount: 25000 },
				{ description: 'Malaria Treatment', amount: 20000 }
			]
		},
		{
			id: '#02',
			claimId: 'CLM-2024-002',
			enrolleeId: 'HMO-9921',
			fullName: 'Sarah Mitchell',
			providerName: 'General Hospital Calabar',
			providerState: 'Cross River',
			email: 'sarah.mitchell@insureco.com',
			status: 'Rejected',
			policyType: 'Bronze',
			coverage: 40,
			phone: '(646) 555-1176',
			date: 'Mar 30th, 2025',
			totalAmount: 12000,
			services: [
				{ description: 'Dental Checkup', amount: 10000 },
				{ description: 'Registration', amount: 2000 }
			]
		},
		{
			id: '#03',
			claimId: 'CLM-2024-003',
			enrolleeId: 'HMO-1123',
			fullName: 'Mason Patel',
			providerName: 'National Hospital Abuja',
			providerState: 'FCT',
			email: 'mason.patel@gmail.com',
			status: 'Pending',
			policyType: 'Silver',
			coverage: 60,
			phone: '(415) 555-2028',
			date: 'Jun 1st, 2025',
			totalAmount: 85000,
			services: [
				{ description: 'X-Ray Scan', amount: 45000 },
				{ description: 'Orthopedic Consultation', amount: 40000 }
			]
		},
		{
			id: '#04',
			claimId: 'CLM-2024-004',
			enrolleeId: 'HMO-7744',
			fullName: 'Zoe Ramirez',
			providerName: 'Reddington Hospital',
			providerState: 'Lagos',
			email: 'zoe.ramirez@hrbridge.io',
			status: 'Accepted',
			policyType: 'Gold',
			coverage: 90,
			phone: '(702) 555-3390',
			date: 'May 25th, 2025',
			totalAmount: 150000,
			services: [
				{ description: 'Maternity Care', amount: 100000 },
				{ description: 'Ultrasound', amount: 50000 }
			]
		},
		{
			id: '#05',
			claimId: 'CLM-2024-005',
			enrolleeId: 'HMO-3321',
			fullName: 'Benjamin Chen',
			providerName: 'University of Calabar Teaching Hospital',
			providerState: 'Cross River',
			email: 'benjamin.chen@riskwise.org',
			status: 'Rejected',
			policyType: 'Bronze',
			coverage: 20,
			phone: '(646) 555-1176',
			date: 'Apr 18th, 2025',
			totalAmount: 5000,
			services: [{ description: 'Eye Test', amount: 5000 }]
		},
		{
			id: '#06',
			claimId: 'CLM-2024-006',
			enrolleeId: 'HMO-5544',
			fullName: 'Lucas Martin',
			providerName: 'Cedar Group Hospital',
			providerState: 'Lagos',
			email: 'lucas.m@safehar.com',
			status: 'Treated',
			policyType: 'Platinum',
			coverage: 100,
			phone: '(480) 555-6712',
			date: 'Feb 10th, 2025',
			totalAmount: 250000,
			services: [
				{ description: 'Surgery (Appendectomy)', amount: 200000 },
				{ description: 'Post-op Care', amount: 50000 }
			]
		},
		{
			id: '#07',
			claimId: 'CLM-2024-007',
			enrolleeId: 'HMO-2233',
			fullName: 'Aria Castillo',
			providerName: 'Garki Hospital',
			providerState: 'FCT',
			email: 'aria.castillo@gmail.com',
			status: 'Accepted',
			policyType: 'Silver',
			coverage: 75,
			phone: '(919) 555-7135',
			date: 'May 15th, 2025',
			totalAmount: 30000,
			services: [
				{ description: 'Typhoid Treatment', amount: 20000 },
				{ description: 'Lab Tests', amount: 10000 }
			]
		},
		{
			id: '#08',
			claimId: 'CLM-2024-008',
			enrolleeId: 'HMO-8811',
			fullName: 'Elijah Ford',
			providerName: 'First Cardiology Consultants',
			providerState: 'Lagos',
			email: 'elijah.f@coveragehq.com',
			status: 'Rejected',
			policyType: 'Bronze',
			coverage: 30,
			phone: '(503) 555-9342',
			date: 'Jun 5th, 2025',
			totalAmount: 18000,
			services: [
				{ description: 'Cardiology Session', amount: 15000 },
				{ description: 'ECG', amount: 3000 }
			]
		},
		{
			id: '#09',
			claimId: 'CLM-2024-009',
			enrolleeId: 'HMO-4422',
			fullName: 'Imran Khan',
			providerName: 'Nizamiye Hospital',
			providerState: 'FCT',
			email: 'imrankhanik4@pti.com',
			status: 'Accepted',
			policyType: 'Silver',
			coverage: 55,
			phone: '(832) 555-8609',
			date: 'Jun 21st, 2024',
			totalAmount: 60000,
			services: [
				{ description: 'Physiotherapy', amount: 40000 },
				{ description: 'Medication', amount: 20000 }
			]
		},
		{
			id: '#10',
			claimId: 'CLM-2024-010',
			enrolleeId: 'HMO-9900',
			fullName: 'Karim Benzema',
			providerName: 'Lagoon Hospital',
			providerState: 'Lagos',
			email: 'kbenzemafifa@uaef.com',
			status: 'Accepted',
			policyType: 'Platinum',
			coverage: 95,
			phone: '(702) 555-3390',
			date: 'May 8th, 2025',
			totalAmount: 120000,
			services: [
				{ description: 'MRI Scan', amount: 100000 },
				{ description: 'Consultation', amount: 20000 }
			]
		}
	];

	const topFacilities = [
		{ name: 'Lagos University Teaching Hospital', state: 'Lagos', amount: 1290000 },
		{ name: 'National Hospital Abuja', state: 'FCT Abuja', amount: 1109000 },
		{ name: 'Reddington Hospital', state: 'Lagos', amount: 988000 },
		{ name: 'Cedar Group Hospital', state: 'Lagos', amount: 931000 },
		{ name: 'General Hospital Calabar', state: 'Cross River', amount: 898000 },
		{ name: 'Nizamiye Hospital', state: 'FCT Abuja', amount: 835000 },
		{ name: 'Lagoon Hospital', state: 'Lagos', amount: 798000 },
		{ name: 'First Cardiology Consultants', state: 'Lagos', amount: 768000 }
	];

	const donutChartData = [
		{ label: 'Approved', value: 45, color: '#1e40af' }, // Deep Blue
		{ label: 'Pending', value: 30, color: '#3b82f6' }, // Blue
		{ label: 'Rejected', value: 25, color: '#93c5fd' } // Light Blue
	];

	const historyItems = [
		{
			month: 'MEI',
			day: '04',
			condition: 'Tooth loss',
			treatment: 'Root Planing',
			dentist: 'Drg Soap Mactavish',
			status: 'Accepted',
			note: 'The service was excellent and the staff were very professional. Highly recommended!',
			coverage: 85,
			amount: 45000,
			procedure: 'Comprehensive Scaling & Polishing with Fluoride Treatment',
			provider: 'Lagos University Teaching Hospital'
		},
		{
			month: 'APR',
			day: '30',
			condition: 'Gum Damage',
			treatment: 'Periodontal Scaling',
			dentist: 'Drg Soap Mactavish',
			status: 'Rejected',
			note: 'Wait time was a bit long, but the doctor explained everything clearly.',
			coverage: 60,
			amount: 25000,
			procedure: 'Deep Cleaning & Periodontal Maintenance Therapy',
			provider: 'General Hospital Calabar'
		},
		{
			month: 'APR',
			day: '15',
			condition: 'Caries',
			treatment: 'Tooth filling',
			dentist: 'Drg Soap Mactavish',
			status: 'Pending',
			note: 'Grateful for the quick attention to my toothache. Feeling much better now.',
			coverage: 0,
			amount: 15000,
			procedure: 'Composite Resin Restoration (Posterior Tooth)',
			provider: 'National Hospital Abuja'
		}
	];

	return {
		analyticsBarData,
		kpiCards,
		claimsData,
		topFacilities,
		donutChartData,
		historyItems
	};
};