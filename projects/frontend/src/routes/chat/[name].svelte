<script lang="ts" context="module">
    export function load({
        page: {
            params: { name }
        }
    }: {
        page: { params: { name: string } };
    }) {
        return { props: { name } };
    }
</script>

<script lang="ts">
    import { onDestroy, onMount, getContext } from 'svelte';
    import { goto } from '$app/navigation';
    import type { Chatters } from '$lib/connection/Chatters';
    import type { Messages } from '$lib/connection/Messages';

    const chatters = getContext<Chatters>('chatters');
    const messages = getContext<Messages>('messages');

    export let name: string;
    let msgtosend = '';

    function sendmessage() {
        if (msgtosend) {
            messages.send(name, msgtosend);
            msgtosend = '';
        }
    }

    onMount(() => chatters.add(name));
    onDestroy(() => chatters.remove(name));
</script>

<div class="root">
    <button on:click={() => goto('/chat')}>HOME</button>
    <div class="header">
        <h3>{name}</h3>
    </div>
    <div>
        {#each $chatters as chatter (chatter)}
            <p>{chatter}</p>
        {/each}
    </div>
    <div>
        {#each $messages as message (message)}
            <p>{message.name}: {message.message}</p>
        {/each}
    </div>

    <div>
        <input type="text" bind:value={msgtosend} />
        <button on:click={sendmessage}>Send</button>
    </div>
</div>

<style>
    .root {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .header {
        display: flex;
        justify-content: center;
    }
</style>
