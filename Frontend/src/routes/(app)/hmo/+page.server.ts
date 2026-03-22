import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
	// Get pagination parameters
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '10');

	// HMO Profile Data
	const hmoProfile = {
		name: 'Vitality Health',
		address: '123 Health Blvd, Med City',
		logo: '💊',
		profileStrength: 85,
		status: 'Partner',
		email: 'admin@vitalityhealth.com',
		phone: '+1 (800) 555-0199',
		website: 'vitalityhealth.com',
		contactPerson: 'Dr. Emily Watson',
		licenseType: 'National',
		responseRate: 85,
		satisfaction: 92,
		claimSpeed: 65
	};

	// Dashboard Statistics
	const stats = {
		totalClients: {
			value: 12450,
			change: '+6.2%',
			lastMonth: 11738,
			trend: 'up'
		},
		activePolicies: {
			value: 8932,
			change: '-1.2%',
			lastMonth: 9040,
			trend: 'down'
		},
		claimsProcessed: {
			thisMonth: 450,
			approved: 385,
			approvalRate: '85.5%'
		},
		avgClaimCost: {
			value: '$1,250',
			saved: '+12%'
		},
		satisfaction: {
			rating: 4.8,
			outOf: 5.0,
			reviewCount: 1021
		},
		networkSize: {
			providers: 3420,
			status: 'Active'
		}
	};

	// Client Roster Data
	const clientsData = [
		{
			id: 1,
			name: 'Sarah Jenkins',
			email: 'sarah.j@example.com',
			avatar: 'SJ',
			policyId: 'POL-2938-XJ',
			type: 'Gold Plan',
			status: 'Active' as const,
			lastActivity: 'Oct 24, 2023',
			color: 'bg-blue-500'
		},
		{
			id: 2,
			name: 'Michael Ross',
			email: 'm.ross88@test.com',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
			policyId: 'POL-9921-MC',
			type: 'Silver Plan',
			status: 'Pending' as const,
			lastActivity: 'Oct 22, 2023',
			color: ''
		},
		{
			id: 3,
			name: 'Emily Chen',
			email: 'echen_work@mail.net',
			avatar: 'EC',
			policyId: 'POL-1122-PL',
			type: 'Platinum',
			status: 'Active' as const,
			lastActivity: 'Oct 21, 2023',
			color: 'bg-purple-500'
		},
		{
			id: 4,
			name: 'David Kim',
			email: 'dkim.sub@example.com',
			avatar: 'DK',
			policyId: 'POL-8833-BR',
			type: 'Bronze',
			status: 'Inactive' as const,
			lastActivity: 'Oct 15, 2023',
			color: 'bg-orange-600'
		},
		{
			id: 5,
			name: 'Amanda Lowery',
			email: 'a.lowery@test.org',
			avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
			policyId: 'POL-5541-XJ',
			type: 'Gold Plan',
			status: 'Active' as const,
			lastActivity: 'Oct 12, 2023',
			color: ''
		}
	];

	// Generate claims data (in real app, this would be from database)
	const allClaims = [
		{
			id: 0,
			claimNumber: 'CLM-2024-001',
			status: 'Pending Review',
			priority: 'High',
			plan: 'Platinum',
			submissionDate: '2024-01-15',
			claimAmount: '₦1,000,000.00',
			personalInfo: {
				fullName: 'Adunni Adebayo',
				dateOfBirth: '1985-03-22',
				gender: 'Female',
				phone: '+234 803 123 4567',
				address: '15 Adeniyi Jones Avenue, Ikeja, Lagos State',
				email: 'adunni.adebayo@gmail.com',
				avatar:
					'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face'
			},
			identificationDetails: {
				patientId: 'PAT-2024-0001',
				nationalId: 'NIN-12345678901',
				insurancePolicyNumber: 'POL-789456123',
				memberHealthPlanId: 'HP-456789'
			},
			insuranceDetails: {
				companyName: 'AIICO Insurance Plc',
				groupNumber: 'GRP-001234',
				policyholderName: 'Adunni Adebayo',
				relationshipToPolicyholder: 'Self'
			},
			medicalProviderDetails: {
				providerName: 'Lagos University Teaching Hospital (LUTH)',
				providerAddress: 'Idi-Araba, Surulere, Lagos State',
				physicianName: 'Dr. Chinedu Okwu',
				physicianLicense: 'MDCN-NG-123456',
				facilityProviderNumber: 'FAC-789123'
			},
			visitDetails: {
				serviceDate: '2024-01-10',
				visitType: 'Outpatient',
				reasonForVisit: 'Chest pain and shortness of breath'
			},
			diagnosisAndTreatment: {
				icd10Codes: ['I25.9', 'R06.02'],
				diagnosisDescription: 'Chronic ischemic heart disease, Shortness of breath',
				cptCodes: ['99213', '93000', '71020'],
				procedureDates: ['2024-01-10'],
				medicationsPrescribed: ['Metoprolol 50mg', 'Atorvastatin 20mg']
			},
			authorizationInfo: {
				referralNumber: 'REF-2024-001',
				preAuthNumber: 'AUTH-456789',
				referringDoctor: 'Dr. Lisa Park'
			},
			billingInfo: {
				totalCost: '₦485,000.00',
				procedureCosts: [
					{ description: 'Consultation - Cardiology', cost: '₦50,000.00' },
					{ description: 'ECG', cost: '₦30,000.00' },
					{ description: 'Chest X-Ray', cost: '₦40,000.00' },
					{ description: 'Laboratory Tests', cost: '₦60,000.00' }
				],
				copay: '₦10,000.00',
				deductible: '₦100,000.00',
				patientPaidAmount: '₦110,000.00'
			},
			medicalHistory: {
				allergies: ['Penicillin', 'Shellfish'],
				chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Chronic Ischemic Heart Disease'],
				previousSurgeries: ['Appendectomy (2010)', 'Gallbladder removal (2018)'],
				currentMedications: [
					'Metformin 500mg twice daily',
					'Lisinopril 10mg daily',
					'Aspirin 81mg daily'
				]
			},
			supportingDocuments: [
				'Medical Report - Dr. Okwu',
				'ECG Results',
				'Chest X-Ray Report',
				'Lab Results - Complete Blood Panel',
				'Prescription Details'
			]
		},
		{
			id: 1,
			claimNumber: 'CLM-2024-002',
			status: 'Under Review',
			priority: 'Medium',
			plan: 'Gold',
			submissionDate: '2024-01-18',
			claimAmount: '₦240,000.00',
			personalInfo: {
				fullName: 'Emeka Okafor',
				dateOfBirth: '1978-07-14',
				gender: 'Male',
				phone: '+234 806 987 6543',
				address: '45 Ogui Road, Enugu, Enugu State',
				email: 'emeka.okafor@yahoo.com',
				avatar:
					'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
			},
			identificationDetails: {
				patientId: 'PAT-2024-0002',
				nationalId: 'NIN-98765432109',
				insurancePolicyNumber: 'POL-456789012',
				memberHealthPlanId: 'HP-789012'
			},
			insuranceDetails: {
				companyName: 'Leadway Assurance Company Limited',
				groupNumber: 'GRP-002345',
				policyholderName: 'Emeka Okafor',
				relationshipToPolicyholder: 'Self'
			},
			medicalProviderDetails: {
				providerName: 'University of Nigeria Teaching Hospital (UNTH)',
				providerAddress: 'Ituku-Ozalla, Enugu, Enugu State',
				physicianName: 'Dr. Ngozi Eze',
				physicianLicense: 'MDCN-NG-789012',
				facilityProviderNumber: 'FAC-456789'
			},
			visitDetails: {
				serviceDate: '2024-01-15',
				visitType: 'Emergency',
				reasonForVisit: 'Sports injury - ankle sprain'
			},
			diagnosisAndTreatment: {
				icd10Codes: ['S93.401A'],
				diagnosisDescription: 'Sprain of unspecified ligament of right ankle, initial encounter',
				cptCodes: ['99283', '73610'],
				procedureDates: ['2024-01-15'],
				medicationsPrescribed: ['Ibuprofen 600mg', 'Acetaminophen 500mg']
			},
			authorizationInfo: {
				referralNumber: 'REF-2024-002',
				preAuthNumber: 'AUTH-789012',
				referringDoctor: 'Dr. Adebayo Ogundimu'
			},
			billingInfo: {
				totalCost: '₦240,000.00',
				procedureCosts: [
					{ description: 'Emergency Consultation', cost: '₦80,000.00' },
					{ description: 'Ankle X-Ray', cost: '₦50,000.00' },
					{ description: 'Splint Application', cost: '₦30,000.00' },
					{ description: 'Medications', cost: '₦25,000.00' }
				],
				copay: '₦20,000.00',
				deductible: '₦40,000.00',
				patientPaidAmount: '₦60,000.00'
			},
			medicalHistory: {
				allergies: ['Latex'],
				chronicConditions: ['None'],
				previousSurgeries: ['Wisdom teeth extraction (2015)'],
				currentMedications: ['None - as needed pain relief only']
			},
			supportingDocuments: [
				'Emergency Room Report',
				'Ankle X-Ray Results',
				'Discharge Instructions',
				'Prescription Details',
				'Follow-up Care Plan'
			]
		},
		{
			id: 2,
			claimNumber: 'CLM-2024-003',
			status: 'Approved',
			priority: 'Low',
			plan: 'Silver',
			submissionDate: '2024-01-12',
			claimAmount: '₦170,000.00',
			personalInfo: {
				fullName: 'Fatima Aliyu',
				dateOfBirth: '1992-11-08',
				gender: 'Female',
				phone: '+234 701 456 7890',
				address: '12 Ahmadu Bello Way, Kaduna, Kaduna State',
				email: 'fatima.aliyu@gmail.com',
				avatar:
					'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
			},
			identificationDetails: {
				patientId: 'PAT-2024-0003',
				nationalId: 'NIN-45678901234',
				insurancePolicyNumber: 'POL-123456789',
				memberHealthPlanId: 'HP-123456'
			},
			insuranceDetails: {
				companyName: 'AXA Mansard Insurance Plc',
				groupNumber: 'GRP-003456',
				policyholderName: 'Fatima Aliyu',
				relationshipToPolicyholder: 'Self'
			},
			medicalProviderDetails: {
				providerName: 'Ahmadu Bello University Teaching Hospital',
				providerAddress: 'Shika, Zaria, Kaduna State',
				physicianName: 'Dr. Hauwa Ibrahim',
				physicianLicense: 'MDCN-NG-345678',
				facilityProviderNumber: 'FAC-123456'
			},
			visitDetails: {
				serviceDate: '2024-01-08',
				visitType: 'Outpatient',
				reasonForVisit: 'Annual physical examination'
			},
			diagnosisAndTreatment: {
				icd10Codes: ['Z00.00'],
				diagnosisDescription:
					'Encounter for general adult medical examination without abnormal findings',
				cptCodes: ['99395', '85025', '80053'],
				procedureDates: ['2024-01-08'],
				medicationsPrescribed: ['Multivitamin daily']
			},
			authorizationInfo: {
				referralNumber: 'REF-2024-003',
				preAuthNumber: 'AUTH-123456',
				referringDoctor: 'Self-referred'
			},
			billingInfo: {
				totalCost: '₦170,000.00',
				procedureCosts: [
					{ description: 'Annual Physical Examination', cost: '₦80,000.00' },
					{ description: 'Complete Blood Count', cost: '₦30,000.00' },
					{ description: 'Comprehensive Metabolic Panel', cost: '₦40,000.00' },
					{ description: 'Preventive Care Counseling', cost: '₦20,000.00' }
				],
				copay: '₦0.00',
				deductible: '₦0.00',
				patientPaidAmount: '₦0.00'
			},
			medicalHistory: {
				allergies: ['None known'],
				chronicConditions: ['None'],
				previousSurgeries: ['None'],
				currentMedications: ['Multivitamin daily', 'Birth control pill']
			},
			supportingDocuments: [
				'Annual Physical Report',
				'Lab Results - CBC',
				'Lab Results - CMP',
				'Preventive Care Guidelines',
				'Next Appointment Reminder'
			]
		},
		{
			id: 3,
			claimNumber: 'CLM-2024-004',
			status: 'Rejected',
			priority: 'High',
			plan: 'Gold',
			submissionDate: '2024-01-20',
			claimAmount: '₦640,000.00',
			personalInfo: {
				fullName: 'Olumide Adeyemi',
				dateOfBirth: '1965-05-30',
				gender: 'Male',
				phone: '+234 802 234 5678',
				address: '78 Ikorodu Road, Palmgrove, Lagos State',
				email: 'olumide.adeyemi@hotmail.com',
				avatar:
					'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
			},
			identificationDetails: {
				patientId: 'PAT-2024-0004',
				nationalId: 'NIN-23456789012',
				insurancePolicyNumber: 'POL-987654321',
				memberHealthPlanId: 'HP-987654'
			},
			insuranceDetails: {
				companyName: 'NSIA Insurance Limited',
				groupNumber: 'GRP-004567',
				policyholderName: 'Olumide Adeyemi',
				relationshipToPolicyholder: 'Self'
			},
			medicalProviderDetails: {
				providerName: 'National Hospital Abuja',
				providerAddress: 'Central Business District, Abuja, FCT',
				physicianName: 'Dr. Kemi Ogunleye',
				physicianLicense: 'MDCN-NG-456789',
				facilityProviderNumber: 'FAC-987654'
			},
			visitDetails: {
				serviceDate: '2024-01-17',
				visitType: 'Inpatient',
				reasonForVisit: 'Cardiac catheterization procedure'
			},
			diagnosisAndTreatment: {
				icd10Codes: ['I25.10', 'Z95.1'],
				diagnosisDescription:
					'Atherosclerotic heart disease of native coronary artery without angina pectoris',
				cptCodes: ['93458', '92928', '93016'],
				procedureDates: ['2024-01-17'],
				medicationsPrescribed: ['Clopidogrel 75mg', 'Atorvastatin 40mg', 'Metoprolol 100mg']
			},
			authorizationInfo: {
				referralNumber: 'REF-2024-004',
				preAuthNumber: 'AUTH-987654',
				referringDoctor: 'Dr. Funmi Adebayo'
			},
			billingInfo: {
				totalCost: '₦640,000.00',
				procedureCosts: [
					{ description: 'Cardiac Catheterization', cost: '₦400,000.00' },
					{ description: 'Coronary Angioplasty', cost: '₦160,000.00' },
					{ description: 'ECG Monitoring', cost: '₦40,000.00' },
					{ description: 'Hospital Stay (1 day)', cost: '₦40,000.00' }
				],
				copay: '₦40,000.00',
				deductible: '₦200,000.00',
				patientPaidAmount: '₦240,000.00'
			},
			medicalHistory: {
				allergies: ['Sulfa drugs', 'Iodine contrast'],
				chronicConditions: [
					'Coronary Artery Disease',
					'Hypertension',
					'High Cholesterol',
					'Type 2 Diabetes'
				],
				previousSurgeries: [
					'Coronary angioplasty (2020)',
					'Hernia repair (2015)',
					'Cataract surgery (2022)'
				],
				currentMedications: [
					'Metoprolol 100mg daily',
					'Atorvastatin 40mg daily',
					'Metformin 1000mg twice daily',
					'Aspirin 81mg daily'
				]
			},
			supportingDocuments: [
				'Cardiac Catheterization Report',
				'Angioplasty Procedure Notes',
				'ECG Results',
				'Discharge Summary',
				'Medication List',
				'Follow-up Care Instructions'
			]
		}
	];

	// Implement pagination for better performance
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedClaims = allClaims.slice(startIndex, endIndex);

	return {
		hmoProfile,
		stats,
		clientsData,
		claims: paginatedClaims,
		pagination: {
			page,
			limit,
			total: allClaims.length,
			totalPages: Math.ceil(allClaims.length / limit),
			hasMore: endIndex < allClaims.length
		}
	};
};
