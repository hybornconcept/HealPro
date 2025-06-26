// place files you want to import through the `$lib` alias in this folder.
import type { ChartConfig } from './components/ui/chart/index.js';
import {
	FileText,
	Calendar,
	MapPin,
	UserCircle,
	HeartHandshake,
	Users2,
	Award
} from '@lucide/svelte';
import type { ColumnDef, VisibilityState } from '@tanstack/table-core';
import StatusCell from '$lib/components/StatusCell.svelte';

export { default as LoadingSpinner } from './components/LoadingSpinner.svelte';
export { default as LoadingOverlay } from './components/LoadingOverlay.svelte';

// ===== Patient data for Header.svelte =====

// Patient KPIs data - displays health metrics in the header
export const kpis = [
	{
		value: '22.4',
		label: 'BMI',
		change: { value: '10', direction: 'up', color: 'green' }
	},
	{
		value: '92',
		label: 'Weight',
		unit: 'kg',
		change: { value: '10 kg', direction: 'up', color: 'green' }
	},
	{
		value: '175',
		label: 'Height',
		unit: 'Cm'
	},
	{
		value: '124/80',
		label: 'Blood pressure',
		change: { value: '10', direction: 'up', color: 'red' }
	}
];

// Patient basic info - displays occupation, age, and location in header
export const patientInfo = [
	{ icon: FileText, text: 'Accountant' },
	{ icon: Calendar, text: '12 Dec 1992 (38 years)' },
	{ icon: MapPin, text: 'Elsheikh zayed,Giza' }
];

// Navigation tabs - main navigation for patient profile sections
export const tabs = [
	{ name: 'Overview', path: '/user/overview' },
	{ name: 'Meds & Lab Report', path: '/user/medslab' },
	{ name: 'Claims', path: '/user/claims' }
];

// Patient demographics - displays personal information in header cards
export const demographics = [
	{ icon: UserCircle, label: 'Gender', value: 'Female' },
	{ icon: HeartHandshake, label: 'Marital Status', value: 'Married' },
	{ icon: Users2, label: 'Dependents', value: '3 persons' },
	{ icon: Award, label: 'Plan', value: 'Platinum' }
];

// Visit data for the pie chart - shows medical vs emergency visits
export const visitData = [
	{ type: 'medical', visits: 176, color: '#6366f1' },
	{ type: 'emergency', visits: 64, color: '#ef4444' }
];

// Configuration for the visits pie chart in header
export const visitChartConfig = {
	visits: { label: 'Visits' },
	medical: { label: 'Medical Checkup', color: '#6366f1' },
	emergency: { label: 'Emergency', color: '#ef4444' }
} as const;

// Total number of patient visits (calculated from visitData)
export const totalVisits = visitData.reduce((acc, curr) => acc + curr.visits, 0);

// ===== Data for Overview page =====

// Medical records data - displays patient health information
export const medicalRecords = [
	{ label: 'Blood Group', value: 'AB+ (ve)' },
	{ label: 'Blood Pressure', value: '130 mm, 80 HG' },
	{ label: 'Particular Sickness', value: 'Heart Disease' },
	{ label: 'Allergic Condition', value: 'Moderate' }
];

// Transaction type definition for appointments
export type Transaction = {
	id: string;
	physician: string;
	hospital: string;
	appointmentType: string;
	unit: string;
	status: 'Confirmed' | 'Cancelled' | 'Completed';
	date: string;
	time: string;
};

// Transaction data for the appointments table
export const transactions: Transaction[] = [
	{
		id: 't1',
		physician: 'Dr. Emma Thompson',
		hospital: 'Memorial Hospital',
		appointmentType: 'General Checkup',
		unit: 'Pediatric Unit',
		status: 'Confirmed',
		date: '15 Jun 2023',
		time: '09:30 AM'
	},
	{
		id: 't2',
		physician: 'Dr. James Wilson',
		hospital: 'City Medical Center',
		appointmentType: 'Cardiology Consultation',
		unit: 'Cardiology',
		status: 'Confirmed',
		date: '22 Jun 2023',
		time: '11:00 AM'
	},
	{
		id: 't3',
		physician: 'Dr. Sarah Chen',
		hospital: 'University Hospital',
		appointmentType: 'Dermatology',
		unit: 'Dermatology',
		status: 'Completed',
		date: '05 May 2023',
		time: '02:15 PM'
	},
	{
		id: 't4',
		physician: 'Dr. Michael Rodriguez',
		hospital: 'Central Healthcare',
		appointmentType: 'Orthopedic Consultation',
		unit: 'Urology',
		status: 'Cancelled',
		date: '28 Apr 2023',
		time: '10:45 AM'
	},
	{
		id: 't5',
		physician: 'Dr. Olivia Patel',
		hospital: 'Riverside Medical',
		appointmentType: 'Neurology Checkup',
		unit: 'Neurology',
		status: 'Completed',
		date: '12 May 2023',
		time: '03:30 PM'
	}
];

// Column definitions for the appointments table
export const appointmentColumns: ColumnDef<Transaction>[] = [
	{
		accessorKey: 'date',
		header: 'Date & Time',
		cell: ({ row }) => `${row.original.date} ${row.original.time}`
	},
	{
		accessorKey: 'appointmentType',
		header: 'Type',
		cell: ({ row }) => row.original.appointmentType
	},
	{
		accessorKey: 'physician',
		header: 'Doctor',
		cell: ({ row }) => row.original.physician
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			return {
				component: StatusCell,
				props: { status: row.getValue('status') }
			};
		}
	},
	{
		accessorKey: 'unit',
		header: 'Unit',
		cell: ({ row }) => row.original.unit,
		enableHiding: true,
		defaultVisible: false
	},
	{
		accessorKey: 'hospital',
		header: 'Hospital',
		cell: ({ row }) => row.original.hospital,
		enableHiding: true,
		defaultVisible: false
	}
];

// Initial column visibility settings
export const initialColumnVisibility: VisibilityState = {
	unit: false,
	hospital: false
};

// Doctor consultations data
export const consultations = [
	{
		name: 'Dr. Emma Thompson',
		role: 'Practitioner',
		avatar: 'https://github.com/shadcn.pn',
		initials: 'AL'
	},
	{
		name: 'Dr. Emma Thompson',
		role: 'Practitioner',
		avatar: 'https://github.com/shadcn.pn',
		initials: 'MT'
	},
	{
		name: 'Dr. Emma Thompson',
		role: 'Practitioner',
		avatar: 'https://github.com/shadcn.pn',
		initials: 'AL'
	}
];
