<script lang="ts">
	const features = [
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>`,
			title: 'Home Care',
			desc: 'Compassionate care always there your well-being is our priority',
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="14" r="4"/></svg>`,
			title: 'Nursing Home',
			desc: 'Comfort and caring home where your loved ones feel valued',
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 14h8"/></svg>`,
			title: 'Hospice Care',
			desc: 'Where compassion meets care offering peace and comfort',
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 14h8"/><circle cx="8" cy="14" r="2"/></svg>`,
			title: 'Adult Day Care',
			desc: 'Where care meets comfort a safe nurturing home for your love',
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="16" cy="14" r="2"/></svg>`,
			title: 'Assisted Living',
			desc: 'Safe welcoming assisted living where your love one feel at home',
			link: '#'
		},
		{
			icon: `<svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>`,
			title: 'Physical Therapy',
			desc: 'Strengthen your body revive your life expert physical therapy',
			link: '#'
		}
	];
</script>

<div
	id="features"
	class="mx-auto flex w-full max-w-7xl flex-col bg-white px-2 py-12 md:flex-row md:px-8"
>
	<!-- Left: Heading and CTA -->
	<div class="mb-10 flex flex-col items-start justify-center md:mb-0 md:w-1/3 md:pr-8">
		<h2 class="mb-3 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
			Our Features<br />Special For You
		</h2>
		<p class="mt-2 mb-8 text-base text-gray-500">
			From health to home, we've got you covered affordable plan with complete protection your
			safety our commitment
		</p>
		<button
			class="flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3 text-base font-semibold text-white shadow transition hover:bg-blue-700"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
				><path
					d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.08"
				/><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg
			>
			Book Appointment
		</button>
	</div>

	<!-- Right: Features Grid -->
	<div class="my-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2 md:w-2/3 lg:grid-cols-3">
		{#each features as feature, i}
			<div class="relative flex flex-col items-start px-6">
				<!-- Vertical divider (except first col in each row) -->
				{#if i % 3 !== 0}
					<div class="absolute top-0 left-0 h-full w-px bg-blue-100"></div>
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
