import type { PieceGetter, CellBoundCheck } from '$lib/chess/Piece';
import { Piece } from '$lib/chess/Piece';

export default class Rook extends Piece {
    constructor(team: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter) {
        super('R', team, isCellInBound, pieceGetter);
    }

    getPossibleMoves(r: number, f: number): [number, number][] {
        return [].concat(
            this.moves(r, f, 1, 0, false),
            this.moves(r, f, -1, 0, false),
            this.moves(r, f, 0, 1, false),
            this.moves(r, f, 0, -1, false)
        );
    }

    getSupportingMoves(r: number, f: number): [number, number][] {
        return [].concat(
            this.moves(r, f, 1, 0, true),
            this.moves(r, f, -1, 0, true),
            this.moves(r, f, 0, 1, true),
            this.moves(r, f, 0, -1, true)
        );
    }

    moves(
        r: number,
        f: number,
        rinc: number,
        finc: number,
        supporting: boolean
    ): [number, number][] {
        const retval: [number, number][] = [];
        for (let i = 0; true; ++i) {
            const rank = r + rinc * (i + 1);
            const file = f + finc * (i + 1);
            if (this.isCellInBound(rank, file)) {
                const piece = this.pieceGetter(rank, file);
                if (piece != null && piece.team === this.team) {
                    if (supporting) {
                        retval.push([rank, file]);
                    }
                    break;
                }
                retval.push([rank, file]);
                if (piece != null) {
                    break;
                }
            } else {
                break;
            }
        }
        return retval;
    }
}
