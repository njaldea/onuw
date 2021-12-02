<script lang="ts">
    import CellComponent from '$components/chess/Cell.svelte';

    import type { IBoard } from '$lib/chess/Board';
    import type { Cell } from '$lib/chess/Cell';

    export let board: IBoard;
    export let factory: Cell[];
    export let dimension: [number, number];
    export let flipped: boolean;

    $: cellsgen = $board.cells(false);
    $: cells = [...cellsgen];

    function dragconfirmcopy({ detail: { from, to } }) {
        if (factory.includes(from) && cells.includes(to)) {
            to.piece = from.piece;
            board.notify();
        }
    }

    function dragconfirm({ detail: { from, to } }) {
        if (cells.includes(from) && cells.includes(to)) {
            board.move(from, to).execute();
        }
    }
</script>

<div class="root">
    <div class="template" style={`--rcount: ${factory.length};`}>
        {#each factory as cell (cell)}
            <CellComponent alt={false} {cell} on:piecedragconfirm={dragconfirmcopy} />
        {/each}
    </div>
    <div class="board" style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
        {#each [...$board.cells(!flipped)] as cell (cell)}
            <CellComponent
                {cell}
                alt={dimension[1] % 2 === 0
                    ? Math.floor(cell.id / dimension[1]) % 2 ^ cell.id % 2
                    : cell.id % 2}
                on:piecedragconfirm={dragconfirm}
            />
        {/each}
    </div>
</div>

<style>
    .root {
        display: flex;
        gap: 20px;
        margin: 0px auto;
    }

    .template {
        display: grid;
        width: 40px;
        height: calc(40px * var(--rcount));
        grid-template-rows: repeat(var(--rcount), 1fr);
        grid-template-columns: 1fr;
        gap: 5px;
        user-select: none;
    }
    .board {
        display: grid;
        width: calc(100% * calc(var(--ccount) / var(--rcount)));
        aspect-ratio: calc(var(--ccount) / var(--rcount));
        grid-template-rows: repeat(var(--rcount), 1fr);
        grid-template-columns: repeat(var(--ccount), 1fr);
        gap: 5px;

        user-select: none;
    }
</style>
