import type { Cell, Kingdom } from '$lib/chess/types';

export abstract class IBoard {
	abstract movePiece(from: number, to: number): boolean;
	abstract getTeamOnCell(id: number): boolean;
    abstract clearTargetedMarkings(): void;
    abstract setTargetedMarkings(id: number): void;
    abstract refreshCoveredByCells(): void;
}

export class Board implements IBoard
{
    teams: Kingdom[];
    cells: Cell[];
    dimension: [number, number];

    constructor(t: Kingdom[], c: Cell[], [rcount, fcount]: [number, number])
    {
        this.teams = t;
        this.cells = c;
        this.dimension = [rcount, fcount];

        this.refreshCoveredByCells();
    }

    movePiece(from: number, to: number)
    {
        if (this.doesCellContainKing(from) && Math.abs(from - to) === 2)
        {
            return this.moveKingCastle(from, to);
        }
        return this.movePieceStandard(from, to);
    }

    getTeamOnCell(id: number)
    {
        const cell = this.cells[id];
        return cell.piece != null && cell.piece.team;
    }


    clearTargetedMarkings()
    {
        for (const cell of this.cells)
        {
            cell.targeted = false;
        }
    }

    setTargetedMarkings(id: number)
    {
        if (this.doesCellContainKing(id))
        {
            this.setKingTargetedMarkings(id);
        }
        else
        {
            const cell = this.cells[id];
            if (cell.piece)
            {
                for (const [rank, file] of cell.piece.getPossibleMoves(...this.cells[id].position))
                {
                    this.cells[(rank * this.dimension[0]) + file].targeted = true;
                }
            }
        }
    }

    refreshCoveredByCells()
    {
        this.cells.forEach((cell) => (cell.coveredby = []));
        const [rcount, ccount] = this.dimension;
        for (let r = 0; r < rcount; ++r) {
            for (let c = 0; c < ccount; ++c) {
                const cell = this.cells[r * 8 + c];
                if (cell.piece) {
                    const moves = cell.piece.getSupportingMoves(r, c);
                    for (const [rank, file] of moves) {
                        this.cells[rank * 8 + file].coveredby.push(cell.id);
                    }
                }
            }
        }
    }

    movePieceStandard(from: number, to: number)
    {
        const fromcell = this.cells[from];
        const tocell = this.cells[to];
        if (tocell.targeted)
        {
            const piece = fromcell.piece;
            tocell.piece = piece;
            tocell.piece.hasMoved = true;
            fromcell.piece = null;
            return true;
        }
        return false;
    }

    moveKingCastle(from: number, to: number)
    {
        if (this.cells[to].targeted)
        {
            const delta = to > from ? +1 : -1;

            const kingCell = this.cells[from];

            const targetKingCell = this.cells[from + (delta * 2)];
            targetKingCell.piece = this.cells[from].piece;
            targetKingCell.piece.hasMoved = true;
            kingCell.piece = null;

            const targetRookCell = this.cells[from + (delta * 1)];
            
            const rookCell = this.cells[from + (delta * 3)].piece ? 
                this.cells[from + (delta * 3)] :
                this.cells[from + (delta * 4)];

            targetRookCell.piece = rookCell.piece;
            targetRookCell.piece.hasMoved = true;
            rookCell.piece = null;
            return true;
        }
        return false;
    }

    doesCellContainKing(id: number)
    {
        const cell = this.cells[id];
        return cell.piece != null && this.teams.find(t => t.king === cell.piece);
    }

    setKingTargetedMarkings(id: number)
    {
        const cell = this.cells[id];
        for (const p of cell.piece.getPossibleMoves(...cell.position))
        {
            const targetcell = this.cells[(p[0] * this.dimension[0]) + p[1]];
            if (!this.isCellSupportedByTeam(targetcell, !cell.piece.team))
            {
                targetcell.targeted = true;
            }
        }

        if (!cell.piece.hasMoved)
        {
            const rookcellsids = [ id - 3, id + 4];
            console.log(rookcellsids)
            for (const rid of rookcellsids)
            {
                const rcell = this.cells[rid];

                // TODO: check if piece is rook of same team
                if (rcell.piece && !rcell.piece.hasMoved)
                {
                    let cancastle = true;
                    const delta = rid > id ? +1 : -1;
                    for (let i = cell.id + delta; i != rid; i += delta)
                    {
                        const nextcell = this.cells[i];
                        if (nextcell.piece != null || this.isCellSupportedByTeam(nextcell, !cell.piece.team))
                        {
                            cancastle = false;
                            break;
                        }
                    }
                    if (cancastle)
                    {
                        this.cells[cell.id + (delta * 2)].targeted = true;   
                    }
                }
            }
        }
    }

    isCellSupportedByTeam(cell: Cell, team: boolean)
    {
        for (const id of cell.coveredby)
        {
            const piece = this.cells[id].piece;
            if (piece && piece.team === team)
            {
                return true;
            }
        }
        return false;
    }
}