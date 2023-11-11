<script context="module" lang="ts">
  export async function load({ fetch }) {
    const response = await fetch('/path-to-your-server-endpoint');
    const { titles } = await response.json();

    return {
      props: { titles },
    };
  }
</script>

<script>
  export let titles;
</script>

<h1>Upcoming Movies</h1>

<ul>
  {#each titles as title}
    <li>{title}</li>
  {/each}
</ul>
