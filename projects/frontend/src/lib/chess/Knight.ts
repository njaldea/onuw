
import { Piece } from "../types/Chess";
import type { PieceGetter } from "../types/Chess";

export default class Knight extends Piece
{
    constructor(team: boolean, pieceGetter: PieceGetter)
    {
        super("N", team, pieceGetter);
    }

    getPossibleMoves(r: number, f: number): [number, number][]
    {
        return this.moves(r, f, false);
    }

    getSupportingMoves(r: number, f: number): [number, number][]
    {
        return this.moves(r, f, true);
    }

    moves(r: number, f: number, supporting: boolean)
    {
        const isvalid = (p: [number, number]): boolean =>
        {
            const inboard = p[0] >= 0 && p[0] <= 7 && p[1] >= 0 && p[1] <= 7;
            if (inboard)
            {
                if (supporting)
                {
                    return true;
                }
                const otherpiece = this.pieceGetter(p[0], p[1]);
                return otherpiece == null || otherpiece.team !== this.team;
            }
            return false;
        };

        const moves: [number, number][] = [
            [r + 1, f + 2],
            [r + 1, f - 2],
            [r - 1, f + 2],
            [r - 1, f - 2],
            [r + 2, f + 1],
            [r + 2, f - 1],
            [r - 2, f + 1],
            [r - 2, f - 1]
        ];
        return moves.filter(isvalid);
    }
}