<script lang="ts">
	import type { PageData } from './$types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Search,
		Star,
		Trash2,
		Printer,
		EllipsisVertical,
		Paperclip,
		Image as ImageIcon,
		Send,
		Bold,
		Italic,
		Underline,
		Highlighter,
		List,
		ListOrdered,
		AlignLeft,
		AlignCenter,
		AlignRight,
		Reply,
		MoreHorizontal
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50/50">
	<!-- Sidebar -->
	<aside class="flex w-80 flex-col border-r bg-gray-50/30">
		<div class="p-4">
			<div class="relative">
				<Input
					placeholder="Search"
					class="rounded-xl border-transparent bg-gray-200/50 pl-4 pr-9 transition-colors focus-visible:bg-white"
				/>
				<Search class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
			</div>
		</div>

		<div class="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 pb-3">
			{#each data.conversations as chat}
				<button
					class="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-all hover:bg-white hover:shadow-sm {chat.active
						? 'bg-white shadow-md ring-1 ring-black/5'
						: ''}"
				>
					<Avatar.Root class="h-10 w-10 border-2 border-white shadow-sm">
						<Avatar.Image src={chat.avatar} alt={chat.name} />
						<Avatar.Fallback class={chat.color || 'bg-gray-100'}>{chat.fallback}</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex-1 overflow-hidden">
						<div class="flex items-center justify-between">
							<span class="truncate text-sm font-semibold text-gray-900">{chat.name}</span>
							<span class="text-xs text-gray-500">{chat.time}</span>
						</div>
						<p class="mt-0.5 truncate text-xs text-gray-500">{chat.preview}</p>
					</div>
					{#if chat.unread > 0}
						<div
							class="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white shadow-sm"
						>
							{chat.unread}
						</div>
					{:else if chat.starred}
						<Star class="h-4 w-4 fill-gray-300 text-gray-300" />
					{/if}
				</button>
			{/each}
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex flex-1 flex-col bg-white">
		<!-- Top Header -->
		<header class="flex items-center justify-between px-6 py-3">
			<div class="flex items-center gap-2">
				<!-- Tags removed as requested -->
			</div>
			<div class="flex items-center gap-4 text-gray-300">
				<button class="hover:text-gray-500"><Star class="h-5 w-5" /></button>
				<button class="hover:text-gray-500"><Printer class="h-5 w-5" /></button>
				<button class="hover:text-gray-500"><Trash2 class="h-5 w-5" /></button>
				<button class="hover:text-gray-500"><EllipsisVertical class="h-5 w-5" /></button>
			</div>
		</header>

		<!-- Scrollable Content -->
		<div class="scrollbar-hide flex-1 overflow-y-auto px-6 pb-4">
			<div class="mb-2 text-sm text-gray-400">{data.currentThread.date}</div>
			<h1 class="mb-4 text-2xl font-bold text-gray-900">{data.currentThread.subject}</h1>

			<div class="space-y-4">
				{#each data.currentThread.messages as message}
					<div class="group relative">
						{#if message.fullBody}
							<!-- Expanded Message View -->
							<div class="flex gap-4">
								<Avatar.Root class="h-10 w-10">
									<Avatar.Image src={message.avatar} alt={message.sender} />
									<Avatar.Fallback>{message.sender[0]}</Avatar.Fallback>
								</Avatar.Root>
								<div class="flex-1">
									<div class="mb-2 flex items-center justify-between">
										<span class="font-semibold text-gray-900">{message.sender}</span>
										<span class="text-sm text-gray-400">{message.time}</span>
									</div>
									<div class="prose prose-sm max-w-none whitespace-pre-line text-gray-600">
										{@html message.fullBody}
									</div>
								</div>
							</div>
						{:else}
							<!-- Collapsed/Previous Message View -->
							<div class="flex items-center gap-4 py-1.5">
								{#if message.isMe}
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600"
									>
										<Reply class="h-4 w-4" />
									</div>
								{:else}
									<Avatar.Root class="h-8 w-8">
										<Avatar.Image src={message.avatar} alt={message.sender} />
										<Avatar.Fallback>{message.sender[0]}</Avatar.Fallback>
									</Avatar.Root>
								{/if}

								<div class="flex flex-1 items-center gap-2 overflow-hidden">
									<span class="whitespace-nowrap text-sm font-semibold text-gray-900"
										>{message.sender}</span
									>
									<span class="truncate text-sm text-gray-400">- {message.content}</span>
								</div>
								<span class="whitespace-nowrap text-xs text-gray-400">{message.time}</span>
							</div>
							<Separator class="mt-1" />
						{/if}
					</div>
				{/each}
			</div>

			<!-- Editor Area -->
			<div class="mt-6">
				<div class="mb-3 rounded-xl border bg-white shadow-sm">
					<div class="p-3">
						<textarea
							class="min-h-[100px] w-full resize-none border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
							placeholder="Write your message..."
						></textarea>
					</div>
					<div class="flex items-center gap-1 border-t bg-white px-3 py-1.5">
						<Button
							variant="ghost"
							size="icon"
							class="h-7 w-7 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
						>
							<Bold class="h-3.5 w-3.5" />
						</Button>
						<Button variant="ghost" size="icon" class="h-7 w-7 text-gray-400 hover:text-gray-600">
							<Italic class="h-3.5 w-3.5" />
						</Button>
						<Button variant="ghost" size="icon" class="h-7 w-7 text-gray-400 hover:text-gray-600">
							<Underline class="h-3.5 w-3.5" />
						</Button>
						<Button variant="ghost" size="icon" class="h-7 w-7 text-gray-400 hover:text-gray-600">
							<Highlighter class="h-3.5 w-3.5" />
						</Button>
						<div class="mx-2 h-4 w-px bg-gray-200"></div>
						<Button variant="ghost" size="icon" class="h-7 w-7 text-gray-400 hover:text-gray-600">
							<List class="h-3.5 w-3.5" />
						</Button>
						<Button variant="ghost" size="icon" class="h-7 w-7 text-gray-400 hover:text-gray-600">
							<ListOrdered class="h-3.5 w-3.5" />
						</Button>
						<Button variant="ghost" size="icon" class="h-7 w-7 text-gray-400 hover:text-gray-600">
							<AlignLeft class="h-3.5 w-3.5" />
						</Button>
						<Button variant="ghost" size="icon" class="h-7 w-7 text-gray-400 hover:text-gray-600">
							<AlignCenter class="h-3.5 w-3.5" />
						</Button>
						<Button variant="ghost" size="icon" class="h-7 w-7 text-gray-400 hover:text-gray-600">
							<AlignRight class="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>

				<div class="flex items-center justify-between px-1">
					<div class="flex items-center gap-2">
						<Button variant="ghost" size="icon" class="text-gray-300 hover:text-gray-500">
							<Paperclip class="h-5 w-5" />
						</Button>
						<Button variant="ghost" size="icon" class="text-gray-300 hover:text-gray-500">
							<ImageIcon class="h-5 w-5" />
						</Button>
					</div>
					<div class="flex items-center gap-2">
						<Button variant="ghost" size="icon" class="text-gray-300 hover:text-gray-500">
							<Trash2 class="h-5 w-5" />
						</Button>
						<Button variant="ghost" size="icon" class="text-gray-300 hover:text-gray-500">
							<MoreHorizontal class="h-5 w-5" />
						</Button>
						<Button class="ml-2 gap-2 bg-teal-500 text-white hover:bg-teal-600">
							Send <Send class="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
