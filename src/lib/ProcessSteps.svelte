<script>
	// No logic needed for this static component
</script>

<div class="mx-auto max-w-5xl px-4 py-12">
	<h4 class="text-primary mb-2 text-center font-semibold">How Its Work</h4>
	<h2 class="mb-4 text-center text-4xl font-bold">Our Process Simple Steps to Follow</h2>
	<p class="text-muted-foreground mx-auto mb-10 max-w-2xl text-center">
		Our process is designed to be simple and stress-free with easy steps to follow, we guide you
		every step of the way no confusion, just a clear path to success we make sure you’re comfortable
		and informed throughout
	</p>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-2">
			{#each [{ title: 'Search Doctor', desc: 'Search by need location expertises thousands of trusted professionals personalized care at your fingertips book in minutes be seen on time', icon: `<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>` }, { title: 'Check Doctor Profile', desc: 'Explore our trusted doctors’ profiles to learn more about their expertise experience and commitment to providing exceptional care', icon: `<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2"/></svg>` }, { title: 'Get Your Solution', desc: 'Quick answers from trusted experts personalized solutions, anytime you need no confusion just clarity from health to home we’ve got it covered', icon: `<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M12 4v16"/><path d="M4 4h16"/><path d="M4 20h8"/></svg>` }, { title: 'Schedule Appointment', desc: 'Schedule appointments in just a few taps choose your doctor, date, and time no long waits no stress Instant confirmations real-time slots', icon: `<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>` }] as step}
				<div class="bg-card flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
					<div
						class="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full"
						use:html={step.icon}
					></div>
					<h3 class="text-lg font-semibold">{step.title}</h3>
					<p class="text-muted-foreground text-sm">{step.desc}</p>
				</div>
			{/each}
		</div>
		<div
			class="bg-primary text-primary-foreground flex flex-col justify-between rounded-xl p-8 shadow-lg"
		>
			<div>
				<h3 class="mb-2 text-xl font-semibold">Opening Hours</h3>
				<p class="text-primary-foreground/70 mb-4 text-sm">
					Explore our opening hours and choose a time that fits your schedule best whether it’s
					early in the day or later in the evening, we’re here to offer the care and support you
					need whenever you need it most.
				</p>
				<div class="mb-4">
					<div class="border-primary/40 mb-1 flex justify-between border-b pb-1">
						<span>Mon-Fri</span>
						<span>6am-10pm</span>
					</div>
					<div class="flex justify-between">
						<span>Sat-Sun</span>
						<span>7am-10pm</span>
					</div>
				</div>
			</div>
			<button
				class="text-primary hover:bg-primary/10 mt-4 flex items-center justify-center rounded-lg bg-white px-6 py-2 font-semibold transition"
			>
				<svg
					class="mr-2 h-5 w-5"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path d="M12 4v16m8-8H4" />
				</svg>
				Book Appointment
			</button>
		</div>
	</div>
</div>
