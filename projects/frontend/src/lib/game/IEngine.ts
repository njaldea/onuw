import type { Cell } from '$lib/game/Cell';
import type { Subscriber, Unsubscriber } from 'svelte/store';

export abstract class IEngine {
    public abstract next(): void;
    public abstract prev(): void;
    public abstract movestart(cell: Cell): void;
    public abstract movecancel(): void;
    public abstract moveconfirm(from: Cell, to: Cell): void;
    public abstract subscribe(cb: Subscriber<IEngine>): Unsubscriber;
    public abstract cells(reverse: boolean): Generator<Cell>;
    public abstract dimension(): [number, number];
}
