<script lang="ts">
  import { getHighResPosterUrl, getPlaceholderImage, getImdbUrl, getImdbPosterUrl } from '$lib/utils/imdb';
  import { onMount } from 'svelte';
  
  export let movie: {
    title: string;
    streaming_date?: string;
    theater_date?: string;
    postersrc: string;
  };
  
  let imdbUrl = '';
  let isLoadingImdbUrl = true;
  let imdbPosterUrl = '';
  let isLoadingImdbPoster = true;
  $: originalPoster = movie.postersrc;
  $: currentImageSrc = imdbPosterUrl || originalPoster || getPlaceholderImage(); // Prioritize IMDB poster
  
  let imageLoadAttempts = 0;

  // Debug logging
  $: {
    console.log('FeaturedMovie - Movie data:', movie);
    console.log('FeaturedMovie - Original poster:', originalPoster);
    console.log('FeaturedMovie - IMDB poster:', imdbPosterUrl);
    console.log('FeaturedMovie - Current image src:', currentImageSrc);
  }

  onMount(async () => {
    try {
      // Get IMDB URL and poster URL in parallel
      const [urlResult, posterResult] = await Promise.all([
        getImdbUrl(movie.title),
        getImdbPosterUrl(movie.title)
      ]);
      
      imdbUrl = urlResult;
      imdbPosterUrl = posterResult;
      
      console.log('FeaturedMovie - IMDB poster URL fetched:', imdbPosterUrl);
    } catch (error) {
      console.error('Error getting IMDb data:', error);
      // Fallback to search URL
      imdbUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}&s=tt&ttype=ft&ref_=fn_ft`;
    } finally {
      isLoadingImdbUrl = false;
      isLoadingImdbPoster = false;
    }
  });

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    imageLoadAttempts++;
    
    if (imageLoadAttempts === 1 && originalPoster && img.src !== originalPoster) {
      // First fallback: try original poster from Rotten Tomatoes
      console.log('FeaturedMovie - IMDB poster failed, trying original poster');
      currentImageSrc = originalPoster;
      img.src = originalPoster;
    } else {
      // Final fallback: use placeholder
      console.log('FeaturedMovie - All poster attempts failed, using placeholder');
      currentImageSrc = getPlaceholderImage();
      img.src = getPlaceholderImage();
    }
  }
</script>

<section class="relative mb-8">
  <a href={imdbUrl} target="_blank" rel="noopener noreferrer" class="block group" class:pointer-events-none={isLoadingImdbUrl}>
    <div class="relative overflow-hidden rounded-xl">
      <!-- Background Image -->
      {#if isLoadingImdbPoster}
        <!-- Loading state for IMDB poster -->
        <div class="w-full h-[400px] md:h-[500px] bg-gray-800 flex items-center justify-center">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p class="text-gray-400 text-sm">Loading high-res poster...</p>
          </div>
        </div>
      {:else}
        <img 
          src={currentImageSrc} 
          alt={movie.title}
          class="w-full h-[400px] md:h-[500px] object-cover"
          loading="lazy"
          on:error={handleImageError}
        />
      {/if}
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      <!-- Content Overlay -->
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div class="max-w-2xl">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
            {movie.title}
          </h1>
          
          <div class="flex items-center gap-4 text-gray-300 mb-4">
            {#if movie.streaming_date}
              <span class="text-sm">{movie.streaming_date}</span>
            {:else if movie.theater_date}
              <span class="text-sm">{movie.theater_date}</span>
            {/if}
            <span class="text-sm">•</span>
            <span class="text-sm">Action, Drama</span>
            <span class="text-sm">•</span>
            <span class="text-sm">2h 30m</span>
          </div>
          
          <p class="text-gray-200 text-sm md:text-base leading-relaxed max-w-xl line-clamp-3">
            When a mysterious threat emerges, our hero must confront their greatest challenge yet. 
            A thrilling adventure that will keep you on the edge of your seat from start to finish.
          </p>
        </div>
      </div>
    </div>
  </a>
</section>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 