<script lang="ts">
  export let movie: {
    title: string;
    streaming_date?: string;
    theater_date?: string;
    postersrc: string;
  };
  export let variant: 'vertical' | 'horizontal' = 'vertical';
  export let showProgress = false;
  export let progress = 0;
  export let episodeInfo = '';

  $: imdbUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}&ref_=nv_sr_sm`;
</script>

<a href={imdbUrl} target="_blank" rel="noopener noreferrer" class="block group">
  <div class="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
    <!-- Movie Poster -->
    <div class="relative">
      <img 
        src={movie.postersrc} 
        alt={movie.title}
        class="w-full h-auto object-cover {variant === 'vertical' ? 'aspect-[2/3]' : 'aspect-[16/9]'}"
        loading="lazy"
      />
      
      <!-- Progress Bar for Continue Watching -->
      {#if showProgress}
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <div class="h-full bg-white transition-all duration-300" style="width: {progress}%"></div>
        </div>
      {/if}
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
    </div>
    
    <!-- Movie Info -->
    <div class="p-3 bg-gray-900/95 backdrop-blur-sm">
      <h3 class="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
        {movie.title}
      </h3>
      
      {#if episodeInfo}
        <p class="text-gray-400 text-xs">{episodeInfo}</p>
      {:else if movie.streaming_date}
        <p class="text-gray-400 text-xs">{movie.streaming_date}</p>
      {:else if movie.theater_date}
        <p class="text-gray-400 text-xs">{movie.theater_date}</p>
      {/if}
    </div>
  </div>
</a>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 