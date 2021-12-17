import type { Cell } from '$lib/game/Cell';
import type { Subscriber, Unsubscriber } from 'svelte/store';

export abstract class IEngine {
    abstract next(): void;
    abstract prev(): void;
    abstract movestart(cell: Cell): void;
    abstract movecancel(): void;
    abstract moveconfirm(from: Cell, to: Cell): void;
    abstract subscribe(cb: Subscriber<IEngine>): Unsubscriber;
    abstract cells(reverse: boolean): Generator<Cell>;
    abstract dimension(): [number, number];
}
