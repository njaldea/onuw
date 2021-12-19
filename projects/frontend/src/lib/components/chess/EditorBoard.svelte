<script lang="ts">
    import CellComponent from '$lib/components/chess/Cell.svelte';
    import type { Cell } from '$lib/game/Cell';
    import type { EditorEngine } from '$lib/chess/EditorEngine';

    export let flipped: boolean;

    export let engine: EditorEngine;
    export let debug = false;

    function undo() {
        engine.prev();
    }

    function redo() {
        engine.next();
    }

    function dragconfirm({ detail: { from, to } }) {
        engine.moveconfirm(from, to);
    }

    function dragcancel() {
        engine.movecancel();
    }

    function dragpiecestart({ detail: { cell } }: { detail: { cell: Cell } }) {
        engine.movestart(cell);
    }

    const dimension = engine.dimension();
</script>

<div class="board" style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
    {#each [...$engine.cells(!flipped)] as cell (cell)}
        <CellComponent
            {debug}
            {cell}
            alt={dimension[1] % 2 === 0 ? cell.position[0] % 2 ^ cell.id % 2 : cell.id % 2}
            on:piecedragconfirm={dragconfirm}
            on:piecedragcancel={dragcancel}
            on:piecedragstart={dragpiecestart}
        />
    {/each}
</div>

<div class="board" style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
    {#each [...$engine.templates.iter()] as cell (cell)}
        <CellComponent
            {debug}
            {cell}
            alt={dimension[1] % 2 === 0 ? cell.position[0] % 2 ^ cell.id % 2 : cell.id % 2}
            on:piecedragconfirm={dragconfirm}
            on:piecedragcancel={dragcancel}
            on:piecedragstart={dragpiecestart}
        />
    {/each}
</div>
<button on:click={undo}>Undo</button>
<button on:click={redo}>Redo</button>

<style>
    .board {
        display: grid;
        width: calc(100% * calc(var(--ccount) / var(--rcount)));
        aspect-ratio: calc(var(--ccount) / var(--rcount));
        grid-template-rows: repeat(var(--rcount), 1fr);
        grid-template-columns: repeat(var(--ccount), 1fr);
        gap: 5px;

        user-select: none;
        margin: 0px auto;
    }
</style>
