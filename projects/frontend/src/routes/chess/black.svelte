<script lang="ts">
    import GameBoard from '$components/chess/GameBoard.svelte';
    import { fill } from '$lib/chess/setup';
    import { Cells } from '$lib/chess/Cell';
    import { Player } from '$lib/chess/Player';
    import { Board, IBoard } from '$lib/chess/Board';
    import { BasicGame } from '$lib/chess/game/Basic';
    import type { Detail } from '$lib/chess/game/Detail';

    const cells = new Cells(8, 8);
    const gamedetail: Detail = new BasicGame(cells);

    const players = [new Player(true, gamedetail), new Player(false, gamedetail)];
    players.forEach((p) => fill(p, cells));

    const board: IBoard = new Board(players, cells);
</script>

<div>
    <GameBoard flipped={true} {board} {cells} dimension={[cells.rcount, cells.ccount]} />
</div>

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>
