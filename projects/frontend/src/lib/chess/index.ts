import type { Piece, PieceGetter, CellBoundCheck } from '../types/Chess';
import { Cell } from '../types/Chess';

import Pawn from './Pawn';
import Knight from './Knight';
import Rook from './Rook';
import Bishop from './Bishop';
import Queen from './Queen';
import King from './King';

// 8x8
export class Kingdom
{
    king: Piece;
    queen: Piece;
    bishops: Piece[];
    knights: Piece[];
    rooks: Piece[];
    pawns: Piece[];
    graveyard: Piece[];

    constructor(
        team: boolean,
        isCellInBound: CellBoundCheck,
        pieceGetter: PieceGetter
    )
    {
        this.king = new King(team, isCellInBound, pieceGetter);
        this.queen = new Queen(team, isCellInBound, pieceGetter);
        this.bishops = [
            new Bishop(team, isCellInBound, pieceGetter),
            new Bishop(team, isCellInBound, pieceGetter)
        ];
        this.knights = [
            new Knight(team, isCellInBound, pieceGetter),
            new Knight(team, isCellInBound, pieceGetter)
        ];
        this.rooks = [
            new Rook(team, isCellInBound, pieceGetter),
            new Rook(team, isCellInBound, pieceGetter)
        ];

        // assumes white always at rank 0
        const transform = team ? 
            (r: number, f: number, rdelta: number, fdelta: number): [number, number] => [ r + rdelta, f + fdelta ] :
            (r: number, f: number, rdelta: number, fdelta: number): [number, number] => [ r - rdelta, f - fdelta ];


        this.pawns = [
            new Pawn(team, isCellInBound, pieceGetter, transform),
            new Pawn(team, isCellInBound, pieceGetter, transform),
            new Pawn(team, isCellInBound, pieceGetter, transform),
            new Pawn(team, isCellInBound, pieceGetter, transform),
            new Pawn(team, isCellInBound, pieceGetter, transform),
            new Pawn(team, isCellInBound, pieceGetter, transform),
            new Pawn(team, isCellInBound, pieceGetter, transform),
            new Pawn(team, isCellInBound, pieceGetter, transform)
        ];
    }
}

export function resetCoveredBy(cells: Cell[]): void {
	cells.forEach((cell) => (cell.coveredby = []));
	for (let r = 0; r < 8; ++r) {
		for (let c = 0; c < 8; ++c) {
			const cell = cells[r * 8 + c];
			if (cell.piece) {
				const moves = cell.piece.getSupportingMoves(r, c);
				for (const [rank, file] of moves) {
					cells[rank * 8 + file].coveredby.push([r, c]);
				}
			}
		}
	}
}

export function getCells(): {
    dimension: [number, number],
    cells: Cell[],
    teams: [Kingdom, Kingdom]
}
{
	const cells: Cell[] = [];

	const rcount = 8;
	const ccount = 8;

	const pieceGetter: PieceGetter = (r: number, f: number) => {
		if (r < rcount && f < ccount) {
			return cells[r * rcount + f].piece;
		}
		return null;
	};

	const isCellInBound: CellBoundCheck = (r: number, f: number) => {
		return 0 <= r && r < rcount && 0 <= f && f < ccount;
	}

    const kingdom1 = new Kingdom(true, isCellInBound, pieceGetter);
    const kingdom2 = new Kingdom(false, isCellInBound, pieceGetter);
	for (let r = 0; r < rcount; ++r) {
		for (let c = 0; c < ccount; ++c) {
			cells.push(new Cell(r * rcount + c, [r, c]));
		}
	}

    cells[0].piece = kingdom1.rooks[0];
    cells[1].piece = kingdom1.knights[0];
    cells[2].piece = kingdom1.bishops[0];
    cells[3].piece = kingdom1.king;
    cells[4].piece = kingdom1.queen;
    cells[5].piece = kingdom1.bishops[1];
    cells[6].piece = kingdom1.knights[1];
    cells[7].piece = kingdom1.rooks[1];

    cells[8 + 0].piece = kingdom1.pawns[0];
    cells[8 + 1].piece = kingdom1.pawns[1];
    cells[8 + 2].piece = kingdom1.pawns[2];
    cells[8 + 3].piece = kingdom1.pawns[3];
    cells[8 + 4].piece = kingdom1.pawns[4];
    cells[8 + 5].piece = kingdom1.pawns[5];
    cells[8 + 6].piece = kingdom1.pawns[6];
    cells[8 + 7].piece = kingdom1.pawns[7];

    cells[63 - 0].piece = kingdom2.rooks[0];
    cells[63 - 1].piece = kingdom2.knights[0];
    cells[63 - 2].piece = kingdom2.bishops[0];
    cells[63 - 3].piece = kingdom2.queen;
    cells[63 - 4].piece = kingdom2.king;
    cells[63 - 5].piece = kingdom2.bishops[1];
    cells[63 - 6].piece = kingdom2.knights[1];
    cells[63 - 7].piece = kingdom2.rooks[1];

    cells[55 - 0].piece = kingdom2.pawns[0];
    cells[55 - 1].piece = kingdom2.pawns[1];
    cells[55 - 2].piece = kingdom2.pawns[2];
    cells[55 - 3].piece = kingdom2.pawns[3];
    cells[55 - 4].piece = kingdom2.pawns[4];
    cells[55 - 5].piece = kingdom2.pawns[5];
    cells[55 - 6].piece = kingdom2.pawns[6];
    cells[55 - 7].piece = kingdom2.pawns[7];

	resetCoveredBy(cells);
	return { dimension: [8, 8], cells, teams: [kingdom1, kingdom2] };
}
