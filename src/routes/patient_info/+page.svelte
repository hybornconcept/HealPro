<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Bell, Settings, User, MapPin, Users, Database } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	// Form state
	let formData = $state({
		nik: '',
		nama: '',
		jenisKelamin: '',
		tempatLahir: '',
		tanggalLahir: '',
		agama: '',
		noTelepon: '',
		statusPernikahan: '',
		suku: '',
		pendidikan: '',
		pekerjaan: '',
		golonganDarah: ''
	});

	const handleSubmit = () => {
		console.log('Form submitted:', formData);
	};
</script>

<div class="min-h-screen bg-[#f0f7f7]">
	<!-- Top Navigation Bar -->
	<div class="flex items-center justify-between bg-white p-4 shadow-sm">
		<div class="flex items-center gap-4">
			<!-- Logo -->
			<div class="text-teal-600">
				<svg
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
				</svg>
			</div>
			<!-- App Launcher -->
			<div class="rounded-md bg-[#e6f7f5] p-2 text-teal-600">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
					<path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
				</svg>
			</div>
		</div>

		<!-- Right Side Icons -->
		<div class="flex items-center gap-2">
			<div class="rounded-full bg-[#e6f7f5] p-2">
				<Bell class="h-5 w-5 text-teal-600" />
			</div>
			<div class="flex items-center gap-1 rounded-full bg-[#e6f7f5] p-1 pr-2">
				<img
					src="https://randomuser.me/api/portraits/men/32.jpg"
					alt="User"
					class="h-8 w-8 rounded-full"
				/>
				<Settings class="h-5 w-5 text-teal-600" />
			</div>
		</div>
	</div>

	<!-- Sidebar -->
	<div class="fixed top-0 left-0 flex h-full w-16 flex-col items-center bg-white pt-20">
		<div class="flex flex-col items-center gap-6">
			<button class="rounded p-2 text-gray-400 hover:bg-gray-100">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect width="7" height="7" x="3" y="3" rx="1"></rect>
					<rect width="7" height="7" x="14" y="3" rx="1"></rect>
					<rect width="7" height="7" x="14" y="14" rx="1"></rect>
					<rect width="7" height="7" x="3" y="14" rx="1"></rect>
				</svg>
			</button>
			<button class="rounded bg-teal-600 p-2 text-white">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path>
					<path d="M14 3v5h5M18 21v-6M15 18h6"></path>
				</svg>
			</button>
			<button class="rounded p-2 text-gray-400 hover:bg-gray-100">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect width="18" height="18" x="3" y="3" rx="2"></rect>
					<path d="M3 9h18"></path>
					<path d="M9 21V9"></path>
				</svg>
			</button>
			<button class="rounded p-2 text-gray-400 hover:bg-gray-100">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M8 2v4"></path>
					<path d="M16 2v4"></path>
					<rect width="18" height="18" x="3" y="4" rx="2"></rect>
					<path d="M3 10h18"></path>
				</svg>
			</button>
			<button class="rounded p-2 text-gray-400 hover:bg-gray-100">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
				</svg>
			</button>
			<button class="rounded p-2 text-gray-400 hover:bg-gray-100">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<path d="M14 2v6h6"></path>
					<path d="M16 13H8"></path>
					<path d="M16 17H8"></path>
					<path d="M10 9H8"></path>
				</svg>
			</button>
		</div>
	</div>

	<!-- Main Content -->
	<div class="ml-16 p-6">
		<h1 class="mb-6 text-2xl font-semibold text-teal-600">Isi Data Pasien</h1>

		<div class="flex gap-6">
			<!-- Left Side - Progress Steps -->
			<div class="w-64 rounded-lg bg-white p-6 shadow-sm">
				<div class="relative">
					<!-- Step 1 -->
					<div class="flex items-start gap-3">
						<div class="relative z-10">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white"
							>
								1
							</div>
							<div class="absolute top-10 left-5 h-16 w-0.5 bg-teal-600"></div>
						</div>
						<div class="pt-1.5">
							<h3 class="font-medium">Data Diri</h3>
						</div>
					</div>

					<!-- Step 2 -->
					<div class="flex items-start gap-3">
						<div class="relative z-10">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white"
							>
								2
							</div>
							<div class="absolute top-10 left-5 h-16 w-0.5 bg-teal-600"></div>
						</div>
						<div class="pt-1.5">
							<h3 class="font-medium">Alamat</h3>
						</div>
					</div>

					<!-- Step 3 -->
					<div class="flex items-start gap-3">
						<div class="relative z-10">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white"
							>
								3
							</div>
							<div class="absolute top-10 left-5 h-16 w-0.5 bg-teal-600"></div>
						</div>
						<div class="pt-1.5">
							<h3 class="font-medium">Keluarga</h3>
						</div>
					</div>

					<!-- Step 4 -->
					<div class="flex items-start gap-3">
						<div class="relative z-10">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white"
							>
								3
							</div>
						</div>
						<div class="pt-1.5">
							<h3 class="font-medium">Data Wali</h3>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Side - Form -->
			<div class="flex-1 rounded-lg bg-white p-6 shadow-sm">
				<form onsubmit={handleSubmit} class="grid grid-cols-2 gap-x-6 gap-y-4">
					<!-- NIK -->
					<div>
						<label for="nik" class="mb-1 block text-sm font-medium">NIK</label>
						<Input id="nik" bind:value={formData.nik} placeholder="Masukkan NIK" class="w-full" />
					</div>

					<!-- Tanggal Lahir -->
					<div>
						<label for="tanggalLahir" class="mb-1 block text-sm font-medium">Tanggal Lahir</label>
						<Input
							id="tanggalLahir"
							bind:value={formData.tanggalLahir}
							placeholder="Pilih Tanggal Lahir"
							class="w-full"
						/>
					</div>

					<!-- Nama -->
					<div>
						<label for="nama" class="mb-1 block text-sm font-medium">Nama</label>
						<Input
							id="nama"
							bind:value={formData.nama}
							placeholder="Masukkan Nama"
							class="w-full"
						/>
					</div>

					<!-- Agama -->
					<div>
						<label for="agama" class="mb-1 block text-sm font-medium">Agama</label>
						<Input
							id="agama"
							bind:value={formData.agama}
							placeholder="Pilih Agama"
							class="w-full"
						/>
					</div>

					<!-- Jenis Kelamin -->
					<div>
						<label for="jenisKelamin" class="mb-1 block text-sm font-medium">Jenis kelamin</label>
						<Input
							id="jenisKelamin"
							bind:value={formData.jenisKelamin}
							placeholder="Pilih Jenis Kelamin"
							class="w-full"
						/>
					</div>

					<!-- No. Telepon -->
					<div>
						<label for="noTelepon" class="mb-1 block text-sm font-medium">No. Telepon</label>
						<Input
							id="noTelepon"
							bind:value={formData.noTelepon}
							placeholder="Masukkan No. Telepon"
							class="w-full"
						/>
					</div>

					<!-- Tempat Lahir -->
					<div>
						<label for="tempatLahir" class="mb-1 block text-sm font-medium">Tempat Lahir</label>
						<Input
							id="tempatLahir"
							bind:value={formData.tempatLahir}
							placeholder="Masukkan Tempat Lahir"
							class="w-full"
						/>
					</div>

					<!-- Status Pernikahan -->
					<div>
						<label for="statusPernikahan" class="mb-1 block text-sm font-medium"
							>Status Pernikahan</label
						>
						<Input
							id="statusPernikahan"
							bind:value={formData.statusPernikahan}
							placeholder="Pilih Status Pernikahan"
							class="w-full"
						/>
					</div>

					<!-- Suku -->
					<div>
						<label for="suku" class="mb-1 block text-sm font-medium">Suku</label>
						<Input id="suku" bind:value={formData.suku} placeholder="Pilih Suku" class="w-full" />
					</div>

					<!-- Pendidikan -->
					<div>
						<label for="pendidikan" class="mb-1 block text-sm font-medium">Pilih Pendidikan</label>
						<Input
							id="pendidikan"
							bind:value={formData.pendidikan}
							placeholder="Pilih Pendidikan"
							class="w-full"
						/>
					</div>

					<!-- Pekerjaan -->
					<div>
						<label for="pekerjaan" class="mb-1 block text-sm font-medium">Pekerjaan</label>
						<Input
							id="pekerjaan"
							bind:value={formData.pekerjaan}
							placeholder="Pilih Pekerjaan"
							class="w-full"
						/>
					</div>

					<!-- Golongan Darah -->
					<div>
						<label for="golonganDarah" class="mb-1 block text-sm font-medium"
							>Pilih Golongan Darah</label
						>
						<Input
							id="golonganDarah"
							bind:value={formData.golonganDarah}
							placeholder="Pilih Golongan Darah"
							class="w-full"
						/>
					</div>

					<!-- Submit Button -->
					<div class="col-span-2 mt-4 flex justify-end">
						<Button class="bg-teal-600 px-6 hover:bg-teal-700">Selanjutnya</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
