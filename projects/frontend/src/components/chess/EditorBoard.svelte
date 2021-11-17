<script lang='ts'>
    import CellComponent from '$components/chess/Cell.svelte';
    import { IBoard, Board } from '$lib/chess/Board';

    import type { Cell } from '$lib/chess/Cell';
    import type { Player } from '$lib/chess/Player';

    export let templatecells: Cell[];
    export let cells: Cell[];
    export let players: Player[];
    export let dimension: [number, number];
    export let flipped: boolean;

    const board: IBoard = new Board(players, cells, dimension);

    function dragconfirmcopy({ detail: {from, to} })
    {
        console.log("dragconfirm", from, to, templatecells, templatecells[from]);
        cells[to].piece = templatecells[from].piece;
        cells = cells;
    }

    function dragconfirm({ detail: { from, to } })
    {
        board.movePiece(from, to)
        board.clearTargetedMarkings();
        board.refreshCoveredByCells();
        cells = cells;
    }

    function dragcancel()
    {
        board.clearTargetedMarkings();
        cells = cells;
    }

    function dragpiecestart({ detail: { id } }: { detail: { id: number } })
    {
        board.setTargetedMarkings(id);
        cells = cells;
    }
</script>

<div class="root">
    <div class="template">
        {#each templatecells as cell (cell.id)}
            <CellComponent alt={false} cell={cell} on:piecedragconfirm={dragconfirmcopy}/>
        {/each}
    </div>
    <div class='board' style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
        {#each flipped ? cells : cells.slice().reverse() as cell (cell.id)}
            <CellComponent
                cell={cell}
                alt={dimension[1] % 2 === 0 ? Math.floor(cell.id / dimension[1]) % 2 ^ cell.id % 2 : cell.id % 2}
                on:piecedragconfirm={dragconfirm}
                on:piecedragcancel={dragcancel}
                on:piecedragstart={dragpiecestart}
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
        height: 40px;
        aspect-ratio: 1;
        grid-template-rows: 1fr;
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