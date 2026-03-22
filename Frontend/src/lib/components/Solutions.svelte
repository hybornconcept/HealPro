<script lang="ts">
	import { ClipboardList, ShieldCheck, Zap, Presentation } from 'lucide-svelte';
</script>

<section class="relative mx-auto w-full bg-white font-sans overflow-hidden">
	<!-- Dotted pattern background -->
	<!-- Radial gradient simulates the faint cross/dotted grid bg -->
	<div class="absolute inset-0 z-0 bg-[radial-gradient(#d1d5db_1.5px,transparent_1.5px)] [background-size:36px_36px] opacity-40"></div>

	<div class="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 md:px-8">
		
		<!-- Header -->
		<div class="flex flex-col items-center text-center mb-6 md:mb-10 px-4">
			<div class="mb-2 inline-flex items-center rounded-md bg-blue-50 border border-gray-100 px-3 py-1 text-[0.8rem] font-semibold text-blue-700 shadow-sm">
				<span class="mr-1.5 text-blue-500 font-bold ">-</span> Solutions
			</div>
			<h2 class="mb-5 text-2xl font-bold tracking-tight text-gray-900 md:text-[2.6rem] md:leading-tight lg:text-5xl">
				And many other services that we <br class="hidden md:block"/> provide for you
			</h2>
			<p class="max-w-xl text-[0.95rem] leading-relaxed text-gray-500">
				Managing your healthcare needs can be a complex challenge. This is where the HealPro Platform is here to provide assistance in the most vital aspects.
			</p>
		</div>

		<!-- Vertical Central Timeline Grid -->
		<div class="relative w-full max-w-[56rem] mx-auto">
			
			<!-- The faint central vertical line dropping down -->
			<!-- md:left-1/2 perfectly centers the line for desktop, left-6 for mobile -->
			<div class="absolute left-[1.5rem] md:left-1/2 top-4 bottom-4 w-[1px] bg-gray-200 md:-translate-x-1/2 z-0"></div>

			<!-- Item 1 (Left aligned text block on Desktop) -->
			<div class="flex flex-col md:flex-row w-full mb-6 md:mb-8 relative z-10">
				<!-- Left Half -->
				<div class="w-full md:w-1/2 pl-14 md:pl-0 md:pr-16 flex flex-col items-start md:items-end text-left md:text-right relative">
					<!-- Dot -> Desktop (right side), Mobile (left side) -->
					<!-- Center dot aligned vertically to the icon box (top-7 = 28px = exactly middle of h-14) -->
					<div class="hidden md:block absolute right-0 top-7 w-2.5 h-2.5 rounded-full bg-blue-600 translate-x-1/2 -translate-y-1/2 ring-[6px] ring-white shadow-sm z-10"></div>
					<div class="absolute left-[1.5rem] md:hidden top-7 w-2.5 h-2.5 rounded-full bg-blue-600 -translate-x-1/2 -translate-y-1/2 ring-[6px] ring-white shadow-sm z-10"></div>
					
					<!-- Blue Icon Box -->
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100/50 bg-blue-50 text-blue-600 shadow-sm md:h-14 md:w-14">
						<ClipboardList size={22} strokeWidth={2.5} />
					</div>
					
					<h3 class="mb-3 text-lg font-bold text-gray-900">Seamless Patient Onboarding</h3>
					<p class="text-[0.875rem] leading-relaxed text-gray-500 max-w-sm">
						We make the new patient integration process very easy. From the first day, you're ready to start. Maintaining your records is simpler too by using advanced healthcare tools like digital health assessments.
					</p>
				</div>
				<!-- Right Half (empty) -->
				<div class="hidden md:block md:w-1/2"></div>
			</div>

			<!-- Item 2 (Right aligned text block on Desktop) -->
			<div class="flex flex-col md:flex-row w-full mb-6 md:mb-8 relative z-10">
				<!-- Left Half (empty) -->
				<div class="hidden md:block md:w-1/2"></div>
				<!-- Right Half -->
				<div class="w-full md:w-1/2 pl-14 md:pl-16 flex flex-col items-start text-left relative">
					<!-- Dot -> Desktop & Mobile (left side) -->
					<div class="hidden md:block absolute left-0 top-7 w-2.5 h-2.5 rounded-full bg-blue-600 -translate-x-1/2 -translate-y-1/2 ring-[6px] ring-white shadow-sm z-10"></div>
					<div class="absolute left-[1.5rem] md:hidden top-7 w-2.5 h-2.5 rounded-full bg-blue-600 -translate-x-1/2 -translate-y-1/2 ring-[6px] ring-white shadow-sm z-10"></div>
					
					<!-- Blue Icon Box -->
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100/50 bg-blue-50 text-blue-600 shadow-sm md:h-14 md:w-14">
						<ShieldCheck size={22} strokeWidth={2.5} />
					</div>
					
					<h3 class="mb-3 text-lg font-bold text-gray-900">Ensure Data Privacy</h3>
					<p class="text-[0.875rem] leading-relaxed text-gray-500 max-w-sm">
						Navigating medical compliance is simplified with HealPro. Our platform automates a plethora of compliance tasks and secure record filings on your behalf. With our integrated safeguards, patient confidentiality risk is minimized.
					</p>
				</div>
			</div>

			<!-- Item 3 (Left aligned text block on Desktop) -->
			<div class="flex flex-col md:flex-row w-full mb-6 md:mb-8 relative z-10">
				<!-- Left Half -->
				<div class="w-full md:w-1/2 pl-14 md:pl-0 md:pr-16 flex flex-col items-start md:items-end text-left md:text-right relative">
					<!-- Dot (Grey) -> Desktop (right side), Mobile (left side) -->
					<div class="hidden md:block absolute right-0 top-7 w-2.5 h-2.5 rounded-full bg-gray-300 translate-x-1/2 -translate-y-1/2 ring-[6px] ring-white shadow-sm z-10"></div>
					<div class="absolute left-[1.5rem] md:hidden top-7 w-2.5 h-2.5 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2 ring-[6px] ring-white shadow-sm z-10"></div>
					
					<!-- Blue Icon Box -->
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100/50 bg-blue-50 text-blue-600 shadow-sm md:h-14 md:w-14">
						<Zap size={22} strokeWidth={2.5} />
					</div>
					
					<h3 class="mb-3 text-lg font-bold text-gray-900">Boost Clinic Efficiency</h3>
					<p class="text-[0.875rem] leading-relaxed text-gray-500 max-w-sm">
						At HealPro, we enhance care delivery through a range of capabilities such as streamlined self-booking, personalized doctor selection, and digital prescription access.
					</p>
				</div>
				<!-- Right Half (empty) -->
				<div class="hidden md:block md:w-1/2"></div>
			</div>

			<!-- Item 4 (Right aligned text block on Desktop) -->
			<div class="flex flex-col md:flex-row w-full relative z-10">
				<!-- Left Half (empty) -->
				<div class="hidden md:block md:w-1/2"></div>
				<!-- Right Half -->
				<div class="w-full md:w-1/2 pl-14 md:pl-16 flex flex-col items-start text-left relative">
					<!-- Dot (Grey) -> Desktop & Mobile (left side) -->
					<div class="hidden md:block absolute left-0 top-7 w-2.5 h-2.5 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2 ring-[6px] ring-white shadow-sm z-10"></div>
					<div class="absolute left-[1.5rem] md:hidden top-7 w-2.5 h-2.5 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2 ring-[6px] ring-white shadow-sm z-10"></div>
					
					<!-- Blue Icon Box -->
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100/50 bg-blue-50 text-blue-600 shadow-sm md:h-14 md:w-14">
						<Presentation size={22} strokeWidth={2.5} />
					</div>
					
					<h3 class="mb-3 text-lg font-bold text-gray-900">Elevate Patient Satisfaction</h3>
					<p class="text-[0.875rem] leading-relaxed text-gray-500 max-w-sm">
						At HealPro, we go beyond enhancing clinic operations; we elevate the overall patient experience. Through our mobile-friendly tools, we simplify remote consultations and streamline follow-up care.
					</p>
				</div>
			</div>

		</div>
	</div>
</section>
