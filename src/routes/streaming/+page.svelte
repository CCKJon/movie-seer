<script lang="ts">
  import { onMount } from 'svelte';
  import { Spinner } from 'flowbite-svelte';
  import MovieSection from '$lib/components/MovieSection.svelte';
  
  export let data;
  
  let allMovies = [...data.data];
  let currentPage = 1;
  let isLoading = false;
  let hasMoreData = true;

  const loadMoreData = async () => {
    if (isLoading || !hasMoreData) return;

    isLoading = true;
    currentPage++;

    try {
      const response = await fetch("/api/streaming", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: currentPage.toString()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const newData = await response.json();
      
      if (newData.length === 0) {
        hasMoreData = false;
      } else {
        allMovies = [...allMovies, ...newData];
      }
    } catch (error) {
      console.error('Error loading more data:', error);
      hasMoreData = false;
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= documentHeight - 200) {
        loadMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:head>
  <title>Streaming Movies - Movie Seer</title>
  <meta name="description" content="Browse the latest movies available for streaming at home" />
</svelte:head>

<div class="min-h-screen bg-gray-900">
  <!-- Page Header -->
  <div class="px-4 py-8">
    <h1 class="text-4xl font-bold text-white mb-2">Streaming Movies</h1>
    <p class="text-gray-400">Latest movies available for streaming at home</p>
  </div>

  <!-- Movies Grid -->
  {#if allMovies.length > 0}
    <div class="px-4 pb-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {#each allMovies as movie (movie.title)}
          <div class="w-full">
            <a 
              href={`https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}&ref_=nv_sr_sm`} 
              target="_blank" 
              rel="noopener noreferrer"
              class="block group"
            >
              <div class="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
                <!-- Movie Poster -->
                <div class="relative">
                  <img 
                    src={movie.postersrc} 
                    alt={movie.title}
                    class="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                  
                  <!-- Hover Overlay -->
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
                
                <!-- Movie Info -->
                <div class="p-2 bg-gray-900/95 backdrop-blur-sm">
                  <h3 class="text-white font-semibold text-xs mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {movie.title}
                  </h3>
                  {#if movie.streaming_date}
                    <p class="text-gray-400 text-xs">{movie.streaming_date}</p>
                  {/if}
                </div>
              </div>
            </a>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Empty State -->
    <div class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">🎬</span>
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">No Movies Found</h2>
        <p class="text-gray-400">Check back later for new streaming releases.</p>
      </div>
    </div>
  {/if}

  <!-- Loading Spinner -->
  {#if isLoading}
    <div class="flex justify-center py-8">
      <Spinner color="white" size="lg"/>
    </div>
  {/if}

  <!-- End of Results -->
  {#if !hasMoreData && allMovies.length > 0}
    <div class="text-center py-8">
      <p class="text-gray-400">You've reached the end of the results.</p>
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

