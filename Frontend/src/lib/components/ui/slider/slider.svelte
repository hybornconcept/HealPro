<script lang="ts">
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils";

	interface SliderProps extends Omit<WithoutChildrenOrChild<SliderPrimitive.RootProps>, 'value' | 'type'> {
		thayzeRatingColor?: number;
		thayzeGetRatingColor?: (value: number) => string;
		thayzeGetRatingText?: (rating: number) => string;
		thayzeSetSliderValue?: (value: number) => void;
		type?: 'single' | 'range';
		value?: number | number[];
	}

	let {
		ref = $bindable(null),
		value = $bindable([0]),
		orientation = "horizontal",
		class: className,
		thayzeRatingColor = 0,
		thayzeGetRatingColor,
		thayzeGetRatingText,
		thayzeSetSliderValue,
		type = 'single',
		...restProps
	}: SliderProps = $props();

	// Use reactive statements to handle the rating color
	let ratingColor = $derived(thayzeRatingColor || 0);
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:this={ref}
	bind:value
	onValueChange={(newValue) => {
		if (thayzeSetSliderValue) {
			if (Array.isArray(newValue) && newValue.length > 0) {
				thayzeSetSliderValue(newValue[0]);
			} else if (typeof newValue === 'number') {
				thayzeSetSliderValue(newValue);
			}
		}
	}}
	data-slot="slider"
	{orientation}
	class={cn(
		"relative flex w-full touch-none select-none items-center data-[orientation=horizontal]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
		className
	)}
	{...restProps}
>
	{#snippet children({ thumbs })}
		<span
			data-orientation={orientation}
			data-slot="slider-track"
			class={cn(
				"bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5"
			)}
		>
			<SliderPrimitive.Range
				data-slot="slider-range"
				class={cn(
					"bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
				)}
				style={`background-color: ${thayzeGetRatingColor?.(ratingColor) || '#3b82f6'}`}
			/>
		</span>
		{#each thumbs as thumb (thumb)}
			<SliderPrimitive.Thumb
				data-slot="slider-thumb"
				index={thumb}
				class={cn(
					"border-primary bg-background ring-ring/50 focus-visible:outline-hidden block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
				)}
				style={`border-color: ${thayzeGetRatingColor?.(ratingColor) || '#3b82f6'}; background-color: ${thayzeGetRatingColor?.(ratingColor) || '#3b82f6'}`}
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>

