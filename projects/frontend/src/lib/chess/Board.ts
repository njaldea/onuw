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
            if (cell !== c && c.attackedby.includes(cell.id) && this.validateMove(cell, c)) {
                c.targeted = true;
            }
        }
        this.notify();
    }

    isInOrder(c1: Cell, c2: Cell, c3: Cell) {
        if (
            (c2.position[1] - c1.position[1]) * (c3.position[0] - c1.position[0]) ===
            (c2.position[0] - c1.position[0]) * (c3.position[1] - c1.position[1])
        ) {
            const sqr = (p: number) => p * p;
            const distance = (p1: [number, number], p2: [number, number]) =>
                sqr(p1[0] - p2[0]) + sqr(p1[1] - p2[1]);
            const d1 = distance(c1.position, c2.position);
            const d2 = distance(c2.position, c3.position);
            const d3 = distance(c1.position, c3.position);
            return d3 > d1 && d3 > d2;
        }
        return false;
    }

    // move this algorithm outside of Board. maybe to game detail
    // and let this depend on it
    validateMove(from: Cell, to: Cell): boolean {
        const cells = [...this.icells.iter()];

        const kingcell = cells.filter(
            (c) => c.piece && c.piece.role === 'K' && c.piece.team === from.piece.team
        )[0];

        if (kingcell.id === from.id) {
            return true;
        } else if (kingcell.attackedby.length === 0) {
            if (from.attackedby.length > 0) {
                const pieceattackers = from.attackedby
                    .map((id) => cells[id])
                    .filter((a) => a.piece && !['P', 'K', 'N'].includes(a.piece.role));
                for (const attacker of pieceattackers) {
                    if (this.isInOrder(kingcell, from, attacker)) {
                        return attacker === to || this.isInOrder(kingcell, to, attacker);
                    }
                }
            }
            return true;
        } else if (kingcell.attackedby.length === 1) {
            const attacker = cells[kingcell.attackedby[0]];
            return attacker === to || this.isInOrder(kingcell, to, attacker);
        } else {
            return false;
        }
    }
}
