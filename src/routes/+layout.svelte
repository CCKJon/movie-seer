<script>
	import '../app.postcss';
	import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gray-900">
	<!-- Navigation Bar -->
	<nav class="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<div class="flex-shrink-0">
					<a href="/" class="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
						Movie Seer
					</a>
				</div>
				
				<!-- Navigation Links -->
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-8">
						<a
							href="/"
							class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/' ? 'bg-gray-700 text-white' : ''}"
						>
							Home
						</a>
						<a
							href="/streaming"
							class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/streaming' ? 'bg-gray-700 text-white' : ''}"
						>
							Streaming
						</a>
						<a
							href="/theater"
							class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/theater' ? 'bg-gray-700 text-white' : ''}"
						>
							Theaters
						</a>
						<a
							href="/bluray"
							class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/bluray' ? 'bg-gray-700 text-white' : ''}"
						>
							Blu-ray
						</a>
					</div>
				</div>

				<!-- Mobile menu button -->
				<div class="md:hidden">
					<button class="text-gray-300 hover:text-white p-2">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</nav>
	
	<!-- Main Content -->
	<main><slot /></main>
</div>
