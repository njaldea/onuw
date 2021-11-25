<script lang="ts">
    import CellComponent from '$components/chess/Cell.svelte';

    import { Cell } from '$lib/chess/Cell';
    import type { Player } from '$lib/chess/Player';

    export let cells: Cell[];
    export let players: Player[];
    export let dimension: [number, number];
    export let flipped: boolean;

    const templatecells: Cell[] = [];
    function createTemplateCell() {
        const cell = new Cell(templatecells.length, [templatecells.length, 0]);
        templatecells.push(cell);
        return cell;
    }
    for (const player of players) {
        createTemplateCell().piece = player.queen;
        createTemplateCell().piece = player.bishop;
        createTemplateCell().piece = player.knight;
        createTemplateCell().piece = player.rook;
        createTemplateCell().piece = player.pawn;
    }

    function dragconfirmcopy({ detail: { from, to } }) {
        if (templatecells.includes(from) && cells.includes(to)) {
            to.piece = from.piece;
            cells = cells;
        }
    }

    function dragconfirm({ detail: { from, to } }) {
        if (cells.includes(from) && cells.includes(to)) {
            to.piece = from.piece;
            from.piece = null;
            cells = cells;
        }
    }

    function* boardOrder(cells: Cell[], flipped: boolean) {
        const [start, end, delta] = flipped ? [0, cells.length, 1] : [cells.length - 1, -1, -1];
        for (let i = start; i != end; i += delta) {
            yield cells[i];
        }
    }
</script>

<div class="root">
    <div class="template" style={`--rcount: ${templatecells.length};`}>
        {#each templatecells as cell (cell.id)}
            <CellComponent alt={false} {cell} on:piecedragconfirm={dragconfirmcopy} />
        {/each}
    </div>
    <div class="board" style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
        {#each [...boardOrder(cells, flipped)] as cell (cell.id)}
            <CellComponent
                {cell}
                alt={dimension[1] % 2 === 0
                    ? Math.floor(cell.id / dimension[1]) % 2 ^ cell.id % 2
                    : cell.id % 2}
                on:piecedragconfirm={dragconfirm}
            />
        {/each}
    </div>
</div>

<style>
    .root {
        display: flex;
        gap: 20px;
        margin: 0px auto;
    }

    .template {
        display: grid;
        width: 40px;
        height: calc(40px * var(--rcount));
        grid-template-rows: repeat(var(--rcount), 1fr);
        grid-template-columns: 1fr;
        gap: 5px;
        user-select: none;
    }
    .board {
        display: grid;
        width: calc(100% * calc(var(--ccount) / var(--rcount)));
        aspect-ratio: calc(var(--ccount) / var(--rcount));
        grid-template-rows: repeat(var(--rcount), 1fr);
        grid-template-columns: repeat(var(--ccount), 1fr);
        gap: 5px;

        user-select: none;
    }
</style>
