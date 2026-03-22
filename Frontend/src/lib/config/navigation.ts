export interface NavItem {
	title: string;
	url: string;
	icon: string; // Store icon name as string for lazy loading
}

import {
	LayoutDashboard,
	Building2,
	Users,
	Receipt,
	Home,
	Stethoscope,
	Calendar,
	BarChart3,
	MessageSquare,
	FileText,
	Cross,
	Navigation,
	User,
	MessageCircleCode,
	BriefcaseBusiness,
	Activity,
	ClipboardList,
	Shield
} from 'lucide-svelte';

// Icon mapping
const icons: Record<string, any> = {
	LayoutDashboard,
	Building2,
	Cross,
	Navigation,
	Users,
	Receipt,
	Home,
	Stethoscope,
	Calendar,
	BarChart3,
	
	MessageSquare,
	FileText,
	User,
	MessageCircleCode,
	BriefcaseBusiness,
	Activity,
	ClipboardList,
	Shield
};

// Get icon component
export function getIcon(iconName: string): any {
	return icons[iconName] || Home;
}

// HMO Navigation Configuration
export const hmoNavItems: NavItem[] = [
	{
		title: 'Home',
		url: '/hmo',
		icon: 'Home'
	},
	{
		title: 'Claims',
		url: '/hmo/claims',
		icon: 'ClipboardList'
	},
	{
		title: 'Providers',
		url: '/hmo/providers',
		icon: 'Cross'
	},
	{
		title: 'Insight',
		url: '/hmo/insight',
		icon: 'Navigation'
	},
	{
		title: 'Facility',
		url: '/hmo/facility',
		icon: 'Building2'
	}
];

// Facility Navigation Configuration
export const facilityNavItems: NavItem[] = [
	{
		title: 'Profile',
		url: '/facility',
		icon: 'User'
	},
	{
		title: 'Appointments',
		url: '/facility/appointments',
		icon: 'Calendar'
	},
	{
		title: 'Clinic',
		url: '/facility/clinic',
		icon: 'Stethoscope'
	},
	{
		title: 'Invoice',
		url: '/facility/invoice',
		icon: 'Receipt'
	},
	{
		title: 'Analytics',
		url: '/facility/analytics',
		icon: 'BarChart3'
	},
	{
		title: 'Records',
		url: '/facility/records',
		icon: 'FileText'
	}
];

// User Navigation Configuration
export const userNavItems: NavItem[] = [
	{
		title: 'Overview',
		url: '/user',
		icon: 'Home'
	},
	{
		title: 'Add Claims ',
		url: '/user/claims',
		icon: 'Receipt'
	},
	{
		title: 'Appointments',
		url: '/user/appointments',
		icon: 'Calendar'
	},

	{
		title: 'Manage Claims',
		url: '/user/claimsMgt',
		icon: 'FileText'
	},
	{
		title: 'Messaging',
		url: '/user/message',
		icon: 'MessageCircleCode'
	}
];

// Helper function to get page title based on route
export function getPageTitle(pathname: string, section: 'hmo' | 'facility' | 'user'): string {
	if (section === 'hmo') {
		if (pathname === '/hmo') return 'Home';
		if (pathname === '/hmo/claims') return 'Claims';
		if (pathname === '/hmo/providers') return 'Providers';
		if (pathname === '/hmo/facility') return 'Facility';
		if (pathname === '/hmo/insight') return 'Insight';
		return 'HMO Dashboard';
	} else if (section === 'facility') {
		if (pathname === '/facility') return 'Profile';
		if (pathname === '/facility/appointments') return 'Appointments';
		if (pathname === '/facility/clinic') return 'Clinic';
		if (pathname === '/facility/invoice') return 'Invoice';
		if (pathname === '/facility/analytics') return 'Analytics';
		if (pathname === '/facility/records') return 'Records';
		return 'Facility Dashboard';
	} else {
		// User section
		if (pathname === '/user') return 'Overview';
		if (pathname === '/user/claims') return 'Claims';
		if (pathname === '/user/appointments') return 'Appointments';
		if (pathname === '/user/claimsMgt') return 'Claims Management';
		if (pathname === '/user/message') return 'message';
		return 'User Dashboard';
	}
}
