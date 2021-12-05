<script lang="ts">
    import GameBoard from '$components/chess/GameBoard.svelte';
    import { fill } from '$lib/chess/setup';
    import { Cells } from '$lib/chess/Cell';
    import { Player } from '$lib/chess/Player';
    import { Board, IBoard } from '$lib/chess/Board';
    import { BasicGame } from '$lib/chess/game/Basic';
    import type { Detail } from '$lib/chess/game/Detail';

    import tooltip from '$stores/tooltip';

    const cells = new Cells(8, 8);
    const gamedetail: Detail = new BasicGame(cells);

    const players = [new Player(true, gamedetail), new Player(false, gamedetail)];
    players.forEach((p) => fill(p, cells));

    const board: IBoard = new Board(players, cells);

    let debug = false;
    $: debug ? tooltip.enable() : tooltip.disable();

    function keydown(ev: KeyboardEvent) {
        if (ev.key === 'd') {
            debug = true;
        }
    }
    function keyup(ev: KeyboardEvent) {
        if (ev.key === 'd') {
            debug = false;
        }
    }
</script>

<svelte:window on:keydown={keydown} on:keyup={keyup} />

<div>
    <GameBoard {debug} flipped={false} {board} dimension={[cells.rcount, cells.ccount]} />
</div>

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>
