// Performance monitoring and optimization utilities

import { browser } from '$app/environment';

// Performance metrics interface
interface PerformanceMetrics {
	fcp?: number; // First Contentful Paint
	lcp?: number; // Largest Contentful Paint
	fid?: number; // First Input Delay
	cls?: number; // Cumulative Layout Shift
	ttfb?: number; // Time to First Byte
}

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
	private metrics: PerformanceMetrics = {};
	private observers: PerformanceObserver[] = [];

	constructor() {
		if (!browser) return;
		this.initializeObservers();
	}

	private initializeObservers() {
		// Observe paint metrics (FCP, LCP)
		if ('PerformanceObserver' in window) {
			try {
				const paintObserver = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						if (entry.name === 'first-contentful-paint') {
							this.metrics.fcp = entry.startTime;
						}
					}
				});
				paintObserver.observe({ entryTypes: ['paint'] });
				this.observers.push(paintObserver);

				// LCP Observer
				const lcpObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const lastEntry = entries[entries.length - 1];
					this.metrics.lcp = lastEntry.startTime;
				});
				lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
				this.observers.push(lcpObserver);

				// FID Observer
				const fidObserver = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						this.metrics.fid = entry.processingStart - entry.startTime;
					}
				});
				fidObserver.observe({ entryTypes: ['first-input'] });
				this.observers.push(fidObserver);

				// CLS Observer
				let clsValue = 0;
				const clsObserver = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						if (!entry.hadRecentInput) {
							clsValue += entry.value;
							this.metrics.cls = clsValue;
						}
					}
				});
				clsObserver.observe({ entryTypes: ['layout-shift'] });
				this.observers.push(clsObserver);

			} catch (error) {
				console.warn('Performance monitoring not supported:', error);
			}
		}

		// TTFB from Navigation Timing
		if ('performance' in window && 'getEntriesByType' in performance) {
			const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
			if (navigationEntries.length > 0) {
				const entry = navigationEntries[0];
				this.metrics.ttfb = entry.responseStart - entry.requestStart;
			}
		}
	}

	getMetrics(): PerformanceMetrics {
		return { ...this.metrics };
	}

	// Report metrics to analytics (placeholder)
	reportMetrics() {
		if (!browser) return;
		
		// You can integrate with your analytics service here
		console.log('Performance Metrics:', this.metrics);
	}

	destroy() {
		this.observers.forEach(observer => observer.disconnect());
		this.observers = [];
	}
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	};
}

// Intersection Observer utility
export function createIntersectionObserver(
	callback: (entries: IntersectionObserverEntry[]) => void,
	options: IntersectionObserverInit = {}
): IntersectionObserver | null {
	if (!browser || !('IntersectionObserver' in window)) {
		return null;
	}

	return new IntersectionObserver(callback, {
		rootMargin: '50px',
		threshold: 0.1,
		...options
	});
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
	if (!browser) return;

	const link = document.createElement('link');
	link.rel = 'preload';
	link.href = href;
	link.as = as;
	if (type) link.type = type;
	
	document.head.appendChild(link);
}

// Prefetch non-critical resources
export function prefetchResource(href: string) {
	if (!browser) return;

	const link = document.createElement('link');
	link.rel = 'prefetch';
	link.href = href;
	
	document.head.appendChild(link);
}

// Memory usage monitoring
export function getMemoryUsage() {
	if (!browser || !('memory' in performance)) {
		return null;
	}

	const memory = (performance as any).memory;
	return {
		used: Math.round(memory.usedJSHeapSize / 1048576), // MB
		total: Math.round(memory.totalJSHeapSize / 1048576), // MB
		limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
	};
}

// Connection quality detection
export function getConnectionInfo() {
	if (!browser || !('connection' in navigator)) {
		return null;
	}

	const connection = (navigator as any).connection;
	return {
		effectiveType: connection.effectiveType,
		downlink: connection.downlink,
		rtt: connection.rtt,
		saveData: connection.saveData
	};
}

// Adaptive loading based on connection
export function shouldLoadHighQuality(): boolean {
	const connection = getConnectionInfo();
	if (!connection) return true; // Default to high quality if unknown

	// Load high quality on fast connections
	return connection.effectiveType === '4g' && !connection.saveData;
}

// Resource hints helper
export function addResourceHints(resources: Array<{ href: string; rel: string; as?: string; type?: string }>) {
	if (!browser) return;

	resources.forEach(resource => {
		const link = document.createElement('link');
		link.rel = resource.rel;
		link.href = resource.href;
		if (resource.as) link.as = resource.as;
		if (resource.type) link.type = resource.type;
		document.head.appendChild(link);
	});
}

// Initialize performance monitoring
export const performanceMonitor = browser ? new PerformanceMonitor() : null;
