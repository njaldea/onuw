<script lang='ts'>
    import EditorBoard from '$components/chess/EditorBoard.svelte';
    import type { CellBoundCheck, PieceGetter } from '$lib/chess/Piece';
    import { Player } from '$lib/chess/Player';
    import { Cell } from '$lib/chess/Cell';

    let rcount = 8;
    let ccount = 4;

    function populatecells(rr, cc)
    {
        let cells: Cell[] = [];
        for (let r = 0; r < rr; ++r) {
            for (let c = 0; c < cc; ++c) {
                cells.push(new Cell(r * cc + c, [r, c]));
            }
        }
        return cells;
    }

    $: cells = populatecells(rcount, ccount);

    const pieceGetter: PieceGetter = (r: number, f: number) => {
        if (r < rcount && f < ccount) {
            return cells[r * ccount + f].piece;
        }
        return null;
    };

    const isCellInBound: CellBoundCheck = (r: number, f: number) => {
        return 0 <= r && r < rcount && 0 <= f && f < ccount;
    };

    const player1 = new Player(true, isCellInBound, pieceGetter);
    const player2 = new Player(false, isCellInBound, pieceGetter);

    let rankcreator = 0;
    let tilecreator = 0;

    function updatecreator(r: number, f: number)
    {
        if (r < rankcreator)
        {
            rankcreator = r;
        }

        if (f < tilecreator)
        {
            tilecreator = f;
        }
    }
    $: updatecreator(rcount, ccount);
</script>

<div class="root">
    <div class="board">
        <EditorBoard flipped={false} players={[player1, player2]} cells={cells} dimension={[rcount, ccount]}/>
    </div>
    <div class="panel">
        <label><input type="number" min={0} bind:value={rcount}><span>max rank</span></label>
        <label><input type="number" min={0} bind:value={ccount}><span>max file</span></label>
        <label><input type="number" min={0} max={rcount} bind:value={rankcreator}><span>rank</span></label>
        <label><input type="number" min={0} max={ccount} bind:value={tilecreator}><span>file</span></label>
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
    button.active {
        outline: 2px solid red;
    }
</style>