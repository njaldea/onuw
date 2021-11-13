<script lang='ts'>
    import Cell from '$components/chess/Cell.svelte';
    import { getTileColor } from '$lib/chess';
    import type { CellDetail } from '$lib/types/Chess';

    export let cells: CellDetail[];
    export let dimension: [number, number];
    export let flipped: boolean;

    function dragconfirm({ detail: { from, to } })
    {
        const fromcell = cells[(from[0] * dimension[0]) + from[1]];
        const tocell = cells[(to[0] * dimension[0]) + to[1]];

        if (tocell.targeted)
        {
            const piece = fromcell.piece;
            tocell.piece = piece;
            fromcell.piece = null;
        }

        for (const cell of cells)
        {
            cell.targeted = false;
        }

        cells = cells;
    }

    function dragcancel()
    {
        for (const cell of cells)
        {
            cell.targeted = false;
        }

        cells = cells;
    }

    function dragpiecestart({ detail: { ref } }: { detail: { ref: [number, number] } })
    {
        const cell = cells[(ref[0] * dimension[0]) + ref[1]];
        console.log('dragpiecestart', cell);
        if (cell.piece)
        {
            const possiblemoves = cell.piece.getPossibleMoves(ref[0], ref[1]);
            console.log(possiblemoves)
            for (const p of possiblemoves)
            {
                cells[(p[0] * dimension[0]) + p[1]].targeted = true;
            }
            cells = cells;
        }
    }

    function split(items: CellDetail[], ccount: number)
    {
        const ret: CellDetail[][] = [];
        for (let x = 0; x < items.length; x += ccount)
        {
            ret.push(items.slice(x, x + ccount));
        }

        return flipped ? ret : ret.reverse();
    }
</script>

<div class='board'style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
    {#each split(cells, dimension[1]) as row, rindex}
        {#each row as cell, cindex (cell.id)}
            <Cell
                color={getTileColor(rindex, cindex, flipped)}
                piece={cell.piece}
                position={cell.position}
                targetable={cell.targeted}
                on:dragconfirm={dragconfirm}
                on:dragcancel={dragcancel}
                on:piecedragstart={dragpiecestart}
            />
        {/each}
    {/each}
</div>

<style>
    .board {
        width: 100%;
        aspect-ratio: 1;
        display: grid;
        grid-template-rows: repeat(var(--rcount), 1fr);
        grid-template-columns: repeat(var(--ccount), 1fr);
        gap: 5px;

        user-select: none;
    }
</style>