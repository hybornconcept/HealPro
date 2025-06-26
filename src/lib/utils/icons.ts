// Optimized icon loading utility
// This reduces bundle size by lazy loading icons only when needed

import type { ComponentType } from 'svelte';

// Icon cache to prevent duplicate imports
const iconCache = new Map<string, ComponentType>();

// Commonly used icons that should be preloaded
const PRELOAD_ICONS = [
	'Search',
	'User',
	'Bell',
	'ChevronRight',
	'Plus',
	'Minus',
	'MoreHorizontal'
];

// Icon loader function
export async function loadIcon(iconName: string): Promise<ComponentType> {
	// Check cache first
	if (iconCache.has(iconName)) {
		return iconCache.get(iconName)!;
	}

	try {
		// Dynamic import based on icon name with vite-ignore comment
		const iconModule = await import(/* @vite-ignore */ `@lucide/svelte/icons/${iconName.toLowerCase().replace(/([A-Z])/g, '-$1').substring(1)}`);
		const IconComponent = iconModule.default;

		// Cache the icon
		iconCache.set(iconName, IconComponent);

		return IconComponent;
	} catch (error) {
		console.warn(`Failed to load icon: ${iconName}`, error);
		// Return a fallback icon
		const { Circle } = await import('@lucide/svelte');
		return Circle;
	}
}

// Preload commonly used icons
export async function preloadCommonIcons(): Promise<void> {
	const promises = PRELOAD_ICONS.map(iconName => loadIcon(iconName));
	await Promise.all(promises);
}

// Icon component wrapper for lazy loading
export function createLazyIcon(iconName: string) {
	return {
		iconName,
		load: () => loadIcon(iconName)
	};
}

// Batch icon loader for components that need multiple icons
export async function loadIcons(iconNames: string[]): Promise<Record<string, ComponentType>> {
	const promises = iconNames.map(async (name) => {
		const icon = await loadIcon(name);
		return [name, icon] as const;
	});
	
	const results = await Promise.all(promises);
	return Object.fromEntries(results);
}

// Icon preloader for critical path
export const criticalIcons = {
	Search: () => import('@lucide/svelte/icons/search'),
	User: () => import('@lucide/svelte/icons/user'),
	Bell: () => import('@lucide/svelte/icons/bell'),
	ChevronRight: () => import('@lucide/svelte/icons/chevron-right'),
	Plus: () => import('@lucide/svelte/icons/plus'),
	Minus: () => import('@lucide/svelte/icons/minus'),
	MoreHorizontal: () => import('@lucide/svelte/icons/more-horizontal')
};
