<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
</script>

<section class="w-full px-6 md:px-0">
	<div class="relative mx-auto my-10 max-w-6xl overflow-hidden rounded-3xl bg-linear-to-b from-blue-600 to-blue-900 px-10 py-8 shadow-2xl shadow-blue-200 sm:px-6 md:rounded-[2.5rem] md:px-8 md:py-10">
	<!-- Decorative background elements -->
	<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
	<div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
	
	<!-- Subtle grid pattern -->
	<div class="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

	<!-- Content -->
	<div class="relative z-10 mx-auto max-w-3xl text-center">
		<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md border border-white/20">
			<span class="relative flex h-2 w-2">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-300 opacity-75"></span>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-blue-400"></span>
			</span>
			Stay Updated
		</div>
		
		<h2 class="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
			Join the Healthcare <br class="hidden sm:block" /> 
			<span class="text-blue-200">Revolution.</span>
		</h2>

		<p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-blue-50 md:text-lg">
			Get exclusive healthcare trends, wellness tips, and platform updates delivered straight to your inbox. No spam, just value.
		</p>

		<!-- Email input form -->
		<div class="mx-auto mt-6 flex w-full max-w-lg flex-col gap-3 rounded-4xl bg-white/10 p-2 backdrop-blur-xl border border-white/20 sm:flex-row">
			<Input
				type="email"
				placeholder="yourname@email.com"
				class="h-12 border-0 bg-transparent px-6 text-lg text-white placeholder:text-blue-100 focus-visible:ring-0 focus-visible:ring-offset-0"
			/>
			<Button class="h-12 rounded-3xl bg-white px-10 text-lg font-bold text-blue-700 hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-95 shadow-lg">
				Subscribe
			</Button>
		</div>
		
		<p class="mt-4 text-xs text-blue-200/60 uppercase tracking-widest font-semibold">Join 10,000+ members</p>
	</div>
</section>
