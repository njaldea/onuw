
import { Piece } from "../types/Chess";
import type { PieceGetter, CellBoundCheck } from "../types/Chess";

export default class Bishop extends Piece
{
    constructor(team: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter)
    {
        super("B", team, isCellInBound, pieceGetter);
    }

    getPossibleMoves(r: number, f: number): [number, number][]
    {
        return [].concat(
            this.moves(r, f, 1, 1, false),
            this.moves(r, f, -1, 1, false),
            this.moves(r, f, 1, -1, false),
            this.moves(r, f, -1, -1, false)
        );
    }

    getSupportingMoves(r: number, f: number): [number, number][]
    {
        return [].concat(
            this.moves(r, f, 1, 1, true),
            this.moves(r, f, -1, 1, true),
            this.moves(r, f, 1, -1, true),
            this.moves(r, f, -1, -1, true)
        );
    }

    moves(r: number, f: number, rinc: number, finc: number, supporting: boolean): [number, number][]
    {
        const retval: [number, number][] = [];
        for (let i = 0; true; ++i)
        {
            const rank = r + (rinc * (i + 1));
            const file = f + (finc * (i + 1));
            if (this.isCellInBound(rank, file))
            {
                const piece = this.pieceGetter(rank, file);
                if (piece != null && piece.team === this.team)
                {
                    if (supporting)
                    {
                        retval.push([rank, file]);
                    }
                    break;
                }
                retval.push([rank, file]);
                if (piece != null)
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }
        return retval;
    }
}