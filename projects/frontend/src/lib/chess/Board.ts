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
        const kingcell = [...this.icells.iter()].filter(
            (c) => c.piece && c.piece.role === 'K' && c.piece.team === cell.piece.team
        )[0];
        const checked = this.checked(kingcell);
        for (const c of this.icells.iter()) {
            if (cell !== c && c.attackedby.includes(cell.id)) {
                if (!checked || kingcell.id === cell.id || this.willVoidCheck(kingcell, cell, c)) {
                    c.targeted = true;
                }
            }
        }
        this.notify();
    }

    // move this algorithm outside of Board. maybe to game detail
    // and let this depend on it
    checked(kingcell: Cell): boolean {
        const cells = [...this.icells.iter()];
        for (const kingattacker of kingcell.attackedby) {
            if (cells[kingattacker].piece.team !== kingcell.piece.team) {
                return true;
            }
        }
        return false;
    }

    willVoidCheck(kingcell: Cell, from: Cell, to: Cell): boolean {
        const cells = [...this.icells.iter()];
        if (
            kingcell.attackedby.map((id) => cells[id].piece.team !== kingcell.piece.team).length ===
            1
        ) {
            const kingattacker = kingcell.attackedby[0];
            if (kingattacker === to.id) {
                return true;
            }
            if (to.attackedby.includes(kingattacker)) {
                // rank/file
                if (
                    kingcell.position[0] === to.position[0] ||
                    kingcell.position[1] === to.position[1]
                ) {
                    return true;
                }
                // diagonal
                const diff = (p1, p2) => Math.abs(Math.abs(p1) - Math.abs(p2));
                if (
                    diff(kingcell.position[0], to.position[0]) ===
                    diff(kingcell.position[1], to.position[1])
                ) {
                    return true;
                }
            }
        }
        return false;
    }
}
