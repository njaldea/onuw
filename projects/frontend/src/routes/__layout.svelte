<script lang='ts'>
    import { onMount } from 'svelte';
    import { CHATTERS_URL } from '$lib/env';
    import wschatter from '$lib/ws-chatters';

    let loaded = false;
    onMount(async () => {
        await wschatter.connect(CHATTERS_URL);
        loaded = true;
    });
</script>

{#if loaded}
    <div class='root'>
        <div>
            <slot></slot>
        </div>
    </div>
{/if}

<style>
    div > div {
        width: 50%;
        height: 50%;
        background-color: red;
        display: flex;
        flex-direction: column;
        padding: 10px;
        gap: 10px;
    }

    .root {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
    }
</style>