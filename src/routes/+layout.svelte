<script>
	import '../app.postcss';
	import { page } from '$app/stores';
</script>

<div class="bg-[url($lib/images/theater.jpg)] min-h-screen bg-cover overflow-hidden bg-no-repeat">
  <div class="flex flex-row justify-evenly items-center py-10 ">
	<a href="/" class="font-serif text-gray-200 flex flex-row justify-center text-5xl hover:underline {$page.url.pathname==='/' ? "underline":""}">Home</a>
    <a href="/streaming" class="font-serif text-gray-200 flex flex-row justify-center text-5xl hover:underline {$page.url.pathname==='/streaming' ? "underline":""}">Upcoming Streamed Movies</a>
    <a href="/theater" class="font-serif text-gray-200 flex flex-row justify-center text-5xl hover:underline {$page.url.pathname==='/theater' ? "underline":""}">Upcoming Movies in Theaters</a>
  </div>

<div class="px-5"><slot /></div>

</div>