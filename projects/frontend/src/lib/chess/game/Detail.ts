import type { Piece } from '../Piece';

export type Move = {
    execute: () => boolean;
    revert: () => boolean;

    prenext: () => void;
    revertprenext: () => void;
};

export class GroupMove implements Move {
    moves: Move[];

    constructor() {
        this.moves = [];
    }

    add(move: Move): void {
        this.moves.push(move);
    }

    execute() {
        this.moves.forEach((m) => m.execute());
        return true;
    }

    revert() {
        this.moves.forEach((m) => m.revert());
        return true;
    }

    prenext() {
        this.moves.forEach((m) => m.prenext());
        return true;
    }

    revertprenext() {
        this.moves.forEach((m) => m.revertprenext());
        return true;
    }
}

export abstract class Detail {
    abstract cell_touched(r: number, f: number): boolean;
    abstract cell_inbound(r: number, f: number): boolean;
    abstract cell_supporters(r: number, f: number): [number, number][];
    abstract cell_marks(r: number, f: number): Record<string, unknown>;
    abstract piece(r: number, f: number): Piece;
    abstract move_take(from: [number, number], to: [number, number]): Move;
    abstract move_remove(position: [number, number]): Move;
    abstract move_mark(
        position: [number, number],
        marks: Record<string, unknown>,
        autorevert: boolean
    ): Move;
}
