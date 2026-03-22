import { register, createPatient, uploadPatientId } from '$lib/api';
import { BACKEND_URL } from '$lib/config';

export class UserFormState {
	formData = $state({
		fullname: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
		dob: '',
		gender: '',
		stateOfResidence: '',
		idType: '',
		idNumber: '',
		address: '',
		idFiles: [] as File[],
		nokName: '',
		nokRelation: '',
		nokPhone: '',
		policyRole: 'principal',
		hmoProvider: '',
		policyId: '',
		sponsorId: '',
		policyRelationship: '',
		planTier: '',
		corpCode: '',
		bloodGroup: '',
		genotype: '',
		height: '',
		weight: '',
		allergies: '',
		conditions: '',
		physician: '',
		physician_phone: '',
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
			this.formData.idFiles = [...this.formData.idFiles, ...accepted];
		}
		return accepted.length;
	}

	removeFile(index: number) {
		this.formData.idFiles = this.formData.idFiles.filter((_, idx) => idx !== index);
	}

	validate() {
		const errors: Record<string, string> = {};
		const data = this.formData;

		if (!data.fullname) errors.fullname = 'Full Name is required';
		if (!data.email) errors.email = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email address';

		if (!data.password) errors.password = 'Password is required';
		else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';

		if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';

		if (!data.phone) errors.phone = 'Phone Number is required';
		if (!data.dob) errors.dob = 'Date of Birth is required';
		if (!data.gender) errors.gender = 'Gender is required';
		if (!data.stateOfResidence) errors.stateOfResidence = 'State is required';
		if (!data.address) errors.address = 'Address is required';

		if (!data.nokName) errors.nokName = 'Next of Kin Name is required';
		if (!data.nokRelation) errors.nokRelation = 'Relationship is required';
		if (!data.nokPhone) errors.nokPhone = 'Next of Kin Phone is required';

		if (!data.hmoProvider) errors.hmoProvider = 'HMO Provider is required';
		if (!data.policyId) errors.policyId = 'Policy ID is required';

		if (data.policyRole === 'dependent') {
			if (!data.sponsorId) errors.sponsorId = 'Sponsor ID is required';
			if (!data.policyRelationship)
				errors.policyRelationship = 'Relationship to Holder is required';
		}

		if (!data.planTier) errors.planTier = 'Plan Tier is required';
		if (!data.bloodGroup) errors.bloodGroup = 'Blood Group is required';
		if (!data.genotype) errors.genotype = 'Genotype is required';
		if (!data.height) errors.height = 'Height is required';
		if (!data.weight) errors.weight = 'Weight is required';

		if (!data.consents.privacy) errors.privacy = 'You must agree to the terms';

		this.errors = errors;
		return Object.keys(errors).length === 0;
	}

	async handleSubmit() {
		if (!this.validate()) {
			return { success: false, error: 'Please fix the highlighted errors.' };
		}

		this.isLoading = true;
		try {
			// 1. Register User
			const authResponse = await register(
				this.formData.email,
				this.formData.password,
				this.formData.fullname,
				'patient'
			);

			// 2. Login to get session - REMOVED to redirect to login page instead
			// try {
			// 	await login(this.formData.email, this.formData.password);
			// } catch (e) {
			// 	console.warn('Login after register failed', e);
			// }
			// Store user ID for rollback if needed
			const createdUserId = authResponse.user.id;

			const patientPayload = {
				// Required by schema
				fullName: this.formData.fullname,
				userId: createdUserId,

				// Contact
				email: this.formData.email,
				phone: this.formData.phone,
				address: this.formData.address,
				state: this.formData.stateOfResidence,

				// Personal
				dateOfBirth: this.formData.dob,
				gender: this.formData.gender,

				// Next of Kin
				nokName: this.formData.nokName,
				nokRelationship: this.formData.nokRelation,
				nokPhone: this.formData.nokPhone,

				// Insurance
				hmoProvider: this.formData.hmoProvider,
				insurancePolicyNumber: this.formData.policyId,
				planTier: this.formData.planTier,
				corporateCode: this.formData.corpCode,
				sponsorId: this.formData.sponsorId,
				policyRole: this.formData.policyRole,
				policyRelationship: this.formData.policyRelationship,

				// Medical
				bloodGroup: this.formData.bloodGroup,
				genotype: this.formData.genotype,
				height: this.formData.height ? this.formData.height.toString() : undefined,
				weight: this.formData.weight ? this.formData.weight.toString() : undefined,
				allergies: this.formData.allergies,
				conditions: this.formData.conditions,
				primaryCarePhysician: this.formData.physician,

				// Identification
				identificationType: this.formData.idType,
				identificationNumber: this.formData.idNumber
			};

			try {
				const patientResponse = await createPatient(patientPayload);
				const patient = patientResponse.data;

				// 4. Upload Files
				if (this.formData.idFiles.length > 0 && patient && patient.id) {
					for (const file of this.formData.idFiles) {
						await uploadPatientId(patient.id, file);
					}
				}

				return { success: true };
			} catch (patientError: any) {
				// Patient creation failed - delete the created user to maintain data integrity
				console.error('Patient creation failed, rolling back user creation:', patientError);

				try {
					// Call backend to delete the user
					await fetch(`${BACKEND_URL}/api/auth/user/${createdUserId}`, {
						method: 'DELETE',
						headers: { 'Content-Type': 'application/json' }
					});
					console.log('User deleted successfully after patient creation failure');
				} catch (deleteError) {
					console.error('Failed to delete user after patient creation failure:', deleteError);
				}

				// Re-throw the patient error
				throw patientError;
			}
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
export const idTypes = ['National ID', 'Voters Card', 'Passport', 'Drivers License'];
export const relationships = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend'];
export const hmoProviders = ['AXA Mansard', 'Hygeia HMO', 'Reliance HMO', 'Avon HMO'];
export const planTiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
export const bloodGroups = ['O+', 'O-', 'A+', 'B+', 'AB+'];
export const genotypes = ['AA', 'AS', 'SS', 'AC'];
export const gender = ['Male', 'Female'];
