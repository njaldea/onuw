/**
 * Piece generally knows only rank/file position [number, number]
 * Also, Piece does not know anything about Cells. It only serves
 * as a collection of method of a piece type. multiple instances if piece type
 * on board is using the same instance of Piece.
 *
 * GameDetail is introduced so that it can inspect Cells and other pieces on board.
 * These implementations are injected to avoid cyclic import of Cell.ts and Piece.ts
 * and to generally isolate the responsibility if Piece from Cell.
 */

import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';
import type { IMove } from '$lib/game/IMove';

export abstract class Piece {
    public constructor(r: string, t: boolean) {
        this.role = r;
        this.team = t;
    }

    public role: string;
    public team: boolean;

    public abstract getAttackingMoves(r: number, f: number): Generator<[number, number]>;
    public abstract getSupportingMoves(r: number, f: number): Generator<[number, number]>;
    public abstract move(from: [number, number], to: [number, number]): IMove;
}

export abstract class GamePiece extends Piece {
    public constructor(r: string, t: boolean, bridge: IBoardPieceBridge) {
        super(r, t);
        this.bridge = bridge;
    }

    public bridge: IBoardPieceBridge;
}

export class TemplatePiece extends Piece {
    public constructor(piece: Piece, mover: (piece: Piece, to: [number, number]) => IMove) {
        super(`<${piece.role}>`, piece.team);
        this.piece = piece;
        this.mover = mover;
    }

    override getAttackingMoves(r: number, f: number): Generator<[number, number], any, unknown> {
        throw new Error('Method not implemented.');
    }

    override getSupportingMoves(r: number, f: number): Generator<[number, number], any, unknown> {
        throw new Error('Method not implemented.');
    }

    override move(from: [number, number], to: [number, number]): IMove {
        return this.mover(this.piece, to);
    }

    private piece: Piece;
    private mover: (piece: Piece, to: [number, number]) => IMove;
}
