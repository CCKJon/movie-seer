<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Spinner } from 'flowbite-svelte';
  import MovieSection from '$lib/components/MovieSection.svelte';
  import { getHighResPosterUrl, getPlaceholderImage, getImdbUrl, cleanMovieTitle } from '$lib/utils/imdb';
  
  export let data;
  
  // Limit initial display to 25 movies
  const INITIAL_DISPLAY_COUNT = 25;
  let allMovies = data?.data ? [...data.data] : [];
  
  // Remove duplicates based on title
  const uniqueMovies = [];
  const seenTitles = new Set();
  for (const movie of allMovies) {
    if (!seenTitles.has(movie.title)) {
      seenTitles.add(movie.title);
      uniqueMovies.push(movie);
    }
  }
  allMovies = uniqueMovies;
  
  let displayedMovies = allMovies.slice(0, INITIAL_DISPLAY_COUNT);
  let currentPage = 1;
  let isLoading = false;
  let hasMoreData = true;
  let errorMessage = '';
  let scrollHandler: (() => void) | null = null;
  let scrollThrottle: ReturnType<typeof setTimeout> | null = null;
  let movieImdbUrls = new Map<string, string>();
  let isImdbUrlsLoaded = false;
  
  // Search functionality
  let searchQuery = '';
  let filteredMovies = [...displayedMovies];

  // Filter movies based on search query
  $: {
    if (searchQuery.trim() === '') {
      filteredMovies = [...displayedMovies];
    } else {
      const query = searchQuery.toLowerCase().trim();
      filteredMovies = displayedMovies.filter(movie => 
        movie.title.toLowerCase().includes(query)
      );
    }
  }

  const loadMoreData = async () => {
    if (isLoading || !hasMoreData) return;

    isLoading = true;
    errorMessage = '';

    try {
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const nextPage = currentPage + 1;

      const response = await fetch("/api/bluray", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: nextPage.toString(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const newData = await response.json();
      
      // Check if the response is an error object
      if (newData.error) {
        throw new Error(newData.error);
      }
      
      // Ensure newData is an array
      if (!Array.isArray(newData)) {
        throw new Error('Invalid data format received from server');
      }
      
      if (newData.length === 0) {
        hasMoreData = false;
      } else {
        // Check for duplicates and only add new movies
        const existingTitles = new Set(allMovies.map((movie: any) => movie.title));
        const newMovies = newData.filter((movie: any) => !existingTitles.has(movie.title));
        
        if (newMovies.length > 0) {
          allMovies = [...allMovies, ...newMovies];
          currentPage = nextPage;
          
          // Update IMDb URLs for newly added movies in background
          for (const movie of newMovies) {
            if (!movieImdbUrls.has(movie.title)) {
              getImdbUrl(movie.title).then(imdbUrl => {
                movieImdbUrls.set(movie.title, imdbUrl);
              }).catch(error => {
                // Fallback to search URL
                movieImdbUrls.set(movie.title, `https://www.imdb.com/find/?q=${encodeURIComponent(cleanMovieTitle(movie.title))}&s=tt&ttype=ft&ref_=fn_ft`);
              });
            }
          }
        } else {
          hasMoreData = false;
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again.';
      } else {
        errorMessage = 'Failed to load more movies. Please try again.';
      }
      hasMoreData = false;
    } finally {
      isLoading = false;
    }
  };

  // Function to load more displayed movies from existing data
  const loadMoreDisplayedMovies = () => {
    if (displayedMovies.length < allMovies.length) {
      const startIndex = displayedMovies.length;
      const endIndex = Math.min(startIndex + INITIAL_DISPLAY_COUNT, allMovies.length);
      displayedMovies = allMovies.slice(0, endIndex);
      
      // If we've shown all available movies and there might be more pages, try to load more
      if (displayedMovies.length >= allMovies.length && hasMoreData) {
        loadMoreData();
      }
    } else if (hasMoreData) {
      loadMoreData();
    }
  };

  onMount(async () => {
    // Set isImdbUrlsLoaded to true immediately so movies can be displayed
    isImdbUrlsLoaded = true;
    
    // Load IMDb URLs in the background (non-blocking)
    loadImdbUrls().then(() => {
      // IMDb URLs loaded successfully
    }).catch(error => {
      // IMDb URLs failed to load, but movies are still displayed
    });
    
    scrollHandler = () => {
      if (scrollThrottle) return; // Prevent multiple rapid calls
      
      scrollThrottle = setTimeout(() => {
        scrollThrottle = null;
      }, 100);

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= documentHeight - 200) {
        loadMoreDisplayedMovies();
      }
    };

    window.addEventListener('scroll', scrollHandler);
  });

  async function loadImdbUrls() {
    for (const movie of displayedMovies) {
      if (!movieImdbUrls.has(movie.title)) {
        try {
          const imdbUrl = await getImdbUrl(movie.title);
          movieImdbUrls.set(movie.title, imdbUrl);
        } catch (error) {
          // Fallback to search URL
          movieImdbUrls.set(movie.title, `https://www.imdb.com/find/?q=${encodeURIComponent(cleanMovieTitle(movie.title))}&s=tt&ttype=ft&ref_=fn_ft`);
        }
      }
    }
  }

  onDestroy(() => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
      scrollHandler = null;
    }
    if (scrollThrottle) {
      clearTimeout(scrollThrottle);
      scrollThrottle = null;
    }
  });

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Use placeholder as fallback
    img.src = getPlaceholderImage();
  }
