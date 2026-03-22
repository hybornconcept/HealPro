<script lang="ts">
	import { Send } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	const features = [
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
			title: 'Healthcare Connection Hub',
			desc: 'Digital platform bridging gaps between HMOs, corporate subscribers, and everyday users',
			fullDesc:
				'A digital platform designed to bridge the gap between Health Maintenance Organizations (HMOs), corporate subscribers, and everyday users. We simplify healthcare access by creating one convenient space where all stakeholders connect, communicate, and collaborate effortlessly.',
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>`,
			title: 'Information at Your Fingertips',
			desc: 'Instant access to vital HMO insights anytime, anywhere with comprehensive healthcare information',
			fullDesc:
				'Instant access to vital HMO insights—anytime, anywhere. Healpro makes comprehensive healthcare information just a click away. Explore detailed HMO packages, available facilities and services, and direct contact information for key stakeholders—all in one place. No more guesswork, just streamlined clarity and control.',
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
			title: 'Smarter Scheduling',
			desc: 'Intuitive appointment scheduling for users and healthcare providers with streamlined time management',
			fullDesc:
				"With Healpro's intuitive appointment scheduling, both users and healthcare providers can effortlessly set up visits that work on their terms. Say goodbye to long waits and missed connections—hello to streamlined time management and better care coordination.",
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
			title: 'Claims Assistant',
			desc: 'Submit claims requests with few clicks and track responses in real time',
			fullDesc:
				'With Healpro Claims Assistant, users and healthcare providers can submit claims requests with just a few clicks—and track responses in real time. Say goodbye to frustrating phone calls and wasted hours, and hello to a transparent, cost-saving claims process that puts you in control.',
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
			title: 'Beyond Healthcare',
			desc: 'Connecting users to essential non-health services that enhance overall well-being',
			fullDesc:
				"Healpro goes the extra mile by connecting users to essential non-health services that enhance overall well-being—like gym memberships, wellness programs, and more—offered through their HMO. It's not just about treatment; it's about total health empowerment.",
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="9"/><rect x="14" y="7" width="3" height="5"/></svg>`,
			title: 'Performance at a Glance',
			desc: 'Intuitive dashboard empowers HMOs with tools to monitor key performance metrics',
			fullDesc:
				"Healpro's intuitive Efficiency Dashboard empowers HMOs with the tools to monitor key performance metrics in real time. Identify gaps, track progress, and optimize service delivery—all from a single intelligent interface designed to elevate system-wide performance.",
			link: '#'
		}
	];
</script>

<div
	id="features"
	class="mx-auto flex w-full max-w-7xl flex-col bg-white px-8 py-12 md:flex-row md:px-8"
>
	<!-- Left: Heading and CTA -->
	 
	<div class="mb-10 flex flex-col items-center text-center justify-center md:mb-0 md:w-1/3 md:pr-8 md:items-start md:text-left">
		<div class="mb-2 inline-flex items-center rounded-md bg-blue-50 border border-gray-100 px-3 py-1 text-[0.8rem] font-semibold text-blue-700 shadow-sm">
				<span class="mr-1.5 text-blue-500 font-bold ">-</span> Features
			</div>
			<h2 class="mb-3 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
			Tailored for your needs
		</h2>
		<p class="mb-8 mt-2 text-base text-gray-500">
From health to home, we've got you covered with improved services and complete
			protection—your safety, our commitment.
		</p>
		<Button
			href="/schedule"
			class="group mt-4 flex w-[70%] mx-auto md:mx-0 items-center justify-center gap-3 rounded-full bg-blue-600 px-6 py-6 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 active:scale-95 md:w-full lg:w-[85%] md:text-base"
		>
			Book Appointment
			<Send class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:scale-110" />
		</Button>
	</div>

	<!-- Right: Features Grid -->
	<div class="my-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2 md:w-2/3 lg:grid-cols-3">
		{#each features as feature, i}
			<div class="relative flex flex-col items-start px-6 py-10 border border-gray-100/50 shadow-md shadow-blue-900/5 rounded-3xl md:border-0 md:shadow-none md:py-0">
				<!-- Vertical divider (except first col in each row) -->
				{#if i % 3 !== 0}
					<div class="absolute left-0 top-0 hidden h-full w-px bg-blue-100 lg:block"></div>
				{/if}
				{#if i % 2 !== 0}
					<div class="absolute left-0 top-0 hidden h-full w-px bg-blue-100 md:block lg:hidden"></div>
				{/if}
				{@html feature.icon}
				<h3 class="mt-5 text-lg font-semibold text-gray-900">{feature.title}</h3>
				<p class="mt-2 text-sm text-gray-500">{feature.desc}</p>
				<a
					href={feature.link}
					class="mt-4 flex items-center text-sm font-medium text-blue-600 hover:underline"
				>
					<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20"
						><path
							d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-10 10a1 1 0 01-.707.293H3a1 1 0 01-1-1v-4a1 1 0 01.293-.707l10-10zM5 17h2v-2H5v2z"
						></path></svg
					>
					Learn more
				</a>
			</div>
		{/each}
	</div>
</div>
