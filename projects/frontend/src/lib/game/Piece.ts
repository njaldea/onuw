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
    constructor(r: string, t: boolean) {
        this.role = r;
        this.team = t;
    }

    role: string;
    team: boolean;

    abstract getAttackingMoves(r: number, f: number): Generator<[number, number]>;
    abstract getSupportingMoves(r: number, f: number): Generator<[number, number]>;
    abstract move(from: [number, number], to: [number, number]): IMove;
}

export abstract class GamePiece extends Piece {
    constructor(r: string, t: boolean, bridge: IBoardPieceBridge) {
        super(r, t);
        this.bridge = bridge;
    }

    bridge: IBoardPieceBridge;
}

export class TemplatePiece extends Piece {
    getAttackingMoves(r: number, f: number): Generator<[number, number], any, unknown> {
        throw new Error('Method not implemented.');
    }

    getSupportingMoves(r: number, f: number): Generator<[number, number], any, unknown> {
        throw new Error('Method not implemented.');
    }

    move(from: [number, number], to: [number, number]): IMove {
        return this.#mover(this.#piece, from, to);
    }

    #piece: Piece;
    #mover: (piece: Piece, from: [number, number], to: [number, number]) => IMove;

    constructor(piece: Piece, mover: (piece: Piece, from: [number, number], to: [number, number]) => IMove) {
        super(`template<${piece.role}>`, piece.team);
        this.#piece = piece;
        this.#mover = mover;
    }
}