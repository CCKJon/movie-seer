<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import FeaturedMovie from '$lib/components/FeaturedMovie.svelte';
	import MovieSection from '$lib/components/MovieSection.svelte';

	let streamingMovies: Array<{
		title: string;
		streaming_date?: string;
		theater_date?: string;
		postersrc: string;
	}> = [];

	let theaterMovies: Array<{
		title: string;
		streaming_date?: string;
		theater_date?: string;
		postersrc: string;
	}> = [];

	let featuredMovie: {
		title: string;
		streaming_date?: string;
		theater_date?: string;
		postersrc: string;
	} | null = null;

	let isLoading = true;
	let currentFeaturedIndex = 0;
	let rotationInterval: ReturnType<typeof setInterval>;

	// Function to rotate featured movie
	function rotateFeaturedMovie() {
		if (streamingMovies.length > 1) {
			currentFeaturedIndex = (currentFeaturedIndex + 1) % streamingMovies.length;
			featuredMovie = streamingMovies[currentFeaturedIndex];
			console.log('Rotating to featured movie:', featuredMovie?.title);
		}
	}

	// Start rotation timer
	function startRotation() {
		if (streamingMovies.length > 1) {
			rotationInterval = setInterval(rotateFeaturedMovie, 12000); // 12 seconds
		}
	}

	// Stop rotation timer
	function stopRotation() {
		if (rotationInterval) {
			clearInterval(rotationInterval);
		}
	}

	onMount(async () => {
		// Load streaming movies for featured and recent releases
		try {
			const streamingResponse = await fetch('/api/streaming', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: '1'
			});
			const streamingData = await streamingResponse.json();
			console.log('Home page - Streaming data received:', streamingData);
			streamingMovies = streamingData.slice(0, 7); // Get first 7 for recent releases

			// Use first movie as featured
			if (streamingData.length > 0) {
				featuredMovie = streamingData[0];
				console.log('Home page - Featured movie:', featuredMovie);

				// Start rotation if we have multiple movies
				if (streamingData.length > 1) {
					startRotation();
				}
			}
		} catch (error) {
			console.error('Error loading streaming data:', error);
		}

		// Load theater movies for continue watching section
		try {
			const theaterResponse = await fetch('/api/theater', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: '1'
			});
			const theaterData = await theaterResponse.json();
			console.log('Home page - Theater data received:', theaterData);
			theaterMovies = theaterData.slice(0, 12); // Get first 12 for continue watching
		} catch (error) {
			console.error('Error loading theater data:', error);
		}

		isLoading = false;
	});

	onDestroy(() => {
		stopRotation();
	});
</script>

<svelte:head>
	<title>Movie Seer - Discover New Movie Releases</title>
	<meta
		name="description"
		content="Stay up to date with the latest movie releases - streaming, theatrical, and Blu-ray releases all in one place!"
	/>
</svelte:head>

<div class="min-h-screen bg-gray-950 w-full">
	<div class="max-w-7xl mx-auto w-full">
		{#if !isLoading}
			<!-- Featured Movie Section -->
			{#if featuredMovie}
				<FeaturedMovie
					movie={featuredMovie}
					currentIndex={currentFeaturedIndex}
					totalMovies={streamingMovies.length}
				/>
			{/if}

			<!-- Recent Streaming Releases -->
			{#if streamingMovies.length > 0}
				<MovieSection
					title="Recent Streaming Releases"
					movies={streamingMovies}
					variant="vertical"
				/>
			{/if}

			<!-- Continue Watching (using theater movies as placeholder) -->
			{#if theaterMovies.length > 0}
				<MovieSection
					title="Coming to Theaters"
					movies={theaterMovies}
					variant="vertical"
					showProgress={true}
				/>
			{/if}

			<!-- Empty State -->
			{#if streamingMovies.length === 0 && theaterMovies.length === 0}
				<div class="flex items-center justify-center min-h-[400px]">
					<div class="text-center">
						<div
							class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<span class="text-white text-2xl">🎬</span>
						</div>
						<h2 class="text-xl font-semibold text-white mb-2">No Movies Found</h2>
						<p class="text-gray-400">Check back later for new releases!</p>
					</div>
				</div>
			{/if}
		{:else}
			<!-- Loading State -->
			<div class="flex items-center justify-center min-h-[400px]">
				<div class="text-center">
					<div
						class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<span class="text-white text-2xl">🎬</span>
					</div>
					<h2 class="text-xl font-semibold text-white mb-2">Loading Movies...</h2>
					<p class="text-gray-400">Please wait while we fetch the latest releases.</p>
				</div>
			</div>
		{/if}
	</div>
</div>
