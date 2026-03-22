import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import { register, createHMO } from '$lib/api';

export class HmoFormState {
	formData = $state({
		// Corporate Identity
		companyName: '',
		website: '',
		address: '',
		logo: [] as File[],

		// Compliance
		licenseType: '',
		licenseDoc: [] as File[],

		// Operational Contacts - SIMPLIFIED
		contactPhone: '',
		contactName: '',
		contactEmail: '',

		// Coverage & Plan Config
		coverageStates: [] as string[],
		planTypes: [] as string[],
		hasApi: false,
		apiUrl: '',

		// Super Admin Account
		adminFirstName: '',
		adminEmail: '', // This will be stored as 'email' in hmos table for login
		password: '',
		confirmPassword: '',

		// Consents
		consents: {
			terms: false
		}
	});

	errors = $state<Record<string, string>>({});
	isLoading = $state(false);

	addFiles(files: File[], type: 'logo' | 'license') {
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

		if (accepted.length > 0) {
			if (type === 'logo') {
				this.formData.logo = [...this.formData.logo, ...accepted];
			} else {
				this.formData.licenseDoc = [...this.formData.licenseDoc, ...accepted];
			}
		}
		return accepted.length;
	}

	removeFile(index: number) {
		this.formData.logo = this.formData.logo.filter((_, i) => i !== index);
	}

	validate() {
		const newErrors: Record<string, string> = {};
		const fd = this.formData;

		// Corporate Identity
		if (!fd.companyName || fd.companyName.length < 2)
			newErrors.companyName = 'Company Name is required';
		if (fd.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(fd.website))
			newErrors.website = 'Invalid URL';
		if (!fd.address || fd.address.length < 10)
			newErrors.address = 'Full Head Office Address required';

		// Operational Contacts - UPDATED
		if (!fd.contactPhone || fd.contactPhone.length < 10)
			newErrors.contactPhone = 'Contact Phone required';
		if (!fd.contactName || fd.contactName.length < 2)
			newErrors.contactName = 'Contact Person Name required';
		if (!fd.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.contactEmail))
			newErrors.contactEmail = 'Valid Contact Email required';

		// Coverage
		if (fd.coverageStates.length === 0) newErrors.coverageStates = 'Select area of operation';
		if (fd.planTypes.length === 0) newErrors.planTypes = 'Select at least one plan type';
		if (fd.hasApi && (!fd.apiUrl || fd.apiUrl.length < 5))
			newErrors.apiUrl = 'API Endpoint is required if API integration is enabled';

		// Admin Auth
		if (!fd.adminFirstName || fd.adminFirstName.length < 2)
			newErrors.adminFirstName = 'Admin Full Name required';
		if (!fd.adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.adminEmail))
			newErrors.adminEmail = 'Valid Admin Email required';
		if (!fd.password || fd.password.length < 8)
			newErrors.password = 'Password must be at least 8 characters';
		if (fd.password !== fd.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

		// Consents
		if (!fd.consents.terms) newErrors.terms = 'You must agree to the terms';

		this.errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async handleSubmit() {
		if (!this.validate()) {
			showToast('warning', 'Action Required', 'Incomplete fields. Please fill in all information');
			return;
		}

		this.isLoading = true;
		try {
			// 1. Register the Admin User
			const userRes = await register(
				this.formData.adminEmail,
				this.formData.password,
				this.formData.adminFirstName
			);

			let userId = '';
			if (userRes && typeof userRes === 'object' && 'id' in userRes) {
				userId = (userRes as any).id;
			} else if (userRes && typeof userRes === 'object' && 'user' in userRes) {
				userId = (userRes as any).user.id;
			} else if (userRes && typeof userRes === 'object' && 'data' in userRes) {
				userId = (userRes as any).data.user.id;
			}

			if (!userId) {
				throw new Error('Failed to retrieve user ID from registration response');
			}

			// 2. Create the HMO Profile - UPDATED TO USE NEW FIELDS
			const hmoData = {
				userId: userId,
				organizationId: userId, // Using user ID as org ID initially

				// Corporate Identity
				companyName: this.formData.companyName,
				website: this.formData.website,
				address: this.formData.address,

				// Compliance
				licenseType: this.formData.licenseType,

				// Operational Contacts - NEW SIMPLIFIED FIELDS
				contactPhone: this.formData.contactPhone,
				contactName: this.formData.contactName,
				// IMPORTANT: adminEmail goes to 'email' field for login
				email: this.formData.adminEmail,

				// Coverage & Config
				coverageStates: JSON.stringify(this.formData.coverageStates),
				planTypes: JSON.stringify(this.formData.planTypes),
				hasApi: this.formData.hasApi,
				apiUrl: this.formData.hasApi ? this.formData.apiUrl : undefined
			};

			const hmoRes = await createHMO(hmoData);

			const now = new Date();
			const timestamp = formatDate(now);
			showToast(
				'success',
				'Registration Successful',
				`Your HMO account has been created.\n${timestamp}`
			);

			// Redirect to success/pending page or login
			setTimeout(() => {
				goto('/login');
			}, 2000);
		} catch (error: any) {
			console.error('HMO Registration Error:', error);
			let message = 'An unexpected error occurred.';

			if (error.body && error.body.message) {
				message = error.body.message;
			} else if (error.message) {
				message = error.message;
			}

			if (
				message.toLowerCase().includes('already exists') ||
				message.toLowerCase().includes('duplicate')
			) {
				message = 'This email is already registered. Please use a different email.';
			}

			showToast('error', 'Registration Failed', message);
		} finally {
			this.isLoading = false;
		}
	}
}

// Helper functions for toasts
function formatDate(date: Date): string {
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: '2-digit',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	};
	return date.toLocaleString('en-US', options).replace(',', '').replace(',', ' at');
}

function showToast(type: 'success' | 'warning' | 'error', title: string, message: string) {
	if (type === 'success') {
		toast.success(title, { description: message });
	} else if (type === 'warning') {
		toast.warning(title, { description: message });
	} else {
		toast.error(title, { description: message });
	}
}

// Data Lists
export const licenseTypes = [
	{ value: 'national', label: 'National HMO' },
	{ value: 'regional', label: 'Regional HMO' },
	{ value: 'state', label: 'State Social Health Insurance' }
];

export const planTypesList = [
	'Retail (Personal)',
	'Corporate',
	'Family',
	'Senior',
	'International',
	'SME'
];
