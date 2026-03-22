import type { PageServerLoad } from './$types';

export const load = (async () => {
	// Cards data
	const cards = [
		{
			tag: 'Schedule · Today',
			title: 'Appointments Today',
			subtitle: 'Confirmed visits',
			stats: [
				{ value: '24', label: 'Scheduled' },
				{ value: '8', label: 'New' }
			],
			action: 'View Calendar',
			variant: 'purple'
		},
		{
			tag: 'Action · Urgent',
			title: 'New Requests',
			subtitle: 'Awaiting approval',
			stats: [
				{ value: '12', label: 'Pending' },
				{ value: '3', label: 'Urgent' }
			],
			action: 'Review All',
			variant: 'blue'
		},
		{
			tag: 'Overview · All Time',
			title: 'Total Visits',
			subtitle: 'Completed appointments',
			stats: [
				{ value: '3.4k', label: 'Total' },
				{ value: '128', label: 'This Month' }
			],
			action: 'View Reports',
			variant: 'orange'
		}
	];

	// Appointments data
	const appointments = [
		{
			id: 'PID-001',
			patientName: 'Courtney Henry',
			patientId: 'ID: 123456',
			date: '27 Nov 2023',
			time: '09:00 AM',
			visitType: 'Check-up',
			hmo: 'Reliance HMO',
			status: 'Pending',
			package: 'Gold'
		},
		{
			id: 'PID-002',
			patientName: 'Jerome Bell',
			patientId: 'ID: 789012',
			date: '26 Nov 2023',
			time: '10:30 AM',
			visitType: 'Follow-up',
			hmo: 'AXA Mansard',
			status: 'Pending',
			package: 'Silver'
		},
		{
			id: 'PID-003',
			patientName: 'Brooklyn Simmons',
			patientId: 'ID: 345678',
			date: '26 Nov 2023',
			time: '02:15 PM',
			visitType: 'Emergency',
			hmo: 'Hygeia HMO',
			status: 'Pending',
			package: 'Platinum'
		},
		{
			id: 'PID-004',
			patientName: 'Devon Lane',
			patientId: 'ID: 901234',
			date: '25 Nov 2023',
			time: '11:45 AM',
			visitType: 'Check-up',
			hmo: 'Reliance HMO',
			status: 'Pending',
			package: 'Gold'
		},
		{
			id: 'PID-005',
			patientName: 'Cody Fisher',
			patientId: 'ID: 567890',
			date: '25 Nov 2023',
			time: '04:00 PM',
			visitType: 'Follow-up',
			hmo: 'Avon HMO',
			status: 'Pending',
			package: 'Silver'
		},
		{
			id: 'PID-006',
			patientName: 'Dianne Russell',
			patientId: 'ID: 112233',
			date: '24 Nov 2023',
			time: '09:30 AM',
			visitType: 'Check-up',
			hmo: 'AXA Mansard',
			status: 'Pending',
			package: 'Platinum'
		}
	];

	// Doctors list
	const doctors = [
		{
			name: 'Dr. Shyed',
			specialty: 'Sergery Experts',
			status: 'Ready',
			rating: '5 Star',
			avatar:
				'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
		},
		{
			name: 'Dr. Forhad',
			specialty: 'Dental Experts',
			status: 'Ready',
			rating: '5 Star',
			avatar:
				'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
		},
		{
			name: 'Dr. Sazzad',
			specialty: 'Sexual Expert',
			status: 'Holiday',
			rating: '5 Star',
			avatar:
				'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
		},
		{
			name: 'Dr. Warren',
			specialty: 'Sergery Experts',
			status: 'Ready',
			rating: '5 Star',
			avatar:
				'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face'
		},
		{
			name: 'Dr. Leslie',
			specialty: 'Sergery Experts',
			status: 'Ready',
			rating: '5 Star',
			avatar:
				'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face'
		},
		{
			name: 'Dr. Hawkins',
			specialty: 'Sergery Experts',
			status: 'Ready',
			rating: '5 Star',
			avatar:
				'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face'
		}
	];

	return {
		cards,
		appointments,
		doctors
	};
}) satisfies PageServerLoad;
