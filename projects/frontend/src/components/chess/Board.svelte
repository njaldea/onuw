<script lang='ts'>
    import CellComponent from '$components/chess/Cell.svelte';
    import { resetCoveredBy } from '$lib/chess';
    import type { Kingdom } from '$lib/chess';
    import type { Cell } from '$lib/types/Chess';

    export let cells: Cell[];
    export let teams: Kingdom[];
    export let dimension: [number, number];
    export let flipped: boolean;

    let teamToMove = true;

    function dragconfirm({ detail: { from, to } })
    {
        const fromcell = cells[from];

        if (teamToMove === fromcell.piece.team)
        {
            const tocell = cells[to];
            if (tocell.targeted)
            {
                const piece = fromcell.piece;
                tocell.piece = piece;
                tocell.piece.hasMoved = true;
                fromcell.piece = null;
            }
            
            for (const cell of cells)
            {
                cell.targeted = false;
            }

            resetCoveredBy(cells);
            cells = cells;

            teamToMove = !teamToMove;
        }
    }

    function dragcancel()
    {
        for (const cell of cells)
        {
            cell.targeted = false;
        }

        cells = cells;
    }

    function removeInvalidMoves(cell: Cell)
    {
        const possiblemoves = cell.piece.getPossibleMoves(...cell.position);
        for (const p of possiblemoves)
        {
            const possibletargetcell = cells[(p[0] * dimension[0]) + p[1]];
            let exclude = false;
            for (const support of possibletargetcell.coveredby)
            {
                const supportingPiece = cells[(support[0] * dimension[0]) + support[1]].piece;
                if (supportingPiece.team != cell.piece.team)
                {
                    exclude = true;
                    break;
                }
            }
            if (exclude === false)
            {
                cells[(p[0] * dimension[0]) + p[1]].targeted = true;
            }
        }
    }

    function dragpiecestart({ detail: { id } }: { detail: { id: number } })
    {
        const cell = cells[id];
        if (cell.piece && teamToMove === cell.piece.team)
        {
            if (cell.piece && teams.find(t => t.king === cell.piece))
            {
                removeInvalidMoves(cell);
            }
            else
            {
                for (const p of cell.piece.getPossibleMoves(...cell.position))
                {
                    cells[(p[0] * dimension[0]) + p[1]].targeted = true;
                }
            }
            cells = cells;
        }
    }
</script>

<div class='board'style={`--rcount: ${dimension[0]}; --ccount: ${dimension[1]};`}>
    {#each flipped ? cells : cells.slice().reverse() as cell (cell.id)}
        <CellComponent
            id={cell.id}
            alt={Math.floor(cell.id / dimension[0]) % 2 ^ cell.id % 2}
            piece={cell.piece}
            position={cell.position}
            targeted={cell.targeted}
            on:dragconfirm={dragconfirm}
            on:dragcancel={dragcancel}
            on:piecedragstart={dragpiecestart}
        />
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