<script lang="ts">
  /** A bad link followed inside an already-loaded session (client-side routing). A first load of
   *  an unknown URL never reaches the app: the host serves build/404.html. */
  import { page } from "$app/state";
  import NotFound from "$lib/components/NotFound.svelte";
</script>

<svelte:head><title>{page.status === 404 ? "Page not found" : "Something went wrong"}</title></svelte:head>

{#if page.status === 404}
  <NotFound />
{:else}
  <main id="main" class="notfound">
    <h1>Something went wrong</h1>
    <p>{page.error?.message}</p>
    <a class="bcms-btn bcms-btn-primary" href="/">Back to home</a>
  </main>
{/if}
