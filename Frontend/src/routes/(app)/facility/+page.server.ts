import type { PageServerLoad } from './$types';

const BACKEND_URL =
	(import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';

// Available staff roles (database access privileges)
const staffRoles = [
	{ value: 'super_admin', label: 'Super Admin' },
	{ value: 'admin', label: 'Admin' },
	{ value: 'manager', label: 'Manager' },
	{ value: 'editor', label: 'Editor' },
	{ value: 'contributor', label: 'Contributor' },
	{ value: 'viewer', label: 'Viewer' },
	{ value: 'guest', label: 'Guest' }
];

// KPI Overview Items (Updated for Healthcare)
const overviewItems = [
	{
		label: 'TOTAL PATIENTS',
		amount: '12,847',
		change: '+12.5%',
		changePositive: true,
		changeColor: 'bg-emerald-100 text-emerald-600',
		delta: '+1,247',
		deltaText: 'from last month',
		iconName: 'Users'
	},
	{
		label: 'CLAIMS PROCESSED',
		amount: '₦24.5M',
		change: '+8.3%',
		changePositive: true,
		changeColor: 'bg-emerald-100 text-emerald-600',
		delta: '+₦2.1M',
		deltaText: 'from last month',
		iconName: 'FileText'
	},
	{
		label: 'APPOINTMENTS',
		amount: '3,456',
		change: '+15.2%',
		changePositive: true,
		changeColor: 'bg-emerald-100 text-emerald-600',
		delta: '+456',
		deltaText: 'from last month',
		iconName: 'Calendar'
	}
];

// Staff Directory data with email addresses
// Clients Data for Feedback Dashboard
// Clients Data for Feedback Dashboard
const clients = [
	{
		id: '1',
		name: 'Sarah Johnson',
		email: 'sarah.j@example.com',
		hmo: 'AXA Mansard',
		enrolleeId: 'AXA/2023/8821',
		appointmentDate: 'Dec 12, 2024',
		appointmentTime: '09:00 AM',
		visitType: 'General Checkup',
		tier: 'Gold',
		feedback:
			'The service was excellent! Dr. James was very attentive and the wait time was minimal. I really appreciate the clean environment.',
		ratings: [9, 8, 9, 10, 8] // Cleanliness, Staff, Wait Time, Care, Overall
	},
	{
		id: '2',
		name: 'Michael Chen',
		email: 'm.chen@example.com',
		hmo: 'Reliance HMO',
		enrolleeId: 'REL/2024/1102',
		appointmentDate: 'Dec 12, 2024',
		appointmentTime: '10:30 AM',
		visitType: 'Dental Care',
		tier: 'Platinum',
		feedback:
			'Good experience overall, but the parking situation could be improved. The dental procedure was quick and painless.',
		ratings: [7, 9, 6, 9, 8]
	},
	{
		id: '3',
		name: 'Amara Okafor',
		email: 'amara.o@example.com',
		hmo: 'Hygeia HMO',
		enrolleeId: 'HYG/2023/5543',
		appointmentDate: 'Dec 12, 2024',
		appointmentTime: '11:45 AM',
		visitType: 'Specialist Consultation',
		tier: 'Gold',
		feedback:
			'I had to wait a bit longer than expected, but the specialist was very knowledgeable and helpful. Worth the wait.',
		ratings: [8, 8, 5, 9, 7]
	},
	{
		id: '4',
		name: 'David Smith',
		email: 'd.smith@example.com',
		hmo: 'Leadway Health',
		enrolleeId: 'LDW/2024/0091',
		appointmentDate: 'Dec 13, 2024',
		appointmentTime: '02:15 PM',
		visitType: 'Follow-up',
		tier: 'Silver',
		feedback:
			'Standard follow-up. Nothing extraordinary, but efficient processing of my HMO details.',
		ratings: [7, 7, 8, 7, 7]
	},
	{
		id: '5',
		name: 'Priya Patel',
		email: 'priya.p@example.com',
		hmo: 'AXA Mansard',
		enrolleeId: 'AXA/2024/3321',
		appointmentDate: 'Dec 13, 2024',
		appointmentTime: '03:30 PM',
		visitType: 'Eye Exam',
		tier: 'Platinum',
		feedback:
			'Fantastic facility! The equipment looks state-of-the-art and the staff were incredibly friendly.',
		ratings: [10, 10, 9, 10, 10]
	}
];

// Healthcare Facility Rating Metrics for progress bars
const baseRatingMetrics = [
	{ stars: 5, label: 'Patient Waiting Time', count: 1823 },
	{ stars: 4, label: 'Staff Responsiveness', count: 654 },
	{ stars: 3, label: 'Cleanliness & Hygiene', count: 227 },
	{ stars: 2, label: 'Equipment Quality', count: 85 },
	{ stars: 1, label: 'Communication', count: 58 },
	{ stars: 0, label: 'Overall Satisfaction', count: 156 }
];

// Patient Reviews Data with HMO
const patientReviews = [
	{
		id: '1',
		patientName: 'Adaeze Okafor',
		patientInitials: 'AO',
		rating: 5,
		date: '2 days ago',
		comment: 'Excellent service! The doctors were very professional and caring.',
		department: 'Cardiology',
		hmo: 'AXA Mansard',
		avatar: 'bg-gradient-to-br from-violet-500 to-purple-600'
	},
	{
		id: '2',
		patientName: 'Chukwuemeka Nwosu',
		patientInitials: 'CN',
		rating: 4,
		date: '5 days ago',
		comment: 'Good experience overall. Wait time could be improved.',
		department: 'Neurology',
		hmo: 'Reliance HMO',
		avatar: 'bg-gradient-to-br from-blue-500 to-cyan-600'
	},
	{
		id: '3',
		patientName: 'Fatima Ibrahim',
		patientInitials: 'FI',
		rating: 5,
		date: '1 week ago',
		comment: 'Very satisfied with the care I received. Highly recommend!',
		department: 'Pediatrics',
		hmo: 'Hygeia HMO',
		avatar: 'bg-gradient-to-br from-rose-500 to-pink-600'
	}
];

// HMO Clients Data for Insights (with percentages for bar chart)
const hmoClients = [
	{ name: 'AXA Mansard', clients: 2847, percentage: 100, barColor: 'bg-indigo-500' },
	{ name: 'Reliance HMO', clients: 1523, percentage: 53, barColor: 'bg-violet-500' },
	{ name: 'Hygeia HMO', clients: 892, percentage: 31, barColor: 'bg-blue-500' },
	{ name: 'Leadway Health', clients: 456, percentage: 16, barColor: 'bg-emerald-500' }
];

// Rating Statistics - Plan style metrics
const ratingStats = {
	overall: 4.8,
	totalReviews: 2847,
	targetReviews: 3000,
	satisfactionScore: 87,
	targetSatisfaction: 100
};

// Insights data
const insights = {
	patientsReached: 5192,
	newPatients: 287,
	avgWaitTime: '12 min',
	bedOccupancy: '78%'
};

// Mini bar chart data for insights
const weeklyData = [65, 45, 78, 52, 88, 72, 95];

export const load = (async ({ parent, fetch, cookies }) => {
	// Get user data from parent layout
	const parentData = await parent();
	const user = parentData.user;

	if (!user?.email) {
		return {
			hospital: null,
			error: 'User not authenticated',
			staffRoles,
			overviewItems,
			clients,
			baseRatingMetrics,
			patientReviews,
			hmoClients,
			ratingStats,
			insights,
			weeklyData
		};
	}

	try {
		// Fetch hospital profile from backend
		const res = await fetch(
			`${BACKEND_URL}/api/hospitals/profile?email=${encodeURIComponent(user.email)}`,
			{
				headers: {
					cookie: cookies
						.getAll()
						.map((c) => `${c.name}=${c.value}`)
						.join('; ')
				}
			}
		);

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({ error: 'Failed to fetch hospital' }));
			console.error('[FACILITY PROFILE] Error fetching hospital:', errorData);
			return {
				hospital: null,
				error: errorData.error || 'Failed to fetch hospital profile',
				staffRoles,
				overviewItems,
				clients,
				baseRatingMetrics,
				patientReviews,
				hmoClients,
				ratingStats,
				insights,
				weeklyData
			};
		}

		const data = await res.json();

		if (!data.success || !data.data) {
			return {
				hospital: null,
				error: 'Hospital not found',
				staffRoles,
				overviewItems,
				clients,
				baseRatingMetrics,
				patientReviews,
				hmoClients,
				ratingStats,
				insights,
				weeklyData
			};
		}

		// Format dates for display
		const hospital = data.data;
		const createdAt = new Date(hospital.created_at || hospital.createdAt);
		const updatedAt = new Date(hospital.updated_at || hospital.updatedAt);

		// Parse specialties if it's a JSON string
		let specialties = hospital.specialties;
		if (typeof specialties === 'string') {
			try {
				specialties = JSON.parse(specialties);
			} catch {
				specialties = [];
			}
		}

		// Parse equipment if it's a JSON string
		let equipment = hospital.equipment;
		if (typeof equipment === 'string') {
			try {
				equipment = JSON.parse(equipment);
			} catch {
				equipment = [];
			}
		}

		return {
			hospital: {
				...hospital,
				specialties,
				equipment,
				// Formatted dates for display
				dates: [
					{
						label: 'Member since',
						day: createdAt.getDate().toString().padStart(2, '0'),
						month: createdAt.toLocaleString('en-US', { month: 'short' }),
						year: createdAt.getFullYear().toString()
					},
					{
						label: 'Last updated',
						day: updatedAt.getDate().toString().padStart(2, '0'),
						month: updatedAt.toLocaleString('en-US', { month: 'short' }),
						year: updatedAt.getFullYear().toString()
					}
				]
			},
			error: null,
			staffRoles,
			overviewItems,
			clients,
			baseRatingMetrics,
			patientReviews,
			hmoClients,
			ratingStats,
			insights,
			weeklyData
		};
	} catch (error) {
		console.error('[FACILITY PROFILE] Error:', error);
		return {
			hospital: null,
			error: 'Failed to load hospital profile',
			staffRoles,
			overviewItems,
			clients,
			baseRatingMetrics,
			patientReviews,
			hmoClients,
			ratingStats,
			insights,
			weeklyData
		};
	}
}) satisfies PageServerLoad;
