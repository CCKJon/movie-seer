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
	<nav class="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<div class="flex-shrink-0">
					<a href="/" class="flex items-center space-x-3 text-2xl font-bold text-white hover:text-blue-300 transition-colors">
						<img src={movieSeerIcon} alt="Movie Seer Icon" class="w-12 h-12" />
						<span>Movie Seer</span>
					</a>
				</div>
				
				<!-- Desktop Navigation Links -->
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-8">
						<a
							href="/"
							class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/' ? 'bg-gray-800 text-white' : ''}"
						>
							Home
						</a>
						<a
							href="/streaming"
							class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/streaming' ? 'bg-gray-800 text-white' : ''}"
						>
							Streaming
						</a>
						<a
							href="/theater"
							class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/theater' ? 'bg-gray-800 text-white' : ''}"
						>
							Theaters
						</a>
						<a
							href="/bluray"
							class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/bluray' ? 'bg-gray-800 text-white' : ''}"
						>
							Blu-ray
						</a>
					</div>
				</div>

				<!-- Mobile menu button -->
				<div class="md:hidden">
					<button 
						on:click={toggleMobileMenu}
						class="text-gray-300 hover:text-white p-2"
						aria-label="Toggle mobile menu"
					>
						{#if mobileMenuOpen}
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						{:else}
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
		
		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden">
				<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
					<a
						href="/"
						class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors {$page.url.pathname === '/' ? 'bg-gray-800 text-white' : ''}"
						on:click={() => mobileMenuOpen = false}
					>
						Home
					</a>
					<a
						href="/streaming"
						class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors {$page.url.pathname === '/streaming' ? 'bg-gray-800 text-white' : ''}"
						on:click={() => mobileMenuOpen = false}
					>
						Streaming
					</a>
					<a
						href="/theater"
						class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors {$page.url.pathname === '/theater' ? 'bg-gray-800 text-white' : ''}"
						on:click={() => mobileMenuOpen = false}
					>
						Theaters
					</a>
					<a
						href="/bluray"
						class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors {$page.url.pathname === '/bluray' ? 'bg-gray-800 text-white' : ''}"
						on:click={() => mobileMenuOpen = false}
					>
						Blu-ray
					</a>
				</div>
			</div>
		{/if}
	</nav>
	
	<!-- Main Content -->
	<main class="min-h-screen w-full"><slot /></main>
</div>
