export const load = async () => {
    const providers = [
        {
            id: 1,
            name: 'General Hospital',
            type: 'Hospital',
            location: 'Lagos Island, Lagos',
            sector: 'Public', // Keeping sector for color logic if needed, or mapping type to color
            sectorColor: 'bg-blue-100 text-blue-700',
            score: 95,
            clients: 1205, // Added clients
            logo: 'GH',
            status: 'Verified'
        },
        {
            id: 2,
            name: 'Reddington Hospital',
            type: 'Private Hospital',
            location: 'Victoria Island, Lagos',
            sector: 'Private',
            sectorColor: 'bg-purple-100 text-purple-700',
            score: 88,
            clients: 850,
            logo: 'RH',
            status: 'Verified'
        },
        {
            id: 3,
            name: 'Lagoon Hospitals',
            type: 'Clinic',
            location: 'Ikoyi, Lagos',
            sector: 'Private',
            sectorColor: 'bg-emerald-100 text-emerald-700',
            score: 92,
            clients: 940,
            logo: 'LH',
            status: 'Verified'
        },
        {
            id: 4,
            name: 'Eko Hospital',
            type: 'Hospital',
            location: 'Ikeja, Lagos',
            sector: 'Public',
            sectorColor: 'bg-orange-100 text-orange-700',
            score: 78,
            clients: 2300,
            logo: 'EH',
            status: 'Pending'
        },
        {
            id: 5,
            name: 'First Cardiology',
            type: 'Specialist',
            location: 'Ikoyi, Lagos',
            sector: 'Private',
            sectorColor: 'bg-rose-100 text-rose-700',
            score: 85,
            clients: 420,
            logo: 'FC',
            status: 'Verified'
        },
        {
            id: 6,
            name: 'Medplus Pharmacy',
            type: 'Pharmacy',
            location: 'Lekki Phase 1',
            sector: 'Pharmaceutical',
            sectorColor: 'bg-cyan-100 text-cyan-700',
            score: 32,
            clients: 15600,
            logo: 'MP',
            status: 'Verified'
        },
        {
            id: 7,
            name: 'Veloura',
            category: 'Streetwear fashion: Merchant',
            type: 'Fashion',
            sector: 'Fashion',
            sectorColor: 'bg-pink-100 text-pink-700',
            score: 78,
            clients: 1200,
            logo: 'V'
        }
    ];

    const concentrationData = [
        {
            name: 'Goldman Sachs Group',
            d2019: { v: '22%', d: '-0.21%' },
            d2020: { v: '11%', d: '-0.50%' },
            d2021: { v: '7%', d: '-0.28%' },
            d2022: { v: '15%', d: '+0.55%' },
            d2023: { v: '16%', d: '+0.06%' }
        },
        {
            name: 'Kimberly-Clark',
            d2019: { v: '14%', d: '+0.21%' },
            d2020: { v: '5%', d: '+3.11%' },
            d2021: { v: '7%', d: '-0.28%' },
            d2022: { v: '9%', d: '+0.21%' },
            d2023: { v: '13%', d: '+0.41%' }
        },
        {
            name: 'J.B. Hunt Transport Services',
            d2019: { v: '18%', d: '+0.16%' },
            d2020: { v: '25%', d: '-0.13%' },
            d2021: { v: '15%', d: '-0.18%' },
            d2022: { v: '11%', d: '-0.18%' },
            d2023: { v: '20%', d: '+4.20%' }
        },
        {
            name: 'Constellation Brands',
            d2019: { v: '29%', d: '+0.23%' },
            d2020: { v: '7%', d: '-0.28%' },
            d2021: { v: '58%', d: '+0.64%' },
            d2022: { v: '30%', d: '-0.18%' },
            d2023: { v: '36%', d: '+0.19%' }
        },
        {
            name: 'Regions Financial Corp',
            d2019: { v: '11%', d: '-0.50%' },
            d2020: { v: '12%', d: '+0.18%' },
            d2021: { v: '15%', d: '+0.55%' },
            d2022: { v: '16%', d: '+0.06%' },
            d2023: { v: '16%', d: '+0.06%' }
        }
    ];

    const kpis = [
        {
            label: 'Total Revenue',
            value: '$ 105,313',
            progress: 74,
            color: 'text-indigo-500',
            ringColor: 'text-indigo-500'
        },
        {
            label: 'Total Customer',
            value: '415,513',
            progress: 58,
            color: 'text-orange-500',
            ringColor: 'text-orange-500'
        },
        {
            label: 'Total Transaction',
            value: '901,426',
            progress: 83,
            color: 'text-purple-500',
            ringColor: 'text-purple-500'
        },
        {
            label: 'Total Product',
            value: '156,100',
            progress: 37,
            color: 'text-pink-500',
            ringColor: 'text-pink-500'
        }
    ];

    // Separate metrics for the "Metrics" tab
    const qualityMetrics = [
        { label: 'Patient Satisfaction', value: '98%', progress: 98, color: 'text-emerald-500' },
        { label: 'Readmission Rate', value: '2.4%', progress: 12, color: 'text-blue-500' },
        { label: 'Infection Control', value: '99.9%', progress: 99, color: 'text-purple-500' },
        { label: 'Avg Wait Time', value: '12m', progress: 25, color: 'text-indigo-500' }
    ];

    const facilityData = {
        devices: [
            {
                name: 'MRI Machine',
                status: 'Operational',
                count: 1,
                color: 'bg-indigo-100 text-indigo-700',
                icon: 'M'
            },
            {
                name: 'CT Scanner',
                status: 'Maintenance',
                count: 1,
                color: 'bg-orange-100 text-orange-700',
                icon: 'C'
            },
            {
                name: 'Ventilators',
                status: 'Operational',
                count: 4,
                color: 'bg-emerald-100 text-emerald-700',
                icon: 'V'
            },
            {
                name: 'X-Ray',
                status: 'Operational',
                count: 2,
                color: 'bg-blue-100 text-blue-700',
                icon: 'X'
            },
            {
                name: 'Ultrasound',
                status: 'Operational',
                count: 3,
                color: 'bg-purple-100 text-purple-700',
                icon: 'U'
            },
            {
                name: 'Dialysis Unit',
                status: 'Operational',
                count: 5,
                color: 'bg-cyan-100 text-cyan-700',
                icon: 'D'
            }
        ],
        procedures: [
            {
                name: 'Appendectomy',
                dept: 'General Surgery',
                time: '1h 30m',
                initials: 'GS',
                color: 'bg-blue-100 text-blue-700'
            },
            {
                name: 'C-Section',
                dept: 'Obstetrics',
                time: '45m',
                initials: 'OB',
                color: 'bg-pink-100 text-pink-700'
            },
            {
                name: 'Dialysis',
                dept: 'Nephrology',
                time: '4h 00m',
                initials: 'NP',
                color: 'bg-cyan-100 text-cyan-700'
            },
            {
                name: 'Hip Replacement',
                dept: 'Orthopedics',
                time: '2h 15m',
                initials: 'OR',
                color: 'bg-amber-100 text-amber-700'
            },
            {
                name: 'Cardiac Stent',
                dept: 'Cardiology',
                time: '1h 00m',
                initials: 'CA',
                color: 'bg-rose-100 text-rose-700'
            },
            {
                name: 'Endoscopy',
                dept: 'Gastroenterology',
                time: '30m',
                initials: 'GE',
                color: 'bg-emerald-100 text-emerald-700'
            }
        ]
    };

    const reviews = [
        {
            id: 1,
            name: 'Esther Howard',
            date: '2 days ago',
            rating: 5,
            comment:
                'The facility is state-of-the-art and the staff were incredibly attentive during my MRI.',
            tags: ['Cleanliness', 'Professionalism'],
            avatar: 'EH',
            sentiment: 'positive'
        },
        {
            id: 2,
            name: 'Cameron Williamson',
            date: '1 week ago',
            rating: 3,
            comment:
                'Wait times were longer than expected even with an appointment. Doctor was great though.',
            tags: ['Wait Time', 'Staff'],
            avatar: 'CW',
            sentiment: 'neutral'
        },
        {
            id: 3,
            name: 'Robert Fox',
            date: '2 weeks ago',
            rating: 1,
            comment:
                'Denied my claim initially due to a clerical error on their end. Very frustrating experience.',
            tags: ['Billing', 'Admin'],
            avatar: 'RF',
            sentiment: 'negative'
        },
        {
            id: 4,
            name: 'Jenny Wilson',
            date: '3 weeks ago',
            rating: 5,
            comment: 'Excellent care provided for my surgery. The recovery room was very comfortable.',
            tags: ['Surgery', 'Comfort'],
            avatar: 'JW',
            sentiment: 'positive'
        }
    ];

    const appointments = [
        {
            time: '09.40 AM',
            title: 'Routine check up',
            patient: 'Jacob Jones',
            doctor: 'DR.Courtney Henry',
            status: 'Confirm',
            variant: 'default'
        },
        {
            time: '09.40 AM',
            title: 'Dermatology consultation',
            patient: 'Jenny Wilson',
            doctor: 'DR.Jane Cooper',
            status: 'Pending',
            variant: 'blue'
        },
        {
            time: '09.40 AM',
            title: 'Routine check up',
            patient: 'Albert Flores',
            doctor: 'Dr. Raj Patel',
            status: 'Canceled',
            variant: 'default'
        },
        {
            time: '10.40 AM',
            title: 'Physical therapy',
            patient: 'Esther Howard',
            doctor: 'DR.Brooklyn S',
            status: 'Confirm',
            variant: 'blue'
        },
        {
            time: '10.40 AM',
            title: 'Allergy test',
            patient: 'Annette Black',
            doctor: 'DR.Theresa Webb',
            status: 'Canceled',
            variant: 'default'
        },
        {
            time: '10.40 AM',
            title: 'Nutrition counseling',
            patient: 'Darrell Steward',
            doctor: 'DR.Courtney Henry',
            status: 'Confirm',
            variant: 'blue'
        },
        {
            time: '11.40 AM',
            title: 'Dental cleaning',
            patient: 'Floyd Miles',
            doctor: 'DR.Courtney Henry',
            status: 'Canceled',
            variant: 'default'
        },
        {
            time: '11.40 AM',
            title: 'Dermatology consultation',
            patient: 'Kristin Watson',
            doctor: 'DR.Jane Cooper',
            status: 'Confirm',
            variant: 'blue'
        },
        {
            time: '12.40 AM',
            title: 'Physical therapy',
            patient: 'Ronald Richards',
            doctor: 'Dr. Raj Patel',
            status: 'Pending',
            variant: 'default'
        },
        {
            time: '12.40 AM',
            title: 'Physical therapy',
            patient: 'Darrell Steward',
            doctor: 'DR.Jane Cooper',
            status: 'Confirm',
            variant: 'blue'
        },
        {
            time: '13.40 AM',
            title: 'Allergy test',
            patient: 'Cody Fisher',
            doctor: 'DR.Brooklyn S',
            status: 'Confirm',
            variant: 'default'
        },
        {
            time: '13.40 AM',
            title: 'Nutrition counseling',
            patient: 'Jenny Wilson',
            doctor: 'DR.Courtney Henry',
            status: 'Confirm',
            variant: 'blue'
        },
        {
            time: '14.40 AM',
            title: 'Physical therapy',
            patient: 'Jerome Bell',
            doctor: 'Dr. Raj Patel',
            status: 'Pending',
            variant: 'default'
        },
        {
            time: '14.40 AM',
            title: 'Allergy test',
            patient: 'Theresa Webb',
            doctor: 'DR.Courtney Henry',
            status: 'Confirm',
            variant: 'blue'
        },
        {
            time: '14.40 AM',
            title: 'Nutrition counseling',
            patient: 'Guy Hawkins',
            doctor: 'DR.Brooklyn S',
            status: 'Canceled',
            variant: 'default'
        }
    ];

    const clients = [
        {
            id: 1,
            name: 'Sarah Jenkins',
            email: 'sarah.j@example.com',
            policyId: 'POL-2938-XJ',
            type: 'Gold Plan',
            typeColor: 'bg-yellow-100/80 text-yellow-700',
            status: 'Active',
            lastActivity: 'Oct 24, 2023',
            avatar: 'SJ',
            image: null
        },
        {
            id: 2,
            name: 'Michael Ross',
            email: 'm.ross88@test.com',
            policyId: 'POL-9921-MC',
            type: 'Silver Plan',
            typeColor: 'bg-slate-100 text-slate-700',
            status: 'Pending',
            lastActivity: 'Oct 22, 2023',
            avatar: 'MR',
            image: 'https://github.com/shadcn.png'
        },
        {
            id: 3,
            name: 'Emily Chen',
            email: 'echen_work@mail.net',
            policyId: 'POL-1122-PL',
            type: 'Platinum',
            typeColor: 'bg-purple-100 text-purple-700',
            status: 'Active',
            lastActivity: 'Oct 21, 2023',
            avatar: 'EC',
            image: null
        },
        {
            id: 4,
            name: 'David Kim',
            email: 'dkim.sub@example.com',
            policyId: 'POL-8833-BR',
            type: 'Bronze',
            typeColor: 'bg-orange-100 text-orange-700',
            status: 'Inactive',
            lastActivity: 'Oct 15, 2023',
            avatar: 'DK',
            image: null
        },
        {
            id: 5,
            name: 'Amanda Lowery',
            email: 'a.lowery@test.org',
            policyId: 'POL-5541-XJ',
            type: 'Gold Plan',
            typeColor: 'bg-yellow-100/80 text-yellow-700',
            status: 'Active',
            lastActivity: 'Oct 12, 2023',
            avatar: 'AL',
            image: 'https://github.com/shadcn.png'
        }
    ];

    return {
        providers,
        concentrationData,
        kpis,
        qualityMetrics,
        facilityData,
        reviews,
        appointments,
        clients
    };
};