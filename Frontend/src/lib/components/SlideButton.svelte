<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		title: string;
		rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		icon: Component;
		href?: string;
		width?: string;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		title,
		rounded = 'full',
		icon: Icon,
		href,
		width = 'w-auto',
		class: className = '',
		onclick,
		onkeydown,
		...restProps
	}: Props = $props();

	const roundedClasses = {
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		full: 'rounded-full'
	};
</script>

<a
	{href}
	class="group relative z-10 flex items-center justify-center overflow-hidden {roundedClasses[rounded]} border-2 border-blue-500 bg-transparent px-7 py-2 text-base font-normal text-blue-500 transition-all duration-300 hover:text-white {width} {className}"
	{onclick}
	{onkeydown}
	{...restProps}
>
	<span
		class="absolute inset-0 -z-10 h-full w-full -translate-x-full bg-blue-500 transition-transform duration-300 group-hover:translate-x-0"
	></span>
	<span class="mx-3">{title}</span>
	<Icon class="h-4 w-4" />
</a>
