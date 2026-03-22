import type { PageServerLoad } from './$types';

export const load = (async () => {
	// Mock Data for Sidebar
	const conversations = [
		{
			id: 1,
			name: 'Jessica Koel',
			avatar: 'https://github.com/shadcn.png', // Placeholder
			preview: 'Hey Jontray, do you remember...',
			time: '11:26',
			unread: 1,
			active: true,
			starred: false
		},
		{
			id: 2,
			name: 'Kamil Boerger',
			avatar: '',
			fallback: 'KB',
			preview: 'I will send the documents as soon...',
			time: '11:15',
			unread: 0,
			active: false,
			starred: true
		},
		{
			id: 3,
			name: 'Tamara Shevchenko',
			avatar: '',
			fallback: 'TS',
			preview: 'are you going to a business...',
			time: '10:05',
			unread: 0,
			active: false,
			starred: true
		},
		{
			id: 4,
			name: 'Sam Nelson',
			avatar: '',
			fallback: 'SN',
			preview: 'I suggest to start, I have...',
			time: '15.09',
			unread: 0,
			active: false,
			starred: true
		},
		{
			id: 5,
			name: 'Jonas Berger',
			avatar: '',
			fallback: 'JB',
			preview: 'We need to start a new research ...',
			time: '14.09',
			unread: 0,
			active: false,
			starred: true
		},
		{
			id: 6,
			name: 'Kristian Kurzawa',
			avatar: '',
			fallback: 'KK',
			preview: 'maybe yes...',
			time: '14.09',
			unread: 0,
			active: false,
			starred: true
		},
		{
			id: 7,
			name: 'Caroline Nixon',
			avatar: '',
			fallback: 'CN',
			preview: 'I would like to introduce you to ...',
			time: '14.09',
			unread: 0,
			active: false,
			starred: true
		},
		{
			id: 8,
			name: 'Patrick Kluivert',
			avatar: '',
			fallback: 'PK',
			preview: 'Integration events at the stad ...',
			time: '13.09',
			unread: 0,
			active: false,
			starred: false,
			color: 'bg-orange-100 text-orange-600'
		},
		{
			id: 9,
			name: 'Lieke Martens',
			avatar: '',
			fallback: 'LM',
			preview: 'I suggest to start, I have...',
			time: '13.09',
			unread: 0,
			active: false,
			starred: true
		}
	];

	// Mock Data for Main Conversation
	const currentThread = {
		subject: 'Meeting with new investors',
		date: 'Today, 16th September 2020, 11:26',
		tags: ['Promising offers'],
		messages: [
			{
				id: 1,
				sender: 'Jessica Koel',
				avatar: 'https://github.com/shadcn.png',
				content: 'Hi, I have a new meeting opportunity...',
				time: '14.09.2020 09:25',
				isMe: false
			},
			{
				id: 2,
				sender: 'You',
				avatar: '', // No avatar for self in this design usually, or generic
				content: 'Hi, thanks for the info, of course we need to ...',
				time: '14.09.2020 10:11',
				isMe: true
			},
			{
				id: 3,
				sender: 'Jessica Koel',
				avatar: 'https://github.com/shadcn.png',
				content: null, // This is the main body message
				time: 'Today, 16.09.2020, 11:26',
				isMe: false,
				fullBody: `Hey Jontray,

Do you remember about tomorrow's meeting with new investors?
Here you have more information about the conference at which we will be together with the client: <a href="#" class="text-teal-500 underline">https://conference.com/agenda/start</a>

Regards,
Jessica`
			}
		]
	};

	return {
		conversations,
		currentThread
	};
}) satisfies PageServerLoad;
