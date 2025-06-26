import type { PageServerLoad } from './$types';

// Mock data for MedifySpace dashboard
const appointments = [
	{
		id: 1,
		patientName: 'Yala Jasmine',
		patientId: '#1298135',
		appointmentDate: '20 oct 2023',
		appointmentTime: '21:32:12',
		age: '59 Years old',
		dateOfBirth: '28/08/1965',
		insurance: 'Prudential',
		avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
	},
	{
		id: 2,
		patientName: 'Esther Howard',
		patientId: '#1298134',
		appointmentDate: '20 oct 2023',
		appointmentTime: '10:21:31',
		age: '34 Years old',
		dateOfBirth: '12/01/1990',
		insurance: 'AIA',
		avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
	},
	{
		id: 3,
		patientName: 'Devon Lane',
		patientId: '#1298133',
		appointmentDate: '15 oct 2023',
		appointmentTime: '08:12:24',
		age: '54 Years old',
		dateOfBirth: '04/12/1970',
		insurance: 'AIA',
		avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
	},
	{
		id: 4,
		patientName: 'Theresa Webb',
		patientId: '#1298132',
		appointmentDate: '16 oct 2023',
		appointmentTime: '14:56:45',
		age: '24 Years old',
		dateOfBirth: '21/10/2000',
		insurance: 'FWD',
		avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
	},
	{
		id: 5,
		patientName: 'Kathryn Murphy',
		patientId: '#1298131',
		appointmentDate: '13 oct 2023',
		appointmentTime: '22:43:21',
		age: '16 Years old',
		dateOfBirth: '16/09/2008',
		insurance: 'Non-insurance',
		avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
	}
];

const doctors = [
	{
		id: 1,
		name: 'Eleanor Pena',
		specialty: 'Anesthesiology',
		status: 'Available',
		avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
	},
	{
		id: 2,
		name: 'Bruno Fernandes',
		specialty: 'Cardiology',
		status: 'Unavailable',
		avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
	},
	{
		id: 3,
		name: 'Jerome Bell',
		specialty: 'Dermatology',
		status: 'Unavailable',
		avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
	},
	{
		id: 4,
		name: 'Savannah Nguyen',
		specialty: 'Neurology',
		status: 'Available',
		avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
	}
];

const revenueData = [
	{ month: 'Jan', value: 25000 },
	{ month: 'Feb', value: 30000 },
	{ month: 'Mar', value: 28000 },
	{ month: 'Apr', value: 32000 },
	{ month: 'May', value: 35000 },
	{ month: 'Jun', value: 38000 },
	{ month: 'Jul', value: 42000 },
	{ month: 'Aug', value: 45000 },
	{ month: 'Sep', value: 40000 },
	{ month: 'Oct', value: 48000 },
	{ month: 'Nov', value: 35000 },
	{ month: 'Dec', value: 35510 }
];

export const load = (async () => {
	return {
		appointments,
		doctors,
		revenueData,
		stats: {
			totalRevenue: 35510.0,
			revenueIncrease: 12,
			increaseAmount: 2992.0,
			overallVisitors: 1210,
			visitorsIncrease: 8,
			bookAppointments: 291,
			totalPatients: 871,
			roomAvailability: { available: 221, total: 300 },
			doctorSchedule: {
				available: 45,
				unavailable: 21,
				leave: 10
			}
		}
	};
}) satisfies PageServerLoad;
