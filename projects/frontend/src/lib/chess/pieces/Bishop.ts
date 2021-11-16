import type { PieceGetter, CellBoundCheck } from '$lib/chess/Piece';
import { Piece, getPossibleMoves, getSupportingMoves } from '$lib/chess/Piece';

export default class Bishop extends Piece {
    constructor(team: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter) {
        super('B', team, isCellInBound, pieceGetter);
    }

    *getPossibleMoves(r: number, f: number): Generator<[number, number]> {
        yield* getPossibleMoves(this, r, f, 1, 1);
        yield* getPossibleMoves(this, r, f, -1, 1);
        yield* getPossibleMoves(this, r, f, 1, -1);
        yield* getPossibleMoves(this, r, f, -1, -1);
    }

    *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        yield* getSupportingMoves(this, r, f, 1, 1);
        yield* getSupportingMoves(this, r, f, -1, 1);
        yield* getSupportingMoves(this, r, f, 1, -1);
        yield* getSupportingMoves(this, r, f, -1, -1);
    }
}
