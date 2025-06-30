// Patient data - moved to separate file for better performance
export const patientData = {
	policy: 'A28475095',
	category: 'Group Membership',
	source: 'Cigna Health',
	sourceType: 'Mail',
	claimsHandler: 'Nick Bortich',
	firstName: 'Peter',
	lastName: 'Morgan',
	ssn: '468 95 5642',
	countryOfBirth: 'United States',
	gender: 'Male',
	maritalStatus: 'Married',
	region: 'USA',
	driversLicense: '',
	dob: 'Jul 10, 1982',
	age: '38 Years 2 Months',
	occupation: 'Architecture',
	smoker: 'No',
	address: {
		line1: '15 Grand Valecrest Crescent',
		line2: '',
		city: 'South Beach',
		state: 'California',
		zipCode: '60210'
	},
	contact: {
		workEmail: 'peter@docounts.com',
		personalEmail: 'peter@gmail.com',
		mobile: '',
		phoneNumber: '(949) 883 0862',
		emergencyNumber: '(949) 883 0866'
	}
};

export const statusTimelineData = [
	{ status: 'Claim Received', date: 'Apr 18, 2020, 10:30 AM', completed: true, current: false },
	{
		status: 'Initial Review',
		date: 'Apr 21, 2020, 10:30 AM',
		completed: true,
		current: false,
		subtext: 'Assigned to Katherine',
		notes: '3 fields marked by Lena Glasco'
	},
	{
		status: 'Evidence Gathering',
		date: 'Apr 28, 2020, 4:27 PM',
		completed: true,
		current: true,
		subtext: 'Send C&P Exam Notice',
		notes: 'John Added Note\nJohn Added Discharge Summary\nMore Updates'
	},
	{ status: 'Provider Review', date: '', completed: false, current: false },
	{ status: 'Entitlement Review', date: '', completed: false, current: false },
	{ status: 'Preparation for Decision Notification', date: '', completed: false, current: false },
	{
		status: 'Payment Processing',
		date: 'Estimated Date Sep 12, 2020',
		completed: false,
		current: false
	}
];
