import type { Cell } from '$lib/game/Cell';
import type { Cells } from '$lib/game/Cells';
import type { Subscriber, Unsubscriber } from 'svelte/store';

import { IMove, Move } from '$lib/game/IMove';
import { IEngine } from './IEngine';

export class Observable<T> {
    _self: T;
    _subscribers: Subscriber<T>[];

    constructor(self: T) {
        this._self = self;
        this._subscribers = [];
    }

    subscribe(cb: (self: T) => void): Unsubscriber {
        cb(this._self);
        this._subscribers.push(cb);
        return () => {
            const idx = this._subscribers.indexOf(cb);
            if (idx >= 0) {
                this._subscribers.splice(idx, 1);
            }
        };
    }

    notify(): void {
        for (const cb of this._subscribers) {
            cb(this._self);
        }
    }
}

export abstract class Engine extends IEngine {
    _cells: Cells;
    _observable: Observable<IEngine>;

    constructor(c: Cells) {
        super();
        this._cells = c;
        this._observable = new Observable<IEngine>(this);
    }

    *cells(reverse: boolean): Generator<Cell> {
        yield* this._cells.iter(reverse);
    }

    subscribe(cb: (self: IEngine) => void): Unsubscriber {
        return this._observable.subscribe(cb);
    }

    _move(from: Cell, to: Cell): null | IMove {
        const move = from.piece.move(from.position, to.position);
        if (move) {
            return new Move({
                execute: () => {
                    const ret = move.execute();
                    this._cells.resetCellStates();
                    this._observable.notify();
                    return ret;
                },
                revert: () => {
                    const ret = move.revert();
                    this._cells.resetCellStates();
                    this._observable.notify();
                    return ret;
                },
                prenext: () => {
                    move.prenext();
                },
                revertprenext: () => {
                    move.revertprenext();
                }
            });
        }
        return null;
    }

    _clearTargetedMarkings(): void {
        for (const cell of this._cells.iter()) {
            cell.targeted = false;
        }
        this._observable.notify();
    }

    _setTargetedMarkings(cell: Cell): void {
        for (const c of this._cells.iter()) {
            if (cell !== c && c.attackedby.includes(cell.id) && this._isMoveValid(cell, c)) {
                c.targeted = true;
            }
        }
        this._observable.notify();
    }

    abstract _isMoveValid(from: Cell, to: Cell): boolean;
}
