<script lang="ts">
    import CellComponent from '$components/chess/Cell.svelte';
    import type { IBoard } from '$lib/chess/Board';
    import type { Cell } from '$lib/chess/Cell';
    import type { Move } from '$lib/chess/game/Detail';

    export let dimension: [number, number];
    export let flipped: boolean;

    export let teamToMove: boolean | null = true; // true == white

    export let board: IBoard;

    const history: Move[] = [];
    const redoqueue: Move[] = [];

    function undo() {
        if (history.length > 0) {
            const move = history.pop();
            redoqueue.push(move);

            if (move.revert() && teamToMove != null) {
                teamToMove = !teamToMove;
            }

            if (history.length > 0) {
                history[history.length - 1].revertprenext();
            }
        }
    }

    function redo() {
        if (redoqueue.length > 0) {
            if (history.length > 0) {
                history[history.length - 1].prenext();
            }

            const move = redoqueue.pop();
            history.push(move);

            if (move.execute() && teamToMove != null) {
                teamToMove = !teamToMove;
            }
        }
    }

    function dragconfirm({ detail: { from, to } }) {
        if (teamToMove == null || (from.piece && teamToMove === from.piece.team)) {
            if (to.targeted) {
                const move = board.move(from, to);
                if (move) {
                    redoqueue.splice(0, redoqueue.length);
                    redoqueue.push(move);
                    redo();
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
</script>

<div class="board" style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
    {#each [...$board.cells(!flipped)] as cell (cell)}
        <CellComponent
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
