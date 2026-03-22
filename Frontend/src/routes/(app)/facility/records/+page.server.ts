export const load = async () => {
	// Mock Patients Data
	const patients = [
		{
			id: '1',
			name: 'Sarah Johnson',
			age: 34,
			gender: 'Female',
			bloodGroup: 'O+',
			genotype: 'AA',
			enrolleeId: 'AXA/2023/8821',
			hmo: 'AXA Mansard',
			lastVisit: 'Dec 12, 2024',
			image: '/avatars/01.png',
			phone: '+234 801 234 5678',
			email: 'sarah.j@example.com',
			address: '123, Victoria Island, Lagos',
			status: 'Active',
			diagnosis: 'Migraine',
			plan: 'Gold',
			encounters: 12
		},
		{
			id: '2',
			name: 'Michael Chen',
			age: 45,
			gender: 'Male',
			bloodGroup: 'A+',
			genotype: 'AS',
			enrolleeId: 'REL/2024/1102',
			hmo: 'Reliance HMO',
			lastVisit: 'Dec 10, 2024',
			image: '/avatars/02.png',
			phone: '+234 802 345 6789',
			email: 'm.chen@example.com',
			address: '45, Ikeja GRA, Lagos',
			status: 'Inactive',
			diagnosis: '-',
			plan: 'Silver',
			encounters: 5
		},
		{
			id: '3',
			name: 'Amara Okafor',
			age: 28,
			gender: 'Female',
			bloodGroup: 'B+',
			genotype: 'AA',
			enrolleeId: 'HYG/2023/5543',
			hmo: 'Hygeia HMO',
			lastVisit: 'Nov 28, 2024',
			image: '/avatars/03.png',
			phone: '+234 803 456 7890',
			email: 'amara.o@example.com',
			address: '10, Lekki Phase 1, Lagos',
			status: 'Active',
			diagnosis: 'Leg fracture',
			plan: 'Platinum',
			encounters: 8
		},
		{
			id: '4',
			name: 'David Smith',
			age: 52,
			gender: 'Male',
			bloodGroup: 'O-',
			genotype: 'AC',
			enrolleeId: 'LDW/2024/0091',
			hmo: 'Leadway Health',
			lastVisit: 'Nov 15, 2024',
			image: '/avatars/04.png',
			phone: '+234 804 567 8901',
			email: 'd.smith@example.com',
			address: '78, Yaba, Lagos',
			status: 'Inactive',
			diagnosis: 'Food allergy (?)',
			plan: 'Bronze',
			encounters: 3
		},
		{
			id: '5',
			name: 'Priya Patel',
			age: 31,
			gender: 'Female',
			bloodGroup: 'AB+',
			genotype: 'AA',
			enrolleeId: 'AXA/2024/3321',
			hmo: 'AXA Mansard',
			lastVisit: 'Oct 30, 2024',
			image: '/avatars/05.png',
			phone: '+234 805 678 9012',
			email: 'priya.p@example.com',
			address: '22, Surulere, Lagos',
			status: 'Active',
			diagnosis: 'Joint replacement',
			plan: 'Gold',
			encounters: 15
		}
	];

	// Mock Medical History for the selected patient (simulated for ID 1)
	const medicalHistory = {
		timeline: [
			{
				id: 1,
				date: 'Dec 12, 2024',
				type: 'Visit',
				title: 'General Checkup',
				doctor: 'Dr. James Brown',
				facility: 'General Hospital Lagos',
				summary: 'Patient reported mild headaches. Vitals normal. Prescribed analgesics.'
			},
			{
				id: 2,
				date: 'Aug 15, 2024',
				type: 'Admission',
				title: 'Malaria Treatment',
				doctor: 'Dr. Sarah Connor',
				facility: 'Lagoon Hospital',
				summary: 'Admitted for 3 days due to severe malaria. Treated with IV Artesunate.'
			},
			{
				id: 3,
				date: 'Jan 10, 2024',
				type: 'Visit',
				title: 'Dental Cleaning',
				doctor: 'Dr. Mike Ross',
				facility: 'Smile 360 Dental',
				summary: 'Routine scaling and polishing. No cavities found.'
			}
		],
		medications: [
			{
				id: 1,
				name: 'Paracetamol',
				dosage: '500mg',
				frequency: 'Twice daily',
				startDate: 'Dec 12, 2024',
				endDate: 'Dec 15, 2024',
				status: 'Active'
			},
			{
				id: 2,
				name: 'Coartem',
				dosage: '80/480mg',
				frequency: 'Twice daily',
				startDate: 'Aug 15, 2024',
				endDate: 'Aug 18, 2024',
				status: 'Completed'
			}
		],
		allergies: [
			{ id: 1, allergen: 'Penicillin', reaction: 'Skin Rash', severity: 'Moderate' },
			{ id: 2, allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Severe' }
		],
		documents: [
			{ id: 1, name: 'Blood Test Results.pdf', date: 'Dec 12, 2024', type: 'Lab Report' },
			{ id: 2, name: 'Chest X-Ray.jpg', date: 'Aug 15, 2024', type: 'Radiology' }
		]
	};

	return {
		patients,
		medicalHistory
	};
};
