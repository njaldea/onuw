<script lang='ts'>
    import EditorBoard from '$components/chess/EditorBoard.svelte';
    import type { CellBoundCheck, PieceGetter } from '$lib/chess/Piece';
    import { ChessPlayer } from '$lib/chess/Player';
    import { Cell } from '$lib/chess/Cell';

    import King from '$lib/chess/pieces/King';
    import Knight from '$lib/chess/pieces/Knight';
    import Rook from '$lib/chess/pieces/Rook';
    import Bishop from '$lib/chess/pieces/Bishop';
    import Queen from '$lib/chess/pieces/Queen';
    import Pawn from '$lib/chess/pieces/Pawn';

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

    const p1 = new ChessPlayer(true, isCellInBound, pieceGetter);

    const createTransformer = (team: boolean) =>
    {
        return (r: number, f: number, rdelta: number, fdelta: number): [number, number] => {
            return team ? [r + rdelta, f + fdelta] : [r - rdelta, f - fdelta];
        };
    }

    let templatecells: Cell[] = [
        new Cell(0, [0, 0])
    ];
    templatecells[0].piece = new Pawn(true, isCellInBound, pieceGetter, createTransformer(true));

    let rankcreator = 0;
    let tilecreator = 0;
    let typecreator = "P";

    function updatecreator(r, f)
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

    let createstate = false;
    let deletestate = false;

    function createclick()
    {
        createstate = !createstate;
        if (createstate)
        {
            deletestate = false;
        }
    }

    function deleteclick()
    {
        deletestate = !deletestate;
        if (deletestate)
        {
            createstate = false;
        }
    }
</script>

<div class="root">
    <div class="board">
        <EditorBoard templatecells={templatecells} flipped={false} players={[p1]} cells={cells} dimension={[rcount, ccount]}/>
    </div>
    <div class="panel">
        <label><input type="number" min={0} bind:value={rcount}><span>max rank</span></label>
        <label><input type="number" min={0} bind:value={ccount}><span>max file</span></label>
        <label><input type="number" min={0} max={rcount} bind:value={rankcreator}><span>rank</span></label>
        <label><input type="number" min={0} max={ccount} bind:value={tilecreator}><span>file</span></label>
        <select bind:value={typecreator}>
            <option value="K">King</option>
            <option value="Q">Queen</option>
            <option value="B">Bishop</option>
            <option value="N">Knight</option>
            <option value="R">Rook</option>
            <option value="P">Pawn</option>
        </select>
        <button class:active={createstate} on:click={createclick}>Create</button>
        <button class:active={deletestate} on:click={deleteclick}>Delete</button>
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