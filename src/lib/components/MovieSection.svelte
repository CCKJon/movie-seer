<script lang="ts">
  import MovieCard from './MovieCard.svelte';
  
  export let title: string;
  export let movies: Array<{
    title: string;
    streaming_date?: string;
    theater_date?: string;
    postersrc: string;
  }>;
  export let variant: 'vertical' | 'horizontal' = 'vertical';
  export let showProgress = false;
</script>

<section class="mb-8">
  <h2 class="text-2xl font-bold text-white mb-4 px-4">{title}</h2>
  
  <div class="relative">
    <div class="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4">
      {#each movies as movie (movie.title)}
        <div class="flex-shrink-0 {variant === 'vertical' ? 'w-48' : 'w-80'}">
          <MovieCard 
            {movie} 
            {variant}
            {showProgress}
          />
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style> 