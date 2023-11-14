<script lang="ts">
  //@ts-nocheck
	import { onMount } from 'svelte';

  // export let movieData;
  export let data;
  let titles = []

  onMount(async () => {
    console.log(data.data)

  });
</script>

<h1>Upcoming Movies</h1>


<div>
  {#each data.data as movie}
    <div>Title: {movie.title} - {movie.streaming_date}</div>
  {/each}
</div>
