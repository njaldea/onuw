import type { Cell } from '$lib/chess/Cell';
import type { Player } from '$lib/chess/Player';

export abstract class IBoard {
    abstract movePiece(from: number, to: number): boolean;
    abstract getTeamOnCell(id: number): boolean;
    abstract clearTargetedMarkings(): void;
    abstract setTargetedMarkings(id: number): void;
    abstract refreshCoveredByCells(): void;
}

export class Board implements IBoard {
    players: Player[];
    cells: Cell[];
    dimension: [number, number];

    constructor(p: Player[], c: Cell[], [rcount, fcount]: [number, number]) {
        this.players = p;
        this.cells = c;
        this.dimension = [rcount, fcount];

        this.refreshCoveredByCells();
    }

    movePiece(from: number, to: number): boolean {
        if (this.doesCellContainKing(from)) {
            return this.moveKing(from, to);
        }
        return this.movePieceStandard(from, to);
    }

    getTeamOnCell(id: number): boolean {
        const cell = this.cells[id];
        return cell.piece != null && cell.piece.team;
    }

    clearTargetedMarkings(): void {
        for (const cell of this.cells) {
            cell.targeted = false;
        }
    }

    getTargetGenerator(id: number): Generator<number, void, unknown> {
        if (this.doesCellContainKing(id)) {
            return this.getKingTargets(id);
        } else if (this.doesCellContainPawn(id)) {
            return this.getPawnTargets(id);
        } else {
            return this.getDefaultTargets(id);
        }
    }

    setTargetedMarkings(id: number): void {
        for (const targetid of this.getTargetGenerator(id)) {
            this.cells[targetid].targeted = true;
        }
    }

    refreshCoveredByCells(): void {
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

    takeCell(from: number, to: number): void {
        const fromcell = this.cells[from];
        const tocell = this.cells[to];
        const piece = fromcell.piece;
        tocell.piece = piece;
        tocell.piece.hasMoved = true;
        fromcell.piece = null;
    }

    movePieceStandard(from: number, to: number): boolean {
        if (this.cells[to].targeted) {
            this.takeCell(from, to);
            return true;
        }
        return false;
    }

    moveKing(from: number, to: number): boolean {
        if (this.cells[to].targeted) {
            if (Math.abs(from - to) === 2) {
                const delta = to > from ? +1 : -1;
                const rookDistance = to > from ? 4 : 3;

                const kingid = from;
                const rookid = from + delta * rookDistance;

                const kingrow = Math.floor(kingid / this.dimension[0]);
                const rookrow = Math.floor(rookid / this.dimension[0]);
                if (rookrow === kingrow) {
                    this.takeCell(kingid, kingid + delta * 2);
                    this.takeCell(rookid, kingid + delta * 1);
                    return true;
                }
            }
            return this.movePieceStandard(from, to);
        }
        return false;
    }

    doesCellContainKing(id: number): boolean {
        const cell = this.cells[id];
        return cell.piece != null && this.players.find((t) => t.king === cell.piece) != null;
    }

    doesCellContainPawn(id: number): boolean {
        const cell = this.cells[id];
        return cell.piece != null && this.players.find((t) => t.pawns.includes(cell.piece)) != null;
    }

    *getPawnTargets(id: number): Generator<number, void, unknown> {
        for (const targetid of this.getDefaultTargets(id)) {
            yield targetid;
        }
        const cell = this.cells[id];
        if (!cell.piece.hasMoved) {
            const targetid = id + (cell.piece.team ? +16 : -16);
            if (0 <= targetid && targetid < this.cells.length) {
                yield targetid;
            }
        }
    }

    *getKingTargets(id: number): Generator<number, void, unknown> {
        const cell = this.cells[id];
        for (const targetid of this.getDefaultTargets(id)) {
            if (!this.isCellSupportedByTeam(this.cells[targetid], !cell.piece.team)) {
                yield targetid;
            }
        }

        if (!cell.piece.hasMoved) {
            const rookcellsids = [id - 3, id + 4];
            for (const rid of rookcellsids) {
                const rcell = this.cells[rid];

                // TODO: check if piece is rook of same team
                if (rcell.piece && !rcell.piece.hasMoved) {
                    let cancastle = true;
                    const delta = rid > id ? +1 : -1;
                    for (let i = cell.id + delta; i != rid; i += delta) {
                        const nextcell = this.cells[i];
                        if (
                            nextcell.piece != null ||
                            this.isCellSupportedByTeam(nextcell, !cell.piece.team)
                        ) {
                            cancastle = false;
                            break;
                        }
                    }
                    if (cancastle) {
                        yield cell.id + delta * 2;
                    }
                }
            }
        }
    }

    *getDefaultTargets(id: number): Generator<number, void, unknown> {
        const cell = this.cells[id];
        for (const [rank, file] of cell.piece.getPossibleMoves(...cell.position)) {
            yield rank * this.dimension[0] + file;
        }
    }

    isCellSupportedByTeam(cell: Cell, team: boolean): boolean {
        for (const id of cell.coveredby) {
            const piece = this.cells[id].piece;
            if (piece && piece.team === team) {
                return true;
            }
        }
        return false;
    }
}
