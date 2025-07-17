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
  let parallaxContainer: HTMLElement;
  let scrollY = 0;

  // Debug logging
  $: {
    console.log('FeaturedMovie - Movie data:', movie);
    console.log('FeaturedMovie - Original poster:', originalPoster);
    console.log('FeaturedMovie - IMDB poster:', imdbPosterUrl);
    console.log('FeaturedMovie - Current image src:', currentImageSrc);
  }

  onMount(() => {
    // Get IMDB data
    (async () => {
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
    })();

    // Add scroll event listener for parallax effect
    const handleScroll = () => {
      scrollY = window.scrollY;
      if (parallaxContainer) {
        const scrolled = scrollY * 0.5;
        parallaxContainer.style.transform = `translateY(${scrolled}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

<section class="relative h-screen min-h-[600px] max-h-[800px] overflow-hidden mb-8">
  <a href={imdbUrl} target="_blank" rel="noopener noreferrer" class="block group h-full" class:pointer-events-none={isLoadingImdbUrl}>
    <!-- Parallax Background Container -->
    <div 
      bind:this={parallaxContainer}
      class="absolute inset-0 w-full h-full"
    >
      {#if isLoadingImdbPoster}
        <!-- Loading state for IMDB poster -->
        <div class="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div class="text-center">
            <div class="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-300 text-lg font-medium">Loading featured movie...</p>
          </div>
        </div>
      {:else}
        <!-- Background Image with Parallax -->
        <img 
          src={currentImageSrc} 
          alt={movie.title}
          class="w-full h-full object-cover"
          loading="eager"
          on:error={handleImageError}
        />
      {/if}
    </div>
    
    <!-- Gradient Overlays for Better Text Readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>
    
    <!-- Content Overlay -->
    <div class="relative z-10 flex items-end h-full">
      <div class="w-full p-6 md:p-8 lg:p-12">
        <div class="max-w-4xl">
          <!-- Movie Title -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
            {movie.title}
          </h1>
          
          <!-- Movie Meta Information -->
          <div class="flex flex-wrap items-center gap-4 text-gray-200 mb-6">
            {#if movie.streaming_date}
              <span class="text-lg font-medium bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full">
                {movie.streaming_date}
              </span>
            {:else if movie.theater_date}
              <span class="text-lg font-medium bg-red-600/20 border border-red-500/30 px-3 py-1 rounded-full">
                {movie.theater_date}
              </span>
            {/if}
            <span class="text-lg">•</span>
            <span class="text-lg">Action, Drama</span>
            <span class="text-lg">•</span>
            <span class="text-lg">2h 30m</span>
          </div>
          
          <!-- Movie Description -->
          <p class="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl mb-6 line-clamp-3">
            When a mysterious threat emerges, our hero must confront their greatest challenge yet. 
            A thrilling adventure that will keep you on the edge of your seat from start to finish.
          </p>
          
          <!-- Call to Action -->
          <div class="flex items-center gap-4">
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2">
              <span>Learn More</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </button>
            <button class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 backdrop-blur-sm">
              Watch Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
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
  
  /* Smooth parallax transition */
  .parallax-container {
    will-change: transform;
  }
  
  /* Ensure proper text rendering */
  h1 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
  
  /* Responsive text sizing */
  @media (max-width: 640px) {
    h1 {
      font-size: 2.5rem;
      line-height: 1.1;
    }
  }
</style> 