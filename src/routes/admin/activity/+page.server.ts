import type { PageServerLoad } from './$types';

// Mock data for Health Insurance Claims
const healthClaims = [
	{
		id: 1,
		patientName: 'John Doe',
		policyNumber: 'POL-2023-0001',
		gender: 'Male',
		age: 34,
		claimStatus: 'Pending',
		diagnosis: 'Acute Bronchitis',
		treatment: 'Antibiotics, Rest',
		notes: 'Requires follow-up in 2 weeks.',
		amount: 320,
		claimGrade: 'Grade B',
		submissionDate: '2024-05-10',
		claimDescription: 'Shortness of breath, cough, fever.',
		additionalNotes: 'No prior history.',
		quantity: 1,
		maxQuantity: 1
	},
	{
		id: 2,
		patientName: 'Jane Smith',
		policyNumber: 'POL-2023-0002',
		gender: 'Female',
		age: 29,
		claimStatus: 'Approved',
		diagnosis: 'Sprained Ankle',
		treatment: 'Physical therapy',
		notes: 'Claim approved for outpatient therapy.',
		amount: 150,
		claimGrade: 'Grade A',
		submissionDate: '2024-05-12',
		claimDescription: 'Swelling and pain after fall.',
		additionalNotes: 'No fracture detected.',
		quantity: 1,
		maxQuantity: 1
	},
	{
		id: 3,
		patientName: 'Michael Brown',
		policyNumber: 'POL-2023-0003',
		gender: 'Male',
		age: 47,
		claimStatus: 'Rejected',
		diagnosis: 'Hypertension',
		treatment: 'Medication',
		notes: 'Claim rejected: pre-existing condition.',
		amount: 0,
		claimGrade: 'Grade C',
		submissionDate: '2024-05-15',
		claimDescription: 'Routine checkup, high blood pressure.',
		additionalNotes: 'Patient advised to reapply next year.',
		quantity: 1,
		maxQuantity: 1
	},
	{
		id: 4,
		patientName: 'Emily Clark',
		policyNumber: 'POL-2023-0004',
		gender: 'Female',
		age: 52,
		claimStatus: 'Pending',
		diagnosis: 'Type 2 Diabetes',
		treatment: 'Insulin therapy',
		notes: 'Pending review by medical board.',
		amount: 500,
		claimGrade: 'Grade B',
		submissionDate: '2024-05-18',
		claimDescription: 'Elevated blood sugar, fatigue.',
		additionalNotes: 'Family history of diabetes.',
		quantity: 1,
		maxQuantity: 1
	},
	{
		id: 5,
		patientName: 'David Lee',
		policyNumber: 'POL-2023-0005',
		gender: 'Male',
		age: 41,
		claimStatus: 'Approved',
		diagnosis: 'Appendicitis',
		treatment: 'Appendectomy',
		notes: 'Claim approved for surgery.',
		amount: 1200,
		claimGrade: 'Grade A',
		submissionDate: '2024-05-20',
		claimDescription: 'Severe abdominal pain, surgery performed.',
		additionalNotes: 'Recovery normal.',
		quantity: 1,
		maxQuantity: 1
	}
];

export const load = (async () => {
	return {
		macbooks: healthClaims,
		orderInfo: {
			orderId: 'CLM-2024-001',
			orderTime: '2024-06-01 10:30',
			totalItems: 5,
			totalPrice: '2 170 €'
		}
	};
}) satisfies PageServerLoad;
