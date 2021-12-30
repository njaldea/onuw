<script lang="ts">
    import EditorBoard from '$lib/components/chess/EditorBoard.svelte';
    import { EditorEngine } from '$lib/chess/EditorEngine';
    import { getContext } from 'svelte';
    import type { Tooltip } from '$lib/game/Tooltip';

    const tooltip = getContext<Tooltip>('tooltip');

    const engine = new EditorEngine();

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
<svelte:head><title>Chess - White</title></svelte:head>

<div>
    <EditorBoard {debug} flipped={false} {engine} />
</div>

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>
