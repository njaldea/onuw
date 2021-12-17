<script lang="ts">
    import GameBoard from '$components/chess/GameBoard.svelte';
    import { ChessEngine } from '$lib/chess/ChessEngine';

    import tooltip from '$stores/tooltip';

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
</script>

<svelte:window on:keydown={keydown} on:keyup={keyup} />
<svelte:head><title>Chess - Black</title></svelte:head>

<div>
    <GameBoard {debug} flipped={true} {engine} />
</div>

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>
