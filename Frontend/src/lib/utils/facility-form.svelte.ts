import { register, login, createHospital, uploadHospitalDocs } from '$lib/api';

export class FacilityFormState {
	formData = $state({
		// Identity & Admin Auth
		facilityName: '',
		facilityType: '',
		facilityTier: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
		contactPerson: '',
		website: '',
		idFiles: [] as File[],
		// Location
		address: '',
		city: '',
		state: '',
		operatingHours: '',

		// Compliance
		licenseNumber: '',
		taxId: '',
		cmdName: '',
		cmdFolio: '',
		licenseFiles: [] as File[],

		// Services
		specialties: [] as string[],
		equipment: [] as string[],
		bedCapacity: '',

		// Financials
		bankName: '',
		accountNumber: '',
		accountName: '',

		// Consents
		consents: {
			privacy: false
		}
	});

	errors = $state({} as Record<string, string>);
	isLoading = $state(false);

	addFiles(files: File[]) {
		const allowed = /\.(pdf|docx|png|jpe?g)$/i;
		const accepted = files.filter(
			(f) =>
				(allowed.test(f.name) ||
					[
						'application/pdf',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						'image/png',
						'image/jpeg'
					].includes(f.type)) &&
				f.size <= 5 * 1024 * 1024
		);

		if (accepted.length) {
			this.formData.licenseFiles = [...this.formData.licenseFiles, ...accepted];
		}
		return accepted.length;
	}

	removeFile(index: number) {
		this.formData.licenseFiles = this.formData.licenseFiles.filter((_, idx) => idx !== index);
	}

	validate() {
		const errors: Record<string, string> = {};
		const data = this.formData;

		// Identity & Admin Auth
		if (!data.facilityName) errors.facilityName = 'Facility Name is required';
		if (!data.facilityType) errors.facilityType = 'Facility Type is required';
		if (!data.facilityTier) errors.facilityTier = 'Facility Tier is required';
		if (!data.email) errors.email = 'Official Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email address';

		if (!data.password) errors.password = 'Password is required';
		else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';

		if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';

		if (!data.phone) errors.phone = 'Facility Phone is required';
		if (!data.contactPerson) errors.contactPerson = 'Contact Person Name is required';

		// Location
		if (!data.address) errors.address = 'Street Address is required';
		if (!data.state) errors.state = 'State is required';
		if (!data.operatingHours) errors.operatingHours = 'Operating Hours is required';

		// Compliance
		if (!data.licenseNumber) errors.licenseNumber = 'License Number is required';
		if (!data.taxId) errors.taxId = 'Tax ID is required';
		if (!data.cmdName) errors.cmdName = 'CMD Name is required';
		if (!data.cmdFolio) errors.cmdFolio = 'CMD Folio Number is required';
		// if (data.licenseFiles.length === 0) errors.licenseFiles = 'License document is required'; // Made optional

		// Services
		if (data.specialties.length === 0) errors.specialties = 'Select at least one specialty';
		// bedCapacity is optional - not all facilities have beds (e.g., pharmacies, diagnostic labs)

		// Financials
		if (!data.bankName) errors.bankName = 'Bank Name is required';
		if (!data.accountNumber) errors.accountNumber = 'Account Number is required';
		else if (data.accountNumber.length !== 10)
			errors.accountNumber = 'Account Number must be 10 digits';

		if (!data.consents.privacy) errors.privacy = 'You must agree to the terms';

		this.errors = errors;

		// Debug: Log validation errors
		if (Object.keys(errors).length > 0) {
			console.log('Validation errors:', errors);
		}

		return Object.keys(errors).length === 0;
	}

	async handleSubmit() {
		if (!this.validate()) {
			return { success: false, error: 'Please fix the highlighted errors.' };
		}

		this.isLoading = true;
		try {
			// 2. Register the Admin User (Auth System)
			const authResponse = await register(
				this.formData.email,
				this.formData.password,
				this.formData.facilityName // Use facility name as the user name
			);

			// 3. Create Facility Profile
			const facilityPayload = {
				userId: authResponse.user.id, // Link to the new Auth User

				// Map Identity
				facilityName: this.formData.facilityName,
				facilityType: this.formData.facilityType,
				facilityTier: this.formData.facilityTier,
				contactPerson: this.formData.contactPerson,

				// Map Contact
				email: this.formData.email,
				primaryPhone: this.formData.phone,
				website: this.formData.website,

				// Map Location
				address: this.formData.address,
				city: this.formData.city,
				state: this.formData.state,
				operatingHours: this.formData.operatingHours,
				country: 'Nigeria', // Default country

				// Map Compliance
				licenseNumber: this.formData.licenseNumber,
				taxId: this.formData.taxId,
				cmdName: this.formData.cmdName,
				cmdFolio: this.formData.cmdFolio,

				// Map Services (Convert Arrays to String)
				specialties: JSON.stringify(this.formData.specialties),
				equipment: JSON.stringify(this.formData.equipment),
				bedCapacity: this.formData.bedCapacity ? parseInt(this.formData.bedCapacity) : null,

				// Map Financials
				bankName: this.formData.bankName,
				accountNumber: this.formData.accountNumber,
				accountName: this.formData.accountName
			};

			const response = await createHospital(facilityPayload);

			// 4. Upload Files (License & IDs)
			if (response.success && response.data.id) {
				// Upload License Files
				if (this.formData.licenseFiles.length > 0) {
					await uploadHospitalDocs(response.data.id, 'license', this.formData.licenseFiles[0]);
				}
				// Upload ID Files (Logo or Admin ID)
				if (this.formData.idFiles.length > 0) {
					await uploadHospitalDocs(response.data.id, 'admin_id', this.formData.idFiles[0]);
				}
			}

			return { success: true };
		} catch (error: any) {
			console.error('Registration error:', error);
			let errorMessage = error.message || 'An unexpected error occurred';

			if (error.body) {
				if (typeof error.body === 'string') {
					errorMessage = error.body;
				} else if (error.body.message) {
					errorMessage = error.body.message;
				} else if (error.body.error) {
					errorMessage = error.body.error;
				}
			}

			// Check for existing user specific messages if needed, though the backend usually provides a clear message
			if (
				errorMessage.toLowerCase().includes('already exists') ||
				errorMessage.toLowerCase().includes('duplicate')
			) {
				errorMessage = 'This email is already registered. Please use a different email.';
			}

			return { success: false, error: errorMessage };
		} finally {
			this.isLoading = false;
		}
	}
}

// Data Arrays
export const facilityTypes = [
	'Hospital',
	'Clinic',
	'Pharmacy',
	'Diagnostic Lab',
	'Dental',
	'Optical'
];
export const facilityTiers = ['Primary', 'Secondary', 'Tertiary'];

export const operatingHours = ['24 - hours a day', 'Day only', 'Night only'];

// Grouped Specialties - As requested by user
export const specialtyGroups = {
	'General Medicine': ['General Practice', 'Family Medicine'],
	Surgical: ['General Surgery', 'Neurosurgery', 'Orthopedics'],
	Maternal: ['Antenatal', 'OBS/GYN', 'IVF'],
	Pediatric: ['General Pediatrics', 'NICU', 'Child Surgery'],
	Diagnostic: ['Laboratory', 'Radiology', 'Pathology', 'Pharmacy'],
	Emergency: ['Emergency Room', 'Trauma', 'ICU']
};

export const equipmentList = [
	'MRI Machine',
	'CT Scanner',
	'X-Ray',
	'Ultrasound',
	'ICU Beds',
	'NICU Incubators',
	'Ambulance',
	'Dialysis Machine',
	'Ventilators'
];
