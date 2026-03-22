import type { PageServerLoad } from './$types';
import { getFacilitiesByState } from '$lib/server/facilities';

const BACKEND_URL =
	(import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';

export const load = (async ({ fetch, parent }) => {
	// Get user from parent layout
	const { user } = await parent();

	// Fetch states from external API
	let states: { value: string; label: string }[] = [];
	try {
		const response = await fetch('https://naija-places.toneflix.com.ng/api/v1/states', {
			headers: {
				'X-Api-Key': 'y6y1j1PVKYaZ9JLMTkf3zOIpriail931'
			}
		});
		const result = await response.json();
		if (result.data && Array.isArray(result.data)) {
			states = result.data.map((s: any) => ({
				value: s.name,
				label: s.name
			}));
		}
	} catch (error) {
		console.error('Error fetching states:', error);
	}

	// Get facilities from CSV
	const facilities = await getFacilitiesByState();

	// Fetch patient data from backend if user is logged in
	let currentPatient = null;
	if (user) {
		try {
			const res = await fetch(
				`${BACKEND_URL}/api/patients/dashboard?email=${encodeURIComponent(user.email)}&userId=${encodeURIComponent(user.id)}`
			);
			if (res.ok) {
				const result = await res.json();
				if (result.success && result.data) {
					const patientProfile = result.data.userProfile;

					// Use patient table fields directly from the database
					// The policy field comes from insurance_policy_number in the patients table
					currentPatient = {
						id: result.debug?.targetPatientId || 0,
						value: user.id,
						label: patientProfile.name || user.name || 'Unknown Patient',
						policy:
							result.data.contactDetails?.find((c: any) => c.label === 'Policy / Member ID')
								?.value || 'N/A',
						address: patientProfile.address || 'N/A',
						email: patientProfile.email || user.email,
						phone: patientProfile.phone || 'N/A'
					};
				}
			}
		} catch (error) {
			console.error('Error fetching patient data:', error);
		}
	}

	// Default service items
	const defaultItems = [
		{
			name: 'Consultation',
			qty: 1,
			price: 15000
		},
		{
			name: 'Blood Test',
			qty: 1,
			price: 8000
		}
	];

	// Generate invoice number
	const generateInvoiceNumber = () => {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const random = Math.floor(Math.random() * 1000)
			.toString()
			.padStart(3, '0');
		return `MED-INV-${year}-${month}-${random}`;
	};

	return {
		states,
		facilities,
		currentPatient,
		defaultItems,
		invoiceNumber: generateInvoiceNumber(),
		serviceDate: new Date().toLocaleDateString('en-GB'),
		dueDate: '30 days from issue',
		defaultProvider: null
	};
}) satisfies PageServerLoad;
