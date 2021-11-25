import type { Cell } from '$lib/chess/Cell';
import type { Player } from '$lib/chess/Player';
import type { Subscriber, Unsubscriber } from 'svelte/store';

export type Move = {
    execute: () => boolean;
    revert: () => boolean;
};

export abstract class IBoard {
    abstract move(from: Cell, to: Cell): null | Move;
    abstract clearTargetedMarkings(): void;
    abstract setTargetedMarkings(cell: Cell): void;
    abstract subscribe(cb: Subscriber<Cell[]>): () => void;
}

export class Board implements IBoard {
    players: Player[];
    cells: Cell[];
    dimension: [number, number];
    subscribers: Subscriber<Cell[]>[];

    constructor(p: Player[], c: Cell[], dimension: [number, number]) {
        this.players = p;
        this.cells = c;
        this.dimension = dimension;
        this.subscribers = [];

        this.refreshCoveredByCells();
    }

    subscribe(cb: (cells: Cell[]) => void): Unsubscriber {
        cb(this.cells);
        this.subscribers.push(cb);
        return () => {
            const idx = this.subscribers.indexOf(cb);
            if (idx >= 0) {
                this.subscribers.splice(idx, 1);
            }
        }
    }

    notify() {
        for (const cb of this.subscribers) {
            cb(this.cells);
        }
    }

    move(from: Cell, to: Cell): null | Move {
        if (this.doesCellContainKing(from)) {
            return this.moveKing(from, to);
        }
        return this.movePieceStandard(from, to);
    }

    clearTargetedMarkings(): void {
        for (const cell of this.cells) {
            cell.targeted = false;
        }
        this.notify();
    }

    *getTargetGenerator(cell: Cell): Generator<Cell> {
        if (this.doesCellContainKing(cell)) {
            yield* this.getKingTargets(cell);
        } else if (this.doesCellContainPawn(cell)) {
            yield* this.getPawnTargets(cell);
        } else {
            yield* this.getDefaultTargets(cell);
        }
    }

    setTargetedMarkings(cell: Cell): void {
        for (const targetcell of this.getTargetGenerator(cell)) {
            targetcell.targeted = true;
        }
        this.notify();
    }

    refreshCoveredByCells(): void {
        this.cells.forEach((cell) => (cell.coveredby = []));
        const [rcount, ccount] = this.dimension;
        for (let r = 0; r < rcount; ++r) {
            for (let c = 0; c < ccount; ++c) {
                const cell = this.cells[r * ccount + c];
                if (cell.piece) {
                    const moves = cell.piece.getSupportingMoves(r, c);
                    for (const [rank, file] of moves) {
                        this.cells[rank * ccount + file].coveredby.push(cell.id);
                    }
                }
            }
        }
    }

    takeCell(from: Cell, to: Cell): Move {
        const prevstate = {
            to: to,
            from: from,
            topiece: to.piece,
            frompiece: from.piece,
            totouched: to.touched,
            fromtouched: from.touched
        };

        const nextstate = {
            to: to,
            from: from,
            topiece: from.piece,
            frompiece: null,
            totouched: true,
            fromtouched: true
        };

        return {
            revert: () => {
                prevstate.to.piece = prevstate.topiece;
                prevstate.to.touched = prevstate.totouched;
                prevstate.from.piece = prevstate.frompiece;
                prevstate.from.touched = prevstate.fromtouched;
                this.refreshCoveredByCells();
                this.notify();
                return true;
            },
            execute: () => {
                nextstate.to.piece = nextstate.topiece;
                nextstate.to.touched = nextstate.totouched;
                nextstate.from.piece = nextstate.frompiece;
                nextstate.from.touched = nextstate.fromtouched;
                this.refreshCoveredByCells();
                this.notify();
                return true;
            }
        };
    }

    movePieceStandard(from: Cell, to: Cell): null | Move {
        if (to.targeted) {
            return this.takeCell(from, to);
        }
        return null;
    }

    moveKing(from: Cell, to: Cell): null | Move {
        if (to.targeted) {
            if (Math.abs(from.id - to.id) === 2) {
                const delta = to.id > from.id ? +1 : -1;
                const rookDistance = to.id > from.id ? 4 : 3;

                const kingid = from.id;
                const rookid = from.id + delta * rookDistance;

                const kingrow = Math.floor(kingid / this.dimension[1]);
                const rookrow = Math.floor(rookid / this.dimension[1]);
                if (rookrow === kingrow) {
                    const rookcell = this.cells[rookid];
                    const kingcell = this.cells[kingid];
                    if (
                        this.players.find(
                            (t) => t.king === kingcell.piece && t.rook === rookcell.piece
                        ) != null
                    ) {
                        const kingmove = this.takeCell(kingcell, this.cells[kingid + delta * 2]);
                        const rookmove = this.takeCell(rookcell, this.cells[kingid + delta * 1]);
                        return {
                            execute: () => {
                                kingmove.execute();
                                rookmove.execute();
                                return true;
                            },
                            revert: () => {
                                kingmove.revert();
                                rookmove.revert();
                                return true;
                            }
                        };
                    }
                    return null;
                }
            }
            return this.movePieceStandard(from, to);
        }
        return null;
    }

    doesCellContainKing(cell: Cell): boolean {
        return cell.piece != null && this.players.find((t) => t.king === cell.piece) != null;
    }

    doesCellContainPawn(cell: Cell): boolean {
        return cell.piece != null && this.players.find((t) => t.pawn === cell.piece) != null;
    }

    *getPawnTargets(cell: Cell): Generator<Cell> {
        yield* this.getDefaultTargets(cell);

        if (this.dimension[0] >= 8) {
            const row = Math.floor(cell.id / this.dimension[1]);
            if (row === 1 || row === this.dimension[0] - 2) {
                if (!cell.touched) {
                    const sign = cell.piece.team ? +1 : -1;
                    if (this.cells[cell.id + sign * this.dimension[1]].piece == null) {
                        const targetid = cell.id + sign * this.dimension[1] * 2;
                        if (0 <= targetid && targetid < this.cells.length) {
                            yield this.cells[targetid];
                        }
                    }
                }
            }
        }
    }

    *getKingTargets(cell: Cell): Generator<Cell> {
        for (const targetedcell of this.getDefaultTargets(cell)) {
            if (!this.isCellSupportedByTeam(targetedcell, !cell.piece.team)) {
                yield targetedcell;
            }
        }

        if (!cell.touched) {
            const rookcellsids = [cell.id - 3, cell.id + 4];
            for (const rid of rookcellsids) {
                const rcell = this.cells[rid];

                // TODO: check if piece is rook of same team
                if (rcell.piece && !rcell.touched) {
                    let cancastle = true;
                    const delta = rid > cell.id ? +1 : -1;
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
                        yield this.cells[cell.id + delta * 2];
                    }
                }
            }
        }
    }

    *getDefaultTargets(cell: Cell): Generator<Cell> {
        for (const [rank, file] of cell.piece.getPossibleMoves(...cell.position)) {
            yield this.cells[rank * this.dimension[1] + file];
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
