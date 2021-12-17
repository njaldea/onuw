import type { Cell } from '$lib/game/Cell';
import type { Cells } from '$lib/game/Cells';
import type { Subscriber, Unsubscriber } from 'svelte/store';

import { IMove, Move } from '$lib/game/IMove';
import { IEngine } from './IEngine';

export class Observable<T> {
    #self: T;
    #subscribers: Subscriber<T>[];

    constructor(self: T) {
        this.#self = self;
        this.#subscribers = [];
    }

    subscribe(cb: (self: T) => void): Unsubscriber {
        cb(this.#self);
        this.#subscribers.push(cb);
        return () => {
            const idx = this.#subscribers.indexOf(cb);
            if (idx >= 0) {
                this.#subscribers.splice(idx, 1);
            }
        };
    }

    notify(): void {
        for (const cb of this.#subscribers) {
            cb(this.#self);
        }
    }
}

export abstract class Engine extends IEngine {
    #cells: Cells;
    #observable: Observable<IEngine>;

    constructor(c: Cells) {
        super();
        this.#cells = c;
        this.#observable = new Observable<IEngine>(this);
    }

    *cells(reverse: boolean): Generator<Cell> {
        yield* this.#cells.iter(reverse);
    }

    subscribe(cb: (self: IEngine) => void): Unsubscriber {
        return this.#observable.subscribe(cb);
    }

    _move(from: Cell, to: Cell): null | IMove {
        const move = from.piece.move(from.position, to.position);
        if (move) {
            return new Move({
                execute: () => {
                    const ret = move.execute();
                    this.#cells.resetCellStates();
                    this.#observable.notify();
                    return ret;
                },
                revert: () => {
                    const ret = move.revert();
                    this.#observable.notify();
                    return ret;
                },
                prenext: () => {
                    move.prenext();
                    this.#observable.notify();
                },
                revertprenext: () => {
                    move.revertprenext();
                    this.#cells.resetCellStates();
                    this.#observable.notify();
                }
            });
        }
        return null;
    }

    _clearTargetedMarkings(): void {
        for (const cell of this.#cells.iter()) {
            cell.targeted = false;
        }
        this.#observable.notify();
    }

    _setTargetedMarkings(cell: Cell): void {
        for (const c of this.#cells.iter()) {
            if (cell !== c && c.attackedby.includes(cell.id) && this._isMoveValid(cell, c)) {
                c.targeted = true;
            }
        }
        this.#observable.notify();
    }

    abstract _isMoveValid(from: Cell, to: Cell): boolean;
}
