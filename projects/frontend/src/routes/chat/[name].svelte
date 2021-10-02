<script lang='ts' context="module">
	export function load({ page }) {
		return {
			props: {
				name: page.params.name
			}
		};
	}
</script>

<script lang='ts'>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import chatters from '$stores/chatters';

	export let name: string;

	onMount(async () => {
		chatters.add(name);
	})

	onDestroy(() => {
		chatters.remove(name);
	});
</script>

<button on:click={() => goto('/')}>HOME</button>
<h3>{name}</h3>
<div>
	{#each $chatters as chatter (chatter)}
		<p>{chatter}</p>
	{/each}
</div>
