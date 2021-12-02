<script lang="ts">
    import EditorBoard from '$components/chess/EditorBoard.svelte';
    import { Cell, Cells } from '$lib/chess/Cell';
    import { Player } from '$lib/chess/Player';
    import { Board, IBoard } from '$lib/chess/Board';
    import { BasicGame } from '$lib/chess/game/Basic';
    import type { Detail } from '$lib/chess/game/Detail';

    let rcount = 2;
    let ccount = 2;

    const cells = new Cells(2, 2);
    const gamedetail: Detail = new BasicGame(cells);

    const players = [new Player(true, gamedetail), new Player(false, gamedetail)];

    const board = new Board(players, cells);

    const factory: Cell[] = [];
    function createTemplateCell() {
        const cell = new Cell(factory.length, [factory.length, 0]);
        factory.push(cell);
        return cell;
    }
    for (const player of players) {
        createTemplateCell().piece = player.queen;
        createTemplateCell().piece = player.bishop;
        createTemplateCell().piece = player.knight;
        createTemplateCell().piece = player.rook;
        createTemplateCell().piece = player.pawn;
    }

    function updatecreator(r: number, f: number, c: Cells) {
        c.reset(r, f);
        board.icells = c;
        board.notify();
    }
    $: updatecreator(rcount, ccount, cells);
</script>

<div class="root">
    <div class="board">
        <EditorBoard flipped={false} {factory} {board} dimension={[rcount, ccount]} />
    </div>
    <div class="panel">
        <label><input type="number" min={0} bind:value={rcount} /><span>max rank</span></label>
        <label><input type="number" min={0} bind:value={ccount} /><span>max file</span></label>
    </div>
</div>

<style>
    .root {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
        display: flex;
    }

    .board {
        width: 80%;
        z-index: 1;
    }

    .panel {
        width: 20%;
        z-index: 0;
    }

    .panel > * {
        width: 100%;
    }

    label {
        display: flex;
        gap: 5px;
    }

    label > * {
        width: 50%;
    }
</style>
