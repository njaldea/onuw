<script lang="ts">
    import EditorBoard from '$components/chess/EditorBoard.svelte';
    import { Cell, Cells } from '$lib/chess/Cell';
    import { Player } from '$lib/chess/Player';
    import { Board, IBoard } from '$lib/chess/Board';
    import { BasicGame } from '$lib/chess/game/Basic';
    import type { Detail } from '$lib/chess/game/Detail';

    const cells = new Cells(8, 8);
    const gamedetail: Detail = new BasicGame(cells);

    let rcount = 8;
    let ccount = 8;

    const players = [
        new Player(true, gamedetail),
        new Player(false, gamedetail)
    ];

    const board: IBoard = new Board(players, cells);

    const factory: Cell[] = []
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

    let rankcreator = 0;
    let tilecreator = 0;

    function updatecreator(r: number, f: number) {
        if (r < rankcreator) {
            rankcreator = r;
        }

        if (f < tilecreator) {
            tilecreator = f;
        }
    }
    $: updatecreator(rcount, ccount);
</script>

<div class="root">
    <div class="board">
        <EditorBoard
            flipped={false}
            {factory}
            {board}
            dimension={[rcount, ccount]}
        />
    </div>
    <div class="panel">
        <label><input type="number" min={0} bind:value={rcount} /><span>max rank</span></label>
        <label><input type="number" min={0} bind:value={ccount} /><span>max file</span></label>
        <label
            ><input type="number" min={0} max={rcount} bind:value={rankcreator} /><span>rank</span
            ></label
        >
        <label
            ><input type="number" min={0} max={ccount} bind:value={tilecreator} /><span>file</span
            ></label
        >
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
