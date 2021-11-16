import type { PieceGetter, CellBoundCheck } from '$lib/chess/Piece';
import { Piece } from '$lib/chess/Piece';

export default class Knight extends Piece {
    constructor(team: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter) {
        super('N', team, isCellInBound, pieceGetter);
    }

    *getPossibleMoves(r: number, f: number): Generator<[number, number]> {
        yield* this.moves(r, f, false);
    }

    *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        yield* this.moves(r, f, true);
    }

    *moves(r: number, f: number, supporting: boolean): Generator<[number, number]> {
        const deltas = [-2, -1, 1, 2];
        for (const rd of deltas) {
            for (const fd of deltas) {
                if (Math.abs(rd) === Math.abs(fd)) {
                    continue;
                }

                const cell: [number, number] = [r + rd, f + fd];
                if (this.isCellInBound(...cell)) {
                    if (supporting) {
                        yield cell;
                    } else {
                        const otherpiece = this.pieceGetter(...cell);
                        if (otherpiece == null || otherpiece.team !== this.team) {
                            yield cell;
                        }
                    }
                }
            }
        }
    }
}
