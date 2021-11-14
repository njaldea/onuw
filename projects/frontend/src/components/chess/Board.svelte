<script lang='ts'>
    import CellComponent from '$components/chess/Cell.svelte';
    import { resetCoveredBy } from '$lib/chess';
    import type { Kingdom } from '$lib/chess';
    import type { Cell, Piece } from '$lib/types/Chess';

    export let cells: Cell[];
    export let teams: Kingdom[];
    export let dimension: [number, number];
    export let flipped: boolean;

    let teamToMove = true;

    function move(from: number, to: number)
    {
        const fromcell = cells[from];
        const tocell = cells[to];
        if (tocell.targeted)
        {
            const piece = fromcell.piece;
            tocell.piece = piece;
            tocell.piece.hasMoved = true;
            fromcell.piece = null;
            teamToMove = !teamToMove;
        }
    }

    // assumes rook is 3-4 files away from king
    function castlemove(from: number, to: number)
    {
        if (cells[to].targeted)
        {
            const delta = to > from ? +1 : -1;

            const kingCell = cells[from];

            const targetKingCell = cells[from + (delta * 2)];
            targetKingCell.piece = cells[from].piece;
            targetKingCell.piece.hasMoved = true;
            kingCell.piece = null;

            const targetRookCell = cells[from + (delta * 1)];
            
            const rookCell = cells[from + (delta * 3)].piece ? 
                cells[from + (delta * 3)] :
                cells[from + (delta * 4)];

            targetRookCell.piece = rookCell.piece;
            targetRookCell.piece.hasMoved = true;
            rookCell.piece = null;

            teamToMove = !teamToMove;
        }
    }

    function dragconfirm({ detail: { from, to } })
    {
        if (teamToMove === cells[from].piece.team)
        {
            const team = teams.find(t => t.king === cells[from].piece);
            if (team != null && Math.abs(from - to) === 2)
            {
                castlemove(from, to);
            }
            else
            {
                move(from, to);
            }

            for (const cell of cells)
            {
                cell.targeted = false;
            }

            resetCoveredBy(cells);
            cells = cells;
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

    function isSupportedByTeam(cell: Cell, team: boolean)
    {
        for (const id of cell.coveredby)
        {
            const piece = cells[id].piece;
            if (piece && piece.team === team)
            {
                return true;
            }
        }
        return false;
    }

    function populateKingCastleMove(cell: Cell, rooks: Piece[])
    {
        for (const rook of rooks)
        {
            if (!rook.hasMoved)
            {
                const rookcell = cells.find(c => c.piece === rook);
                if (rookcell != null)
                {
                    let cancastle = true;
                    const delta = rookcell.id > cell.id ? +1 : -1;
                    const start = cell.id + delta;
                    const end = rookcell.id - delta;
                    for (let i = start; i <= end; i += delta)
                    {
                        const nextcell = cells[i];
                        if (nextcell.piece != null || isSupportedByTeam(cell, !cell.piece.team))
                        {
                            cancastle = false;
                            break;
                        }
                    }
                    if (cancastle)
                    {
                        cells[cell.id + (delta * 1)].targeted = true;
                        cells[cell.id + (delta * 2)].targeted = true;   
                    }
                }
            }
        }
    }

    function populateKingPossibleMoves(cell: Cell)
    {
        for (const p of cell.piece.getPossibleMoves(...cell.position))
        {
            const targetcell = cells[(p[0] * dimension[0]) + p[1]];
            if (!isSupportedByTeam(targetcell, !cell.piece.team))
            {
                targetcell.targeted = true;
            }
        }
    }

    function dragpiecestart({ detail: { id } }: { detail: { id: number } })
    {
        const cell = cells[id];
        if (cell.piece && teamToMove === cell.piece.team)
        {
            const team = teams.find(t => t.king === cell.piece);
            if (team != null)
            {
                populateKingPossibleMoves(cell);

                // assumption is that rook's cell and king's cell are on same tile
                if (!cell.piece.hasMoved)
                {
                    populateKingCastleMove(cell, team.rooks);
                }
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