<script lang='ts'>
    import CellComponent from '$components/chess/Cell.svelte';
    import { IBoard, Board } from '$lib/chess/Board';

    import type { Cell } from '$lib/chess/Cell';
    import type { Player } from '$lib/chess/Player';

    export let cells: Cell[];
    export let players: Player[];
    export let dimension: [number, number];
    export let flipped: boolean;

    let teamToMove = true; // true == white

    const board: IBoard = new Board(players, cells, dimension);

    function dragconfirm({ detail: { from, to } })
    {
        if (teamToMove === board.getTeamOnCell(from))
        {
            if (board.movePiece(from, to))
            {
                teamToMove = !teamToMove;
            }

            board.clearTargetedMarkings();
            board.refreshCoveredByCells();
            cells = cells;
        }
    }

    function dragcancel()
    {
        board.clearTargetedMarkings();
        cells = cells;
    }

    function dragpiecestart({ detail: { id } }: { detail: { id: number } })
    {
        if (teamToMove === board.getTeamOnCell(id))
        {
            board.setTargetedMarkings(id);
            cells = cells;
        }
    }
</script>

<div class='board'style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
    {#each flipped ? cells : cells.slice().reverse() as cell (cell.id)}
        <CellComponent
            id={cell.id}
            alt={Math.floor(cell.id / dimension[0]) % 2 ^ cell.id % 2}
            piece={cell.piece}
            position={cell.position}
            targeted={cell.targeted}
            on:piecedragconfirm={dragconfirm}
            on:piecedragcancel={dragcancel}
            on:piecedragstart={dragpiecestart}
        />
    {/each}
</div>

<style>
    .board {
        width: 100%;
        aspect-ratio: 1;
        display: grid;
        grid-template-rows: repeat(var(--rcount), 1fr);
        grid-template-columns: repeat(var(--ccount), 1fr);
        gap: 5px;

        user-select: none;
    }
</style>