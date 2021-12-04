import type { Cell, Cells } from '$lib/chess/Cell';
import type { Player } from '$lib/chess/Player';
import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { Move } from './game/Detail';

export abstract class IBoard {
    abstract move(from: Cell, to: Cell): null | Move;
    abstract clearTargetedMarkings(): void;
    abstract setTargetedMarkings(cell: Cell): void;
    abstract cells(reverse: boolean): Generator<Cell>;

    abstract subscribe(cb: Subscriber<IBoard>): () => void;
    abstract notify(): void;
}

export class Board implements IBoard {
    players: Player[];
    icells: Cells;
    subscribers: Subscriber<IBoard>[];

    constructor(p: Player[], c: Cells) {
        this.players = p;
        this.icells = c;
        this.subscribers = [];

        this.icells.resetCellStates();
    }

    *cells(reverse: boolean): Generator<Cell> {
        yield* this.icells.iter(reverse);
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
                    this.icells.resetCellStates();
                    this.notify();
                    return ret;
                },
                revert: () => {
                    const ret = move.revert();
                    this.notify();
                    return ret;
                },
                prenext: () => {
                    move.prenext();
                    this.notify();
                },
                revertprenext: () => {
                    move.revertprenext();
                    this.icells.resetCellStates();
                    this.notify();
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
        for (const c of this.icells.iter()) {
            if (cell !== c) {
                if (c.attackedby.includes(cell.id)) {
                    c.targeted = true;
                }
            }
        }
        this.notify();
    }
}
