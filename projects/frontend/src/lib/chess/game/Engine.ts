import type { IBoard } from '../Board';
import type { Cell } from '../Cell';
import type { Subscriber, Unsubscriber } from 'svelte/store';

export abstract class Engine {
    abstract next(): void;
    abstract prev(): void;
    abstract movestart(cell: Cell): void;
    abstract movecancel(): void;
    abstract moveconfirm(from: Cell, to: Cell): void;
    abstract subscribe(cb: Subscriber<IBoard>): Unsubscriber;
    abstract dimension(): [number, number];
}
