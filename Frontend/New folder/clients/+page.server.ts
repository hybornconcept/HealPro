import type { ServerLoad } from '@sveltejs/kit';

// Cache avatar URLs to avoid recreating on every request
const avatarUrls = [
	'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face'
];

// Cache customers data to avoid recreating on every request
const customersCache = [
	{
		id: 1,
		name: 'Elon Mask',
		location: 'United State',
		mobile: '(207) 444-2901',
		email: 'elon@gmail.com',
		status: 'Active',
		company: 'Starlink',
		initials: 'EM',
		avatarColor: 'bg-blue-500',
		avatar: avatarUrls[0],
		sex: 'Male',
		dateEnrolled: 'Jan 15, 2023'
	},
	{
		id: 2,
		name: 'Tony Stark',
		location: 'Australia',
		mobile: '(207) 234-3214',
		email: 'tony@gmail.com',
		status: 'Inactive',
		company: 'Marvel',
		initials: 'TS',
		avatarColor: 'bg-blue-500',
		avatar: avatarUrls[1],
		sex: 'Male',
		dateEnrolled: 'Feb 20, 2023'
	},
	{
		id: 3,
		name: 'Henry Cavil',
		location: 'England',
		mobile: '44-0343-234',
		email: 'henry@gmail.com',
		status: 'Unconfirmed',
		company: 'BMW',
		initials: 'HC',
		avatarColor: 'bg-orange-500',
		avatar: avatarUrls[2],
		sex: 'Male',
		dateEnrolled: 'Mar 10, 2023'
	},
	{
		id: 4,
		name: 'Mike Banner',
		location: 'Canada',
		mobile: '(223) 323-7743',
		email: 'mike@gmail.com',
		status: 'Unconfirmed',
		company: 'MBM',
		initials: 'MB',
		avatarColor: 'bg-gray-600',
		avatar: avatarUrls[3],
		sex: 'Male',
		dateEnrolled: 'Apr 05, 2023'
	},
	{
		id: 5,
		name: 'Tom Camel',
		location: 'French',
		mobile: '11-2093-2342',
		email: 'tom@gmail.com',
		status: 'Unconfirmed',
		company: 'KFC',
		initials: 'TC',
		avatarColor: 'bg-pink-500',
		avatar: avatarUrls[4],
		sex: 'Male',
		dateEnrolled: 'May 12, 2023'
	},
	{
		id: 6,
		name: 'Raj Patel',
		location: 'India',
		mobile: '(234) 11-23333',
		email: 'raj@gmail.com',
		status: 'Active',
		company: 'TATA',
		initials: 'RP',
		avatarColor: 'bg-blue-500',
		avatar: avatarUrls[5],
		sex: 'Male',
		dateEnrolled: 'Jun 18, 2023'
	},
	{
		id: 7,
		name: 'James Brown',
		location: 'Brazil',
		mobile: '11-3664-2424',
		email: 'brown@gmail.com',
		status: 'Active',
		company: 'Saltbox',
		initials: 'JB',
		avatarColor: 'bg-purple-500',
		avatar: avatarUrls[6],
		sex: 'Male',
		dateEnrolled: 'Jul 22, 2023'
	},
	{
		id: 8,
		name: 'Wei Chen',
		location: 'Japan',
		mobile: '(001) 221-2901',
		email: 'wei@gmail.com',
		status: 'Active',
		company: 'TOYOTA',
		initials: 'WC',
		avatarColor: 'bg-orange-500',
		avatar: avatarUrls[7],
		sex: 'Female',
		dateEnrolled: 'Aug 30, 2023'
	},
	{
		id: 9,
		name: 'David Smith',
		location: 'Jamaica',
		mobile: '11-2093-2342',
		email: 'david@gmail.com',
		status: 'Active',
		company: 'KFC',
		initials: 'DS',
		avatarColor: 'bg-gray-600',
		avatar: avatarUrls[8],
		sex: 'Male',
		dateEnrolled: 'Sep 14, 2023'
	},
	{
		id: 10,
		name: 'Miya Chen',
		location: 'China',
		mobile: '(234) 11-23333',
		email: 'miya@gmail.com',
		status: 'Active',
		company: 'TATA',
		initials: 'MC',
		avatarColor: 'bg-pink-500',
		sex: 'Female',
		dateEnrolled: 'Oct 08, 2023'
	},
	{
		id: 11,
		name: 'David Warner',
		location: 'Australia',
		mobile: '11-3664-2424',
		email: 'warner@gmail.com',
		status: 'Active',
		company: 'Saltbox',
		initials: 'DW',
		avatarColor: 'bg-blue-500',
		sex: 'Male',
		dateEnrolled: 'Nov 25, 2023'
	},
	{
		id: 12,
		name: 'Mikel Jordan',
		location: 'Germany',
		mobile: '(001) 221-2901',
		email: 'jordan@gmail.com',
		status: 'Active',
		company: 'TOYOTA',
		initials: 'MJ',
		avatarColor: 'bg-gray-400',
		sex: 'Male',
		dateEnrolled: 'Dec 12, 2023'
	}
];

// Cache stats data
const statsCache = {
	totalCustomers: 20,
	activeCustomers: 14,
	inactiveCustomers: 6,
	contactsLogInToday: 4,
	totalCustomersDisplay: '20',
	activeCustomersDisplay: '14',
	inactiveCustomersDisplay: '06',
	contactsLogInTodayDisplay: '04'
};

export const load: ServerLoad = async () => {
	// Return cached data immediately for faster loading
	return {
		customers: customersCache,
		stats: statsCache
	};
};
