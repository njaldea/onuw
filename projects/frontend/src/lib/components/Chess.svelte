<script lang="ts">
    import GameBoard from '$lib/components/chess/GameBoard.svelte';
    import { ChessEngine } from '$lib/chess/ChessEngine';

    import tooltip from '$lib/stores/tooltip';
    import { browser } from '$app/env';

    const engine = new ChessEngine();

    let debug = false;
    $: debug ? tooltip.enable() : tooltip.disable();

    function keydown(ev: KeyboardEvent) {
        if (ev.key === 'd') {
            debug = true;
        }
    }
    function keyup(ev: KeyboardEvent) {
        if (ev.key === 'd') {
            debug = false;
        }
    }

    export let flipped = false;
</script>

<svelte:window on:keydown={keydown} on:keyup={keyup} />

{#if browser}
    <div>
        <GameBoard {debug} {flipped} {engine} />
    </div>
{/if}

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>
