<script lang="ts">
  import { getHighResPosterUrl, getPlaceholderImage } from '$lib/utils/imdb';
  
  export let movie: {
    title: string;
    streaming_date?: string;
    theater_date?: string;
    postersrc: string;
  };
  
  $: imdbUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}&s=tt&ttype=ft&ref_=fn_ft`;
  $: highResPoster = getHighResPosterUrl(movie.postersrc);
  $: originalPoster = movie.postersrc;
  $: currentImageSrc = highResPoster; // Make this reactive
  
  let imageLoadAttempts = 0;

  // Debug logging
  $: {
    console.log('FeaturedMovie - Movie data:', movie);
    console.log('FeaturedMovie - Original poster:', originalPoster);
    console.log('FeaturedMovie - High res poster:', highResPoster);
    console.log('FeaturedMovie - Current image src:', currentImageSrc);
  }

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    imageLoadAttempts++;
    
    if (imageLoadAttempts === 1 && originalPoster && img.src !== originalPoster) {
      // First fallback: try original poster
      currentImageSrc = originalPoster;
      img.src = originalPoster;
    } else {
      // Final fallback: use placeholder
      currentImageSrc = getPlaceholderImage();
      img.src = getPlaceholderImage();
    }
  }
</script>

<section class="relative mb-8">
  <a href={imdbUrl} target="_blank" rel="noopener noreferrer" class="block group">
    <div class="relative overflow-hidden rounded-xl">
      <!-- Background Image -->
      <img 
        src={currentImageSrc} 
        alt={movie.title}
        class="w-full h-[400px] md:h-[500px] object-cover"
        loading="lazy"
        on:error={handleImageError}
      />
      
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