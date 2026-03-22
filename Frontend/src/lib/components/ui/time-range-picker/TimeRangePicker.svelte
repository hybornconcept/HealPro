<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Clock, ArrowRight } from '@lucide/svelte';

	let {
		startHour = $bindable('1'),
		startMinute = $bindable('00'),
		startSecond = $bindable('00'),
		startAMPM = $bindable('AM')
	} = $props();

	// Handle input focus to clear placeholder
	function handleFocus(event: FocusEvent) {
		const target = event.target as HTMLInputElement;
		target.value = '';
	}

	// Enforce 1-12 for hour
	function handleHourInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value.replace(/[^0-9]/g, '').slice(0, 2);
		let numValue = parseInt(value) || 0;
		if (numValue > 12) numValue = 12;
		if (numValue < 1 && value !== '') numValue = 1;
		value = value === '' ? '' : numValue.toString();
		startHour = value;
		target.value = value;
	}

	// Enforce 0-59 for minute/second
	function handleTimeInput(event: Event, type: 'minute' | 'second') {
		const target = event.target as HTMLInputElement;
		let value = target.value.replace(/[^0-9]/g, '').slice(0, 2);
		let numValue = parseInt(value) || 0;
		if (numValue > 59) numValue = 59;
		value = value === '' ? '' : numValue.toString().padStart(2, '0');
		if (type === 'minute') startMinute = value;
		else startSecond = value;
		target.value = value;
	}

	// On blur, enforce defaults and clamp values
	function handleBlur(event: FocusEvent, type: 'hour' | 'minute' | 'second') {
		const target = event.target as HTMLInputElement;
		let value = target.value.replace(/[^0-9]/g, '');
		if (value === '') {
			if (type === 'hour') value = '1';
			else value = '00';
		} else {
			let numValue = parseInt(value) || 0;
			if (type === 'hour') {
				if (numValue > 12) numValue = 12;
				if (numValue < 1) numValue = 1;
				value = numValue.toString();
			} else {
				if (numValue > 59) numValue = 59;
				value = numValue.toString().padStart(2, '0');
			}
		}
		if (type === 'hour') startHour = value;
		else if (type === 'minute') startMinute = value;
		else startSecond = value;
		target.value = value;
	}

	const ampmOptions = [
		{ value: 'AM', label: 'AM' },
		{ value: 'PM', label: 'PM' }
	];

	const ampmTriggerContent = $derived(
		ampmOptions.find((o) => o.value === startAMPM)?.label ?? 'AM'
	);
</script>

<div class="flex justify-center">
	<div class="ml-1 flex items-center space-x-1">
		<Input
			class="w-[43px] text-center"
			placeholder="1"
			type="text"
			maxlength="2"
			bind:value={startHour}
			on:focus={handleFocus}
			on:input={handleHourInput}
			on:blur={(e) => handleBlur(e, 'hour')}
		/>
		<div class="flex items-center text-xs">:</div>
		<Input
			class="w-[43px] text-center"
			placeholder="00"
			min="0"
			max="59"
			bind:value={startMinute}
			on:focus={handleFocus}
			on:input={(e) => handleTimeInput(e, 'minute')}
			on:blur={(e) => handleBlur(e, 'minute')}
		/>
		<div class="flex items-center text-xs">:</div>
		<Input
			class="w-[43px] text-center"
			placeholder="00"
			min="0"
			max="59"
			bind:value={startSecond}
			on:focus={handleFocus}
			on:input={(e) => handleTimeInput(e, 'second')}
			on:blur={(e) => handleBlur(e, 'second')}
		/>
		<div class="flex items-center text-xs">:</div>
		<Select.Root type="single" name="ampm" bind:value={startAMPM}>
			<Select.Trigger
				class="w-[65px] rounded border border-gray-300 bg-white focus:border-blue-500 focus:outline-none"
			>
				{ampmTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each ampmOptions as option (option.value)}
						<Select.Item value={option.value} label={option.label}>
							{option.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>
