<script lang="ts">
    import CellComponent from '$components/chess/Cell.svelte';
    import type { IBoard, Move } from '$lib/chess/Board';
    import type { Cell } from '$lib/chess/Cell';

    export let dimension: [number, number];
    export let flipped: boolean;

    export let teamToMove: boolean | null = true; // true == white

    export let board: IBoard;

    const history: Move[] = [];
    const redoqueue: Move[] = [];

    function move(q1: Move[], q2: Move[], method: (m: Move) => boolean) {
        if (q1.length > 0)
        {
            const move = q1.pop();
            q2.push(move);

            if (method(move) && teamToMove != null)
            {
                teamToMove = !teamToMove;
            }
        }
    }

    function dragconfirm({ detail: { from, to } }) {
        if (teamToMove == null || (from.piece && teamToMove === from.piece.team)) {
            const move = board.move(from, to);
            if (move) {
                history.push(move);
                redoqueue.splice(0, redoqueue.length);
                if (move.execute() && teamToMove != null) {
                    teamToMove = !teamToMove;
                }
            }

            board.clearTargetedMarkings();
        }
    }

    function dragcancel() {
        board.clearTargetedMarkings();
    }

    function dragpiecestart({ detail: { cell } }: { detail: { cell: Cell } }) {
        if (teamToMove == null || (cell.piece && teamToMove === cell.piece.team)) {
            board.setTargetedMarkings(cell);
        }
    }

    function* boardOrder(cells: Cell[], flipped: boolean) {
        const [start, end, delta] = flipped ? [0, cells.length, 1] : [cells.length - 1, -1, -1];
        for (let i = start; i != end; i += delta) {
            yield cells[i];
        }
    }
</script>

<div class="board" style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
    {#each [...boardOrder($board, flipped)] as cell (cell.id)}
        <CellComponent
            {cell}
            alt={dimension[1] % 2 === 0
                ? Math.floor(cell.id / dimension[1]) % 2 ^ cell.id % 2
                : cell.id % 2}
            on:piecedragconfirm={dragconfirm}
            on:piecedragcancel={dragcancel}
            on:piecedragstart={dragpiecestart}
        />
    {/each}
</div>
<button on:click={() => move(history, redoqueue, (m) => m.revert())}>Undo</button>
<button on:click={() => move(redoqueue, history, (m) => m.execute())}>Redo</button>

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
