<script lang="ts">
	import { onMount } from 'svelte';

  // export let movieData;
  export let data;
  let titles = []

  onMount(async () => {
    console.log(data)


  });
</script>

<h1>Upcoming Movies</h1>

<!-- <ul>
  {#each movieData as title}
    <li>{title}</li>
  {/each}
</ul> -->
