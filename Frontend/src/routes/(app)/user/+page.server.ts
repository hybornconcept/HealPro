import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const BACKEND_URL =
	(import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';

export const load: PageServerLoad = async ({ parent, fetch }) => {
	const { user } = await parent();

	if (!user) {
		throw redirect(303, '/login');
	}

	// Fetch patient data from backend
	let patientData = null;
	console.log('Fetching patient data for:', user.email);
	try {
		const res = await fetch(
			`${BACKEND_URL}/api/patients/dashboard?email=${encodeURIComponent(user.email)}&userId=${encodeURIComponent(user.id)}`
		);
		console.log('Fetch response status:', res.status);
		if (res.ok) {
			const result = await res.json();
			console.log('Fetch result success:', result.success);
			if (result.success) {
				patientData = result.data;
				console.log('Patient appointments count:', patientData.appointments?.length);
			} else {
				console.error('Fetch failed with error:', result.error);
			}
		} else {
			const text = await res.text();
			console.error('Fetch failed with status:', res.status, text);
		}
	} catch (error) {
		console.error('Error fetching patient data:', error);
	}

	const sliders = [
		{
			title: 'Quality of medical care and treatment',
			color: 'bg-emerald-500'
		},
		{
			title: 'Staff professionalism and bedside manner',
			color: 'bg-blue-500'
		},
		{
			title: 'Cleanliness and hygiene standards',
			color: 'bg-purple-500'
		},
		{
			title: 'Wait times and appointment scheduling',
			color: 'bg-amber-500'
		},
		{
			title: 'Overall hospital facilities and equipment',
			color: 'bg-rose-500'
		}
	];

	// Default empty structure
	let userProfile = {
		name: user.name || 'User Name',
		email: user.email,
		phone: '(000) 000 0000',
		address: 'Not provided',
		avatar: user.image || '/placeholder-avatar-1.svg',
		stats: { past: 5, upcoming: 2 },
		personalDetails: [] as any[],
		medicalDetails: [] as any[],
		dependentDetails: [] as any[],
		insuranceCard: {
			provider: 'Axa Mansard',
			enrolleeId: '5323 2099 2000',
			planTier: 'Platinum',
			expiryDate: '05/26'
		}
	};

	let appointments: any[] = [];

	const hospitalInfo = {
		name: 'General Hospital Lagos',
		location: 'Victoria Island, Lagos State',
		initials: 'GH',
		unit: 'Cardiology',
		rating: '4.2/5'
	};

	let serviceTimeline = [
		{
			title: 'Routine check up',
			date: '30 Nov 2024 • 5:23 PM',
			details: 'Blood pressure, heart rate, general physical examination',
			status: 'completed'
		},
		{
			title: 'Check lab',
			date: '23 Nov 2024 • 5:23 PM',
			details: 'Blood test, urine analysis, cholesterol screening',
			status: 'completed'
		},
		{
			title: 'Control of lab results',
			date: '18 Nov 2024 • 5:23 PM',
			details: 'Review blood work, discuss findings with physician',
			status: 'pending'
		},
		{
			title: 'Drug control',
			date: '11 Nov 2024 • 5:23 PM',
			details: 'Medication review, dosage adjustment, side effects check',
			status: 'pending'
		},
		{
			title: 'Routine check up',
			date: '4 Nov 2024 • 5:23 PM',
			details: 'Follow-up examination, vital signs monitoring',
			status: 'pending'
		},
		{
			title: 'Check lab',
			date: '27 Oct 2024 • 5:23 PM',
			details: 'Liver function test, kidney function assessment',
			status: 'pending'
		},
		{
			title: 'Control of lab results',
			date: '20 Oct 2024 • 5:23 PM',
			details: 'Lab report analysis, treatment plan discussion',
			status: 'pending'
		}
	];

	if (patientData) {
		const pd = patientData.userProfile;
		const cd = patientData.contactDetails || [];
		const deps = pd.dependents || [];

		const getContact = (label: string) =>
			cd.find((i: any) => i.label === label) || { label, value: 'Not provided' };

		const policyHolder = getContact('Policy Holder');
		const isPrincipal = policyHolder.value.toLowerCase().includes('principal');

		// Fictitious dependent details - one dependent per row
		const dependentDetails = [
			{ label: 'Dependent 1 Name', value: 'Sarah Johnson' },
			{ label: 'Relationship', value: 'Wife' },
			{ label: 'Dependent 1 ID', value: 'DEP-2024-001' },
			{ label: 'Plan', value: 'Gold' },
			{ label: 'Dependent 2 Name', value: 'Michael Johnson' },
			{ label: 'Relationship', value: 'Child' },
			{ label: 'Dependent 2 ID', value: 'DEP-2024-002' },
			{ label: 'Plan', value: 'Platinum' },
			{ label: 'Dependent 3 Name', value: 'Emily Johnson' },
			{ label: 'Relationship', value: 'Child' },
			{ label: 'Dependent 3 ID', value: 'DEP-2024-003' },
			{ label: 'Plan', value: 'Silver' }
		];

		// Insurance card data from database
		const insuranceCard = {
			provider: getContact('HMO Provider').value,
			enrolleeId: getContact('Policy / Member ID').value,
			planTier: getContact('Plan Tier').value,
			expiryDate: '05/26' // This could be fetched from database if available
		};

		userProfile = {
			name: pd.name,
			email: pd.email,
			phone: pd.phone,
			address: pd.address,
			avatar: pd.avatar,
			stats: pd.stats || userProfile.stats,
			personalDetails: [
				...pd.personalDetails,
				getContact('Next of Kin'),
				getContact('Relationship'),
				getContact('NOK Phone'),
				...deps.map((d: any) => ({ label: `Dependent (${d.label})`, value: d.value }))
			],
			medicalDetails: pd.medicalDetails,
			dependentDetails,
			insuranceCard
		};

		if (patientData.appointments) {
			appointments = patientData.appointments;
		}
		if (patientData.serviceTimeline) {
			serviceTimeline = patientData.serviceTimeline;
		}
	} else {
		// Fallback data if fetch fails
		userProfile.personalDetails = [
			{ label: 'Full Name', value: user.name || 'Not provided' },
			{ label: 'Email', value: user.email }
		];
	}

	return {
		sliders,
		userProfile,
		appointments,
		hospitalInfo,
		serviceTimeline
	};
};
