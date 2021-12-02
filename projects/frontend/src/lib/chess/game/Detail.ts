import type { Piece } from '../Piece';

export type Move = {
    execute: () => boolean;
    revert: () => boolean;
};

export abstract class Detail {
    abstract cell_touched(r: number, f: number): boolean;
    abstract cell_inbound(r: number, f: number): boolean;
    abstract cell_supporters(r: number, f: number): [number, number][];
    abstract piece(r: number, f: number): Piece;
    abstract move(from: [number, number], to: [number, number]): Move;
}
