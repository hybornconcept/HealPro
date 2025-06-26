<script lang="ts">
	import { Activity, MapPin, Mail, Globe, Facebook, Twitter, Instagram } from '@lucide/svelte';

	// Social media links
	const socialLinks = [
		{ icon: Facebook, label: 'Facebook' },
		{ icon: Twitter, label: 'Twitter' },
		{ icon: Instagram, label: 'Instagram' }
	];

	// Contact information
	const contactInfo = [
		{ icon: MapPin, text: '123 Healthcare Blvd, Medical District, NY 10001', isLink: false },
		{ icon: Mail, text: 'contact@healpro.com', isLink: true, href: 'mailto:contact@healpro.com' },
		{ icon: Globe, text: 'www.healpro.com', isLink: true, href: 'https://www.healpro.com' }
	];

	// Footer columns
	const footerColumns = [
		{
			title: 'Quick Links',
			links: [
				{ text: 'About Us', href: '/' },
				{ text: 'Our Services', href: '/' },
				{ text: 'Doctors', href: '/' },
				{ text: 'Appointments', href: '/' },
				{ text: 'Contact', href: '/' }
			]
		},
		{
			title: 'Our Services',
			links: [
				{ text: 'Primary Care', href: '/' },
				{ text: 'Specialty Care', href: '/' },
				{ text: 'Urgent Care', href: '/' },
				{ text: 'Telehealth', href: '/' },
				{ text: 'Preventive Care', href: '/' }
			]
		},
		{
			title: 'Opening Hours',
			hours: [
				{ day: 'Monday - Friday', hours: '8:00 - 20:00' },
				{ day: 'Saturday', hours: '9:00 - 18:00' },
				{ day: 'Sunday', hours: '10:00 - 16:00' },
				{ day: 'Holidays', hours: '10:00 - 14:00' },
				{ day: 'Emergency', hours: '24/7' }
			]
		}
	];
</script>

<footer class="w-full bg-gray-900 py-10 text-white">
	<div class="mx-auto max-w-6xl px-6">
		<!-- Logo and social icons -->
		<div class="mb-6 flex items-center justify-between border-b border-gray-700 pb-6">
			<div class="flex items-center gap-2">
				<Activity class="h-5 w-5 text-blue-500" />
				<span class="text-xl font-bold">
					Heal<span class="text-blue-500">Pro.</span>
				</span>
			</div>

			<div class="flex gap-4">
				{#each socialLinks as { icon: Icon, label }}
					<a href="/" aria-label={label}>
						<Icon class="h-5 w-5 text-gray-400 hover:text-blue-500" />
					</a>
				{/each}
			</div>
		</div>

		<!-- Footer content -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			<!-- Column 1: Contact -->
			<div>
				<h3 class="mb-4 text-lg font-semibold">Contact Us</h3>
				<ul class="space-y-3">
					{#each contactInfo as { icon: Icon, text, isLink, href }}
						<li class="flex items-start gap-3">
							<Icon class="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
							{#if isLink}
								<a {href}>{text}</a>
							{:else}
								<span>{text}</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Columns 2-4: Dynamic content -->
			{#each footerColumns as column}
				<div>
					<h3 class="mb-4 text-lg font-semibold">{column.title}</h3>
					<ul class="space-y-2">
						{#if column.links}
							{#each column.links as link}
								<li>
									<a href={link.href} class="hover:text-blue-500">{link.text}</a>
								</li>
							{/each}
						{:else if column.hours}
							{#each column.hours as { day, hours }}
								<li>
									<a href="/" class="flex justify-between hover:text-blue-500">
										<span>{day}</span>
										<span>{hours}</span>
									</a>
								</li>
							{/each}
						{/if}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Copyright -->
		<div class="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
			<p>© {new Date().getFullYear()} HealPro. All rights reserved.</p>
		</div>
	</div>
</footer>
