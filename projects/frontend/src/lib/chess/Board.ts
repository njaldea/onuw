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

    isInLine(p1: Cell, p2: Cell, p3: Cell) {
        return (
            (p2.position[1] - p1.position[1]) * (p3.position[0] - p1.position[0]) ===
            (p2.position[0] - p1.position[0]) * (p3.position[1] - p1.position[1])
        );
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
                    // check if pinned (order in line is important but assumed to be covered somewhere else)
                    if (this.isInLine(attacker, kingcell, from)) {
                        return attacker === to || this.isInLine(attacker, kingcell, to);
                    }
                }
            }
            return true;
        } else if (kingcell.attackedby.length === 1) {
            const attacker = cells[kingcell.attackedby[0]];
            return attacker === to || this.isInLine(attacker, kingcell, to);
        } else {
            return false;
        }
    }
}