</script>

<svelte:head>
  <title>Blu-ray Releases - Movie Seer</title>
  <meta name="description" content="Discover the latest Blu-ray and 4K Ultra HD releases" />
</svelte:head>

<div class="min-h-screen bg-gray-950">
  <div class="max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="px-4 py-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">Blu-ray Releases</h1>
          <p class="text-gray-400">Discover the latest Blu-ray and 4K Ultra HD releases</p>
          <p class="text-gray-500 text-sm mt-2">Showing {displayedMovies.length} of {allMovies.length} movies (Page {currentPage})</p>
        </div>
        
        <!-- Search Bar -->
        <div class="max-w-lg mt-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search movies..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {#if searchQuery.trim() !== ''}
            <p class="text-gray-400 text-sm mt-2">
              Showing {filteredMovies.length} of {displayedMovies.length} movies
            </p>
          {/if}
        </div>
      </div>
    </div>

    <!-- Movies Grid -->
    {#if filteredMovies.length > 0}
      <div class="px-4 pb-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {#each filteredMovies as movie, index (movie.title + '-' + index)}
            <div class="w-full">
              <a 
                href={movieImdbUrls.get(movie.title) || `https://www.imdb.com/find/?q=${encodeURIComponent(cleanMovieTitle(movie.title))}&s=tt&ttype=ft&ref_=fn_ft`} 
                target="_blank" 
                rel="noopener noreferrer"
                class="block group"
              >
                <div class="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
                  <!-- Movie Poster -->
                  <div class="relative">
                    <img 
                      src={getHighResPosterUrl(movie.postersrc)} 
                      alt={movie.title}
                      class="w-full aspect-[2/3] object-cover"
                      loading="lazy"
                      on:error={handleImageError}
                    />
                    
                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                  
                  <!-- Movie Info -->
                  <div class="p-2 bg-gray-900/95 backdrop-blur-sm">
                    <h3 class="text-white font-semibold text-xs mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {movie.title}
                    </h3>
                    {#if movie.bluray_date}
                      <p class="text-gray-400 text-xs">{movie.bluray_date}</p>
                    {/if}
                  </div>
                </div>
              </a>
            </div>
          {/each}
        </div>
      </div>
      
    {:else if searchQuery.trim() !== '' && filteredMovies.length === 0}
      <!-- No Search Results -->
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-2xl">🔍</span>
          </div>
          <h2 class="text-xl font-semibold text-white mb-2">No Movies Found</h2>
          <p class="text-gray-400">No movies match your search for "{searchQuery}".</p>
          <button 
            on:click={() => searchQuery = ''}
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      </div>
    {:else if allMovies.length === 0}
      <!-- No Data Available -->
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-2xl">⚠️</span>
          </div>
          <h2 class="text-xl font-semibold text-white mb-2">No Blu-ray Data Available</h2>
          <p class="text-gray-400 mb-4">Unable to load Blu-ray releases at the moment.</p>
          <p class="text-gray-500 text-sm mb-4">Debug info: allMovies.length = {allMovies.length}, displayedMovies.length = {displayedMovies.length}</p>
          <button 
            on:click={() => window.location.reload()}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    {:else}
      <!-- Empty State -->
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-2xl">💿</span>
          </div>
          <h2 class="text-xl font-semibold text-white mb-2">No Movies Found</h2>
          <p class="text-gray-400">Check back later for new Blu-ray releases.</p>
        </div>
      </div>
    {/if}

    <!-- Loading Spinner -->
    {#if isLoading}
      <div class="flex justify-center py-4">
        <div class="flex items-center gap-3">
          <Spinner color="white" size="xs"/>
          <span class="text-gray-400 text-sm">Loading more movies...</span>
        </div>
      </div>
    {/if}

    <!-- Error Message -->
    {#if errorMessage}
      <div class="text-center py-8">
        <p class="text-red-400 mb-4">{errorMessage}</p>
        <button 
          on:click={() => { hasMoreData = true; currentPage = 1; loadMoreData(); }}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    {/if}

    <!-- End of Results -->
    {#if !hasMoreData && allMovies.length > 0 && !isLoading}
      <div class="text-center py-8">
        <p class="text-gray-400">You've reached the end of the results.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
