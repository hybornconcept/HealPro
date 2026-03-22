import type { PageServerLoad } from './$types';

type Company = {
	id: string;
	name: string;
	domain: string;
	status: 'Customer' | 'Churned';
	aboutTitle: string;
	aboutDesc: string;
	users: string[];
	userCount: number;
	licenseUse: number;
	icon: string;
	iconColor: string;
	iconBg: string;
};

const companies: Company[] = [
	{
		id: '1',
		name: 'Catalog',
		domain: 'catalogapp.io',
		status: 'Customer',
		aboutTitle: 'Content curating app',
		aboutDesc: 'Brings all your news into one place',
		users: [
			'https://randomuser.me/api/portraits/women/1.jpg',
			'https://randomuser.me/api/portraits/men/1.jpg',
			'https://randomuser.me/api/portraits/women/2.jpg',
			'https://randomuser.me/api/portraits/men/2.jpg',
			'https://randomuser.me/api/portraits/women/3.jpg'
		],
		userCount: 5,
		licenseUse: 65,
		icon: 'Command',
		iconColor: 'text-blue-600',
		iconBg: 'bg-blue-100'
	},
	{
		id: '2',
		name: 'Circooles',
		domain: 'getcirooles.com',
		status: 'Churned',
		aboutTitle: 'Design software',
		aboutDesc: 'Super lightweight design app',
		users: [
			'https://randomuser.me/api/portraits/women/4.jpg',
			'https://randomuser.me/api/portraits/men/4.jpg',
			'https://randomuser.me/api/portraits/women/5.jpg',
			'https://randomuser.me/api/portraits/men/5.jpg',
			'https://randomuser.me/api/portraits/women/6.jpg'
		],
		userCount: 8,
		licenseUse: 60,
		icon: 'Hexagon',
		iconColor: 'text-indigo-600',
		iconBg: 'bg-indigo-100'
	},
	{
		id: '3',
		name: 'Command+R',
		domain: 'cmdr.ai',
		status: 'Customer',
		aboutTitle: 'Data prediction',
		aboutDesc: 'AI and machine learning data',
		users: [
			'https://randomuser.me/api/portraits/men/6.jpg',
			'https://randomuser.me/api/portraits/women/7.jpg',
			'https://randomuser.me/api/portraits/men/7.jpg',
			'https://randomuser.me/api/portraits/women/8.jpg',
			'https://randomuser.me/api/portraits/men/8.jpg'
		],
		userCount: 2,
		licenseUse: 30,
		icon: 'Zap',
		iconColor: 'text-orange-600',
		iconBg: 'bg-orange-100'
	},
	{
		id: '4',
		name: 'Hourglass',
		domain: 'hourglass.app',
		status: 'Customer',
		aboutTitle: 'Productivity app',
		aboutDesc: 'Time management and productivity',
		users: [
			'https://randomuser.me/api/portraits/women/9.jpg',
			'https://randomuser.me/api/portraits/men/9.jpg',
			'https://randomuser.me/api/portraits/women/10.jpg',
			'https://randomuser.me/api/portraits/men/10.jpg',
			'https://randomuser.me/api/portraits/women/11.jpg'
		],
		userCount: 0,
		licenseUse: 80,
		icon: 'Hourglass',
		iconColor: 'text-cyan-600',
		iconBg: 'bg-cyan-100'
	},
	{
		id: '5',
		name: 'Layers',
		domain: 'getlayers.io',
		status: 'Churned',
		aboutTitle: 'Web app integrations',
		aboutDesc: 'Connect web apps seamlessly',
		users: [
			'https://randomuser.me/api/portraits/men/11.jpg',
			'https://randomuser.me/api/portraits/women/12.jpg',
			'https://randomuser.me/api/portraits/men/12.jpg',
			'https://randomuser.me/api/portraits/women/13.jpg',
			'https://randomuser.me/api/portraits/men/13.jpg'
		],
		userCount: 1,
		licenseUse: 20,
		icon: 'Layers',
		iconColor: 'text-purple-600',
		iconBg: 'bg-purple-100'
	},
	{
		id: '6',
		name: 'Quotient',
		domain: 'quotient.co',
		status: 'Customer',
		aboutTitle: 'Sales CRM',
		aboutDesc: 'Web-based sales doc management',
		users: [
			'https://randomuser.me/api/portraits/women/14.jpg',
			'https://randomuser.me/api/portraits/men/14.jpg',
			'https://randomuser.me/api/portraits/women/15.jpg',
			'https://randomuser.me/api/portraits/men/15.jpg',
			'https://randomuser.me/api/portraits/women/16.jpg'
		],
		userCount: 6,
		licenseUse: 15,
		icon: 'Command',
		iconColor: 'text-pink-600',
		iconBg: 'bg-pink-100'
	},
	{
		id: '7',
		name: 'Sisyphus',
		domain: 'sisyphus.com',
		status: 'Customer',
		aboutTitle: 'Automation and workflow',
		aboutDesc: 'Time tracking, invoicing and expenses',
		users: [
			'https://randomuser.me/api/portraits/men/16.jpg',
			'https://randomuser.me/api/portraits/women/17.jpg',
			'https://randomuser.me/api/portraits/men/17.jpg',
			'https://randomuser.me/api/portraits/women/18.jpg',
			'https://randomuser.me/api/portraits/men/18.jpg'
		],
		userCount: 4,
		licenseUse: 45,
		icon: 'Zap',
		iconColor: 'text-emerald-600',
		iconBg: 'bg-emerald-100'
	}
];

const kpiData = [
	{
		title: 'Budget',
		value: '$20,250',
		change: '+25.00%',
		changeIcon: 'ArrowUp',
		badgeClass: 'bg-blue-50 text-blue-600 hover:bg-blue-50',
		footerText: '2.1% than last month',
		footerClass: 'text-blue-500'
	},
	{
		title: 'Expends',
		value: '$14,350',
		change: '+87.50%',
		changeIcon: 'ArrowUp',
		badgeClass: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-50',
		footerText: '1.9% than last month',
		footerClass: 'text-yellow-500'
	},
	{
		title: 'Income',
		value: '$17,550',
		change: '-24.50%',
		changeIcon: 'ArrowDown',
		badgeClass: 'bg-red-50 text-red-600 hover:bg-red-50',
		footerText: '15.3% less than last month',
		footerClass: 'text-red-500'
	}
];

const buttonGroupData = [
	{ text: 'Principal', badge: 99 },
	{ text: 'Dependent 1', badge: 99 },
	{ text: 'Dependent 2' },
	{ text: 'Dependent 3' }
];

export const load = (async () => {
	return {
		companies,
		kpiData,
		buttonGroupData
	};
}) satisfies PageServerLoad;
