<script lang="ts">
    import { onMount } from 'svelte';
    import { CHATTERS_URL } from '$lib/env';
    import wschatter from '$lib/ws-chatters';

    let loaded = false;
    function connect() {
        wschatter
            .connect(CHATTERS_URL)
            .then(() => (loaded = true))
            .catch(() => setTimeout(connect, 1000));
    }
    onMount(connect);
</script>

{#if loaded}
    <div class="root">
        <div>
            <slot />
        </div>
    </div>
{/if}

<style>
    div > div {
        width: 85%;

        margin: auto;
        margin-top: 20px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 10px;

        box-shadow: 0 0 20px 10px;
    }

    .root {
        width: 100%;
        height: 100%;
        display: grid;
        color: var(--color);
        background-color: var(--background-color);
    }
</style>
