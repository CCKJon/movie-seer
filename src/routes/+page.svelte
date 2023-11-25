<script lang="ts">
  //@ts-nocheck
	import { onMount } from 'svelte';
  import { Card, Button, Toggle, Spinner } from 'flowbite-svelte';
  import { afterUpdate } from 'svelte';
  export let data;
  // export let page;

  let hCard = false;
  let titles = [];
  let currentPage = 1;
  let isLoading= false;

  const loadMoreData = async () => {
    if (isLoading) return;

      isLoading = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      currentPage++;

    try {
      const response =await fetch("/api", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: currentPage.toString()
		});
      const newData = await response.json();
      data.data = [...newData];
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      isLoading = false;
    }
  };

  onMount(async () => {
    console.log(data.data)

  });

  afterUpdate(() => {
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

<div class="bg-[url($lib/images/theater.jpg)] min-h-screen bg-cover overflow-hidden bg-no-repeat">
  <h1 class="font-serif text-gray-200 flex flex-row justify-center py-10 text-5xl">Upcoming Movies to Stream</h1>
  <div class="dark flex flex-wrap justify-evenly">
    {#each data.data as movie (movie.title)}
        <div class="py-1 px-1 flex justify-center">
          <Card img={movie.postersrc} href={`https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}&ref_=nv_sr_sm`} horizontal reverse={hCard} class="mb-4">
            <div class="min-w-[350px] max-w-[350px]">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.title}</h5>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">{movie.streaming_date}</p>
            </div>
          </Card>
        </div>
    {/each}
  </div>
  <div class="flex flex-row justify-center py-5">
    {#if isLoading}
        <Spinner color="yellow" size={12}/>
    {/if}
  </div>
</div>
