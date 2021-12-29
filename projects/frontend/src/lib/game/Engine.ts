import type { Cell } from '$lib/game/Cell';
import type { Cells } from '$lib/game/Cells';
import type { Subscriber, Unsubscriber } from 'svelte/store';

import { IMove, Move } from '$lib/game/IMove';
import { IEngine } from './IEngine';

export class Observable<T> {
    private self: T;
    private subscribers: Subscriber<T>[];

    public constructor(self: T) {
        this.self = self;
        this.subscribers = [];
    }

    public subscribe(cb: (self: T) => void): Unsubscriber {
        cb(this.self);
        this.subscribers.push(cb);
        return () => {
            const idx = this.subscribers.indexOf(cb);
            if (idx >= 0) {
                this.subscribers.splice(idx, 1);
            }
        };
    }

    public notify(): void {
        for (const cb of this.subscribers) {
            cb(this.self);
        }
    }
}

export abstract class Engine extends IEngine {
    private icells: Cells;
    private observable: Observable<IEngine>;

    public constructor(c: Cells) {
        super();
        this.icells = c;
        this.observable = new Observable<IEngine>(this);
    }

    override *cells(reverse: boolean): Generator<Cell> {
        yield* this.icells.iter(reverse);
    }

    override subscribe(cb: (self: IEngine) => void): Unsubscriber {
        return this.observable.subscribe(cb);
    }

    protected move(from: Cell, to: Cell): null | IMove {
        const move = from.piece.move(from.position, to.position);
        if (move) {
            return new Move({
                execute: () => {
                    const ret = move.execute();
                    this.icells.resetCellStates();
                    this.observable.notify();
                    return ret;
                },
                revert: () => {
                    const ret = move.revert();
                    this.icells.resetCellStates();
                    this.observable.notify();
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

    protected clearTargetedMarkings(): void {
        for (const cell of this.icells.iter()) {
            cell.targeted = false;
        }
        this.observable.notify();
    }

    protected setTargetedMarkings(cell: Cell): void {
        for (const c of this.icells.iter()) {
            if (cell !== c && c.attackedby.includes(cell.id) && this.isMoveValid(cell, c)) {
                c.targeted = true;
            }
        }
        this.observable.notify();
    }

    protected abstract isMoveValid(from: Cell, to: Cell): boolean;
}
