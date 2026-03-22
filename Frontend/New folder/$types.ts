export interface PersonalInfo {
	fullName: string;
	dateOfBirth: string;
	gender: string;
	phone: string;
	address: string;
	email: string;
	avatar: string;
}

export interface IdentificationDetails {
	patientId: string;
	nationalId: string;
	insurancePolicyNumber: string;
	memberHealthPlanId: string;
}

export interface InsuranceDetails {
	companyName: string;
	groupNumber: string;
	policyholderName: string;
	relationshipToPolicyholder: string;
}

export interface MedicalProviderDetails {
	providerName: string;
	providerAddress: string;
	physicianName: string;
	physicianLicense: string;
	facilityProviderNumber: string;
}

export interface VisitDetails {
	serviceDate: string;
	visitType: string;
	reasonForVisit: string;
}

export interface DiagnosisAndTreatment {
	icd10Codes: string[];
	diagnosisDescription: string;
	cptCodes: string[];
	procedureDates: string[];
	medicationsPrescribed: string[];
}

export interface AuthorizationInfo {
	referralNumber: string;
	preAuthNumber: string;
	referringDoctor: string;
}

export interface ProcedureCost {
	description: string;
	cost: string;
}

export interface BillingInfo {
	totalCost: string;
	procedureCosts: ProcedureCost[];
	copay: string;
	deductible: string;
	patientPaidAmount: string;
}

export interface MedicalHistory {
	allergies: string[];
	chronicConditions: string[];
	previousSurgeries: string[];
	currentMedications: string[];
}

export interface Claim {
	id: number;
	claimNumber: string;
	status: string;
	priority: 'High' | 'Medium' | 'Low';
	plan: 'Gold' | 'Silver' | 'Platinum';
	submissionDate: string;
	claimAmount: string;
	personalInfo: PersonalInfo;
	identificationDetails: IdentificationDetails;
	insuranceDetails: InsuranceDetails;
	medicalProviderDetails: MedicalProviderDetails;
	visitDetails: VisitDetails;
	diagnosisAndTreatment: DiagnosisAndTreatment;
	authorizationInfo: AuthorizationInfo;
	billingInfo: BillingInfo;
	medicalHistory?: MedicalHistory;
	supportingDocuments: string[];
}

export interface PageData {
	claims: Claim[];
}
