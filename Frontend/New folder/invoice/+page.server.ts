import type { PageServerLoad } from './$types';

interface Claim {
	id: string;
	claimNumber: string;
	patientName: string;
	claimType: string;
	amount: number;
	status: 'Approved';
	date: string;
	dueDate: string;
	isPaid: boolean;
	enrolleeId: string;
	plan: 'Gold' | 'Silver' | 'Platinum';
	clientId: string;
	provider: string;
	services: Array<{
		description: string;
		units: number;
		price: number;
		amount: number;
	}>;
	patientInfo: {
		address: string;
		phone: string;
		email: string;
		policyNumber: string;
	};
}

export const load = (async () => {
	const claims: Claim[] = [
		{
			id: '1',
			claimNumber: 'CLM-2025-001',
			patientName: 'Adebayo Ogundimu',
			claimType: 'Medical',
			amount: 125000.0,
			status: 'Approved',
			date: 'Feb 15, 2025',
			dueDate: 'Feb 20, 2025',
			isPaid: true,
			enrolleeId: 'ENR001',
			plan: 'Gold',
			clientId: 'A7B9X',
			provider: 'AIICO Insurance',
			services: [
				{ description: 'General Consultation', units: 1, price: 7500, amount: 7500 },
				{ description: 'Blood Test', units: 1, price: 10000, amount: 10000 },
				{ description: 'X-Ray Examination', units: 1, price: 15000, amount: 15000 }
			],
			patientInfo: {
				address: 'Lagos University Teaching Hospital, Lagos',
				phone: '+234 803 123 4567',
				email: 'adebayo.ogundimu@email.com',
				policyNumber: 'POL-789456'
			}
		},
		{
			id: '2',
			claimNumber: 'CLM-2025-002',
			patientName: 'Fatima Abdullahi',
			claimType: 'Dental',
			amount: 60000.0,
			status: 'Approved',
			date: 'Feb 16, 2025',
			dueDate: 'Feb 21, 2025',
			isPaid: false,
			enrolleeId: 'ENR002',
			plan: 'Silver',
			clientId: 'M3K8P',
			provider: 'Leadway Assurance',
			services: [
				{ description: 'Dental Cleaning', units: 1, price: 6000, amount: 6000 },
				{ description: 'Cavity Filling', units: 2, price: 9000, amount: 18000 }
			],
			patientInfo: {
				address: 'Perfect Smile Dental Clinic, Abuja',
				phone: '+234 807 987 6543',
				email: 'fatima.abdullahi@email.com',
				policyNumber: 'POL-456789'
			}
		},
		{
			id: '3',
			claimNumber: 'CLM-2025-003',
			patientName: 'Chinedu Okwu',
			claimType: 'Vision',
			amount: 40000.0,
			status: 'Approved',
			date: 'Feb 17, 2025',
			dueDate: 'Feb 22, 2025',
			isPaid: true,
			enrolleeId: 'ENR003',
			plan: 'Platinum',
			clientId: 'Q5R2T',
			provider: 'AXA Mansard',
			services: [
				{ description: 'Eye Examination', units: 1, price: 5000, amount: 5000 },
				{ description: 'Prescription Glasses', units: 1, price: 17500, amount: 17500 }
			],
			patientInfo: {
				address: 'Clear Vision Eye Center, Port Harcourt',
				phone: '+234 806 456 7890',
				email: 'chinedu.okwu@email.com',
				policyNumber: 'POL-123456'
			}
		},
		{
			id: '4',
			claimNumber: 'CLM-2025-004',
			patientName: 'Kemi Adebisi',
			claimType: 'Medical',
			amount: 160000.0,
			status: 'Approved',
			date: 'Feb 18, 2025',
			dueDate: 'Feb 23, 2025',
			isPaid: true,
			enrolleeId: 'ENR004',
			plan: 'Gold',
			clientId: 'H6N4L',
			provider: 'NSIA Insurance',
			services: [
				{ description: 'Emergency Room Visit', units: 1, price: 40000, amount: 40000 },
				{ description: 'CT Scan', units: 1, price: 60000, amount: 60000 },
				{ description: 'Medication', units: 1, price: 7500, amount: 7500 }
			],
			patientInfo: {
				address: 'National Hospital Abuja, FCT',
				phone: '+234 809 234 5678',
				email: 'kemi.adebisi@email.com',
				policyNumber: 'POL-987654'
			}
		},
		{
			id: '5',
			claimNumber: 'CLM-2025-005',
			patientName: 'Ibrahim Musa',
			claimType: 'Dental',
			amount: 90000.0,
			status: 'Approved',
			date: 'Feb 19, 2025',
			dueDate: 'Feb 24, 2025',
			isPaid: false,
			enrolleeId: 'ENR005',
			plan: 'Silver',
			clientId: 'Z9W3V',
			provider: 'Sovereign Trust Insurance',
			services: [
				{ description: 'Root Canal Treatment', units: 1, price: 60000, amount: 60000 },
				{ description: 'Crown Placement', units: 1, price: 30000, amount: 30000 }
			],
			patientInfo: {
				address: 'Elite Dental Care, Kano',
				phone: '+234 805 345 6789',
				email: 'ibrahim.musa@email.com',
				policyNumber: 'POL-654321'
			}
		},
		{
			id: '6',
			claimNumber: 'CLM-2025-006',
			patientName: 'Ngozi Okafor',
			claimType: 'Vision',
			amount: 47500.0,
			status: 'Approved',
			date: 'Feb 20, 2025',
			dueDate: 'Feb 25, 2025',
			isPaid: true,
			enrolleeId: 'ENR006',
			plan: 'Platinum',
			clientId: 'F4D8S',
			provider: 'Custodian Insurance',
			services: [
				{ description: 'Comprehensive Eye Exam', units: 1, price: 7500, amount: 7500 },
				{ description: 'Contact Lens Fitting', units: 1, price: 10000, amount: 10000 },
				{ description: 'Progressive Lenses', units: 1, price: 30000, amount: 30000 }
			],
			patientInfo: {
				address: 'Vision Plus Eye Clinic, Enugu',
				phone: '+234 803 456 7891',
				email: 'ngozi.okafor@email.com',
				policyNumber: 'POL-111222'
			}
		}
	];

	return {
		claims
	};
}) satisfies PageServerLoad;
