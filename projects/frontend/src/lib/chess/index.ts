import type { Piece, PieceGetter, CellBoundCheck } from "../types/Chess";
import { Cell } from '../types/Chess';

import Pawn from "./Pawn";
import Knight from "./Knight";
import Rook from "./Rook";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";

function createPiece(rank: number, file: number, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter): null|Piece {
    if (rank === 0 || rank === 7) {
        if (file === 0 || file === 7) {
            return new Rook(rank === 0, isCellInBound, pieceGetter);
        }
        if (file === 1 || file === 6) {
            return new Knight(rank === 0, isCellInBound, pieceGetter);
        }
        if (file === 2 || file === 5) {
            return new Bishop(rank === 0, isCellInBound, pieceGetter);
        }
        if (file === 4) {
            return new Queen(rank === 0, isCellInBound, pieceGetter);
        }
        if (file === 3) {
            return new King(rank === 0, isCellInBound, pieceGetter);
        }
    }
    if (rank === 1 || rank === 6) {
        return new Pawn(rank === 1, isCellInBound, pieceGetter);
    }
    return null;
}

export function resetCoveredBy(cells: Cell[])
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

export function getCells()
{
    const cells: Cell[] = [];

    const rcount = 8;
    const ccount = 8;

    const pieceGetter: PieceGetter = (r: number, f: number) =>
    {
        if (r < rcount && f < ccount) {
            return cells[(r * rcount) + f].piece;
        }
        return null;
    }

    const isCellInBound: CellBoundCheck = (r: number, f: number) =>
    {
        return 0 <= r && r < rcount && 0 <= f && f < ccount;
    }

    for (let r = 0; r < rcount; ++r)
    {
        for (let c = 0; c < ccount; ++c)
        {
            cells.push(new Cell((r * rcount) + c, createPiece(r, c, isCellInBound, pieceGetter), [r, c]));
        }
    }
    resetCoveredBy(cells);
    return { dimension: [8, 8], cells };
}

export function getTileColor(r: number, c: number) {
    type Callable = () => string;
    const get = (i: number, p: Callable, s: Callable) => i % 2 === 0 ? p() : s();
    const cb1 = () => get(c, () => "white", () => "black");
    const cb2 = () => get(c, () => "black", () => "white");
    return get(r, cb1, cb2);
}
