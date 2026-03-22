import type { PageServerLoad } from './$types';

// Cache facilities data to avoid recreating on every request
const facilitiesCache = [
	{
		id: 'FAC001',
		hospitalName: 'Lagos University Teaching Hospital',
		hospitalCode: 'LUTH-001',
		facilityType: 'General Hospital',
		accreditationStatus: 'Approved',
		ninRegistration: 'RC-123456789',
		licenseValidity: { start: '2023-01-01', expiry: '2025-12-31' },
		address: '1-5 Idi-Araba Road, Surulere, Lagos State',
		geoCoordinates: { lat: 6.5244, lng: 3.3792 },
		phone: '+234-1-7740123',
		email: 'info@luth.edu.ng',
		contactPerson: { name: 'Dr. Adebayo Johnson', title: 'Medical Director' },
		operatingHours: '24/7',
		logoUrl: 'https://www.luth.edu.ng/images/logo.png',
		iconBg: 'bg-blue-600',
		claimsAcceptanceRate: 92,
		avgProcessingTime: 3.2,
		preAuthApprovalRate: 88,
		costPerEnrollee: 1250,
		rejectionRate: 8,
		utilizationRate: 85,
		status: 'Active'
	},
	{
		id: 'FAC002',
		hospitalName: 'National Hospital Abuja',
		hospitalCode: 'NHA-002',
		facilityType: 'Specialist Hospital',
		accreditationStatus: 'Approved',
		ninRegistration: 'RC-987654321',
		licenseValidity: { start: '2023-06-01', expiry: '2026-05-31' },
		address: 'Plot 132 Central District, Abuja FCT',
		geoCoordinates: { lat: 9.0765, lng: 7.3986 },
		phone: '+234-9-4613344',
		email: 'contact@nationalhospital.gov.ng',
		contactPerson: { name: 'Prof. Sarah Adetoro', title: 'Chief Medical Officer' },
		operatingHours: '24/7',
		logoUrl: 'https://nationalhospital.gov.ng/wp-content/uploads/2020/06/logo.png',
		iconBg: 'bg-green-600',
		claimsAcceptanceRate: 89,
		avgProcessingTime: 2.8,
		preAuthApprovalRate: 91,
		costPerEnrollee: 1180,
		rejectionRate: 11,
		utilizationRate: 78,
		status: 'Active'
	},
	{
		id: 'FAC003',
		hospitalName: 'Reddington Hospital Victoria Island',
		hospitalCode: 'RED-003',
		facilityType: 'Private Hospital',
		accreditationStatus: 'Approved',
		ninRegistration: 'RC-456789123',
		licenseValidity: { start: '2023-03-15', expiry: '2025-03-14' },
		address: '12 Idowu Martins Street, Victoria Island, Lagos',
		geoCoordinates: { lat: 6.4281, lng: 3.4219 },
		phone: '+234-1-4617000',
		email: 'info@reddingtonhospital.com',
		contactPerson: { name: 'Dr. Michael Adeyemi', title: 'Hospital Administrator' },
		operatingHours: 'Mon-Sun 6:00AM-10:00PM',
		logoUrl: 'https://reddingtonhospital.com/wp-content/uploads/2019/11/reddington-logo.png',
		iconBg: 'bg-purple-600',
		claimsAcceptanceRate: 95,
		avgProcessingTime: 2.1,
		preAuthApprovalRate: 94,
		costPerEnrollee: 1420,
		rejectionRate: 5,
		utilizationRate: 92,
		status: 'Active'
	},
	{
		id: 'FAC004',
		hospitalName: 'Garki Hospital Abuja',
		hospitalCode: 'GAR-004',
		facilityType: 'General Hospital',
		accreditationStatus: 'Pending Review',
		ninRegistration: 'RC-789123456',
		licenseValidity: { start: '2022-12-01', expiry: '2024-11-30' },
		address: 'Area 8, Garki District, Abuja FCT',
		geoCoordinates: { lat: 9.0579, lng: 7.4951 },
		phone: '+234-9-2348765',
		email: 'admin@garkihospital.gov.ng',
		contactPerson: { name: 'Dr. Fatima Usman', title: 'Chief Medical Director' },
		operatingHours: 'Mon-Fri 8:00AM-6:00PM',
		logoUrl: 'https://via.placeholder.com/40x40/f97316/ffffff?text=GH',
		iconBg: 'bg-orange-500',
		claimsAcceptanceRate: 76,
		avgProcessingTime: 4.5,
		preAuthApprovalRate: 82,
		costPerEnrollee: 980,
		rejectionRate: 24,
		utilizationRate: 68,
		status: 'Under Review'
	},
	{
		id: 'FAC005',
		hospitalName: 'St. Nicholas Hospital Lagos',
		hospitalCode: 'SNH-005',
		facilityType: 'Specialist Clinic',
		accreditationStatus: 'Approved',
		ninRegistration: 'RC-321654987',
		licenseValidity: { start: '2023-08-01', expiry: '2026-07-31' },
		address: '57 Campbell Street, Lagos Island, Lagos',
		geoCoordinates: { lat: 6.4541, lng: 3.3947 },
		phone: '+234-1-2630916',
		email: 'info@saintnicholashospital.com',
		contactPerson: { name: 'Dr. Chinedu Okwu', title: 'Medical Director' },
		operatingHours: 'Mon-Sat 7:00AM-9:00PM',
		logoUrl: 'https://saintnicholashospital.com/wp-content/uploads/2020/03/logo.png',
		iconBg: 'bg-red-500',
		claimsAcceptanceRate: 94,
		avgProcessingTime: 2.3,
		preAuthApprovalRate: 96,
		costPerEnrollee: 1350,
		rejectionRate: 6,
		utilizationRate: 88,
		status: 'Active'
	}
];

export const load = (async ({ url }) => {
	// Implement pagination for better performance
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;

	// Return paginated data for faster loading
	const paginatedFacilities = facilitiesCache.slice(startIndex, endIndex);

	return {
		facilities: paginatedFacilities,
		totalFacilities: facilitiesCache.length,
		currentPage: page,
		totalPages: Math.ceil(facilitiesCache.length / limit),
		hasMore: endIndex < facilitiesCache.length
	};
}) satisfies PageServerLoad;
