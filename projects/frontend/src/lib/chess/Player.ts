import type { CellBoundCheck, Piece, PieceGetter } from '$lib/chess/Piece';

import Pawn from './pieces/Pawn';
import Knight from './pieces/Knight';
import Rook from './pieces/Rook';
import Bishop from './pieces/Bishop';
import Queen from './pieces/Queen';
import King from './pieces/King';
import type { Cell } from './Cell';

export class Player {
    king: Piece;
    queens: Piece[];
    bishops: Piece[];
    knights: Piece[];
    rooks: Piece[];
    pawns: Piece[];
    graveyard: Piece[];

    constructor() {
        this.queens = [];
        this.bishops = [];
        this.knights = [];
        this.rooks = [];
        this.pawns = [];
        this.graveyard = [];
    }
}

export class Player8x8 extends Player {
    team: boolean;
    isCellInBound: CellBoundCheck;
    pieceGetter: PieceGetter;

    constructor(team: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter) {
        super();

        this.team = team;
        this.isCellInBound = isCellInBound;
        this.pieceGetter = pieceGetter;
    }

    populateDefault(): void {
        this.king = new King(this.team, this.isCellInBound, this.pieceGetter);
        this.queens = [new Queen(this.team, this.isCellInBound, this.pieceGetter)];
        this.bishops = [
            new Bishop(this.team, this.isCellInBound, this.pieceGetter),
            new Bishop(this.team, this.isCellInBound, this.pieceGetter)
        ];
        this.knights = [
            new Knight(this.team, this.isCellInBound, this.pieceGetter),
            new Knight(this.team, this.isCellInBound, this.pieceGetter)
        ];
        this.rooks = [
            new Rook(this.team, this.isCellInBound, this.pieceGetter),
            new Rook(this.team, this.isCellInBound, this.pieceGetter)
        ];

        // assumes white always at rank 0
        const transform = (
            r: number,
            f: number,
            rdelta: number,
            fdelta: number
        ): [number, number] => {
            return this.team ? [r + rdelta, f + fdelta] : [r - rdelta, f - fdelta];
        };

        this.pawns = [
            new Pawn(this.team, this.isCellInBound, this.pieceGetter, transform),
            new Pawn(this.team, this.isCellInBound, this.pieceGetter, transform),
            new Pawn(this.team, this.isCellInBound, this.pieceGetter, transform),
            new Pawn(this.team, this.isCellInBound, this.pieceGetter, transform),
            new Pawn(this.team, this.isCellInBound, this.pieceGetter, transform),
            new Pawn(this.team, this.isCellInBound, this.pieceGetter, transform),
            new Pawn(this.team, this.isCellInBound, this.pieceGetter, transform),
            new Pawn(this.team, this.isCellInBound, this.pieceGetter, transform)
        ];
    }

    fillDefault(cells: Cell[]): void {
        const order = [
            this.rooks[0],
            this.knights[0],
            this.bishops[0],
            this.team ? this.king : this.queens[0],
            this.team ? this.queens[0] : this.king,
            this.bishops[0],
            this.knights[0],
            this.rooks[0],
            this.pawns[0],
            this.pawns[1],
            this.pawns[2],
            this.pawns[3],
            this.pawns[4],
            this.pawns[5],
            this.pawns[6],
            this.pawns[7]
        ];

        const start = this.team ? 0 : cells.length - order.length;
        const end = this.team ? order.length : cells.length;
        const cc = cells.slice(start, end);
        if (!this.team) {
            cc.reverse();
        }

        for (let index = 0; index < order.length; ++index) {
            cc[index].piece = order[index];
        }
    }
}
