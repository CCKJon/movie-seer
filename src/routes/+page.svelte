<script lang="ts">
  //@ts-nocheck
	import { onMount } from 'svelte';
  import { Card } from 'flowbite-svelte';

  // export let movieData;
  export let data;
  let titles = []

  onMount(async () => {
    console.log(data.data)

  });
</script>




<div class="bg-[url($lib/images/theater.jpg)] min-h-screen bg-cover overflow-hidden bg-no-repeat">
  <h1 class="font-serif text-gray-200 font-bold flex flex-row justify-center py-5 text-3xl">Upcoming Movies</h1>
  <div class="dark">
    {#each data.data as movie}
      <div class="py-1 px-1 flex justify-center">
        <Card href="/cards" class="max-w-[225px]">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.title}</h5>
          <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{movie.streaming_date}</p>
        </Card>
      </div>
    {/each}
  </div>
</div>