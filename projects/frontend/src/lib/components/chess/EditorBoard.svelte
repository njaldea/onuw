<script lang="ts">
    import CellComponent from '$lib/components/chess/Cell.svelte';
    import type { Cell } from '$lib/game/Cell';
    import type { EditorEngine } from '$lib/chess/EditorEngine';
    import type { Cells } from '$lib/game/Cells';

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

    function template(cells: Cells, section: boolean) {
        const t = [...cells.iter()];
        const count = t.length / 2;
        const offset = section ? count : 0;
        return t.slice(offset, offset + count);
    }
</script>

<div class="root">
    <div class="template white">
        {#each template($engine.templates, false) as cell (cell)}
            <CellComponent
                {debug}
                {cell}
                on:piecedragconfirm={dragconfirm}
                on:piecedragcancel={dragcancel}
                on:piecedragstart={dragpiecestart}
            />
        {/each}
    </div>
    <div class="board" style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
        {#each [...$engine.cells(!flipped)] as cell (cell)}
            <CellComponent
                {debug}
                {cell}
                alt={dimension[1] % 2 === 0
                    ? (cell.position[0] % 2 ^ cell.id % 2) > 0
                    : cell.id % 2 > 0}
                on:piecedragconfirm={dragconfirm}
                on:piecedragcancel={dragcancel}
                on:piecedragstart={dragpiecestart}
            />
        {/each}
    </div>
    <div class="template black">
        {#each template($engine.templates, true) as cell (cell)}
            <CellComponent
                {debug}
                {cell}
                on:piecedragconfirm={dragconfirm}
                on:piecedragcancel={dragcancel}
                on:piecedragstart={dragpiecestart}
            />
        {/each}
    </div>
</div>

<button on:click={undo}>Undo</button>
<button on:click={redo}>Redo</button>

<style>
    .root {
        display: grid;
        grid-template-areas: 'white board black';
        grid-template-columns: 1fr 8fr 1fr;
        grid-template-rows: 1fr;
        user-select: none;
        margin: 0px;
        gap: 10px;
    }

    .template {
        display: grid;
        width: 100%;
        grid-template-rows: repeat(8, 1fr);
        grid-template-columns: repeat(1, 1fr);
        gap: 5px;
    }

    .template.white {
        grid-area: 'white';
    }

    .template.black {
        grid-area: 'black';
    }

    .board {
        display: grid;
        grid-area: 'board';
        width: 100%;
        aspect-ratio: calc(var(--ccount) / var(--rcount));
        grid-template-rows: repeat(var(--rcount), 1fr);
        grid-template-columns: repeat(var(--ccount), 1fr);
        gap: 5px;
        margin: 0px auto;
    }
</style>
