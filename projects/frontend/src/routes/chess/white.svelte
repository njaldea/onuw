<script lang="ts">
    import GameBoard from '$components/chess/GameBoard.svelte';
    import { getCells } from '$lib/chess';
    import { Board, IBoard } from '$lib/chess/Board';

    const { dimension, cells, players } = getCells();
    const board: IBoard = new Board(players, cells);
</script>

<div>
    <GameBoard flipped={false} {board} {cells} {dimension} />
</div>

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>
