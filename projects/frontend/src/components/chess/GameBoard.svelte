<script lang='ts'>
    import CellComponent from '$components/chess/Cell.svelte';
    import { IBoard, Board } from '$lib/chess/Board';

    import type { Cell } from '$lib/chess/Cell';
    import type { Player } from '$lib/chess/Player';

    export let cells: Cell[];
    export let players: Player[];
    export let dimension: [number, number];
    export let flipped: boolean;

    export let teamToMove: boolean|null = true; // true == white

    const board: IBoard = new Board(players, cells, dimension);

    function dragconfirm({ detail: { from, to } })
    {
        if (teamToMove == null || teamToMove === board.getTeamOnCell(from))
        {
            if (board.movePiece(from, to) && teamToMove != null)
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
        if (teamToMove == null || teamToMove === board.getTeamOnCell(id))
        {
            board.setTargetedMarkings(id);
            cells = cells;
        }
    }
</script>

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