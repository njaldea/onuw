
import { Piece } from "../types/Chess";
import type { PieceGetter } from "../types/Chess";

export default class Pawn extends Piece
{
    constructor(team: boolean, pieceGetter: PieceGetter)
    {
        super("P", team, pieceGetter);
    }

    getPossibleMoves(r: number, f: number): [number, number][]
    {
        const retval: [number, number][] = [];

        if (this.team ? r !== 7 : r !== 0)
        {
            const nextCell: [number, number] = this.team ? [ r + 1, f ] : [ r - 1, f ];

            if (this.pieceGetter(nextCell[0], nextCell[1]) == null)
            {
                retval.push(nextCell);
            }

            if (this.hasMoved === false && retval.length === 1)
            {
                const nextNextCell: [number, number] = this.team ? [ r + 2, f ] : [ r - 2, f ];
                if (this.pieceGetter(nextNextCell[0], nextNextCell[1]) == null)
                {
                    retval.push(nextNextCell);
                }
            }

            const diagonal1: [number, number] = this.team ? [ r + 1, f + 1 ] : [ r - 1, f + 1 ];
            if (0 <= diagonal1[0] && diagonal1[0] <= 7 && 0 <= diagonal1[1] && diagonal1[1] <= 7)
            {
                const diagonalPiece1 = this.pieceGetter(diagonal1[0], diagonal1[1])
                if (diagonalPiece1 && diagonalPiece1.team !== this.team)
                {
                    retval.push(diagonal1);
                }
            }

            const diagonal2: [number, number] = this.team ? [ r + 1, f - 1 ] : [ r - 1, f - 1 ];
            if (0 <= diagonal2[0] && diagonal2[0] <= 7 && 0 <= diagonal2[1] && diagonal2[1] <= 7)
            {
                const diagonalPiece2 = this.pieceGetter(diagonal2[0], diagonal2[1])
                if (diagonalPiece2 && diagonalPiece2.team !== this.team)
                {
                    retval.push(diagonal2);
                }
            }
        }

        return retval;
    }

    getSupportingMoves(r: number, f: number): [number, number][]
    {
        const retval: [number, number][] = [];

        const diagonal1: [number, number] = this.team ? [ r + 1, f + 1 ] : [ r - 1, f + 1 ];
        if (0 <= diagonal1[0] && diagonal1[0] <= 7 && 0 <= diagonal1[1] && diagonal1[1] <= 7)
        {
            retval.push(diagonal1);
        }

        const diagonal2: [number, number] = this.team ? [ r + 1, f - 1 ] : [ r - 1, f - 1 ];
        if (0 <= diagonal2[0] && diagonal2[0] <= 7 && 0 <= diagonal2[1] && diagonal2[1] <= 7)
        {
            retval.push(diagonal2);
        }

        return retval;
    }
}