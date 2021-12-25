import type { Piece } from '$lib/game/Piece';
import type { IMove } from '$lib/game/IMove';

export abstract class IBoardPieceBridge {
    abstract cell_touched(r: number, f: number): boolean;
    abstract cell_inbound(r: number, f: number): boolean;
    abstract cell_supporters(r: number, f: number): Generator<[number, number]>;
    abstract cell_marks(r: number, f: number): Record<string, unknown>;
    abstract piece(r: number, f: number): Piece;
    abstract move_take(from: [number, number], to: [number, number]): IMove;
    abstract move_remove(position: [number, number]): IMove;
    abstract move_mark(
        position: [number, number],
        marks: Record<string, unknown>,
        autorevert: boolean
    ): IMove;
}
