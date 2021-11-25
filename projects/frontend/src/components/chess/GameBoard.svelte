<script lang='ts'>
    import CellComponent from '$components/chess/Cell.svelte';
    import { IBoard, Board, Move } from '$lib/chess/Board';

    import type { Cell } from '$lib/chess/Cell';
    import type { Player } from '$lib/chess/Player';

    export let cells: Cell[];
    export let players: Player[];
    export let dimension: [number, number];
    export let flipped: boolean;

    export let teamToMove: boolean|null = true; // true == white

    const board: IBoard = new Board(players, cells, dimension);

    const history: Move[] = [];
    const redoqueue: Move[] = [];

    function undo()
    {
        if (history.length > 0)
        {
            const move = history.pop();
            redoqueue.push(move);
            move.prev();

            board.refreshCoveredByCells();
            cells = cells;
            if (teamToMove != null)
            {
                teamToMove = !teamToMove;
            }
        }
    }

    function redo()
    {
        if (redoqueue.length > 0) {
            const move = redoqueue.pop();
            history.push(move);
            move.next();

            board.refreshCoveredByCells();
            cells = cells;
            if (teamToMove != null)
            {
                teamToMove = !teamToMove;
            }
        }
    }

    function dragconfirm({ detail: { from, to } })
    {
        if (teamToMove == null || (from.piece && teamToMove === from.piece.team))
        {
            const move = board.movePiece(from, to);
            if (move) 
            {
                move.next();
                history.push(move);
                redoqueue.splice(0, redoqueue.length);
                if (teamToMove != null)
                {
                    teamToMove = !teamToMove;
                }
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

    function dragpiecestart({ detail: { cell } }: { detail: { cell: Cell } })
    {
        if (teamToMove == null || (cell.piece && teamToMove === cell.piece.team))
        {
            board.setTargetedMarkings(cell);
            cells = cells;
        }
    }

    function* boardOrder(cells: Cell[], flipped: boolean)
    {
        const [ start, end, delta ] = flipped ? 
            [0, cells.length, 1] :
            [cells.length - 1, -1, -1];
        for (let i = start; i != end; i += delta)
        {
            yield cells[i];
        }
    }
</script>

<div class='board' style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
    {#each [ ...boardOrder(cells, flipped) ] as cell (cell.id)}
        <CellComponent
            cell={cell}
            alt={dimension[1] % 2 === 0 ? Math.floor(cell.id / dimension[1]) % 2 ^ cell.id % 2 : cell.id % 2}
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