<script>
	import '../app.postcss';
	import { page } from '$app/stores';
	import movieSeerIcon from '$lib/images/movie-seer-icon.png';
	
	let mobileMenuOpen = false;
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<div class="min-h-screen bg-gray-950 w-full">
	<!-- Navigation Bar -->
	<nav class="bg-gray-900/60 backdrop-blur-md border-b border-gray-800/50 shadow-lg shadow-black/20 sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-20">
				<!-- Logo -->
				<div class="flex-shrink-0">
					<a href="/" class="flex items-center space-x-4 text-2xl font-bold text-white hover:text-blue-300 transition-all duration-300 group">
						<div class="relative">
							<img src={movieSeerIcon} alt="Movie Seer Icon" class="w-14 h-14 transition-transform duration-300 group-hover:scale-110" />
							<div class="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-400/30 transition-all duration-300"></div>
						</div>
						<span class="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-blue-100 transition-all duration-300">Movie Seer</span>
					</a>
				</div>
				
				<!-- Desktop Navigation Links -->
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-1">
						<a
							href="/"
							class="relative text-gray-300 hover:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group {$page.url.pathname === '/' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' : 'hover:bg-gray-800/50'} overflow-hidden"
						>
							<span class="relative z-10">Home</span>
							{#if $page.url.pathname === '/'}
								<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
							{/if}
							<div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
						</a>
						<a
							href="/streaming"
							class="relative text-gray-300 hover:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group {$page.url.pathname === '/streaming' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' : 'hover:bg-gray-800/50'} overflow-hidden"
						>
							<span class="relative z-10">Streaming</span>
							{#if $page.url.pathname === '/streaming'}
								<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
							{/if}
							<div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
						</a>
						<a
							href="/theater"
							class="relative text-gray-300 hover:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group {$page.url.pathname === '/theater' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' : 'hover:bg-gray-800/50'} overflow-hidden"
						>
							<span class="relative z-10">Theaters</span>
							{#if $page.url.pathname === '/theater'}
								<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
							{/if}
							<div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
						</a>
						<a
							href="/bluray"
							class="relative text-gray-300 hover:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group {$page.url.pathname === '/bluray' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' : 'hover:bg-gray-800/50'} overflow-hidden"
						>
							<span class="relative z-10">Blu-ray</span>
							{#if $page.url.pathname === '/bluray'}
								<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
							{/if}
							<div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
						</a>
					</div>
				</div>

				<!-- Mobile menu button -->
				<div class="md:hidden">
					<button 
						on:click={toggleMobileMenu}
						class="text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
						aria-label="Toggle mobile menu"
					>
						{#if mobileMenuOpen}
							<svg class="w-6 h-6 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						{:else}
							<svg class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
		
		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden animate-in slide-in-from-top-2 duration-300">
				<div class="px-4 pt-4 pb-6 space-y-2 bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50 shadow-xl">
					<a
						href="/"
						class="relative text-gray-300 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group {$page.url.pathname === '/' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' : 'hover:bg-gray-800/50'} overflow-hidden"
						on:click={() => mobileMenuOpen = false}
					>
						<span class="relative z-10">Home</span>
						{#if $page.url.pathname === '/'}
							<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
						{/if}
						<div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
					</a>
					<a
						href="/streaming"
						class="relative text-gray-300 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group {$page.url.pathname === '/streaming' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' : 'hover:bg-gray-800/50'} overflow-hidden"
						on:click={() => mobileMenuOpen = false}
					>
						<span class="relative z-10">Streaming</span>
						{#if $page.url.pathname === '/streaming'}
							<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
						{/if}
						<div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
					</a>
					<a
						href="/theater"
						class="relative text-gray-300 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group {$page.url.pathname === '/theater' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' : 'hover:bg-gray-800/50'} overflow-hidden"
						on:click={() => mobileMenuOpen = false}
					>
						<span class="relative z-10">Theaters</span>
						{#if $page.url.pathname === '/theater'}
							<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
						{/if}
						<div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
					</a>
					<a
						href="/bluray"
						class="relative text-gray-300 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group {$page.url.pathname === '/bluray' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' : 'hover:bg-gray-800/50'} overflow-hidden"
						on:click={() => mobileMenuOpen = false}
					>
						<span class="relative z-10">Blu-ray</span>
						{#if $page.url.pathname === '/bluray'}
							<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
						{/if}
						<div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
					</a>
				</div>
			</div>
		{/if}
	</nav>
	
	<!-- Main Content -->
	<main class="min-h-screen w-full"><slot /></main>
</div>
