import type { Cell } from '$lib/chess/Cell';
import type { Player } from '$lib/chess/Player';
import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { Move } from './Piece';

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
        };
    }

    notify(): void {
        for (const cb of this.subscribers) {
            cb(this.cells);
        }
    }

    move(from: Cell, to: Cell): null | Move {
        if (to.targeted) {
            const move = from.piece.move(from.position, to.position);
            if (move) {
                return {
                    execute: () => {
                        const ret = move.execute();
                        this.refreshCoveredByCells();
                        this.notify();
                        return ret;
                    },
                    revert: () => {
                        const ret = move.revert();
                        this.refreshCoveredByCells();
                        this.notify();
                        return ret;
                    }
                };
            }
        }
        return null;
    }

    clearTargetedMarkings(): void {
        for (const cell of this.cells) {
            cell.targeted = false;
        }
        this.notify();
    }

    setTargetedMarkings(cell: Cell): void {
        for (const [r, f] of cell.piece.getAttackingMoves(...cell.position)) {
            this.cells[r * this.dimension[1] + f].targeted = true;
        }
        this.notify();
    }

    refreshCoveredByCells(): void {
        this.cells.forEach((cell) => (cell.coveredby = []));
        this.cells.forEach((cell) => {
            if (cell.piece != null) {
                for (const [rank, file] of cell.piece.getSupportingMoves(...cell.position)) {
                    this.cells[rank * this.dimension[1] + file].coveredby.push(cell.id);
                }
            }
        });
    }
}
