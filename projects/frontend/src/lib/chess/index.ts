import type { CellDetail } from "../types/Chess";
import type { Piece, PieceGetter } from "../types/Chess";

import Pawn from "./Pawn";
import Knight from "./Knight";
import Rook from "./Rook";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";

export function getPiece(rank: number, file: number, pieceGetter: PieceGetter): null|Piece {
    if (rank === 0 || rank === 7) {
        if (file === 0 || file === 7) {
            return new Rook(rank === 0, pieceGetter);
        }
        if (file === 1 || file === 6) {
            return new Knight(rank === 0, pieceGetter);
        }
        if (file === 2 || file === 5) {
            return new Bishop(rank === 0, pieceGetter);
        }
        if (file === 3) {
            return new Queen(rank === 0, pieceGetter);
        }
        if (file === 4) {
            return new King(rank === 0, pieceGetter);
        }
    }
    if (rank === 1 || rank === 6) {
        return new Pawn(rank === 1, pieceGetter);
    }
    return null;
}

export function getCells()
{
    const cells: CellDetail[] = [];

    const rcount = 8;
    const ccount = 8;

    const pieceGetter: PieceGetter = (r: number, f: number) => {
        if (r < rcount && f < ccount) {
            return cells[(r * rcount) + f].piece;
        }
        return null;
    }

    for (let r = 0; r < rcount; ++r)
    {
        for (let c = 0; c < ccount; ++c)
        {
            cells.push({
                id: (r * rcount) + c,
                piece: getPiece(r, c, pieceGetter),
                position: [r, c],
                targeted: false,
                coveredby: []
            });
        }
    }
    for (let r = 0; r < rcount; ++r)
    {
        for (let c = 0; c < ccount; ++c)
        {
            const cell = cells[(r * rcount) + c];
            if (cell.piece)
            {
                const moves = cell.piece.getSupportingMoves(r, c);
                for (const rf of moves)
                {
                    cells[(rf[0] * rcount) + rf[1]].coveredby.push([r, c]);
                }
            }
        }
    }
    return { dimension: [8, 8], cells };
}

export function getTileColor(r: number, c: number) {
    type Callable = () => string;
    const get = (i: number, p: Callable, s: Callable) => i % 2 === 0 ? p() : s();
    const cb1 = () => get(c, () => "white", () => "black");
    const cb2 = () => get(c, () => "black", () => "white");
    return get(r, cb1, cb2);
}

export function resetCoveredBy(cells: CellDetail[])
{
    cells.forEach(cell => cell.coveredby = []);
    for (let r = 0; r < 8; ++r)
    {
        for (let c = 0; c < 8; ++c)
        {
            const cell = cells[(r * 8) + c];
            if (cell.piece)
            {
                const moves = cell.piece.getSupportingMoves(r, c);
                for (const [rank, file] of moves)
                {
                    cells[(rank * 8) + file].coveredby.push([r, c]);
                }
            }
        }
    }
}
