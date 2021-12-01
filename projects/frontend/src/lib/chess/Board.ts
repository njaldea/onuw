import type { Cell, Cells } from '$lib/chess/Cell';
import type { Player } from '$lib/chess/Player';
import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { Move } from './Piece';

export abstract class IBoard {
    abstract move(from: Cell, to: Cell): null | Move;
    abstract clearTargetedMarkings(): void;
    abstract setTargetedMarkings(cell: Cell): void;
    abstract subscribe(cb: Subscriber<IBoard>): () => void;
    abstract cells(): Cells;
}

export class Board implements IBoard {
    players: Player[];
    icells: Cells;
    subscribers: Subscriber<IBoard>[];

    constructor(p: Player[], c: Cells) {
        this.players = p;
        this.icells = c;
        this.subscribers = [];

        this.refreshCoveredByCells();
    }

    cells(): Cells {
        return this.icells;
    }

    subscribe(cb: (self: IBoard) => void): Unsubscriber {
        cb(this);
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
            cb(this);
        }
    }

    move(from: Cell, to: Cell): null | Move {
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
        return null;
    }

    clearTargetedMarkings(): void {
        for (const cell of this.icells.iter()) {
            cell.targeted = false;
        }
        this.notify();
    }

    setTargetedMarkings(cell: Cell): void {
        for (const [r, f] of cell.piece.getAttackingMoves(...cell.position)) {
            const c = this.icells.getCell(r, f);
            if (c) {
                c.targeted = true;
            }
        }
        this.notify();
    }

    refreshCoveredByCells(): void {
        [...this.icells.iter()].forEach((cell) => (cell.coveredby = []));
        [...this.icells.iter()].forEach((cell) => {
            if (cell.piece != null) {
                for (const [rank, file] of cell.piece.getSupportingMoves(...cell.position)) {
                    const c = this.icells.getCell(rank, file);
                    if (c) {
                        c.coveredby.push(cell.position);
                    }
                }
            }
        });
    }
}
